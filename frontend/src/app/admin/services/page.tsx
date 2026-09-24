"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Code,
  Server,
  Database,
  Terminal,
  Globe,
  Layers,
  Cpu,
  Loader2,
  X,
  Save,
  CheckCircle2,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon?: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
}

// Icon helper function
function RenderServiceIcon({ icon, className = "w-5 h-5" }: { icon?: string; className?: string }) {
  const i = icon?.toLowerCase() || "code";
  if (i.includes("server")) return <Server className={className} />;
  if (i.includes("database")) return <Database className={className} />;
  if (i.includes("terminal")) return <Terminal className={className} />;
  if (i.includes("globe")) return <Globe className={className} />;
  if (i.includes("layer")) return <Layers className={className} />;
  if (i.includes("cpu")) return <Cpu className={className} />;
  return <Code className={className} />;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    icon: "code",
    display_order: 1,
    is_featured: true,
    is_visible: true,
  });

  const loadServices = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const res = await fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/services", {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setServices(data.data);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      icon: "code",
      display_order: services.length + 1,
      is_featured: true,
      is_visible: true,
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      short_description: service.short_description,
      description: service.description,
      icon: service.icon || "code",
      display_order: service.display_order,
      is_featured: service.is_featured,
      is_visible: service.is_visible,
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    const token = getAuthToken();
    const url = editingService
      ? `https://portfolio-backend-kofh.onrender.com/api/v1/admin/services/${editingService.id}`
      : "https://portfolio-backend-kofh.onrender.com/api/v1/admin/services";
    const method = editingService ? "PUT" : "POST";

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
        setFeedback("Service saved successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          loadServices();
        }, 500);
      } else {
        alert(data.error?.message || "Failed to save service.");
      }
    } catch (err) {
      console.error("Service save error:", err);
      alert("Network error saving service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete service "${title}"?`)) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/services/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-blue-500" />
            <span>Capabilities & Services CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Manage the software development solutions displayed in the &quot;What I Can Build &amp; Deliver&quot; section.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/#services"
            target="_blank"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Preview on Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Button onClick={openCreateModal} size="sm" className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Add New Service
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading services from PostgreSQL...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <Wrench className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No Services Found</h3>
          <p className="text-xs text-zinc-500">
            Click &quot;Add New Service&quot; above to create your first client offering.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <RenderServiceIcon icon={service.icon} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Order: {service.display_order}
                    </Badge>
                 {service.is_featured && (
                      <span title="Featured"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /></span>
                    )}
                    {service.is_visible ? (
                      <span title="Visible"><Eye className="w-3.5 h-3.5 text-emerald-400" /></span>
                    ) : (
                      <span title="Hidden"><EyeOff className="w-3.5 h-3.5 text-zinc-500" /></span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{service.title}</h3>
                  <span className="text-[10px] font-mono text-zinc-500">/{service.slug}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                    {service.short_description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/70 text-[11px] text-zinc-400 leading-relaxed">
                  {service.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/80">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(service)}
                  className="gap-1.5 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(service.id, service.title)}
                  className="gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingService ? `Edit: ${editingService.title}` : "Add New Capability / Service"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="DevOps & Cloud Orchestration"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="devops-cloud"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Icon Type</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  >
                    <option value="code">Code (Programming)</option>
                    <option value="server">Server (API & Backend)</option>
                    <option value="database">Database (Storage & SQL)</option>
                    <option value="terminal">Terminal (Automation)</option>
                    <option value="globe">Globe (Web & Networking)</option>
                    <option value="layer">Layers (Architecture)</option>
                    <option value="cpu">CPU (Systems)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Short Summary (Card Caption) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Building scalable microservices and high-throughput systems..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full scope of what is delivered, methodologies applied, and guarantees..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600"
                  />
                  <span>Featured Solution</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600"
                  />
                  <span>Visible on Portfolio</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingService ? "Update Service" : "Save Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}