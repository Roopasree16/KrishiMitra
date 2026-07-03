import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Advisory() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [month, setMonth] = useState("");
  const [crops, setCrops] = useState("");
  const [lang, setLang] = useState("en");

  const handleSubmit = () => {
    if (!location.trim()) {
      alert("Please enter your location");
      return;
    }

    if (!month) {
      alert("Please select a month");
      return;
    }

    if (!crops.trim()) {
      alert("Please enter at least one crop");
      return;
    }

    navigate("/result", {
      state: {
        location: location.trim(),
        month: Number(month),
        crops: crops
          .split(",")
          .map(c => c.trim())
          .filter(Boolean),
        lang,
      },
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Expert Farming Advice</h1>

      <div style={styles.field}>
        <label style={styles.label}>
          Location (City or Pincode)
        </label>
        <input
          style={styles.input}
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Example: 560001 or Mandya"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          Month
        </label>
        <select
          style={styles.input}
          value={month}
          onChange={e => setMonth(e.target.value)}
        >
          <option value="">Select month</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          Crops (comma separated)
        </label>
        <input
          style={styles.input}
          value={crops}
          onChange={e => setCrops(e.target.value)}
          placeholder="Rice, Wheat, Maize"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          Language
        </label>
        <div style={styles.langRow}>
          <button
            style={lang === "en" ? styles.langActive : styles.langBtn}
            onClick={() => setLang("en")}
          >
            English
          </button>
          <button
            style={lang === "hi" ? styles.langActive : styles.langBtn}
            onClick={() => setLang("hi")}
          >
            Hindi
          </button>
        </div>
      </div>

      <button style={styles.submitBtn} onClick={handleSubmit}>
        Get Advice
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "420px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#f4f1ea",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#2e5e2e",
    marginBottom: "24px",
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },
  langRow: {
    display: "flex",
    gap: "10px",
  },
  langBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #888",
    backgroundColor: "#fff",
  },
  langActive: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #2e5e2e",
    backgroundColor: "#2e5e2e",
    color: "#fff",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    backgroundColor: "#2e5e2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
  },
};
