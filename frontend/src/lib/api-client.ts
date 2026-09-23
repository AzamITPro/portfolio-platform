import { APIResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<APIResponse<T>> {
  const { params, headers, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: "include", // Enables HttpOnly cookies for session management
  });

  const data: APIResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "An unexpected error occurred while communicating with the API.");
  }

  return data;
}