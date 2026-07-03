import FormInput from "../components/FormInput";
import RecommendationCard from "../components/RecommendationCard";
import Loader from "../components/Loader";
import useRecommendations from "../hooks/useRecommendations";
import { UI_TEXT } from "../translations/ui";

export default function Schemes({ language }) {
  const { data, loading, error, getRecommendations } =
    useRecommendations("schemes");

  return (
    <div className="container">
      <h1>{UI_TEXT[language].schemesTitle}</h1>

      <FormInput
        language={language}
        onSubmit={(formData) =>
          getRecommendations({ ...formData, language })
        }
      />

      {loading && <Loader />}
      {error && <p>{error}</p>}
      {data.length > 0 && (
  <p className="disclaimer">
    This is an advisory system. Please verify details on official portals.
  </p>
)}

      {data.map((scheme) => (
        <div key={scheme.id} className="fade-in">
          <RecommendationCard item={scheme} />
        </div>
      
      ))}
    </div>
  );
}
