import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Advisory from "./pages/Advisory";
import Result from "./pages/Result";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
