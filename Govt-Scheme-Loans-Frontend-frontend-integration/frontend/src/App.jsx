import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import Loans from "./pages/Loans";
import Header from "./components/Header";

export default function App() {
  const [language, setLanguage] = useState("en");

  return (
    <BrowserRouter>
      <Header language={language} setLanguage={setLanguage} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/schemes"
          element={<Schemes language={language} />}
        />
        <Route
          path="/loans"
          element={<Loans language={language} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
