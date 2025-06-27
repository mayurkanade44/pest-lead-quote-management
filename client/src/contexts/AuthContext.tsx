import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, setGlobalLogout, type User } from "../lib/api";
import { toast } from "sonner";
import { logger } from "../lib/logger";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: (showMessage?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCurrentUser = async (): Promise<User> => {
  const response = await authAPI.me();
  return response.data.user;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: !isInitialized && location.pathname !== "/login", // Only run once on app startup and not on login page
  });

  const logout = (showMessage = true) => {
    logger.info("User logout initiated", {
      userId: user?.id,
      showMessage,
      currentPath: location.pathname,
    });

    setUser(null);
    queryClient.clear(); // Clear all cache

    // Don't show session expired message if user is already on public routes
    const isOnPublicRoute =
      location.pathname === "/login" || location.pathname === "/";

    if (showMessage && !isOnPublicRoute) {
      toast.error("Session expired. Please login again.");
    }

    navigate("/login", { replace: true });
  };

  // Set up global logout for API interceptor
  useEffect(() => {
    const globalLogoutHandler = () => {
      const isOnPublicRoute =
        window.location.pathname === "/login" ||
        window.location.pathname === "/";
      logout(!isOnPublicRoute); // Only show message if not on public route
    };

    setGlobalLogout(globalLogoutHandler);

    // Cleanup on unmount
    return () => {
      setGlobalLogout(() => {});
    };
  }, []);

  // Handle auth check result
  useEffect(() => {
    // If on login page, initialize immediately without auth check
    if (location.pathname === "/login" && !isInitialized) {
      setIsInitialized(true);
      return;
    }

    if (userData) {
      setUser(userData);
    } else if (error && !isLoading) {
      setUser(null);
      if (isInitialized && (error as any)?.response?.status === 401) {
        const isOnPublicRoute =
          location.pathname === "/login" || location.pathname === "/";
        logout(!isOnPublicRoute); // Only show message if not on public route
      }
    }

    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [userData, error, isLoading, isInitialized, location.pathname]);

  const login = (userData: User) => {
    logger.info("User login successful", {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    });

    setUser(userData);
    queryClient.setQueryData(["auth", "currentUser"], userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized || isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
