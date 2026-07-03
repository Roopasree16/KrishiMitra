import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-actions">
  <a className="action-card" href="/schemes">
    Government Schemes
    <p>Check subsidies, compensation, and support programs</p>
  </a>

  <a className="action-card" href="/loans">
    Agricultural Loans
    <p>Find loans and financial assistance you are eligible for</p>
  </a>
</div>

  );
}
