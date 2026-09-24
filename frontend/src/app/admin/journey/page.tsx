"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  Loader2,
  X,
  Save,
  CheckCircle2,
} from "lucide-react";

interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  display_order: number;
  is_visible: boolean;
}

interface ExperienceItem {
  id: number;
  company_name: string;
  position: string;
  employment_type: string;
  location?: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  display_order: number;
  is_visible: boolean;
}

export default function AdminJourneyPage() {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Education Modal
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "Bachelor Degree",
    field_of_study: "Information Technology",
    description: "",
    start_date: "2023-09-01",
    end_date: "",
    is_current: true,
    display_order: 1,
    is_visible: true,
  });

  // Experience Modal
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [expForm, setExpForm] = useState({
    company_name: "",
    position: "Software Developer",
    employment_type: "Full-time",
    location: "Yemen",
    description: "",
    start_date: "2024-01-01",
    end_date: "",
    is_current: true,
    display_order: 1,
    is_visible: true,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadJourneyData = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const [eduRes, expRes] = await Promise.all([
        fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/education", { headers, credentials: "include" }),
        fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/experience", { headers, credentials: "include" }),
      ]);

      const eduJson = await eduRes.json();
      const expJson = await expRes.json();

      if (eduJson.success) setEducationList(eduJson.data || []);
      if (expJson.success) setExperienceList(expJson.data || []);
    } catch (err) {
      console.error("Failed to load journey data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJourneyData();
  }, [loadJourneyData]);

  // Education Handlers
  const openCreateEdu = () => {
    setEditingEdu(null);
    setEduForm({
      institution: "",
      degree: "Bachelor Degree",
      field_of_study: "Information Technology",
      description: "",
      start_date: "2023-09-01",
      end_date: "",
      is_current: true,
      display_order: educationList.length + 1,
      is_visible: true,
    });
    setFeedback("");
    setIsEduModalOpen(true);
  };

  const openEditEdu = (edu: EducationItem) => {
    setEditingEdu(edu);
    setEduForm({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      description: edu.description || "",
      start_date: edu.start_date,
      end_date: edu.end_date || "",
      is_current: edu.is_current,
      display_order: edu.display_order,
      is_visible: edu.is_visible,
    });
    setFeedback("");
    setIsEduModalOpen(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = getAuthToken();
    const url = editingEdu
      ? `https://portfolio-backend-kofh.onrender.com/api/v1/admin/education/${editingEdu.id}`
      : "https://portfolio-backend-kofh.onrender.com/api/v1/admin/education";
    const method = editingEdu ? "PUT" : "POST";

    const payload = {
      ...eduForm,
      end_date: eduForm.is_current ? null : eduForm.end_date || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Education record saved successfully!");
        setTimeout(() => {
          setIsEduModalOpen(false);
          loadJourneyData();
        }, 500);
      } else {
        alert(data.error?.message || "Failed to save education.");
      }
    } catch (err) {
      console.error("Save education error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEdu = async (id: number, institution: string) => {
    if (!confirm(`Delete education record from "${institution}"?`)) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/education/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setEducationList((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Delete education error:", err);
    }
  };

  // Experience Handlers
  const openCreateExp = () => {
    setEditingExp(null);
    setExpForm({
      company_name: "",
      position: "Software Developer",
      employment_type: "Full-time",
      location: "Yemen / Remote",
      description: "",
      start_date: "2024-01-01",
      end_date: "",
      is_current: true,
      display_order: experienceList.length + 1,
      is_visible: true,
    });
    setFeedback("");
    setIsExpModalOpen(true);
  };

  const openEditExp = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setExpForm({
      company_name: exp.company_name,
      position: exp.position,
      employment_type: exp.employment_type,
      location: exp.location || "",
      description: exp.description,
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      is_current: exp.is_current,
      display_order: exp.display_order,
      is_visible: exp.is_visible,
    });
    setFeedback("");
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = getAuthToken();
    const url = editingExp
      ? `https://portfolio-backend-kofh.onrender.com/api/v1/admin/experience/${editingExp.id}`
      : "https://portfolio-backend-kofh.onrender.com/api/v1/admin/experience";
    const method = editingExp ? "PUT" : "POST";

    const payload = {
      ...expForm,
      end_date: expForm.is_current ? null : expForm.end_date || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Experience record saved successfully!");
        setTimeout(() => {
          setIsExpModalOpen(false);
          loadJourneyData();
        }, 500);
      } else {
        alert(data.error?.message || "Failed to save experience.");
      }
    } catch (err) {
      console.error("Save experience error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExp = async (id: number, company: string) => {
    if (!confirm(`Delete experience record at "${company}"?`)) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/experience/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setExperienceList((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Delete experience error:", err);
    }
  };

  return (
    <div className="max-w-6xl space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-blue-500" />
            <span>Journey & Career Timeline CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Manage your academic milestones and professional work history displayed in your timeline.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/#journey"
            target="_blank"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Preview Timeline</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Button onClick={openCreateEdu} size="sm" variant="outline" className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
          <Button onClick={openCreateExp} size="sm" className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading career milestones from PostgreSQL...</span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section 1: Academic Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span>Academic Education Milestones</span>
                <Badge variant="outline" className="text-[10px] font-mono ml-2">
                  {educationList.length}
                </Badge>
              </h2>
            </div>

            {educationList.length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                No academic education records found. Click &quot;Add Education&quot; to create one.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educationList.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                          <span className="text-xs text-blue-400 font-medium">{edu.field_of_study}</span>
                        </div>
                        {edu.is_current ? (
                          <Badge variant="success" className="text-[10px]">Current</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">Completed</Badge>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-zinc-300">{edu.institution}</p>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>{edu.start_date} {edu.is_current ? "— Present" : `— ${edu.end_date}`}</span>
                      </div>

                      {edu.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed pt-1">{edu.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditEdu(edu)}
                        className="gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEdu(edu.id, edu.institution)}
                        className="gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Work Experience */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>Professional Work Experience</span>
                <Badge variant="outline" className="text-[10px] font-mono ml-2">
                  {experienceList.length}
                </Badge>
              </h2>
            </div>

            {experienceList.length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                No professional work experience added yet. Click &quot;Add Experience&quot; to add your software roles or freelance history.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experienceList.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">{exp.position}</h3>
                          <span className="text-xs text-emerald-400 font-medium">{exp.company_name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{exp.employment_type}</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          {exp.start_date} {exp.is_current ? "— Present" : `— ${exp.end_date}`}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">{exp.description}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditExp(exp)}
                        className="gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExp(exp.id, exp.company_name)}
                        className="gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Education Modal */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingEdu ? "Edit Academic Milestone" : "Add Academic Milestone"}
              </h3>
              <button onClick={() => setIsEduModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdu} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Degree *</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="Bachelor Degree / Diploma"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Field of Study *</label>
                <input
                  type="text"
                  required
                  value={eduForm.field_of_study}
                  onChange={(e) => setEduForm({ ...eduForm, field_of_study: e.target.value })}
                  placeholder="Information Technology / Computer Science"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="University / College Name"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={eduForm.start_date}
                    onChange={(e) => setEduForm({ ...eduForm, start_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
                {!eduForm.is_current && (
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">End Date</label>
                    <input
                      type="date"
                      value={eduForm.end_date}
                      onChange={(e) => setEduForm({ ...eduForm, end_date: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={eduForm.is_current}
                    onChange={(e) => setEduForm({ ...eduForm, is_current: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600"
                  />
                  <span>Currently Studying Here</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description</label>
                <textarea
                  rows={2}
                  value={eduForm.description}
                  onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                  placeholder="Specialization, relevant coursework, major subjects..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEduModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Education
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingExp ? "Edit Career Experience" : "Add Work Experience"}
              </h3>
              <button onClick={() => setIsExpModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveExp} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Job Title / Position *</label>
                <input
                  type="text"
                  required
                  value={expForm.position}
                  onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                  placeholder="Full-Stack Developer / Freelancer"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Company / Client *</label>
                  <input
                    type="text"
                    required
                    value={expForm.company_name}
                    onChange={(e) => setExpForm({ ...expForm, company_name: e.target.value })}
                    placeholder="Company or Remote"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Employment Type</label>
                  <select
                    value={expForm.employment_type}
                    onChange={(e) => setExpForm({ ...expForm, employment_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Location</label>
                <input
                  type="text"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  placeholder="Yemen / Remote"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={expForm.start_date}
                    onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
                {!expForm.is_current && (
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">End Date</label>
                    <input
                      type="date"
                      value={expForm.end_date}
                      onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={expForm.is_current}
                    onChange={(e) => setExpForm({ ...expForm, is_current: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600"
                  />
                  <span>Currently Working Here</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description / Achievements *</label>
                <textarea
                  rows={3}
                  required
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  placeholder="Responsibilities, technical stack used, and delivered systems..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsExpModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Experience
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}