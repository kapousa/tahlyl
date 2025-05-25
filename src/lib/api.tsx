// src/lib/api.ts
import axios from "axios";


const api = axios.create({
  baseURL: "http://your-api-url.com", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      history.push("/login"); // Redirect using history
      window.location.reload(); // Force refresh to trigger <Navigate /> if needed
    }
    return Promise.reject(error);
  }
);

export default api;
