import axios from "axios";
import config from "../../config.js";

const server = config.server;

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: server,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Tokens & User Info
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const user = localStorage.getItem("user");
        const role = localStorage.getItem("role");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers["x-refresh-token"] = refreshToken;
        }
        if (user) {
            config.headers["x-user-id"] = user;
        }
        if (role) {
            config.headers["x-role-id"] = role;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry & Refresh Token
axiosInstance.interceptors.response.use(
    (response) => response, // Return response directly if it's OK
    async (error) => {
        const originalRequest = error.config;

        // If access token expired & we haven't retried already
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    console.error("Refresh token missing. Redirecting to login.");
                    localStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                // Request new access token
                const { data } = await axios.post(`${server}/refreshToken`, { token: refreshToken });

                // Store new tokens
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                // 🔹 Update Axios global defaults with new access token
                axiosInstance.defaults.headers["Authorization"] = `Bearer ${data.accessToken}`;

                // Attach the new token to the original request
                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed. Redirecting to login.");
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;