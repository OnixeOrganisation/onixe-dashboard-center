const API_BASE_URL = process.env.NEXT_PUBLIC_API_CENTRE_URL || "http://localhost:3003";
const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "tenant_inphb";

export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, "")}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("X-Tenant-ID")) {
    headers.set("X-Tenant-ID", tenantId);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.message) {
        errorMessage = Array.isArray(errorJson.message) ? errorJson.message.join(", ") : errorJson.message;
      }
    } catch {
      // Keep default error message if json parsing fails
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}
