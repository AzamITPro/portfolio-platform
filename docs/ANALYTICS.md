
<div dir="ltr">

```markdown
# Privacy-First Custom Analytics Architecture

## 1. Design Philosophy

- Zero third-party tracker scripts (No Google Analytics, no tracking cookies).
- Compliant with privacy regulations (GDPR friendly).
- 100% self-hosted inside PostgreSQL.

## 2. Telemetry Mechanisms

- **Page Views:** Logged asynchronously via client beacon (`POST /public/analytics/view`) recording route path, referrer, and device classification.
- **Session Identification:** Ephemeral `sessionStorage` tokens that terminate upon browser closure.
- **Event Tracking:** User interactions (CV downloads, GitHub outbound link clicks) dispatched via `POST /public/analytics/event`.
- **IP Anonymization:** Raw IP addresses are combined with a cryptographic salt and hashed via SHA-256. Raw IPs are never persisted.

## 3. Telemetry Visualizations

- Real-time KPI cards on Admin Dashboard.
- Pure CSS/SVG daily traffic timeline for the past 7 days.
- Top 5 visited pages ranking.
```
