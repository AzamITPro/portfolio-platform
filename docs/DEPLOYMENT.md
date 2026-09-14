

<div dir="ltr">

````markdown
# Production Deployment Blueprint ($0/Month Strategy)

## 1. Hosting Architecture

| Tier              | Recommended Platform          | Free Tier Specifications                         | Card Required?            |
| :---------------- | :---------------------------- | :----------------------------------------------- | :------------------------ |
| **Frontend**      | **Vercel**                    | Unlimited static & SSR requests, Global CDN, SSL | No                        |
| **Backend API**   | **Render** or **Railway**     | 512MB RAM, HTTPS endpoints                       | Render: No / Railway: Yes |
| **PostgreSQL**    | **Neon.tech** or **Supabase** | 0.5 GB cloud storage, SSL connections            | No                        |
| **Media Storage** | **Cloudflare R2** / Local     | 10 GB free S3-compatible storage, Zero egress    | R2: Optional              |

## 2. Environment Variables Configuration

### Backend Production (`.env`):

```env
ENVIRONMENT="production"
DEBUG=False
POSTGRES_SERVER="ep-xyz.eu-central-1.aws.neon.tech"
POSTGRES_PORT=5432
POSTGRES_USER="neondb_owner"
POSTGRES_PASSWORD="secure_cloud_password"
POSTGRES_DB="neondb"
SECRET_KEY="generate-64-character-random-hex-string"
```
````

Frontend Production (.env.production):
code
Env
NEXT_PUBLIC_API_URL=https://portfolio-backend.onrender.com/api/v1
NEXT_PUBLIC_SITE_URL=https://azzam-portfolio.vercel.app
