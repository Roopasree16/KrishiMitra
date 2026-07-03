export default function RecommendationCard({ item }) {
  if (!item) return null;

  return (
    <div className="card">
      <h3>{item.schemeName}</h3>

      <p><strong>Why you are eligible:</strong></p>
      <p>{item.reason}</p>

      <p><strong>Eligibility Summary:</strong></p>
      <p>{item.eligibilitySummary}</p>

      <p><strong>Benefits:</strong> {item.benefits}</p>

      <strong>Required Documents:</strong>
      <ul>
        {item.requiredDocuments.map((doc, i) => (
          <li key={i}>{doc}</li>
        ))}
      </ul>

      <p>
        <strong>Apply Through:</strong> {item.applicationChannel}
      </p>

      <a href={item.officialLink} target="_blank" rel="noreferrer">
        Official Website
      </a>

      <p className="disclaimer">{item.disclaimer}</p>
    </div>
  );
}
