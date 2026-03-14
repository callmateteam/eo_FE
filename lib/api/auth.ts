import { ApiError, apiFetch } from "@/lib/api/client";

export type LoginPayload = {
  password: string;
  username: string;
};

export type SignupPayload = {
  name: string;
  password: string;
  username: string;
  verification_token: string;
};

export type User = {
  created_at: string;
  email: string | null;
  id: string;
  name: string;
  profile_image: string | null;
  social: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
  };
  username: string;
};

export type AuthSuccessResponse = {
  message: string;
  user_id: string;
  username: string;
};

export type GoogleLoginResponse = AuthSuccessResponse & {
  email: string | null;
  is_new_user: boolean;
};

export type SignupResponse = {
  id: string;
  message: string;
  username: string;
};

export type UsernameValidationResponse = {
  available: boolean;
  message: string;
  username: string;
  verification_token: string | null;
};

export async function login(payload: LoginPayload) {
  return apiFetch<AuthSuccessResponse>("/api/auth/login", {
    body: payload,
    method: "POST",
    retryOnAuthError: false,
  });
}

export async function signup(payload: SignupPayload) {
  return apiFetch<SignupResponse>("/api/auth/signup", {
    body: payload,
    method: "POST",
    retryOnAuthError: false,
  });
}

export async function validateUsername(username: string) {
  return apiFetch<UsernameValidationResponse>("/api/auth/validate-username", {
    body: { username },
    method: "POST",
    retryOnAuthError: false,
  });
}

export async function googleLogin(idToken: string) {
  return apiFetch<GoogleLoginResponse>("/api/auth/google", {
    body: { id_token: idToken },
    method: "POST",
    retryOnAuthError: false,
  });
}

export async function logout() {
  return apiFetch<void>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  return apiFetch<User>("/api/auth/me", {
    method: "GET",
  });
}

export async function getCurrentUserOrNull() {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
}
