import axios from "axios";
import { getCookie, setCookie } from "../../utils/cookie";
import { API_KEY, API_URL, API_WORKER_URL } from "./config";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const axiosClientWorker = axios.create({
  baseURL: API_WORKER_URL,
  withCredentials: true,
});

const authPaths = ["/login", "/register", "/refresh", "/logout"];

const isAuthPath = (url?: string) => {
  if (!url) {
    return false;
  }

  return authPaths.some(
    (path) => url === path || url.endsWith(path) || url.includes(`${API_URL}${path}`)
  );
};

// Add the access token to headers on every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (API_KEY) {
      config.headers["x-api-key"] = API_KEY;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add the access token to headers on every request for worker
axiosClientWorker.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (API_KEY) {
      config.headers["x-api-key"] = API_KEY;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token (401)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // If token expired and we haven't already retried this request
    if (
      (status === 401 || status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthPath(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        // Try to get a new access token
        const res = await axios.post(
          `${API_URL}/refresh`,
          undefined,
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setCookie("accessToken", newAccessToken, 1);
        if (res.data.user) {
          setCookie("user", JSON.stringify(res.data.user), 1);
        }

        // Add new token to header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh failed:", refreshErr);
        // Optional: redirect to login if refresh fails
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
