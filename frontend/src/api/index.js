import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:8000");

const api = axios.create({
  baseURL: `${API_URL}/api/v2`,
  withCredentials: true,
});

export default api;
