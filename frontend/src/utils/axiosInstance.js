import axios from "axios";
import config from "../../config.js";

const server = config.server;

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: server,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// Request Interceptor
// ============================
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    if (refreshToken) config.headers["x-refresh-token"] = refreshToken;
    if (user) config.headers["x-user-id"] = user;
    if (role) config.headers["x-role-id"] = role;

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// Response Interceptor
// ============================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle Access Token Expiry
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.warn("No refresh token found — redirecting to login.");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Request a new access token using refresh token
        const { data } = await axios.post(`${server}/refresh`, {
          token: refreshToken,
        });

        // Save new tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Update axios default headers
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed — redirecting to login.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;