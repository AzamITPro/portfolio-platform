const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-kofh.onrender.com/api/v1";

function getSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  let sessionId = sessionStorage.getItem("portfolio_session_id");
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    sessionStorage.setItem("portfolio_session_id", sessionId);
  }
  return sessionId;
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || path.startsWith("/admin")) return;

  const payload = {
    path,
    referrer: document.referrer || null,
    session_id: getSessionId(),
    device_type: window.innerWidth < 768 ? "mobile" : "desktop",
    browser: navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser",
  };

  fetch(`${API_BASE_URL}/public/analytics/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function trackEvent(eventName: string, targetType?: string, targetId?: string) {
  if (typeof window === "undefined") return;

  const payload = {
    event_name: eventName,
    page_path: window.location.pathname,
    target_type: targetType || null,
    target_id: targetId || null,
    session_id: getSessionId(),
  };

  fetch(`${API_BASE_URL}/public/analytics/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}