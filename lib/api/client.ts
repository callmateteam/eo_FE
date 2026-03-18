const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

// ---------------------------------------------------------------------------
// Error classes
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;
  errors: { field?: string; message: string }[];

  constructor(
    status: number,
    message: string,
    errors: { field?: string; message: string }[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    this.name = "NetworkError";
    this.cause = cause;
  }
}

// ---------------------------------------------------------------------------
// Token refresh singleton
// ---------------------------------------------------------------------------

let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new ApiError(res.status, "세션이 만료되었습니다. 다시 로그인해주세요.");
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

type ApiFetchOptions = {
  raw?: boolean;
  _isRetry?: boolean;
};

export async function apiFetch<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown | FormData,
  options?: ApiFetchOptions,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {};

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers,
      credentials: "include",
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });
  } catch (error) {
    throw new NetworkError(error);
  }

  // 401 → try refresh once
  if (response.status === 401 && !options?._isRetry) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;
      return apiFetch<T>(method, path, body, { ...options, _isRetry: true });
    } catch {
      // refresh failed — throw original 401
    }
  }

  // raw response (for binary downloads)
  if (options?.raw) {
    return response as unknown as T;
  }

  // 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  // Parse JSON
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, "서버 응답을 처리할 수 없습니다.");
    }
    return null as T;
  }

  if (!response.ok) {
    const body = data as Record<string, unknown> | undefined;
    const message =
      (body?.message as string) ??
      (body?.detail as string) ??
      `요청에 실패했습니다. (${response.status})`;

    const fieldErrors: { field?: string; message: string }[] = [];

    // Handle { detail: [{ loc, msg, type }] } (FastAPI validation)
    if (Array.isArray(body?.detail)) {
      for (const item of body.detail as { loc?: string[]; msg?: string }[]) {
        const field = item.loc?.at(-1);
        fieldErrors.push({ field, message: item.msg ?? "" });
      }
    }

    // Handle { errors: { field: message } } or { errors: [{ field, message }] }
    if (body?.errors) {
      if (Array.isArray(body.errors)) {
        for (const item of body.errors as { field?: string; message: string }[]) {
          fieldErrors.push(item);
        }
      } else if (typeof body.errors === "object") {
        for (const [field, msg] of Object.entries(
          body.errors as Record<string, string>,
        )) {
          fieldErrors.push({ field, message: msg });
        }
      }
    }

    throw new ApiError(response.status, message, fieldErrors);
  }

  return data as T;
}
