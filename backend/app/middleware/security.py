from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware enforcing strict OWASP-compliant security headers on all HTTP responses.
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent Clickjacking by disallowing framing
        response.headers["X-Frame-Options"] = "DENY"

        # Cross-Site Scripting protection filter
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Restrict browser referrer information leakage
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Restrict access to sensitive browser device APIs
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

        # HSTS (Strict-Transport-Security) for HTTPS connections
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        return response