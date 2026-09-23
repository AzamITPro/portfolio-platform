"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
  CheckCircle2,
  Layers,
  FolderPlus,
} from "lucide-react";

interface SkillItem {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  proficiency_level: number;
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [catFormData, setCatFormData] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: 1,
    is_visible: true,
  });

  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillFormData, setSkillFormData] = useState({
    category_id: 1,
    name: "",
    slug: "",
    description: "",
    proficiency_level: 80,
    is_featured: false,
    is_visible: true,
    display_order: 1,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const [catsRes, skillsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/v1/admin/skill-categories", { headers, credentials: "include" }),
        fetch("http://127.0.0.1:8000/api/v1/admin/skills", { headers, credentials: "include" }),
      ]);

      const catsData = await catsRes.json();
      const skillsData = await skillsRes.json();

      if (catsData.success) setCategories(catsData.data || []);
      if (skillsData.success) setSkills(skillsData.data || []);
    } catch (err) {
      console.error("Failed to load skills data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Category Actions
  const openCreateCatModal = () => {
    setEditingCat(null);
    setCatFormData({
      name: "",
      slug: "",
      description: "",
      display_order: categories.length + 1,
      is_visible: true,
    });
    setFeedback("");
    setIsCatModalOpen(true);
  };

  const openEditCatModal = (cat: CategoryItem) => {
    setEditingCat(cat);
    setCatFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      display_order: cat.display_order,
      is_visible: cat.is_visible,
    });
    setFeedback("");
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    const token = getAuthToken();
    const url = editingCat
      ? `http://127.0.0.1:8000/api/v1/admin/skill-categories/${editingCat.id}`
      : "http://127.0.0.1:8000/api/v1/admin/skill-categories";
    const method = editingCat ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(catFormData),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setFeedback("Category saved successfully!");
        setTimeout(() => {
          setIsCatModalOpen(false);
          loadData();
        }, 500);
      } else {
        alert(data.error?.message || "Failed to save category.");
      }
    } catch (err) {
      console.error("Save category error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? This will also remove associated skills!`)) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/skill-categories/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  // Skill Actions
  const openCreateSkillModal = (defaultCatId?: number) => {
    setEditingSkill(null);
    setSkillFormData({
      category_id: defaultCatId || (categories[0]?.id || 1),
      name: "",
      slug: "",
      description: "",
      proficiency_level: 80,
      is_featured: false,
      is_visible: true,
      display_order: 1,
    });
    setFeedback("");
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setSkillFormData({
      category_id: skill.category_id,
      name: skill.name,
      slug: skill.slug,
      description: skill.description || "",
      proficiency_level: skill.proficiency_level,
      is_featured: skill.is_featured,
      is_visible: skill.is_visible,
      display_order: skill.display_order,
    });
    setFeedback("");
    setIsSkillModalOpen(true);
  };

  const handleSkillNameChange = (val: string) => {
    setSkillFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    const token = getAuthToken();
    const url = editingSkill
      ? `http://127.0.0.1:8000/api/v1/admin/skills/${editingSkill.id}`
      : "http://127.0.0.1:8000/api/v1/admin/skills";
    const method = editingSkill ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(skillFormData),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setFeedback("Skill saved successfully!");
        setTimeout(() => {
          setIsSkillModalOpen(false);
          loadData();
        }, 500);
      } else {
        alert(data.error?.message || "Failed to save skill.");
      }
    } catch (err) {
      console.error("Save skill error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete skill "${name}"?`)) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/skills/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete skill error:", err);
    }
  };

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-blue-500" />
            <span>Skills Arsenal & Categories</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Organize technical competencies, stack groupings, and live proficiency benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button onClick={openCreateCatModal} variant="outline" size="sm" className="gap-2 text-xs">
            <FolderPlus className="w-4 h-4" />
            + New Category
          </Button>
          <Button onClick={() => openCreateSkillModal()} size="sm" className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            + New Skill
          </Button>
        </div>
      </div>

      {/* Main Categories & Skills Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading skills arsenal from database...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No Categories Defined</h3>
          <p className="text-xs text-zinc-500">
            Create your first category (e.g. Backend, Frontend, DevOps) to begin grouping skills.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category_id === cat.id);
            return (
              <div
                key={cat.id}
                className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white tracking-tight">{cat.name}</h2>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {catSkills.length} skills
                      </Badge>
                      {!cat.is_visible && (
                        <Badge variant="outline" className="text-[10px] text-zinc-500">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-zinc-400">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openCreateSkillModal(cat.id)}
                      className="text-xs gap-1.5 text-blue-400 hover:text-blue-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skill Here
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditCatModal(cat)}
                      className="text-xs p-1.5 h-7 w-7 text-zinc-400 hover:text-white"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="text-xs p-1.5 h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Skills Grid */}
                {catSkills.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic py-2">
                    No skills assigned to this category yet. Click &quot;Add Skill Here&quot; above.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-semibold text-white text-xs">
                              {skill.is_featured && (
                                <span title="Featured"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /></span>
                              )}
                              <span>{skill.name}</span>
                            </div>
                            <span className="text-xs font-mono text-blue-400 font-bold">
                              {skill.proficiency_level}%
                            </span>
                          </div>

                          {/* Progress track */}
                          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400"
                              style={{ width: `${skill.proficiency_level}%` }}
                            />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[10px]">
                          <span className="flex items-center gap-1 text-zinc-500">
                            {skill.is_visible ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-zinc-500" />
                                <span>Hidden</span>
                              </>
                            )}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditSkillModal(skill)}
                              className="p-1 rounded text-blue-400 hover:text-blue-300"
                              title="Edit Skill"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id, skill.name)}
                              className="p-1 rounded text-red-400 hover:text-red-300"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingCat ? `Edit Category: ${editingCat.name}` : "Create Skill Category"}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catFormData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCatFormData((prev) => ({
                      ...prev,
                      name: val,
                      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                    }));
                  }}
                  placeholder="Cloud & Systems"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Slug (URL ID) *</label>
                <input
                  type="text"
                  required
                  value={catFormData.slug}
                  onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                  placeholder="cloud-systems"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description</label>
                <input
                  type="text"
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  placeholder="Infrastructure, containerization, and networking"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={catFormData.is_visible}
                    onChange={(e) => setCatFormData({ ...catFormData, is_visible: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600"
                  />
                  <span>Visible on Portfolio</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsCatModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingSkill ? `Edit Skill: ${editingSkill.name}` : "Add New Skill"}
              </h3>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveSkill} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Target Category *</label>
                <select
                  value={skillFormData.category_id}
                  onChange={(e) => setSkillFormData({ ...skillFormData, category_id: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillFormData.name}
                  onChange={(e) => handleSkillNameChange(e.target.value)}
                  placeholder="Docker / Redis / GraphQL"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Slug *</label>
                <input
                  type="text"
                  required
                  value={skillFormData.slug}
                  onChange={(e) => setSkillFormData({ ...skillFormData, slug: e.target.value })}
                  placeholder="docker"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300">Proficiency Level</label>
                  <span className="font-mono text-blue-400 font-bold">{skillFormData.proficiency_level}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={skillFormData.proficiency_level}
                  onChange={(e) => setSkillFormData({ ...skillFormData, proficiency_level: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={skillFormData.is_featured}
                    onChange={(e) => setSkillFormData({ ...skillFormData, is_featured: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600"
                  />
                  <span>Feature on Hero/Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={skillFormData.is_visible}
                    onChange={(e) => setSkillFormData({ ...skillFormData, is_visible: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600"
                  />
                  <span>Visible</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsSkillModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Skill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}