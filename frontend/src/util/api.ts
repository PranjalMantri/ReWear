import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const skipRefreshEndpoints = [
      "/user/signin",
      "/user/signup",
      "/user/refresh",
    ];

    if (skipRefreshEndpoints.some((url) => originalRequest.url.includes(url))) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await refreshApi.post("/user/refresh");

        console.log(response);
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
