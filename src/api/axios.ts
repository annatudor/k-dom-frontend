// src/api/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7293/api",
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("API Request interceptor - token exists:", !!token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("API Request interceptor - Authorization header set");
  }

  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log("API Response success:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("Unauthorized request - removing token and redirecting");
      localStorage.removeItem("token");

      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
