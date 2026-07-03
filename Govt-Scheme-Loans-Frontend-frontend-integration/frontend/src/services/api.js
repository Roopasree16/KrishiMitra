import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5006/api/recommend",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchSchemes = async (payload) => {
  const res = await API.post("/schemes", payload);
  return res.data;
};

export const fetchLoans = async (payload) => {
  const res = await API.post("/loans", payload);
  return res.data;
};
