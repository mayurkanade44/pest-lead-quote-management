import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { authAPI, type LoginRequest } from "../lib/api";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
      };
      return authAPI.login(loginData);
    },
    onSuccess: (response) => {
      toast.success("Login successful! Welcome back.", {
        description: `Logged in as ${response.data.user.fullName}`,
      });
      // Store user data in query cache
      queryClient.setQueryData(["user"], response.data.user);
      // Redirect to dashboard
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login failed", error);

      // Extract error message from the response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      toast.error(errorMessage);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      toast.success("Logged out successfully", {
        description: "See you next time!",
      });
      // Clear user data from cache
      queryClient.removeQueries({ queryKey: ["user"] });
      // Redirect to login
      navigate("/login");
    },
    onError: (error: any) => {
      console.error("Logout failed", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Logout failed. Please try again.";

      toast.error("Logout Failed", {
        description: errorMessage,
      });
    },
  });
};
