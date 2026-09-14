import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { AnalyticsTracker } from "@/components/public/analytics-tracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Azzam AL-JARMOUZI | IT Student & Software Developer",
  description:
    "Production-grade personal portfolio and professional profile platform engineered with FastAPI, PostgreSQL, and Next.js.",
  keywords: [
    "Azzam AL-JARMOUZI",
    "Full-Stack Developer",
    "FastAPI",
    "Next.js",
    "PostgreSQL",
    "Software Engineer",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-500 selection:text-white flex flex-col">
        <AnalyticsTracker />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}