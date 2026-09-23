import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { AnalyticsTracker } from "@/components/public/analytics-tracker";
import { LanguageProvider } from "@/context/language-context";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Azzam AL-JARMOUZI | IT Student & Software Developer",
    template: "%s | Azzam AL-JARMOUZI",
  },
  description:
    "Full-stack portfolio platform engineered with FastAPI, PostgreSQL, and Next.js. Featuring clean architecture, secure auth, and production-grade design.",
  keywords: [
    "Azzam AL-JARMOUZI",
    "Azzam Abdo Abdullah Al-Jarmouzi",
    "Full-Stack Developer",
    "FastAPI",
    "Next.js Developer",
    "PostgreSQL",
    "Software Engineer Portfolio",
    "Clean Architecture",
    "Yemen Developer",
  ],
  authors: [{ name: "Azzam AL-JARMOUZI", url: "https://github.com/AzamITPro" }],
  creator: "Azzam AL-JARMOUZI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Azzam AL-JARMOUZI | IT Student & Software Developer",
    description:
      "Full-stack software engineering portfolio built with clean architecture, FastAPI, PostgreSQL, and Next.js.",
    siteName: "Azzam AL-JARMOUZI Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azzam AL-JARMOUZI | Software Developer",
    description:
      "Full-stack software engineering portfolio built with FastAPI, PostgreSQL, and Next.js.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getSiteVerificationCode(): Promise<string | null> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/v1/public/settings", { cache: "no-store" });
    const data = await res.json();
    return data.success && data.data?.google_site_verification ? data.data.google_site_verification : null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleVerification = await getSiteVerificationCode();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Azzam AL-JARMOUZI",
    alternateName: "Azzam Abdo Abdullah Al-Jarmouzi",
    jobTitle: "IT Student & Software Developer",
    url: SITE_URL,
    sameAs: ["https://github.com/AzamITPro"],
    knowsAbout: [
      "Software Architecture",
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "Python",
      "TypeScript",
      "RESTful APIs",
      "Clean Code",
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {googleVerification && (
          <meta name="google-site-verification" content={googleVerification} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-500 selection:text-white flex flex-col">
        <LanguageProvider>
          <AnalyticsTracker />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}