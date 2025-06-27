import { createMutation } from "../hooks/createMutation";
import { authAPI, type LoginRequest } from "../lib/api";

export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

// Pre-configured login mutation
export const useLoginMutation = createMutation(
  async (data: LoginFormValues) => {
    const loginData: LoginRequest = {
      email: data.email,
      password: data.password,
    };
    return authAPI.login(loginData);
  },
  {
    showToasts: true,
    redirectTo: undefined,
  }
);

// Pre-configured logout mutation
export const useLogoutMutation = createMutation(authAPI.logout, {
  showToasts: true,
  redirectTo: undefined,
});
