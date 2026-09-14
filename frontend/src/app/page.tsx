import { apiClient } from "@/lib/api-client";
import {
  Profile,
  ServiceItem,
  SkillCategory,
  ProjectSummary,
  EducationItem,
  ExperienceItem,
  CertificateItem,
} from "@/types";
import { Hero } from "@/components/public/hero";
import { About } from "@/components/public/about";
import { SkillsSection } from "@/components/public/skills";
import { ProjectsSection } from "@/components/public/projects-section";
import { Services } from "@/components/public/services";
import { JourneySection } from "@/components/public/timeline";
import { ContactSection } from "@/components/public/contact-section";

interface HomeData {
  profile: Profile | null;
  services: ServiceItem[];
  skills: SkillCategory[];
  projects: ProjectSummary[];
  education: EducationItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
}

async function getHomeData(): Promise<HomeData> {
  try {
    const [profileRes, servicesRes, skillsRes, projectsRes, eduRes, expRes, certRes] =
      await Promise.all([
        apiClient<Profile>("/public/profile", { cache: "no-store" }),
        apiClient<ServiceItem[]>("/public/services", { cache: "no-store" }),
        apiClient<SkillCategory[]>("/public/skills", { cache: "no-store" }),
        apiClient<ProjectSummary[]>("/public/projects", { cache: "no-store" }),
        apiClient<EducationItem[]>("/public/education", { cache: "no-store" }),
        apiClient<ExperienceItem[]>("/public/experience", { cache: "no-store" }),
        apiClient<CertificateItem[]>("/public/certificates", { cache: "no-store" }),
      ]);

    return {
      profile: profileRes.data,
      services: servicesRes.data || [],
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      education: eduRes.data || [],
      experience: expRes.data || [],
      certificates: certRes.data || [],
    };
  } catch (err) {
    console.error("Failed to load homepage data:", err);
    return {
      profile: null,
      services: [],
      skills: [],
      projects: [],
      education: [],
      experience: [],
      certificates: [],
    };
  }
}

export default async function HomePage() {
  const { profile, services, skills, projects, education, experience, certificates } =
    await getHomeData();

  if (!profile) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center font-bold">!</div>
          <h1 className="text-xl font-semibold">Backend Connection Pending</h1>
          <p className="text-sm text-zinc-400">
            Make sure FastAPI is running on <code className="text-blue-400">http://127.0.0.1:8000</code>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-950">
      <Hero profile={profile} />
      <About profile={profile} />
      <SkillsSection categories={skills} />
      <ProjectsSection projects={projects} />
      <Services services={services} />
      <JourneySection
        education={education}
        experience={experience}
        certificates={certificates}
      />
      <ContactSection email={profile.email} />
    </main>
  );
}