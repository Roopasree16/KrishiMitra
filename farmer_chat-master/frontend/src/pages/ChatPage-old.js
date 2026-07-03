import { useState, useEffect, useRef } from "react";

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

/* ---------- KEYMAPS FOR EACH LANGUAGE (phonetic keypad: vowels + basic consonants) ---------- */
const KEYMAPS = {
  // Latin (English) - simple phonetic buttons
  en: ["a", "aa", "i", "ii", "u", "uu", "e", "ai", "o", "au", "k", "kh", "g", "gh", "ng"],

  // Devanagari (Hindi / Marathi)
  hi: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "क", "ख", "ग", "घ", "ङ"],
  mr: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "क", "ख", "ग", "घ", "ङ"],

  // Bengali
  bn: ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "এ", "ঐ", "ও", "ঔ", "ক", "খ", "গ", "ঘ", "ঙ"],

  // Telugu
  te: ["అ", " ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఎ", "ఐ", "ఒ", "ఔ", "క", "ఖ", "గ", "ఘ", "ఙ"],

  // Tamil
  ta: ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஐ", "ஒ", "ஔ", "க", "ச", "ட", "த", "ந"],

  // Kannada
  kn: ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಎ", "ಐ", "ಒ", "ಔ", "ಕ", "ಖ", "ಗ", "ಘ", "ಙ"],

  // Malayalam
  ml: ["അ", "ആ", "ഇ", "ഈ", "ഉ", "ഊ", "എ", "ഐ", "ഓ", "ഔ", "ക", "ഖ", "ഗ", "ഘ", "ങ"],

  // Gujarati
  gu: ["અ", "આ", "ઇ", "ઈ", "ઉ", "ઊ", "એ", "ઐ", "ઓ", "ઔ", "ક", "ખ", "ગ", "ઘ", "ଙ"],

  // Odia
  or: ["ଅ", "ଆ", "ଇ", "ଈ", "ଉ", "ଊ", "ଏ", "ଐ", "ଓ", "ଔ", "କ", "ଖ", "ଗ", "ଘ", "ଙ"],
};

/* ---------- FULL KEYBOARD LAYOUTS (rows) ---------- */
const KEYBOARD_LAYOUTS = {
  en: [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"],
  ],
  hi: [
    ["क","ख","ग","घ","ङ","च","छ","ज","झ","ञ"],
    ["ट","ठ","ड","ढ","ण","त","थ","द","ध","न"],
    ["प","फ","ब","भ","म","य","र","ल","व"],
    ["अ","आ","इ","ई","उ","ऊ","ए","ऐ","ओ","औ"],
  ],
  bn: [
    ["ক","খ","গ","ঘ","ঙ","চ","ছ","জ","ঝ","ঞ"],
    ["ট","ঠ","ড","ঢ","ণ","ত","থ","দ","ধ","ন"],
    ["প","ফ","ব","ভ","ম","য","র","ল","ব্"],
    ["অ","আ","ই","ঈ","উ","ঊ","এ","ঐ","ও","ঔ"],
  ],
  te: [
    ["క","ఖ","గ","ఘ","ఙ","చ","ఛ","జ","ఝ","ఞ"],
    ["ట","ఠ","డ","ఢ","ణ","త","థ","ద","ధ","న"],
    ["ప","ఫ","బ","భ","మ","య","ర","ల","వ"],
    ["అ","ఆ","ఇ","ఈ","ఉ","ఊ","ఎ","ఐ","ఒ","ఔ"],
  ],
  ta: [
    ["க","ங","ச","ஞ","ட","ண","த","ந","ப","ம"],
    ["ய","ர","ல","வ","ழ","ள","ற","ன"],
    ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஒ","ஓ"],
  ],
  kn: [
    ["ಕ","ಖ","ಗ","ಘ","ಙ","ಚ","ಛ","ಜ","ಝ","ಞ"],
    ["ಟ","ಠ","ಡ","ಢ","ಣ","ತ","ಥ","ದ","ಧ","ನ"],
    ["ಪ","ಫ","ಬ","ಭ","ಮ","ಯ","ರ","ಲ","ವ"],
    ["അ","ആ","ഇ","ಈ","ഉ","ഊ","എ","ഐ","ഓ","ഔ"],
  ],
  ml: [
    ["ക","ഖ","ഗ","ഘ","ങ","ച","ഛ","ജ","ഝ","ഞ"],
    ["ട","ഠ","ഡ","ഢ","ണ","ത","ഥ","ദ","ധ","ന"],
    ["പ","ഫ","ബ","ഭ","മ","യ","ര","ല","വ"],
    ["അ","ആ","ഇ","ഈ","ഉ","ഊ","എ","ഐ","ഓ","ൌ"],
  ],
  gu: [
    ["ક","ખ","ગ","ઘ","ઙ","ચ","છ","જ","ઝ","ઞ"],
    ["ટ","ઠ","ડ","ઢ","ણ","ત","થ","દ","ધ","ન"],
    ["પ","ફ","બ","ભ","મ","ય","ર","લ","વ"],
    ["અ","આ","ઇ","ઈ","ઉ","ઊ","એ","ઐ","ઓ","ઔ"],
  ],
  or: [
    ["କ","ଖ","ଗ","ଘ","ଙ","ଚ","ଛ","ଜ","ଝ","ଞ"],
    ["ଟ","ଠ","ଡ","ଢ","ଣ","ତ","ଥ","ଦ","ଧ","ନ"],
    ["ପ","ଫ","ବ","ଭ","ମ","ୟ","ର","ଲ","ବ୍"],
    ["ଅ","ଆ","ଇ","ଈ","ଉ","ଊ","ଏ","ଐ","ଓ","ଔ"],
  ],
};


async function playRemoteTTS(text, language) {
  try {
    const res = await fetch("http://localhost:5001/tts", {
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
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showKeypad, setShowKeypad] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);
  const [showHelpline, setShowHelpline] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [helplines, setHelplines] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyServices, setNearbyServices] = useState([]);

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
      const res = await fetch(`http://localhost:5002/emergency-helplines?lang=${textLang}`);
      const data = await res.json();
      setHelplines(data || []);
    } catch (e) {
      console.error("Failed to fetch helplines", e);
    }
  }

  async function fetchNearbyServices(lat, lon) {
    try {
      const res = await fetch("http://localhost:5002/nearby-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat,
          lon,
          service_type: "hospital",
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

    unlockAudio(language); // 🔓 REQUIRED

    const userText = input.trim();
    setInput("");
    setLoading(true);

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

      setMessages((p) => [...p, { bot: data.reply }]);

      // Check if critical (suicidal intent)
      if (data.is_critical || data.severity_level === "high") {
        setIsCritical(true);
        setShowHelpline(true);
        // Fetch nearby services
        if (userLocation) {
          fetchNearbyServices(userLocation.lat, userLocation.lon);
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

  function startListening() {
    unlockAudio(language); // 🔓 ALSO UNLOCK HERE

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  }

  function insertKey(k) {
    setInput((p) => (p ? p + (p.endsWith(" ") ? "" : " ") + k : k));
  }

  function handleKeyPress(key) {
    setInput((p) => (p || "") + key);
  }

  function handleBackspace() {
    setInput((p) => (p || "").slice(0, -1));
  }

  function handleSpace() {
    setInput((p) => (p || "") + " ");
  }

  function handleEnter() {
    sendMessage();
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
      {/* EMERGENCY HELPLINE MODAL */}
      {showHelpline && (
        <div style={styles.emergencyOverlay}>
          <div style={isCritical ? styles.criticalCard : styles.emergencyCard}>
            <button 
              style={styles.closeBtn}
              onClick={() => {
                setShowHelpline(false);
                if (isCritical) setIsCritical(false);
                if (isEmergency) setIsEmergency(false);
              }}
            >
              ✕
            </button>
            
            <div style={isCritical ? styles.criticalTitle : styles.emergencyTitle}>
              {isCritical ? "🚨 CRISIS ALERT - IMMEDIATE HELP NEEDED" : isEmergency ? "🚨 We're Here to Help" : "📞 Support Available"}
            </div>

            <div style={isCritical ? styles.criticalText : styles.emergencyText}>
              {isCritical 
                ? "We're concerned about your safety. PLEASE reach out to a helpline immediately or visit a nearby health center. You are not alone, and help is available right now."
                : isEmergency 
                ? "You seem to be in distress. Please reach out to one of these helplines:"
                : "If you need immediate support, please contact:"}
            </div>

            <div style={styles.helplinesList}>
              {helplines.map((h) => (
                <div key={h.id} style={isCritical ? styles.helplineItemCritical : styles.helplineItem}>
                  <div style={styles.helplineRow}>
                    <div>
                      <div style={styles.helplineName}>{h.helpline_name}</div>
                      {h.helpline_url && (
                        <a
                          href={h.helpline_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.helplineLink}
                        >
                          Visit website
                        </a>
                      )}
                    </div>

                    {h.helpline_number && (
                      <div style={styles.helplineActions}>
                        <a href={`tel:${h.helpline_number.replace(/\s+/g, "")}`} style={styles.callButton}>📞 Call</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isCritical && nearbyServices.length > 0 && (
              <div style={styles.nearbySection}>
                <div style={styles.nearbySectionTitle}>🏥 Nearby Health Centers & Hospitals:</div>
                <div style={styles.nearbyServicesList}>
                  {nearbyServices.map((service, i) => (
                    <div key={i} style={styles.nearbyServiceItem}>
                      <div style={styles.nearbyServiceName}>{service.name}</div>
                      {service.address && (
                        <div style={styles.nearbyServiceAddress}>📍 {service.address}</div>
                      )}
                      <div style={styles.nearbyServiceDistance}>{service.distance_km.toFixed(1)} km away</div>
                      {service.phone && (
                        <div style={styles.nearbyServicePhone}>📞 Call: {service.phone}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              style={isCritical ? styles.dismissBtnCritical : styles.dismissBtn}
              onClick={() => {
                setShowHelpline(false);
                if (isCritical) setIsCritical(false);
                if (isEmergency) setIsEmergency(false);
              }}
            >
              {isCritical ? "I will call for help" : "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.back} onClick={() => setLanguage(null)}>
          ←
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={styles.title}>Farmer Support</div>
          <div style={styles.subtitle}>You are not alone</div>
        </div>

        <button
          style={isEmergency ? styles.sosButtonActive : styles.sosButton}
          onClick={() => setShowHelpline(true)}
          title="Show emergency helplines"
        >
          🆘
        </button>

        <div style={styles.langTag} aria-hidden>
          {getLanguageNative(language) || language}
        </div>
      </div>

      {/* CHAT */}
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div key={i}>
            {m.user && <div style={styles.user}>{m.user}</div>}
            {m.bot && <div style={styles.bot}>{m.bot}</div>}
          </div>
        ))}
        {loading && <div style={styles.typing}>Bot is typing…</div>}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBarWrap}>
        <div style={styles.inputBar}>
          <button style={styles.mic} onClick={startListening} title="Start voice input">
            🎤
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type or speak…"
            style={styles.input}
          />

          <button style={styles.send} onClick={sendMessage} title="Send message">
            ➤
          </button>
        </div>

        <div style={styles.keypadBar}>
          <button
            style={styles.toggleKeypad}
            onClick={() => setShowKeypad((s) => !s)}
          >
            {showKeypad ? "Hide keypad" : "Show keypad"}
          </button>
        </div>
      </div>

      {showKeypad && (
        <div>
          <div style={styles.kbControls}>
            <button style={styles.toggleKeypad} onClick={() => setShowKeyboard((s)=>!s)}>
              {showKeyboard ? "Hide keyboard" : "Show keyboard"}
            </button>
          </div>

          {showKeyboard && (
            <div style={styles.keyboard}>
              {(KEYBOARD_LAYOUTS[primary] || KEYBOARD_LAYOUTS["en"]).map((row, i) => (
                <div key={i} style={styles.kbRow}>
                  {row.map((k) => (
                    <button
                      key={k}
                      onClick={() => handleKeyPress(k)}
                      style={styles.kbKey}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              ))}

              <div style={styles.kbRow}>
                <button onClick={handleBackspace} style={styles.kbControl}>⌫</button>
                <button onClick={handleSpace} style={{...styles.kbControl, flex:1}}>space</button>
                <button onClick={handleEnter} style={styles.kbControl}>↵</button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f3f4f6",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  container: {
    width: "100%",
    maxWidth: 880,
    margin: "28px auto",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 56px)",
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    background: "#fff",
    color: "#0f172a",
    borderBottom: "1px solid rgba(15,23,42,0.04)",
  },
  back: { background: "none", border: "none", color: "#0f172a", fontSize: 20, cursor: "pointer" },
  title: { fontSize: 18, fontWeight: 700, color: "#064e3b" },
  subtitle: { fontSize: 13, color: "#475569", marginTop: 2 },
  select: { borderRadius: 8, padding: 4 },
  chat: { flex: 1, padding: 20, overflowY: "auto", background: "#f8fafc" },
  user: {
    background: "#dcfce7",
    margin: "10px 0 10px auto",
    padding: 14,
    maxWidth: "72%",
    borderRadius: 16,
    boxShadow: "0 4px 14px rgba(2,6,23,0.04)",
    lineHeight: 1.45,
  },
  bot: {
    background: "#ffffff",
    margin: "10px auto 10px 0",
    padding: 14,
    maxWidth: "72%",
    borderRadius: 16,
    boxShadow: "0 4px 14px rgba(2,6,23,0.04)",
    lineHeight: 1.45,
  },
  typing: { fontSize: 13, color: "#64748b", padding: 8 },
  inputBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 8,
    background: "#fff",
    borderTop: "1px solid #eee",
  },
  inputBarWrap: { background: "#fff" },
  mic: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#10b981",
    color: "#fff",
    border: "none",
    fontSize: 20,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 22,
    border: "1px solid #e6edf0",
    fontSize: 16,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    fontSize: 18,
  },
  keypadBar: { padding: "8px 14px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" },
  toggleKeypad: { background: "none", border: "none", color: "#0f172a", cursor: "pointer", fontSize: 13 },
  keypad: { display: "flex", gap: 8, padding: 12, background: "#f8fafc", borderTop: "1px solid #eef2f7", flexWrap: "wrap" },
  keyButton: { padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(15,23,42,0.06)", background: "#fff", cursor: "pointer", fontSize: 14 },
  keyboard: { padding: 10, background: "#fff", borderTop: "1px solid #eef2f7" },
  kbRow: { display: "flex", justifyContent: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" },
  kbKey: { padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(15,23,42,0.06)", background: "#f8fafc", cursor: "pointer", fontSize: 16, minWidth: 40, textAlign: "center" },
  kbControl: { padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(15,23,42,0.06)", background: "#e6eef6", cursor: "pointer", fontSize: 15, marginRight: 6 },
  kbControls: { display: "flex", justifyContent: "flex-end", padding: "6px 12px" },
  langTag: {
    padding: "6px 10px",
    borderRadius: 8,
    background: "rgba(16,185,129,0.12)",
    color: "#065f46",
    fontSize: 13,
    border: "1px solid rgba(16,185,129,0.18)",
    marginLeft: 8,
  },
  sosButton: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    marginRight: 8,
  },
  sosButtonActive: {
    background: "#dc2626",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    marginRight: 8,
    padding: "6px 10px",
    borderRadius: 6,
    color: "#fff",
    fontWeight: "bold",
  },
  emergencyOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  emergencyCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    maxWidth: 450,
    width: "90%",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    color: "#6b7280",
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
    color: "#dc2626",
  },
  emergencyText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  helplinesList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 16,
  },
  helplineItem: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 12,
    background: "#f9fafb",
  },
  helplineName: {
    fontWeight: 600,
    fontSize: 14,
    color: "#0f172a",
    marginBottom: 4,
  },
  helplineNumber: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: 600,
    marginBottom: 6,
  },
  helplineLink: {
    fontSize: 13,
    color: "#059669",
    textDecoration: "none",
    fontWeight: 500,
  },
  dismissBtn: {
    width: "100%",
    padding: 12,
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  criticalCard: {
    background: "#fef2f2",
    borderRadius: 16,
    padding: 24,
    maxWidth: 450,
    width: "90%",
    boxShadow: "0 25px 60px rgba(220,38,38,0.4)",
    position: "relative",
    border: "3px solid #dc2626",
  },
  criticalTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
    color: "#991b1b",
  },
  criticalText: {
    fontSize: 14,
    color: "#7f1d1d",
    marginBottom: 16,
    lineHeight: 1.6,
    fontWeight: 500,
  },
  helplineItemCritical: {
    border: "2px solid #dc2626",
    borderRadius: 10,
    padding: 12,
    background: "#fee2e2",
  },
  helplineNumberCritical: {
    fontSize: 15,
    color: "#991b1b",
    fontWeight: 700,
    marginBottom: 6,
  },
  dismissBtnCritical: {
    width: "100%",
    padding: 14,
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  nearbySection: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: "2px solid #fecaca",
  },
  nearbySectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#991b1b",
    marginBottom: 10,
  },
  nearbyServicesList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  nearbyServiceItem: {
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    borderRadius: 8,
    padding: 10,
  },
  nearbyServiceName: {
    fontWeight: 600,
    fontSize: 13,
    color: "#991b1b",
  },
  nearbyServiceAddress: {
    fontSize: 12,
    color: "#7f1d1d",
    marginTop: 2,
  },
  nearbyServiceDistance: {
    fontSize: 12,
    color: "#7f1d1d",
    marginTop: 4,
  },
  nearbyServicePhone: {
    fontSize: 12,
    color: "#991b1b",
    fontWeight: 600,
    marginTop: 4,
  },
};

export default ChatPage;
