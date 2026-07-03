export default function RecommendationCard({ seasonal, prices }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🌱 Crop & Market Advisory</h2>

      {/* Seasonal Advisory */}
      {seasonal && (
        <>
          <h3>📅 Seasonal Recommendation</h3>
          <p>{seasonal.message}</p>

          {Array.isArray(seasonal.recommended_crops) && (
            <ul>
              {seasonal.recommended_crops.map((crop, index) => (
                <li key={index}>
                  <strong>{crop.name}</strong> — Water need:{" "}
                  {crop.water_requirement}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Market Prices */}
      {Array.isArray(prices) && (
        <>
          <h3>💰 Market Prices</h3>
          <ul>
            {prices.map((item, index) => (
              <li key={index}>
                <strong>{item.crop}</strong>: ₹{item.current_price}{" "}
                {item.unit}
                <br />
                MSP: ₹{item.msp} | Trend: {item.trend} (
                {item.change_percent}%)
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#2e5e2e",
    marginBottom: "12px",
  },
};
