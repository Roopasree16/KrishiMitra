import { UI_TEXT } from "../translations/ui";

export default function Header({ language, setLanguage }) {
  return (
    <header className="app-header">
      <h2 className="logo">{UI_TEXT[language].appName}</h2>

      <select
        className="lang-toggle small"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="hi">हिंदी</option>
      </select>
    </header>
  );
}
