import { apiFetch } from "./client";
import type {
  AuthResponse,
  GoogleAuthResponse,
  LoginPayload,
  SignupPayload,
  User,
  ValidateUsernameResponse,
} from "./types";

export function validateUsername(username: string) {
  return apiFetch<ValidateUsernameResponse>("POST", "/api/auth/validate-username", {
    username,
  });
}

export function signup(payload: SignupPayload) {
  return apiFetch<{ id: string; username: string; message: string }>(
    "POST",
    "/api/auth/signup",
    payload,
  );
}

export function login(payload: LoginPayload) {
  return apiFetch<AuthResponse>("POST", "/api/auth/login", payload);
}

export function googleLogin(idToken: string) {
  return apiFetch<GoogleAuthResponse>("POST", "/api/auth/google", {
    id_token: idToken,
  });
}

export function logout() {
  return apiFetch<Record<string, never>>("POST", "/api/auth/logout");
}

export function getMe() {
  return apiFetch<User>("GET", "/api/auth/me");
}
