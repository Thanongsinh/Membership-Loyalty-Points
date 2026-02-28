import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const stored = localStorage.getItem("auth-storage");
        if (stored) {
          const { state } = JSON.parse(stored);
          const res = await axios.post("http://localhost:3001/api/auth/refresh", {
            refreshToken: state.refreshToken,
          });
          const newState = {
            ...state,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          };
          localStorage.setItem("auth-storage", JSON.stringify({ state: newState }));
          original.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
