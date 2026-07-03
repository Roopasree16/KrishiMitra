import './LanguageSelect.css';

function LanguageSelect({ setLanguage }) {
  const languages = [
    { code: "en-IN", native: "English" },
    { code: "hi-IN", native: "हिंदी" },
    { code: "te-IN", native: "తెలుగు" },
    { code: "ta-IN", native: "தமிழ்" },
    { code: "kn-IN", native: "ಕನ್ನಡ" },
    { code: "ml-IN", native: "മലയാളം" },
    { code: "mr-IN", native: "मराठी" },
    { code: "bn-IN", native: "বাংলা" },
    { code: "gu-IN", native: "ગુજરાતી" },
  ];

  return (
    <div className="lang-simple-root">
      <div className="lang-grid">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="lang-card"
          >
            {lang.native}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelect;
