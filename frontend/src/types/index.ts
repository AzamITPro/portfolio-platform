export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  username: string;
  icon?: string;
  display_order: number;
}

export interface Profile {
  full_name: string;
  professional_title: string;
  short_bio: string;
  about_me: string;
  location: string;
  email: string;
  phone?: string;
  availability: string;
  profile_image_url?: string;
  social_links: SocialLink[];
}

export interface Skill {
  id: number;
  name: string;
  slug: string;
  description?: string;
  proficiency_level: number;
  icon?: string;
  is_featured: boolean;
}

export interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  skills: Skill[];
}

export interface ProjectSummary {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  project_type: string;
  role: string;
  status: string;
  is_featured: boolean;
  cover_image_url?: string;
  github_url?: string;
  live_demo_url?: string;
  skills: string[];
}

export interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon?: string;
  is_featured: boolean;
}
export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
}

export interface ExperienceItem {
  id: number;
  company_name: string;
  position: string;
  employment_type: string;
  location?: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
}

export interface CertificateItem {
  id: number;
  title: string;
  issuer: string;
  description?: string;
  issue_date: string;
  credential_url?: string;
  is_featured: boolean;
}

export interface ProjectMediaItem {
  id: number;
  url: string;
  caption?: string;
  is_featured: boolean;
}

export interface ProjectDetail extends ProjectSummary {
  description: string;
  problem?: string;
  solution?: string;
  features?: string;
  challenges?: string;
  learnings?: string;
  start_date?: string;
  end_date?: string;
  media_items: ProjectMediaItem[];
  categories: string[];
}