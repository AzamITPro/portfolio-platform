import { MetadataRoute } from "next";
import { apiClient } from "@/lib/api-client";
import { ProjectSummary } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await apiClient<ProjectSummary[]>("/public/projects");
    if (res.success && res.data) {
      projectRoutes = res.data.map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // If backend is unreachable during build, fallback to empty project routes
    projectRoutes = [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...staticRoutes, ...projectRoutes];
}