import axiosClient from "../../api/axiosClient";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: string;
  status?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const AuthService = {
  login: (identifier: string, password: string) =>
    axiosClient.post<AuthResponse>("/login", { identifier, password }),

  register: (payload: { name: string; email: string; password: string }) =>
    axiosClient.post<AuthResponse>("/register", payload),

  logout: () => axiosClient.post<{ msg: string }>("/logout"),
};
