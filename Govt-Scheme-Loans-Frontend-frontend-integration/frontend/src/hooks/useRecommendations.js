import { useState, useEffect } from "react";
import { fetchSchemes, fetchLoans } from "../services/api";

export default function useRecommendations(type, language) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);

  const getRecommendations = async (payload) => {
    const finalPayload = {
      ...payload,
      language, // 🔥 always inject current language
    };

    setLastPayload(finalPayload);

    try {
      setLoading(true);
      setError(null);

      const response =
        type === "schemes"
          ? await fetchSchemes(finalPayload)
          : await fetchLoans(finalPayload);

      if (response && Array.isArray(response.recommendations)) {
        setData(response.recommendations);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 AUTO RE-FETCH WHEN LANGUAGE CHANGES
  useEffect(() => {
    if (lastPayload) {
      getRecommendations(lastPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return { data, loading, error, getRecommendations };
}
