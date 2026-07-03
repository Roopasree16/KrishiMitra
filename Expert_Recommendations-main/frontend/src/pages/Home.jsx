import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Expert Recommendations</h1>
      <p style={styles.text}>
        Get reliable farming advice based on weather, season, and market prices.
      </p>
      <button style={styles.button} onClick={() => navigate("/advisory")}>
        Start
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#f4f1ea",
    minHeight: "100vh",
  },
  title: {
    color: "#2e5e2e",
  },
  text: {
    marginBottom: "20px",
  },
  button: {
    padding: "14px 30px",
    fontSize: "18px",
    backgroundColor: "#2e5e2e",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
};
