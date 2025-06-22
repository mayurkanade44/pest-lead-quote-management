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

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      error.message = "Network error. Please check if the server is running.";
    } else if (error.response?.status === 401) {
      error.message =
        "Invalid credentials. Please check your email and password.";
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

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
    };
  };
}

export const authAPI = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post("/auth/login", data).then((res) => res.data),

  logout: (): Promise<{ success: boolean; message: string }> =>
    api.post("/auth/logout").then((res) => res.data),
};
