import { useState } from "react";
import {
  weatherAdvisory,
  seasonalAdvisory,
  priceAdvisory,
} from "../api/expertApi";

export default function useExpertAdvice() {
  const [data, setData] = useState({
    weather: null,
    seasonal: null,
    prices: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvice = async ({ location, month, crops, lang }) => {
    setLoading(true);
    setError(null);

    try {
      const [w, s, p] = await Promise.all([
        weatherAdvisory(location, lang),
        seasonalAdvisory(month, lang),
        priceAdvisory(crops.join(","), lang),
      ]);

      setData({
        weather: w.data,
        seasonal: s.data,
        prices: p.data,
      });
    } catch (err) {
      setError("Unable to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAdvice };
}
