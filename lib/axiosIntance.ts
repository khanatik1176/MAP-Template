import { TEMP_BACKEND_URI } from "@/utils/config";
import axios from "axios";

// Function to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/sign-in";
    return;
  }

  try {
    // POST to Django-simplejwt refresh endpoint which returns { access: "<token>" }
    const response = await axios.post(`${TEMP_BACKEND_URI}/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccess = response.data?.access;
    if (!newAccess) {
      throw new Error("No access token in refresh response");
    }

    // Update access token in local storage (refresh token usually stays the same)
    localStorage.setItem("accessToken", newAccess);

    return newAccess;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/sign-in";
    throw error;
  }
};

// Axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: TEMP_BACKEND_URI,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers || {};
      // use string concatenation to avoid template/backtick parsing issues
      config.headers["Authorization"] = 'Bearer ' + accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops

      try {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers || {};
          // use string concatenation here as well
          originalRequest.headers["Authorization"] = 'Bearer ' + newAccessToken;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed or invalid:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;