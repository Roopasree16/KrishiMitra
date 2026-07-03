import FormInput from "../components/FormInput";
import RecommendationCard from "../components/RecommendationCard";
import Loader from "../components/Loader";
import useRecommendations from "../hooks/useRecommendations";
import { UI_TEXT } from "../translations/ui";

export default function Loans({ language }) {
  const { data, loading, error, getRecommendations } =
    useRecommendations("loans");

  return (
    <div className="container">
      <h1>{UI_TEXT[language].loansTitle}</h1>

      <FormInput
        language={language}
        onSubmit={(formData) =>
          getRecommendations({ ...formData, language })
        }
      />
        {data.length > 0 && (
  <p className="disclaimer">
    This is an advisory system. Please verify details on official portals.
  </p>
)}

      {loading && <Loader />}
      {error && <p>{error}</p>}

      {data.map((loan) => (
        <div key={loan.id} className="fade-in">
          <RecommendationCard item={loan} />
        </div>
      ))}
    </div>
  );
}
