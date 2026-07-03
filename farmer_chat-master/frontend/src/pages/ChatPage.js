import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import ChatMessage from '../components/ChatMessage';
import EmergencyModal from '../components/EmergencyModal';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { 
  Mic, 
  MicOff, 
  Send, 
  ArrowLeft, 
  AlertTriangle, 
  Phone, 
  Keyboard,
  Volume2,
  Globe
} from 'lucide-react';
import './ChatPage.css';

/* ---------- GLOBAL VOICE HANDLING ---------- */
let voices = [];
let audioUnlocked = false;

function refreshVoices() {
  try {
    voices = window.speechSynthesis.getVoices() || [];
  } catch (e) {
    voices = [];
  }
}

refreshVoices();

window.speechSynthesis.onvoiceschanged = () => {
  refreshVoices();
};

function unlockAudio(language) {
  if (audioUnlocked) return;

  refreshVoices();

  // speak a short neutral utterance to unlock audio on mobile browsers
  const u = new SpeechSynthesisUtterance(".");
  u.lang = language;
  // do not require a matched voice here; the act of speaking unlocks audio
  try {
    window.speechSynthesis.speak(u);
  } catch (e) {
    // ignore
  }

  audioUnlocked = true;
}

function speak(text, language) {
  if (!audioUnlocked) return;

  refreshVoices();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = language;
  u.rate = 0.95;
  u.pitch = 1.0;
  u.volume = 1;

  const primary = (language || "en").split("-")[0].toLowerCase();

  // try exact match (case-insensitive), then any voice that starts with primary language
  let match = voices.find((v) => (v.lang || "").toLowerCase() === language.toLowerCase());
  if (!match) {
    match = voices.find((v) => (v.lang || "").toLowerCase().startsWith(primary));
  }

  if (match) u.voice = match;

  try {
    if (match) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } else {
      // No local voice match — fallback to backend TTS
      playRemoteTTS(text, language);
    }
  } catch (e) {
    // ignore speak errors
  }
}

async function playRemoteTTS(text, language) {
  try {
    const res = await fetch("http://localhost:5002/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang: language }),
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play().catch(() => {});
    audio.onended = () => URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Remote TTS failed", e);
  }
}

/* ---------- COMPONENT ---------- */
function ChatPage({ language, setLanguage }) {
  const textLang = language.split("-")[0];
  const primary = textLang.toLowerCase();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef("");
  const analyzeTimeoutRef = useRef(null);
  const lastAnalyzedRef = useRef("");

  function updateInput(value) {
    inputRef.current = value;
    setInput(value);
  }

  function modifyInput(updater) {
    const next = typeof updater === 'function' ? updater(inputRef.current) : updater;
    updateInput(next);
  }
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [showHelpline, setShowHelpline] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [helplines, setHelplines] = useState([]);
  const [nearestPolice, setNearestPolice] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const interimRef = useRef('');
  const committedRef = useRef('');
  const lastProcessedIndexRef = useRef(-1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    // Fetch helplines on mount
    fetchHelplines();
    // Request geolocation
    requestUserLocation();
  }, [language]);

  function requestUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.log("Geolocation denied or unavailable", error);
        }
      );
    }
  }

  async function fetchHelplines() {
    try {
      let url = `http://localhost:5002/emergency-helplines?lang=${textLang}`;
      if (userLocation && userLocation.lat && userLocation.lon) {
        url += `&lat=${userLocation.lat}&lon=${userLocation.lon}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data) {
        setHelplines(data.helplines || []);
        setNearestPolice(data.nearest_police || null);
      }
    } catch (e) {
      console.error("Failed to fetch helplines", e);
    }
  }

  async function fetchNearbyServices(lat, lon, service_type = 'hospital') {
    try {
      const res = await fetch("http://localhost:5002/nearby-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat,
          lon,
          service_type: service_type,
          radius: 5,
        }),
      });
      const data = await res.json();
      setNearbyServices(data.nearby || []);
    } catch (e) {
      console.error("Failed to fetch nearby services", e);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    unlockAudio(language);

    const userText = inputRef.current.trim();
    updateInput("");  // Clear input immediately
    setLoading(true);  // Set loading after clearing
    setMessages((p) => [...p, { user: userText }]);

    try {
      const res = await fetch("http://localhost:5002/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userText,
          lang: textLang,
        }),
      });

      const data = await res.json();

      // Update the last user message with sentiment analysis
      setMessages((p) => {
        const updated = [...p];
        if (updated.length > 0 && updated[updated.length - 1].user) {
          updated[updated.length - 1].sentiment_score = data.sentiment_score;
          updated[updated.length - 1].emotion = data.emotion;
          updated[updated.length - 1].is_critical = data.is_critical;
        }
        // Add bot reply
        updated.push({ bot: data.reply });
        return updated;
      });

      // Check if critical (suicidal intent)
      if (data.is_critical || data.severity_level === "high") {
        setIsCritical(true);
        setShowHelpline(true);
        // Fetch nearby services
        if (userLocation) {
          fetchNearbyServices(userLocation.lat, userLocation.lon, 'police');
        }
      } else if (data.is_emergency) {
        setIsEmergency(true);
        setShowHelpline(true);
      }

      // 🔊 SPEAK AFTER MESSAGE IS SET
      setTimeout(() => {
        speak(data.reply, language);
      }, 200);
    } catch {
      setMessages((p) => [
        ...p,
        { bot: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  }

  function analyzeSpeechDebounced(text) {
    // avoid repeated analysis for same text
    if (!text || text.trim().length < 3) return;
    if (lastAnalyzedRef.current === text.trim()) return;
    clearTimeout(analyzeTimeoutRef.current);
    analyzeTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:5002/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang: textLang }),
        });
        if (!res.ok) return;
        const data = await res.json();
        lastAnalyzedRef.current = text.trim();
        const severity = data.severity || data.level || '';
        const is_suicidal = data.is_suicidal || data.isSuicidal || false;
        const is_self_harm = data.is_self_harm || data.isSelfHarm || false;

        if (is_suicidal || is_self_harm || severity === 'critical' || severity === 'high') {
          setIsCritical(true);
          setShowHelpline(true);
        }
      } catch (e) {
        // ignore analysis errors
      }
    }, 900);
  }

  function startListening() {
    unlockAudio(language);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const base = inputRef.current || '';
    let committed = base;

    // Map short language codes to BCP 47 format for Web Speech API
    // Web Speech API requires region codes for proper recognition
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'te': 'te-IN',      // Telugu
      'ta': 'ta-IN',      // Tamil
      'kn': 'kn-IN',      // Kannada
      'ml': 'ml-IN',      // Malayalam
      'mr': 'mr-IN',      // Marathi
      'bn': 'bn-IN',      // Bengali
      'gu': 'gu-IN',      // Gujarati
      'pa': 'pa-IN',      // Punjabi
    };

    const webSpeechLang = langMap[language] || language;

    // stop any existing recognition first
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = webSpeechLang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    committedRef.current = inputRef.current || '';
    interimRef.current = '';
    lastProcessedIndexRef.current = -1;
    recognition.start();
    setIsListening(true);

    // auto-stop after 30s to avoid long recordings
    if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
    recordingTimerRef.current = setTimeout(() => {
      stopListening();
    }, 30000);

    recognition.onresult = (e) => {
      let interim = '';
      let newFinalText = '';

      // Only process results we haven't seen before
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          // Only add if we haven't processed this index yet
          if (i > lastProcessedIndexRef.current) {
            newFinalText += transcript + ' ';
            lastProcessedIndexRef.current = i;
          }
        } else {
          interim += transcript;
        }
      }

      // Add new final text to committed (no translation here to avoid delays)
      if (newFinalText.trim().length > 0) {
        committedRef.current = (committedRef.current + ' ' + newFinalText).trim();
      }

      interimRef.current = interim;

      // update the input to show committed + interim (no duplication)
      updateInput((committedRef.current + (interimRef.current ? ' ' + interimRef.current : '')).trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
      // clear timer
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      // Don't commit interim here - onresult should have already done it
      // Only ensure state is clean
      setIsListening(false);
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
      recognitionRef.current = null;
      // Reset for next recording
      lastProcessedIndexRef.current = -1;
      interimRef.current = '';
    };
  }

  function stopListening() {
    const r = recognitionRef.current;
    if (r) {
      try { r.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    // commit interim to input
    if (interimRef.current && interimRef.current.trim().length > 0) {
      committedRef.current = (committedRef.current + ' ' + interimRef.current).trim();
    }
    updateInput(committedRef.current);
    setIsListening(false);
  }

  function handleKeyPress(key) {
    modifyInput((p) => (p || "") + key);
  }

  function handleBackspace() {
    modifyInput((p) => (p || "").slice(0, -1));
  }

  function handleSpace() {
    modifyInput((p) => (p || "") + " ");
  }

  function handleEnter() {
    sendMessage();
  }

  function handleCallHelpline(number) {
    window.open(`tel:${number.replace(/\s+/g, "")}`, '_self');
  }

  function getLanguageNative(code) {
    const map = {
      "en-IN": "English",
      "hi-IN": "हिंदी",
      "te-IN": "తెలుగు",
      "ta-IN": "தமிழ்",
      "kn-IN": "ಕನ್ನಡ",
      "ml-IN": "മലയാളം",
      "mr-IN": "मराठी",
      "bn-IN": "বাংলা",
      "gu-IN": "ગુજરાતી",
      "or-IN": "ଓଡ଼ିଆ",
    };

    return map[code] || code;
  }

  function t(key) {
    const dict = {
      'placeholder': {
        'en': 'Type your message or click the microphone to speak...',
        'hi': 'अपना संदेश टाइप करें या बोलने के लिए माइक्रोफ़ोन दबाएँ...',
        'te': 'మీ సందేశాన్ని టైప్ చేయండి లేదా మాట్లాడటానికి మైక్రోఫోన్‌ను నొక్కండి...',
        'ta': 'உங்கள் செய்தியை இட்டுக்கொள்ள அல்லது பேச மைக்ரோபோனை அழுத்தவும்...',
        'kn': 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಮೈಕ್ರೊಫೋൺ ಒತ್ತಿ...',
        'ml': 'നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കാൻ മൈക്രോഫോൺ അമർത്തുക...',
        'mr': 'आपला संदेश टाइप करा किंवा बोलण्यासाठी मायक्रोफोन दाबा...',
        'bn': 'আপনার বার্তা টাইপ করুন অথবা বলার জন্য মাইক্রোফোন চাপুন...',
        'gu': 'તમારો સંદેશ ટાઇપ કરો અથવા બોલવા માટે માઇક્રોફોન દબાવો...'
      },
      'send': {
        'en': 'Send', 'hi': 'भेजें', 'te': 'పంపించు', 'ta': 'அனுப்पு', 'kn': 'ಕಳುಹಿಸು', 'ml': 'അയയ്ക്കുക', 'mr': 'पाठवा', 'bn': 'পাঠান', 'gu': 'પઠાવો'
      },
      'available': { 'en': 'Available 24/7', 'hi': '24/7 उपलब्ध', 'te': '24/7 అందుబాటులో', 'ta': '24/7 கிடைக்கும்', 'kn': '24/7 ಲಭ್ಯವಿದೆ', 'ml': '24/7 ലഭ്യമാണ്', 'mr': '24/7 उपलब्ध', 'bn': '24/7 উপলब्ধ', 'gu': '24/7 ઉપલબ્ધ' },
      'empty_title': { 'en': 'How can I help you today?', 'hi': 'मैं आपकी किस प्रकार मदद कर सकता हूँ?', 'te': 'నేను మీకు ఎలా సహాయం చేయగలను?', 'ta': 'நான் இன్று உங்களுக்கு எவ్வாறு உதవ முடியும்?', 'kn': 'ನಾನು ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲು ಬಹುದು?', 'ml': 'നിന്റെ ഇന്നത്തെ പ്രയാസങ്ങൾ പരിഹരിക്കാൻ ഞാൻ സഹായിച്ചേക്കാം?', 'mr': 'मी आज तुम्हाला कसे मदत करू शकतो?', 'bn': 'আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?', 'gu': 'હું આજ તમને કેવી રીતે મદદ કરી શકું?' },
      'empty_desc': { 'en': "I'm here to listen and support you. You can type or speak to me about any concerns.", 'hi': 'मैं सुनने और समर्थन करने के लिए यहाँ हूँ। आप मुझे कोई भी समस्या टाइप कर सकते हैं या बोल सकते हैं।', 'te': 'నేను వినడానికి మరియు మద్దతు ఇవ్వడానికి ఇక్కడ ఉన్నాను. మీరు ఎటువంటి సమస్యల గురించి టైప్ చేయవచ్చు లేదా మాట్లాడవచ్చు.', 'ta': 'நான் கேட்க மற్றும் ஆதரவு வழங்க இங்கு இருக்கிறேன். நீங்கள் எந்த கவலைகளையும் டைப் செய்யலாம் அல்லது பேசலாம்.', 'kn': 'ನಾನು ಕೇಳಲು ಮತ್ತು ಬೆಂಬಲ ನೀಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು ಯಾವುದೇ ಸಮಸ್ಯೆಗಳ ಬಗ್ಗೆ ಟೈಪ್ ಮಾಡಬಹುದು ಅಥವಾ ಮಾತನಾಡಬಹುದು.', 'ml': 'ഞാൻ കേട്ട് സഹായിക്കാൻ ഇവിടെയുണ്ട്. നിങ്ങൾക്ക് ഏതെങ്കിലും കാര്യം ടൈപ്പ് ചെയ്യാം അല്ലെങ്കിൽ പറയാം.', 'mr': 'मी येथे आहे ऐकण्यासाठી आणि समर्थन देण्यासाठी. तुम्ही कोणत्याही समस्येबद्दल टाइप करू शकता किंवा बोलू शकता.', 'bn': 'আমি এখানে শুনতে এবং সমর্থন দিতে আছি। আপনি যেকোনো সমস्যা টাইप করতে পারেন বা বলতে পারেন।', 'gu': 'હું સાંભળવા અને સમર્થન આપવા માટે અહીં છું. તમે કોઈપણ સમસ્યા ટાઈપ કરી શકો અથવા બોલી શકો.' },
      'emergency': { 'en': 'Emergency', 'hi': 'आपातकाल', 'te': 'అత్యవసర', 'ta': 'அவசர', 'kn': 'ತುರ್ತು', 'ml': 'അടിയന്തരം', 'mr': 'आपातकाल', 'bn': 'জরুরি', 'gu': 'તુરંત' }

    };

    const lang = textLang || 'en';
    return (dict[key] && (dict[key][lang] || dict[key]['en'])) || '';
  }

  // cleanup recognition and timers on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        recognitionRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      lastProcessedIndexRef.current = -1;
    };
  }, []);

  // reset lastProcessedIndex when listener stops
  useEffect(() => {
    if (!isListening) {
      lastProcessedIndexRef.current = -1;
    }
  }, [isListening]);

  async function translateText(text, target) {
    try {
      const res = await fetch('http://localhost:5002/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target }),
      });
      if (!res.ok) return text;
      const data = await res.json();
      return data.translated || text;
    } catch (e) {
      return text;
    }
  }

  return (
    <div className="chatpage-container">
      {/* Header */}
      <header className="chatpage-header">
        <div className="chatpage-header-content">
          <div className="header-left">
            <button
              className="header-back-button"
              onClick={() => setLanguage(null)}
              title="Back to language selection"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="header-title-section">
              <h1>Krishimitra</h1>
              <p>{t('available') || 'Available 24/7'}</p>
            </div>
          </div>

          <div className="header-right">
            <button
              className={`emergency-button ${isCritical ? 'active' : ''}`}
              onClick={() => setShowHelpline(true)}
              title="Emergency resources"
            >
              <AlertTriangle size={16} />
              <span>{t('emergency') || 'Emergency'}</span>
            </button>
            
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {getLanguageNative(language) || language}
            </Badge>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="chatpage-messages">
        {messages.length === 0 && (
          <div className="empty-chat-state">
            <div className="empty-state-icon">
              <Volume2 />
            </div>
            <h2 className="empty-state-title">{t('empty_title')}</h2>
            <p className="empty-state-description">
              {t('empty_desc')}
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index}>
            {message.user && (
              <ChatMessage message={message.user} isUser={true} sentiment_score={message.sentiment_score} emotion={message.emotion} is_critical={message.is_critical} />
            )}
            {message.bot && (
              <ChatMessage message={message.bot} isUser={false} />
            )}
          </div>
        ))}

        {loading && <ChatMessage isLoading={true} />}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="chatpage-input-section">
        <div className="input-content">
          <div className="input-controls">
            <button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={() => (isListening ? stopListening() : startListening())}
              disabled={loading}
              title={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>

            <div className="text-input-wrapper">
              <textarea
                className="text-input"
                value={input}
                onChange={(e) => updateInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={t('placeholder')}
                rows={1}
                disabled={loading}
              />
            </div>

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              title="Send message"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">{t('send')}</span>
            </button>
          </div>

          {/* Keyboard Toggle */}
          <div className="text-center">
            <button
              className="keyboard-toggle-btn"
              onClick={() => setShowKeyboard(!showKeyboard)}
            >
              <Keyboard className="h-4 w-4" />
              {showKeyboard ? t('keyboard_hide') : t('keyboard_show')}
            </button>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <VirtualKeyboard
          language={language}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onEnter={handleEnter}
          isVisible={showKeyboard}
          onToggle={() => setShowKeyboard(!showKeyboard)}
        />
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={showHelpline}
        language={language}
        onClose={() => {
          setShowHelpline(false);
          setIsCritical(false);
          setIsEmergency(false);
        }}
        isCritical={isCritical}
        helplines={helplines}
        nearbyServices={nearbyServices}
        nearestPolice={nearestPolice}
        onCallHelpline={handleCallHelpline}
      />
    </div>
  );
}

export default ChatPage;
