import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useExpertAdvice from "../hooks/useExpertAdvice";
import { sendSMS } from "../api/expertApi";

import WeatherCard from "../components/WeatherCard";
import RecommendationCard from "../components/RecommendationCard";

export default function Result() {
  const { state } = useLocation();
  const { data, loading, error, fetchAdvice } = useExpertAdvice();

  const [phone, setPhone] = useState("");
  const [smsStatus, setSmsStatus] = useState("");

  useEffect(() => {
    if (state) {
      fetchAdvice(state);
    }
  }, [state]);

  const handleSendSMS = async () => {
    if (!phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    const w = data?.weather;

    const message = `
Weather Advisory:
Condition: ${w?.description}
Temperature: ${w?.temperature} °C
Feels Like: ${w?.feels_like} °C
Humidity: ${w?.humidity}%
Rainfall: ${w?.rainfall} mm
Wind Speed: ${w?.wind_speed} km/h

Seasonal Advisory:
${data?.seasonal?.message || "N/A"}

Market Prices:
${Array.isArray(data?.prices)
  ? data.prices
      .map(p => `${p.crop}: ₹${p.current_price}/${p.unit}`)
      .join("\n")
  : "N/A"}
    `;

    try {
      await sendSMS(phone.trim(), message);
      setSmsStatus("✅ Message sent successfully");
    } catch {
      setSmsStatus("❌ Failed to send SMS");
    }
  };

  if (loading) return <p style={styles.center}>Loading recommendations...</p>;
  if (error) return <p style={styles.center}>{error}</p>;

console.log("DATA IN RESULT:", data);
console.log("WEATHER IN RESULT:", data?.weather);


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Expert Recommendations</h1>

      {/* ✅ DIRECT BACKEND DATA */}
      <WeatherCard weather={data?.weather} />

      <RecommendationCard
        seasonal={data?.seasonal}
        prices={data?.prices}
      />

      <div style={styles.smsBox}>
        <h3>📱 Send advice to your phone</h3>

        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSendSMS} style={styles.button}>
          Send SMS
        </button>

        {smsStatus && <p>{smsStatus}</p>}
      </div>
    </div>
  );
}


const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f1ea",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#2e5e2e",
    marginBottom: "30px",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "18px",
  },
  smsBox: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #aaa",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    backgroundColor: "#2e5e2e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
