"""Deepgram speech-to-text handler"""
import os
import requests

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
DEEPGRAM_URL = "https://api.deepgram.com/v1/listen"

def transcribe_audio(audio_data, language="en"):
    """
    Transcribe audio using Deepgram API.
    
    Args:
        audio_data: Audio bytes (WAV, MP3, etc.)
        language: Language code ('en', 'hi', 'or', 'te', 'ta', etc.)
    
    Returns:
        dict: { "transcript": "...", "confidence": 0.95 }
    """
    if not DEEPGRAM_API_KEY:
        return {"error": "DEEPGRAM_API_KEY not set", "transcript": ""}
    
    # Map language codes to Deepgram language codes
    lang_map = {
        'en': 'en',
        'hi': 'hi',
        'or': 'or',  # Odia
        'te': 'te',  # Telugu
        'ta': 'ta',  # Tamil
        'kn': 'kn',  # Kannada
        'ml': 'ml',  # Malayalam
        'mr': 'mr',  # Marathi
        'bn': 'bn',  # Bengali
        'gu': 'gu',  # Gujarati
    }
    
    deepgram_lang = lang_map.get(language.split('-')[0].lower(), 'en')
    
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": "audio/wav",
    }
    
    params = {
        "model": "nova-2",
        "language": deepgram_lang,
        "smart_format": True,
    }
    
    try:
        response = requests.post(
            DEEPGRAM_URL,
            headers=headers,
            params=params,
            data=audio_data,
            timeout=30,
        )
        
        if response.status_code != 200:
            return {
                "error": f"Deepgram error: {response.status_code}",
                "transcript": "",
            }
        
        result = response.json()
        
        # Extract transcript from Deepgram response
        transcript = ""
        confidence = 0.0
        
        if "results" in result and "channels" in result["results"]:
            channels = result["results"]["channels"]
            if channels and len(channels) > 0:
                alternatives = channels[0].get("alternatives", [])
                if alternatives and len(alternatives) > 0:
                    transcript = alternatives[0].get("transcript", "")
                    confidence = alternatives[0].get("confidence", 0.0)
        
        return {
            "transcript": transcript,
            "confidence": confidence,
            "language": deepgram_lang,
        }
    
    except requests.exceptions.Timeout:
        return {"error": "Deepgram request timeout", "transcript": ""}
    except Exception as e:
        return {"error": str(e), "transcript": ""}
