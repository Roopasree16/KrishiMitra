import axios from "axios";

console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
//temporary line delete after debug

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});


export const weatherAdvisory = (location, lang) =>
  api.get("/weather-advisory", {
    params: { location, lang },
  });

export const seasonalAdvisory = (month, lang) =>
  api.get("/seasonal-advisory", {
    params: { month, lang },
  });

export const priceAdvisory = (crops, lang) =>
  api.get("/price-advisory", {
    params: { crops, lang },
  });

export const sendSMS = (phone, message) =>
  api.post("/send-sms", { phone, message });
