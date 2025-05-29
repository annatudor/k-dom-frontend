import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7293/api",
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[Axios error]", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
