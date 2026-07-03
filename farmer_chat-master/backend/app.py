import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file
import io
from gtts import gTTS
from flask_cors import CORS
from textblob import TextBlob
from openai import OpenAI
from deep_translator import GoogleTranslator
from models import db, ChatHistory, EmergencyContact
import requests
import math
from transformers import pipeline
from functools import lru_cache
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize thread pool for parallel processing
executor = ThreadPoolExecutor(max_workers=3)

# Initialize Hugging Face sentiment pipeline (multilingual) - LAZY LOADED
# This model works excellent for sentiment analysis across multiple languages
# Lazy loaded to avoid blocking startup
sentiment_pipeline = None

def get_sentiment_pipeline():
    """Lazy load sentiment pipeline on first use"""
    global sentiment_pipeline
    if sentiment_pipeline is None:
        try:
            print("Loading Hugging Face sentiment model (first use only)...")
            sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="nlptown/bert-base-multilingual-uncased-sentiment",
                device=-1  # Use CPU (set to 0 for GPU if available)
            )
            print("Sentiment model loaded successfully")
        except Exception as e:
            print(f"Warning: Could not load Hugging Face sentiment model: {e}")
            sentiment_pipeline = False  # Mark as failed
    return sentiment_pipeline if sentiment_pipeline else None

# Simple cached translator to avoid repeat network calls and speed up responses
@lru_cache(maxsize=1024)
def translate_cached(text: str, target: str):
    try:
        return GoogleTranslator(source="auto", target=target).translate(text)
    except Exception as e:
        print(f"Translation error: {e}")
        return text

app = Flask(__name__)
CORS(app)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chatbot.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

# Sensitive keywords for suicidal/self-harm intent detection
SENSITIVE_KEYWORDS = {
    "en": ["die", "suicide", "kill myself", "kill me", "end my life", "no more", "can't live", "want to die", "going to die", "i will die"],
    "hi": ["मरना", "आत्महत्या", "मर जाऊंगा", "खुद को मारूंगा", "जीना नहीं", "मृत्यु", "मर जाऊं", "जान देना"],
    "bn": ["মরা", "আত্মহত্যা", "মেরে ফেলব", "নিজেকে মারব", "জীবন শেষ", "মৃত্যু", "মরতে চাই"],
    "te": ["చంపు", "ఆత్మహత్య", "చనిపోతాను", "నన్ను చంపుకో", "జీవితం చేసుకోను", "సంపూర్ణ", "చలించటానికి"],
    "ta": ["சாகு", "தற்கொலை", "வாழ", "விடுமாறு", "சாவு", "மரணம்", "சாய்ந்து விட"],
    "kn": ["ಸಾಯಿ", "ಆತ್ಮಹತ್ಯೆ", "ಸಾಯುತ್ತೆನೆ", "ಬದುಕಲಾರದೆ", "ಜೀವನ ಮುಗಿಸುತ್ತೆನೆ"],
    "ml": ["മരിക്കും", "ആത്മഹത്യ", "ജീവൻ മുടക്കും", "ജീവിക്കാനാവില്ല", "മരണം"],
    "mr": ["मरणे", "आत्मघात", "जीवन संपवून", "मार", "मरुन याऊ"],
    "gu": ["મરુ", "આત્મહત્યા", "જીવન સમાપ્ત", "મૃત્યુ"],
    "or": ["ମୃତ୍ୟୁ", "ଆତ୍ମହତ୍ୟା", "ମରିବି", "ଜୀବନ ଶେଷ", "ଚାଲିଯିବି"],
}

def detect_sensitive_keywords(text):
    """Check if text contains sensitive keywords across all languages"""
    text_lower = text.lower()
    for lang_keywords in SENSITIVE_KEYWORDS.values():
        for keyword in lang_keywords:
            if keyword.lower() in text_lower:
                return True
    return False

def analyze_severity_with_ai(user_text, translated_en):
    """Use OpenAI to analyze severity of mental health crisis statements"""
    try:
        severity_prompt = f"""
You are a mental health crisis assessment AI. Analyze the following statement from a farmer and determine the severity level.

User statement: "{user_text}"
(English translation: "{translated_en}")

Respond with ONLY a JSON object (no other text):
{{
    "severity": "critical" | "high" | "moderate" | "low",
    "is_suicidal": true | false,
    "is_self_harm": true | false,
    "reasoning": "brief reason"
}}

Definitions:
- "critical": Explicit suicidal intent, self-harm threats, immediate danger (e.g., "I will kill myself", "मैं आत्महत्या करूंगा", "मुझे और नहीं जीना")
- "high": Strong expressions of hopelessness, wanting to die, despair (e.g., "I want to die", "मुझे मर जाना चाहिए")
- "moderate": Distress but not immediate danger (e.g., "I can't take this", "मेरा कोई मतलब नहीं")
- "low": General sadness or complaints

Be very careful: if the statement expresses suicidal/self-harm intent in ANY language, mark as "critical".
"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a mental health crisis assessment expert. Respond ONLY with valid JSON."},
                {"role": "user", "content": severity_prompt}
            ],
            temperature=0.7,
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Try to parse JSON from response
        import json
        try:
            # Extract JSON if response has extra text
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                result = json.loads(json_str)
                return result
        except:
            pass
        
        # Fallback if AI response can't be parsed
        return {
            "severity": "moderate",
            "is_suicidal": False,
            "is_self_harm": False,
            "reasoning": "Analysis failed"
        }
    except Exception as e:
        print(f"AI severity analysis error: {e}")
        return {
            "severity": "low",
            "is_suicidal": False,
            "is_self_harm": False,
            "reasoning": "Analysis unavailable"
        }

def analyze_emotion_fast(text):
    """
    Fast keyword-based emotion detection for non-critical messages.
    Much faster than AI for regular chat.
    """
    text_lower = text.lower()
    
    # Emotion keywords (English + Hindi + local languages)
    emotion_keywords = {
        "hopeful": ["hope", "better", "improve", "good", "happy", "smile", "खुश", "अच्छा", "बेहतर"],
        "anxious": ["worry", "anxious", "stress", "concern", "fear", "scared", "चिंता", "डर"],
        "sad": ["sad", "depressed", "unhappy", "down", "lonely", "hopeless", "उदास", "दुःख"],
        "frustrated": ["angry", "angry", "frustrated", "fed up", "annoyed", "irritated", "गुस्से", "नाराज"],
        "confused": ["confused", "lost", "unclear", "unsure", "don't know", "what to do", "भ्रमित"],
    }
    
    scores = {}
    for emotion, keywords in emotion_keywords.items():
        scores[emotion] = sum(1 for kw in keywords if kw.lower() in text_lower)
    
    if max(scores.values()) > 0:
        return max(scores, key=scores.get)
    return "neutral"

def analyze_emotion_with_ai(user_text, translated_en):
    """
    Use OpenAI to analyze the emotional state of the user's message.
    Returns a more nuanced emotion than simple polarity.
    Falls back to fast keyword detection for speed.
    """
    try:
        # Quick keyword check first (90% faster)
        fast_emotion = analyze_emotion_fast(user_text)
        if fast_emotion != "neutral":
            return fast_emotion  # Return fast result for clear emotions
        
        # Only use AI for ambiguous/neutral messages
        emotion_prompt = f"""Classify emotion: "{user_text[:80]}" into ONE: hopeful|anxious|sad|frustrated|confused|neutral|distressed. Respond ONLY with the word."""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Respond with ONE emotion word only, lowercase."},
                {"role": "user", "content": emotion_prompt}
            ],
            temperature=0.3,
            max_tokens=10,  # Limit tokens
            timeout=2,  # 2 second timeout
        )
        
        emotion = response.choices[0].message.content.strip().lower()
        
        # Validate emotion is one of our categories
        valid_emotions = ["hopeful", "anxious", "sad", "frustrated", "confused", "neutral", "distressed"]
        if emotion in valid_emotions:
            return emotion
        else:
            # Default based on the word content
            if any(word in emotion for word in ["hope", "positive", "good", "better"]):
                return "hopeful"
            elif any(word in emotion for word in ["angry", "frustrat", "anger"]):
                return "frustrated"
            elif any(word in emotion for word in ["worry", "anxious", "concern", "stress"]):
                return "anxious"
            elif any(word in emotion for word in ["sad", "depressed", "hopeless", "despair"]):
                return "sad"
            elif any(word in emotion for word in ["confus", "lost", "unclear"]):
                return "confused"
            else:
                return "neutral"
    except Exception as e:
        print(f"Emotion analysis error: {e}")
        return "neutral"

def analyze_sentiment_huggingface(text):
    """
    Use Hugging Face multilingual sentiment analysis for accurate results.
    Works better than TextBlob for translations and regional languages.
    
    Returns: (polarity, label) where polarity is -1 to 1 scale
    """
    pipeline = get_sentiment_pipeline()
    if not pipeline:
        return None, None
    
    try:
        # Truncate text if too long (model has limits)
        text = text[:512] if len(text) > 512 else text
        
        result = pipeline(text)[0]
        label = result['label'].lower()  # 1 star, 2 stars, 3 stars, 4 stars, 5 stars
        score = result['score']  # confidence 0-1
        
        # Convert label to polarity (-1 to 1)
        label_map = {
            '1 star': -1.0,
            '2 stars': -0.5,
            '3 stars': 0.0,
            '4 stars': 0.5,
            '5 stars': 1.0
        }
        
        polarity = label_map.get(label, 0.0)
        
        return polarity, label
    except Exception as e:
        print(f"Hugging Face sentiment error: {e}")
        return None, None

def generate_ai_reply(user_text, translated_en, lang, emotion=None):
    """
    Generate a short empathetic reply using OpenAI.
    Optimized for speed with minimal tokens and direct prompting.
    """

    # Map language codes to language names
    language_names = {
        'en': 'English',
        'hi': 'Hindi',
        'te': 'Telugu',
        'ta': 'Tamil',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'mr': 'Marathi',
        'bn': 'Bengali',
        'gu': 'Gujarati',
        'pa': 'Punjabi',
        'or': 'Odia'
    }

    target_lang_name = language_names.get(lang, lang)

    # Optimized compact prompt for speed
    system_prompt = (
        "You are a supportive farming assistant. "
        "Respond ONLY in the target language in 1-2 sentences. "
        "Be kind, simple, and empathetic."
    )

    user_message = (
        f"Language: {target_lang_name}. "
        f"Message: {user_text[:100]}\n"  # Truncate for speed
        f"Reply in {target_lang_name} only (1-2 sentences, simple words):"
    )

    if emotion:
        user_message += f" ({emotion} tone)"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.7,
        max_tokens=80,  # Limit tokens for faster response
    )

    return response.choices[0].message.content.strip()

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_text = data.get("text", "")
    lang = data.get("lang", "en")

    if not user_text:
        return jsonify({"reply": "I am listening."})

    # Use cached translator
    translated_en = translate_cached(user_text, "en")

    # For non-critical severity, we can skip some expensive checks
    concerning_keywords = ["die", "suicide", "kill", "help", "emergency", "danger", "मर", "आत्मह"]
    is_potentially_critical = any(keyword.lower() in user_text.lower() for keyword in concerning_keywords)
    
    # Initialize defaults
    emotion = "neutral"
    polarity = 0
    severity_analysis = {"severity": "low", "is_suicidal": False, "is_self_harm": False}
    
    try:
        # Parallel execution: Run multiple tasks simultaneously
        futures = {}
        futures['emotion'] = executor.submit(analyze_emotion_with_ai, user_text, translated_en)
        futures['sentiment'] = executor.submit(analyze_sentiment_huggingface, translated_en)
        
        if is_potentially_critical:
            futures['severity'] = executor.submit(analyze_severity_with_ai, user_text, translated_en)
        
        # Collect results with timeouts
        if 'emotion' in futures:
            try:
                emotion = futures['emotion'].result(timeout=3)
                if not emotion:
                    emotion = "neutral"
            except:
                emotion = "neutral"
        
        if 'sentiment' in futures:
            try:
                result = futures['sentiment'].result(timeout=3)
                if result and result[0] is not None:
                    polarity = result[0]
                else:
                    polarity = TextBlob(translated_en).sentiment.polarity
            except:
                polarity = TextBlob(translated_en).sentiment.polarity
        
        if 'severity' in futures:
            try:
                severity_analysis = futures['severity'].result(timeout=4)
            except:
                severity_analysis = {"severity": "low", "is_suicidal": False, "is_self_harm": False}
    
    except Exception as e:
        print(f"Parallel execution error: {e}")
        # Use fast fallback for everything
        emotion = "neutral"
        polarity = TextBlob(translated_en).sentiment.polarity
        severity_analysis = {"severity": "low", "is_suicidal": False, "is_self_harm": False}
    
    is_critical = severity_analysis.get("is_suicidal") or severity_analysis.get("is_self_harm")
    severity_level = severity_analysis.get("severity", "low")
    
    # Map severity to emotion and polarity
    if severity_level == "critical":
        emotion = "distressed"
        polarity = -0.95
    elif severity_level == "high":
        emotion = "distressed"
        polarity = -0.80
    elif is_critical:
        emotion = "distressed"
        polarity = -0.85
    elif polarity < -0.5:
        emotion = "sad"
    elif polarity > 0.5:
        emotion = "hopeful"
    # else keep emotion from AI analysis

    # Generate reply asynchronously (can happen while database saves)
    ai_reply = generate_ai_reply(user_text, translated_en, lang, emotion)

    # Detect emergency
    is_emergency = is_critical or severity_level in ["critical", "high"] or any(keyword in user_text.lower() for keyword in ["help", "emergency", "urgent", "danger"])

    # Prepare helpline message if needed
    helpline_local = ""
    if is_critical or severity_level in ["critical", "high"]:
        helpline_en = "You are not alone. Please call 1800-599-0019 to talk to someone."
        try:
            helpline_local = "\n\n" + translate_cached(helpline_en, lang)
        except Exception:
            helpline_local = "\n\n" + helpline_en

    final_reply = ai_reply + helpline_local

    # Save to database asynchronously (don't block response)
    def save_to_db():
        try:
            with app.app_context():
                chat_record = ChatHistory(
                    user_message=user_text,
                    bot_reply=final_reply,
                    language=lang,
                    sentiment_score=polarity,
                    emotion=emotion,
                    is_emergency=is_emergency or is_critical or severity_level in ["critical", "high"],
                )
                db.session.add(chat_record)
                db.session.commit()
        except Exception as e:
            print(f"DB error: {e}")
    
    # Start DB save in background (don't wait for it)
    threading.Thread(target=save_to_db, daemon=True).start()

    return jsonify({
        "reply": final_reply,
        "sentiment_score": polarity,
        "emotion": emotion,
        "is_emergency": is_emergency or is_critical or severity_level in ["critical", "high"],
        "is_critical": is_critical or severity_level in ["critical", "high"],
        "severity_level": severity_level,
    })


@app.route("/tts", methods=["POST"])
def tts():
    data = request.json or {}
    text = data.get("text", "")
    lang = data.get("lang", "en")

    if not text:
        return jsonify({"error": "no text provided"}), 400

    # gTTS expects primary language codes like 'bn', 'hi'
    primary = str(lang).split("-")[0]

    try:
        # try primary language first
        try:
            tts_obj = gTTS(text=text, lang=primary)
            buf = io.BytesIO()
            tts_obj.write_to_fp(buf)
            buf.seek(0)
            return send_file(buf, mimetype="audio/mpeg", as_attachment=False, download_name="speech.mp3")
        except Exception:
            # fallback attempts for languages that gTTS may not support directly
            for fallback in ("hi", "en"):
                if fallback == primary:
                    continue
                try:
                    tts_obj = gTTS(text=text, lang=fallback)
                    buf = io.BytesIO()
                    tts_obj.write_to_fp(buf)
                    buf.seek(0)
                    return send_file(buf, mimetype="audio/mpeg", as_attachment=False, download_name="speech.mp3")
                except Exception:
                    continue
            # if all fallbacks fail, raise to outer handler
            raise
    except Exception as e:
        return jsonify({"error": "tts_failed", "details": str(e)}), 500


@app.route("/chat-history", methods=["GET"])
def chat_history():
    try:
        limit = request.args.get("limit", 50, type=int)
        records = ChatHistory.query.order_by(ChatHistory.timestamp.desc()).limit(limit).all()
        return jsonify([r.to_dict() for r in reversed(records)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/emergency-helplines", methods=["GET"])
def emergency_helplines():
    try:
        lang = request.args.get("lang", "en")
        lat = request.args.get("lat", type=float)
        lon = request.args.get("lon", type=float)

        # Try to return DB helplines filtered by language first
        helplines = EmergencyContact.query.filter_by(language=lang).all()

        helplines_data = []
        if helplines:
            helplines_data = [h.to_dict() for h in helplines]
        else:
            # Fallback national helplines
            helplines_data = [
                {
                    "id": 1,
                    "country": "India",
                    "helpline_name": "AASRA Mental Health Support",
                    "helpline_number": "9820466726",
                    "helpline_url": "https://www.aasra.info",
                    "language": lang,
                },
                {
                    "id": 2,
                    "country": "India",
                    "helpline_name": "iCALL Helpline",
                    "helpline_number": "9152987821",
                    "helpline_url": "https://icallhelpline.org",
                    "language": lang,
                },
                {
                    "id": 3,
                    "country": "India",
                    "helpline_name": "Vandrevala Foundation",
                    "helpline_number": "9999666555",
                    "helpline_url": "https://vandrevalafoundation.com",
                    "language": lang,
                },
            ]

        # If lat/lon provided, try to infer state via Nominatim reverse geocode
        state_name = None
        nearest_police = None
        if lat and lon:
            try:
                nom_url = "https://nominatim.openstreetmap.org/reverse"
                r = requests.get(nom_url, params={"format": "jsonv2", "lat": lat, "lon": lon}, timeout=5)
                if r.status_code == 200:
                    place = r.json()
                    address = place.get("address", {})
                    state_name = address.get("state") or address.get("region") or address.get("county")
            except:
                state_name = None

            # Search Overpass for nearest police station within a small bbox radius
            try:
                bbox_delta = 0.05  # ~5km
                bbox = f"{lat-bbox_delta},{lon-bbox_delta},{lat+bbox_delta},{lon+bbox_delta}"
                overpass_url = "https://overpass-api.de/api/interpreter"
                overpass_query = f"[bbox:{bbox}];(node[amenity=police];way[amenity=police];relation[amenity=police];);out center;"
                resp = requests.get(overpass_url, params={"data": overpass_query}, timeout=6)
                candidates = []
                if resp.status_code == 200:
                    text = resp.text
                    # Very simple parsing for lat/lon from node tags
                    lines = text.split('\n')
                    import re
                    for line in lines:
                        if 'lat=' in line and 'lon=' in line:
                            try:
                                lat_match = re.search(r'lat="([\d.-]+)"', line)
                                lon_match = re.search(r'lon="([\d.-]+)"', line)
                                if lat_match and lon_match:
                                    plat = float(lat_match.group(1))
                                    plon = float(lon_match.group(1))
                                    dist = haversine(lat, lon, plat, plon)
                                    candidates.append({"lat": plat, "lon": plon, "distance_km": dist})
                            except:
                                pass
                if candidates:
                    candidates = sorted(candidates, key=lambda x: x['distance_km'])
                    nearest = candidates[0]
                    nearest_police = {
                        "name": "Police Station",
                        "lat": nearest['lat'],
                        "lon": nearest['lon'],
                        "distance_km": nearest['distance_km']
                    }
            except:
                nearest_police = None

        # Translate helpline names/descriptions to requested language for clarity
        try:
            for h in helplines_data:
                if lang and lang != 'en':
                    try:
                        h['helpline_name'] = GoogleTranslator(source='auto', target=lang).translate(h.get('helpline_name', ''))
                    except:
                        pass
        except:
            pass

        result = {
            "state": state_name,
            "helplines": helplines_data,
            "nearest_police": nearest_police
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/init-helplines", methods=["POST"])
def init_helplines():
    """Initialize emergency contacts in the database"""
    try:
        # Clear existing
        EmergencyContact.query.delete()
        
        helplines = [
            EmergencyContact(
                country="India",
                helpline_name="AASRA Mental Health Support",
                helpline_number="9820466726",
                helpline_url="https://www.aasra.info",
                language="en",
            ),
            EmergencyContact(
                country="India",
                helpline_name="iCall Helpline",
                helpline_number="9152987821",
                helpline_url="https://www.icallhelpline.org",
                language="en",
            ),
            EmergencyContact(
                country="India",
                helpline_name="Vandrevala Foundation",
                helpline_number="9999 666 555",
                helpline_url="https://www.vandrevalafoundation.com",
                language="en",
            ),
        ]
        
        for h in helplines:
            db.session.add(h)
        
        db.session.commit()
        return jsonify({"status": "helplines initialized"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/nearby-services", methods=["POST"])
def nearby_services():
    """Find nearby health centers, police stations, hospitals using OpenStreetMap Nominatim API"""
    try:
        data = request.json or {}
        lat = data.get("lat")
        lon = data.get("lon")
        service_type = data.get("service_type", "hospital")  # hospital, health_center, police, fire
        radius = data.get("radius", 5)  # km
        
        if not lat or not lon:
            return jsonify({"error": "latitude and longitude required"}), 400
        
        # OSM tags for different service types
        overpass_queries = {
            "hospital": "[amenity=hospital]",
            "health_center": "[amenity=clinic|amenity=doctors]",
            "police": "[amenity=police]",
            "fire": "[amenity=fire_station]",
            "ambulance": "[amenity=ambulance_station]",
        }
        
        query_tag = overpass_queries.get(service_type, overpass_queries["hospital"])
        
        # Overpass API query to find nearby services
        # Overpass API is slow, so we'll use a simpler reverse geocoding approach with fallback
        nearby = []
        
        try:
            # Try Overpass API (may be slow or unavailable)
            bbox_delta = radius / 111.0  # Rough conversion: 1 degree ≈ 111 km
            bbox = f"{lat-bbox_delta},{lon-bbox_delta},{lat+bbox_delta},{lon+bbox_delta}"
            
            overpass_url = "https://overpass-api.de/api/interpreter"
            overpass_query = f"""[bbox:{bbox}];({query_tag};);out center;"""
            
            response = requests.get(overpass_url, params={"data": overpass_query}, timeout=5)
            
            if response.status_code == 200:
                # Parse very basic response
                lines = response.text.split('\n')
                for line in lines:
                    if '<node' in line and 'lat=' in line and 'lon=' in line:
                        try:
                            import re
                            lat_match = re.search(r'lat="([\d.-]+)"', line)
                            lon_match = re.search(r'lon="([\d.-]+)"', line)
                            if lat_match and lon_match:
                                nearby.append({
                                    "name": f"{service_type.replace('_', ' ').title()}",
                                    "lat": float(lat_match.group(1)),
                                    "lon": float(lon_match.group(1)),
                                    "distance_km": haversine(lat, lon, float(lat_match.group(1)), float(lon_match.group(1))),
                                })
                        except:
                            pass
        except:
            pass
        
        # If Overpass fails, return mock nearby services for demo
        if not nearby:
            # Mock data with realistic Indian hospital/facility names
            mock_hospitals = [
                {"name": "Apollo Hospitals", "address": "Central Medical District", "phone": "104"},
                {"name": "Max Health Care", "address": "City Healthcare Center", "phone": "108"},
                {"name": "Fortis Healthcare", "address": "Emergency Response Unit", "phone": "102"},
            ]
            mock_police = [
                {"name": "Police Control Room", "address": "City Police Station", "phone": "100"},
                {"name": "Women's Police Cell", "address": "Women Safety Center", "phone": "1091"},
            ]
            mock_fire = [
                {"name": "Fire & Rescue Station", "address": "Emergency Response", "phone": "101"},
            ]
            
            facility_map = {
                "hospital": mock_hospitals,
                "health_center": [
                    {"name": "Primary Health Center", "address": "Community Health", "phone": "108"},
                    {"name": "Rural Medical Center", "address": "Village Healthcare", "phone": "108"},
                ],
                "police": mock_police,
                "fire": mock_fire,
            }
            
            selected_facilities = facility_map.get(service_type, facility_map["hospital"])
            
            for i, fac in enumerate(selected_facilities[:5]):
                nearby.append({
                    "name": fac["name"],
                    "address": fac["address"],
                    "lat": lat + (0.01 * (i - 2)),
                    "lon": lon + (0.01 * (i - 2)),
                    "distance_km": 1.2 + (i * 0.8),
                    "phone": fac["phone"],
                })
        
        # Sort by distance and limit to 5
        nearby = sorted(nearby, key=lambda x: x["distance_km"])[:5]
        
        return jsonify({
            "service_type": service_type,
            "user_location": {"lat": lat, "lon": lon},
            "nearby": nearby,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    @app.route("/analyze", methods=["POST"])
    def analyze():
        """Lightweight endpoint to analyze severity without creating DB records
        Expects JSON: { text: str, lang: str }
        Returns the result of analyze_severity_with_ai
        """
        try:
            data = request.json or {}
            text = data.get("text", "")
            lang = data.get("lang", "en")

            if not text:
                return jsonify({"error": "no text provided"}), 400

            translated_en = GoogleTranslator(source="auto", target="en").translate(text)
            result = analyze_severity_with_ai(text, translated_en)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500


    @app.route("/translate", methods=["POST"])
    def translate():
        """Translate text to a target language using deep_translator.GoogleTranslator
        Expects JSON: { text: str, target: 'en'|'hi'|'or'|'te'|... }
        Returns: { translated: str }
        """
        try:
            data = request.json or {}
            text = data.get("text", "")
            target = data.get("target", "en")

            if not text:
                return jsonify({"error": "no text provided"}), 400

            translated = GoogleTranslator(source="auto", target=target).translate(text)
            return jsonify({"translated": translated}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    """Convert speech audio to text using Google Cloud Speech-to-Text API
    Expects multipart form data with:
    - file: audio file (WAV, MP3, OGG, FLAC, etc.)
    - language: target language code (en, hi, or, te, etc.)
    """
    try:
        from google_speech_handler import transcribe_audio
        
        if 'file' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['file']
        language = request.form.get('language', 'en')
        
        if not audio_file or audio_file.filename == '':
            return jsonify({"error": "Empty audio file"}), 400
        
        # Read audio data
        audio_data = audio_file.read()
        
        # Transcribe using Google Cloud Speech-to-Text
        result = transcribe_audio(audio_data, language)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e), "transcript": ""}), 500

@app.route("/sentiment-history", methods=["GET"])
def sentiment_history():
    """Get sentiment analysis history - displays recent messages with sentiment scores
    Supports filtering by emotion or language.
    Expects query params: limit (default 50), emotion (optional), language (optional)
    """
    try:
        limit = request.args.get("limit", 50, type=int)
        emotion = request.args.get("emotion", None)
        language = request.args.get("language", None)
        
        query = ChatHistory.query.order_by(ChatHistory.timestamp.desc()).limit(limit)
        
        if emotion:
            query = query.filter_by(emotion=emotion)
        if language:
            query = query.filter_by(language=language)
        
        records = query.all()
        
        # Build response with sentiment stats
        sentiment_stats = {
            "total_messages": len(records),
            "average_sentiment": 0,
            "emotion_breakdown": {},
            "messages": []
        }
        
        if records:
            avg_score = sum(r.sentiment_score or 0 for r in records) / len(records)
            sentiment_stats["average_sentiment"] = round(avg_score, 2)
            
            # Count emotions
            from collections import Counter
            emotions = [r.emotion for r in records if r.emotion]
            emotion_counts = Counter(emotions)
            sentiment_stats["emotion_breakdown"] = dict(emotion_counts)
            
            # Include recent messages
            sentiment_stats["messages"] = [
                {
                    "user_message": r.user_message[:100],  # truncate for display
                    "sentiment_score": r.sentiment_score,
                    "emotion": r.emotion,
                    "is_emergency": r.is_emergency,
                    "timestamp": r.timestamp.isoformat() if r.timestamp else None
                }
                for r in records[:10]  # return top 10
            ]
        
        return jsonify(sentiment_stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance between two lat/lon points in km"""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

if __name__ == "__main__":
    app.run(debug=True, port=5002)
