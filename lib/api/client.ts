const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
  retryOnAuthError?: boolean;
};

type ErrorItem = {
  field?: string | null;
  message: string;
};

export class ApiError extends Error {
  status: number;
  errors: ErrorItem[];

  constructor(message: string, status: number, errors: ErrorItem[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

let refreshPromise: Promise<boolean> | null = null;

function getApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return apiBaseUrl;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeErrorPayload(payload: unknown) {
  if (!isPlainObject(payload)) {
    return {
      errors: [] as ErrorItem[],
      message: "요청을 처리하지 못했습니다.",
    };
  }

  if (typeof payload.detail === "string") {
    return {
      errors: Array.isArray(payload.errors) ? (payload.errors as ErrorItem[]) : [],
      message: payload.detail,
    };
  }

  if (isPlainObject(payload.detail)) {
    return {
      errors: Array.isArray(payload.detail.errors)
        ? (payload.detail.errors as ErrorItem[])
        : [],
      message:
        typeof payload.detail.detail === "string"
          ? payload.detail.detail
          : "요청을 처리하지 못했습니다.",
    };
  }

  return {
    errors: [],
    message: "요청을 처리하지 못했습니다.",
  };
}

async function parseError(response: Response) {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const { errors, message } = normalizeErrorPayload(payload);

  return new ApiError(message, response.status, errors);
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      credentials: "include",
      method: "POST",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, headers, retryOnAuthError = true, ...rest } = options;
  const requestHeaders = new Headers(headers);
  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    if (isPlainObject(body)) {
      requestHeaders.set("Content-Type", "application/json");
      requestBody = JSON.stringify(body);
    } else {
      requestBody = body;
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    body: requestBody,
    credentials: "include",
    headers: requestHeaders,
  });

  if (response.status === 401 && retryOnAuthError) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return apiFetch<T>(path, {
        ...options,
        retryOnAuthError: false,
      });
    }
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
