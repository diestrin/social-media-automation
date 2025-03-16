import axios from "axios";
import { AuthResponse, LoginDto, RegisterDto } from "./types";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials for CORS
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if we're in the browser
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("auth_token") || Cookies.get("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if we're in the browser
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        Cookies.remove("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    // Store the token in localStorage and cookies
    if (typeof window !== "undefined") {
      const token = response.data.access_token;
      localStorage.setItem("auth_token", token);
      Cookies.set("auth_token", token, { expires: 1 }); // 1 day expiry
    }
    return response.data;
  },

  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", userData);
    // Store the token in localStorage and cookies
    if (typeof window !== "undefined") {
      const token = response.data.access_token;
      localStorage.setItem("auth_token", token);
      Cookies.set("auth_token", token, { expires: 1 }); // 1 day expiry
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      // Call the logout endpoint to clear the HTTP-only cookie
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear client-side storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        Cookies.remove("auth_token");
        window.location.href = "/login";
      }
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!(
        localStorage.getItem("auth_token") || Cookies.get("auth_token")
      );
    }
    return false;
  },
};

export default api;
