import axios from "axios";
import { config } from "../config";

const API_BASE_URL = `${config.API_BASE_URL}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global logout function (will be set by AuthContext)
let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void) => {
  globalLogout = logoutFn;
};


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Authentication failed, logging out...");

      if (globalLogout) {
        globalLogout();
      }

      error.message = "Session expired. Please login again.";
    } else if (error.code === "ERR_NETWORK") {
      error.message = "Network error. Please check if the server is running.";
    } else if (error.response?.status === 500) {
      error.message = "Server error. Please try again later.";
    }

    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export const authAPI = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post("/auth/login", data).then((res) => res.data),

  logout: (): Promise<{ success: boolean; message: string }> =>
    api.post("/auth/logout").then((res) => res.data),

  me: (): Promise<LoginResponse> => api.get("/auth/me").then((res) => res.data),
};
