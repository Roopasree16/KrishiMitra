import { useState } from "react";

export default function InputField({ onSubmit }) {
  const [location, setLocation] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [crops, setCrops] = useState("");
  const [lang, setLang] = useState("en");

  const handleSubmit = () => {
    onSubmit({
      location,
      month,
      crops: crops.split(",").map(c => c.trim()),
      lang,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Enter city (e.g., New Delhi)"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Crops (comma separated)"
        value={crops}
        onChange={e => setCrops(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-2"
        value={lang}
        onChange={e => setLang(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Get Expert Advice
      </button>
    </div>
  );
}
