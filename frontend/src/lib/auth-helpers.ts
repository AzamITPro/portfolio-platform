const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-kofh.onrender.com/api/v1";

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )admin_token=([^;]+)"));
  if (match) return match[2];
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token");
  }
  return null;
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Invalid login credentials.");
  }

  if (data.data?.access_token) {
    document.cookie = `admin_token=${data.data.access_token}; path=/; max-age=86400; SameSite=Lax`;
    localStorage.setItem("admin_token", data.data.access_token);
  }

  return data.data;
}

export async function getCurrentAdmin() {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function logoutAdmin() {
  try {
    document.cookie = "admin_token=; path=/; max-age=0;";
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/admin/login";
  }
}