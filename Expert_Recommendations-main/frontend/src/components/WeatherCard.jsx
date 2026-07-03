export default function WeatherCard({ weather }) {
  console.log("WEATHER IN WeatherCard:", weather);

  const actualWeather = weather?.weather;

  if (!actualWeather) return null;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🌦 Weather Advisory</h3>

      <p><b>Condition:</b> {actualWeather.description ?? "N/A"}</p>
      <p><b>Temperature:</b> {actualWeather.temperature ?? "N/A"} °C</p>
      <p><b>Feels Like:</b> {actualWeather.feels_like ?? "N/A"} °C</p>
      <p><b>Humidity:</b> {actualWeather.humidity ?? "N/A"}%</p>
      <p><b>Rainfall:</b> {actualWeather.rainfall ?? 0} mm</p>
      <p><b>Wind Speed:</b> {actualWeather.wind_speed ?? "N/A"} km/h</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "12px",
    color: "#2e5e2e",
  },
};
