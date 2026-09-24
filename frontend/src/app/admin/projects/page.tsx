"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
  CheckCircle2,
  ChevronDown,
  Check,
  Images,
} from "lucide-react";

interface SkillItem {
  id: number;
  name: string;
  slug: string;
}

interface MediaAsset {
  id: number;
  original_name: string;
  url: string;
  file_type: string;
}

interface ProjectMediaItem {
  id: number;
  media_id: number;
}

interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  project_type: string;
  role: string;
  problem?: string;
  solution?: string;
  features?: string;
  challenges?: string;
  learnings?: string;
  status: string;
  github_url?: string;
  live_demo_url?: string;
  cover_media_id?: number | null;
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
  skills: SkillItem[];
  media_items?: ProjectMediaItem[];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillItem[]>([]);
  const [availableImages, setAvailableImages] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Searchable Multi-Select State
  const [skillSearch, setSkillSearch] = useState("");
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    project_type: "Full-Stack Application",
    role: "Full-Stack Developer",
    status: "Completed",
    problem: "",
    solution: "",
    features: "",
    challenges: "",
    learnings: "",
    github_url: "",
    live_demo_url: "",
    cover_media_id: null as number | null,
    is_featured: false,
    is_visible: true,
    display_order: 1,
    skill_ids: [] as number[],
    gallery_media_ids: [] as number[],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const [projRes, skillsRes, mediaRes] = await Promise.all([
        fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/projects", { headers, credentials: "include" }),
        fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/skills", { headers, credentials: "include" }),
        fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/media", { headers, credentials: "include" }),
      ]);

      const projData = await projRes.json();
      const skillsData = await skillsRes.json();
      const mediaData = await mediaRes.json();

      if (projData.success) setProjects(projData.data || []);
      if (skillsData.success) setAvailableSkills(skillsData.data || []);
      if (mediaData.success) setAvailableImages(mediaData.data || []);
    } catch (err) {
      console.error("Failed to load projects data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSkillDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      project_type: "Full-Stack Application",
      role: "Full-Stack Developer",
      status: "Completed",
      problem: "",
      solution: "",
      features: "",
      challenges: "",
      learnings: "",
      github_url: "",
      live_demo_url: "",
      cover_media_id: null,
      is_featured: false,
      is_visible: true,
      display_order: projects.length + 1,
      skill_ids: [],
      gallery_media_ids: [],
    });
    setFeedbackMsg("");
    setSkillSearch("");
    setIsSkillDropdownOpen(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectItem) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      short_description: project.short_description,
      description: project.description,
      project_type: project.project_type,
      role: project.role,
      status: project.status,
      problem: project.problem || "",
      solution: project.solution || "",
      features: project.features || "",
      challenges: project.challenges || "",
      learnings: project.learnings || "",
      github_url: project.github_url || "",
      live_demo_url: project.live_demo_url || "",
      cover_media_id: project.cover_media_id || null,
      is_featured: project.is_featured,
      is_visible: project.is_visible,
      display_order: project.display_order,
      skill_ids: project.skills.map((s) => s.id),
      gallery_media_ids: project.media_items ? project.media_items.map((m) => m.media_id) : [],
    });
    setFeedbackMsg("");
    setSkillSearch("");
    setIsSkillDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const toggleSkill = (skillId: number) => {
    setFormData((prev) => {
      const exists = prev.skill_ids.includes(skillId);
      return {
        ...prev,
        skill_ids: exists ? prev.skill_ids.filter((id) => id !== skillId) : [...prev.skill_ids, skillId],
      };
    });
  };

  const removeSkill = (skillId: number) => {
    setFormData((prev) => ({
      ...prev,
      skill_ids: prev.skill_ids.filter((id) => id !== skillId),
    }));
  };

  const toggleGalleryImage = (mediaId: number) => {
    setFormData((prev) => {
      const exists = prev.gallery_media_ids.includes(mediaId);
      if (exists) {
        return { ...prev, gallery_media_ids: prev.gallery_media_ids.filter((id) => id !== mediaId) };
      }
      if (prev.gallery_media_ids.length >= 6) {
        alert("Maximum of 6 gallery screenshots allowed per project.");
        return prev;
      }
      return { ...prev, gallery_media_ids: [...prev.gallery_media_ids, mediaId] };
    });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedbackMsg("");

    const token = getAuthToken();
    const url = editingProject
      ? `https://portfolio-backend-kofh.onrender.com/api/v1/admin/projects/${editingProject.id}`
      : "https://portfolio-backend-kofh.onrender.com/api/v1/admin/projects";
    const method = editingProject ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg("Project saved successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          loadData();
        }, 600);
      } else {
        alert(data.error?.message || "Failed to save project.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/projects/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkillsForDropdown = availableSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const selectedSkillsList = availableSkills.filter((s) => formData.skill_ids.includes(s.id));
  const imageAssets = availableImages.filter((m) => m.file_type === "image");

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-blue-500" />
            <span>Projects Management CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Create, edit, and orchestrate software engineering case studies in your portfolio.
          </p>
        </div>
        <Button onClick={openCreateModal} size="sm" className="gap-2 text-xs self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add New Project
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-xs text-zinc-400">
          Total Projects: <strong className="text-white">{projects.length}</strong>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading projects from database...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <FolderGit2 className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No Projects Found</h3>
          <p className="text-xs text-zinc-500">
            {searchTerm ? "No projects match your search query." : "Start by adding your first project."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Type & Role</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {proj.is_featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        <span>{proj.title}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono block pt-0.5">
                        /{proj.slug}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>{proj.project_type}</div>
                      <span className="text-[10px] text-zinc-400">{proj.role}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.skills.map((s) => (
                          <span
                            key={s.id}
                            className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[10px] font-mono"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px]">
                          {proj.status}
                        </Badge>
                        {proj.is_visible ? (
                          <span title="Published"><Eye className="w-3.5 h-3.5 text-emerald-400" /></span>
                        ) : (
                          <span title="Hidden"><EyeOff className="w-3.5 h-3.5 text-zinc-500" /></span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <Link href={`/projects/${proj.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="p-1.5 h-7 w-7 text-zinc-400 hover:text-white" title="View Case Study">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 h-7 w-7 text-blue-400 hover:text-blue-300"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-1.5 h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingProject ? `Edit: ${editingProject.title}` : "Add New Project"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="E-Commerce API Gateway"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Slug (URL identifier) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ecommerce-api-gateway"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Project Type</label>
                  <input
                    type="text"
                    required
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    placeholder="Full-Stack Application"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Your Role</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Software Architect"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Short Summary (Visible on Cards) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="High-performance order lifecycle management engine."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Case Study Fields */}
              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <h3 className="font-bold text-zinc-200 text-xs uppercase font-mono">Case Study Engineering Breakdown</h3>

                <div className="space-y-1">
                  <label className="font-semibold text-rose-400">Problem Statement</label>
                  <textarea
                    rows={2}
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="What real-world pain point or bottleneck existed?"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-blue-400">Engineered Solution</label>
                  <textarea
                    rows={2}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="How did your software architecture solve it?"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-amber-400">Technical Challenges</label>
                    <textarea
                      rows={2}
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      placeholder="Concurrency, database locks, memory bottlenecks..."
                      className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-indigo-400">Learnings & Takeaways</label>
                    <textarea
                      rows={2}
                      value={formData.learnings}
                      onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                      placeholder="What principles were mastered?"
                      className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Technologies Applied: Searchable Multi-Select Combobox */}
              <div className="space-y-2 border-t border-zinc-800 pt-4" ref={dropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300">
                    Select Technologies Applied:
                  </label>
                  <Link
                    href="/admin/skills"
                    target="_blank"
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Manage Skills Arsenal</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[34px] p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  {selectedSkillsList.length === 0 ? (
                    <span className="text-zinc-500 text-[11px] italic self-center">
                      No technologies selected yet. Click the search box below to add.
                    </span>
                  ) : (
                    selectedSkillsList.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[11px] font-mono font-medium"
                      >
                        <span>{s.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(s.id)}
                          className="hover:text-white text-blue-400 focus:outline-none"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="relative">
                  <div
                    className="flex items-center justify-between w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white cursor-pointer focus-within:border-blue-500 transition-colors"
                    onClick={() => setIsSkillDropdownOpen(true)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Search className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => {
                          setSkillSearch(e.target.value);
                          setIsSkillDropdownOpen(true);
                        }}
                        onFocus={() => setIsSkillDropdownOpen(true)}
                        placeholder="Type to search skills from database (e.g. Next, Fast, Post)..."
                        className="w-full bg-transparent outline-none text-xs text-white placeholder:text-zinc-600"
                      />
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  </div>

                  {isSkillDropdownOpen && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1.5 max-h-48 overflow-y-auto rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl divide-y divide-zinc-800/50">
                      {filteredSkillsForDropdown.length === 0 ? (
                        <div className="p-3 text-center text-zinc-500 text-[11px]">
                          No matching skills found.
                        </div>
                      ) : (
                        filteredSkillsForDropdown.map((skill) => {
                          const isSelected = formData.skill_ids.includes(skill.id);
                          return (
                            <div
                              key={skill.id}
                              onClick={() => toggleSkill(skill.id)}
                              className={`flex items-center justify-between p-2.5 px-3.5 cursor-pointer text-xs transition-colors ${
                                isSelected
                                  ? "bg-blue-600/15 text-blue-400 font-semibold"
                                  : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                              }`}
                            >
                              <span className="font-mono">{skill.name}</span>
                              {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Media Selection (Video Demo or Single Image) */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300">
                    Project Cover Media (Image or Video Demo &lt; 1 min):
                  </label>
                  <Link href="/admin/media" target="_blank" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">
                    <span>Open Media Library</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-36 overflow-y-auto p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, cover_media_id: null }))}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-colors flex items-center justify-center text-[11px] ${
                      !formData.cover_media_id ? "border-blue-500 bg-blue-500/10 text-blue-400 font-bold" : "border-zinc-800 text-zinc-500 hover:text-white"
                    }`}
                  >
                    None / Default
                  </div>
                  {availableImages.map((media) => {
                    const isSelected = formData.cover_media_id === media.id;
                    const isVideo = media.url.endsWith(".mp4") || media.url.endsWith(".webm");
                    return (
                      <div
                        key={media.id}
                        onClick={() => setFormData((prev) => ({ ...prev, cover_media_id: media.id }))}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected ? "border-blue-500 shadow-md shadow-blue-500/30" : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {isVideo ? (
                          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[10px] font-mono text-zinc-400">
                            ▶ Video Demo
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={media.url} alt={media.original_name} className="w-full h-full object-cover" />
                        )}
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NEW: Screenshots Gallery Selection (Max 6 Images) */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-emerald-400" />
                    <span>Project Screenshots Gallery (Max 6 Images):</span>
                  </label>
                  <span className={`text-[11px] font-mono font-bold ${formData.gallery_media_ids.length === 6 ? "text-amber-400" : "text-emerald-400"}`}>
                    {formData.gallery_media_ids.length} / 6 selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-40 overflow-y-auto p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  {imageAssets.length === 0 ? (
                    <span className="text-zinc-500 text-[11px] col-span-4 p-2 italic">
                      No images found in Media Library. Upload screenshots from the Media Library first.
                    </span>
                  ) : (
                    imageAssets.map((img) => {
                      const isSelected = formData.gallery_media_ids.includes(img.id);
                      const selectedIndex = formData.gallery_media_ids.indexOf(img.id) + 1;
                      return (
                        <div
                          key={img.id}
                          onClick={() => toggleGalleryImage(img.id)}
                          className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
                            isSelected ? "border-emerald-500 shadow-md shadow-emerald-500/20" : "border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.original_name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                              {selectedIndex}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Links and Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/AzamITPro/..."
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.live_demo_url}
                    onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-blue-600"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-blue-600"
                  />
                  <span>Publish / Visible</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingProject ? "Update Project" : "Save Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}