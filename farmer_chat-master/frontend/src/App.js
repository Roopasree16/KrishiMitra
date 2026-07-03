import { useState } from "react";
import LanguageSelect from "./pages/LanguageSelect";
import ChatPage from "./pages/ChatPage";

function App() {
  const [language, setLanguage] = useState(null);

  // If language not selected, show language selection screen
  if (!language) {
    return <LanguageSelect setLanguage={setLanguage} />;
  }

  // Pass BOTH language and setLanguage
  return (
    <ChatPage
      language={language}
      setLanguage={setLanguage}
    />
  );
}

export default App;
