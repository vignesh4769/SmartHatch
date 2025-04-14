import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Log requests for debugging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method.toUpperCase(),
      url: config.url,
      headers: {
        Authorization: config.headers.Authorization,
        "Content-Type": config.headers["Content-Type"],
      },
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default api;