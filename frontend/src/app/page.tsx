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
import { Wrench } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HomeData {
  profile: Profile | null;
  services: ServiceItem[];
  skills: SkillCategory[];
  projects: ProjectSummary[];
  education: EducationItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
  settings: Record<string, string>;
}

async function getHomeData(): Promise<HomeData> {
  try {
    const [profileRes, servicesRes, skillsRes, projectsRes, eduRes, expRes, certRes, settingsRes] =
      await Promise.all([
        apiClient<Profile>("/public/profile", { cache: "no-store" }),
        apiClient<ServiceItem[]>("/public/services", { cache: "no-store" }),
        apiClient<SkillCategory[]>("/public/skills", { cache: "no-store" }),
        apiClient<ProjectSummary[]>("/public/projects", { cache: "no-store" }),
        apiClient<EducationItem[]>("/public/education", { cache: "no-store" }),
        apiClient<ExperienceItem[]>("/public/experience", { cache: "no-store" }),
        apiClient<CertificateItem[]>("/public/certificates", { cache: "no-store" }),
        apiClient<Record<string, string>>("/public/settings", { cache: "no-store" }).catch(() => ({ data: {} })),
      ]);

    return {
      profile: profileRes.data,
      services: servicesRes.data || [],
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      education: eduRes.data || [],
      experience: expRes.data || [],
      certificates: certRes.data || [],
      settings: settingsRes.data || {},
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
      settings: {},
    };
  }
}

export default async function HomePage() {
  const { profile, services, skills, projects, education, experience, certificates, settings } =
    await getHomeData();

  // 1. Scheduled Maintenance Screen Handler
  if (settings["maintenance_mode"] === "true") {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Wrench className="w-7 h-7 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Platform Under Scheduled Maintenance</h1>
        <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
          We are currently upgrading backend architectures and database services. The platform will be back online shortly.
        </p>
        <span className="text-[11px] font-mono text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          Admin Portal remains accessible at /admin/dashboard
        </span>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center font-bold">!</div>
          <h1 className="text-xl font-semibold">Backend Connection Pending</h1>
          <p className="text-sm text-zinc-400">Make sure FastAPI is running on http://127.0.0.1:8000.</p>
        </div>
      </main>
    );
  }

  // 2. Dynamic Universal Feature Flags
  const showAbout = settings["show_about_section"] !== "false";
  const showSkills = settings["show_skills_section"] !== "false";
  const showProjects = settings["show_projects_section"] !== "false";
  const showServices = settings["show_services_section"] !== "false";
  const showJourney = settings["show_journey_section"] !== "false";
  const showContact = settings["show_contact_section"] !== "false";

  return (
    <main className="bg-zinc-950">
      <Hero profile={profile} />
      {showAbout && <About profile={profile} />}
      {showSkills && <SkillsSection categories={skills} />}
      {showProjects && <ProjectsSection projects={projects} />}
      {showServices && <Services services={services} />}
      {showJourney && (
        <JourneySection
          education={education}
          experience={experience}
          certificates={certificates}
        />
      )}
      {showContact && <ContactSection email={profile.email} phone={profile.phone} />}
    </main>
  );
}