"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Loader2,
  X,
  CheckCircle2,
  Sliders,
  Key,
} from "lucide-react";

interface SettingItem {
  id: number;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settingsList, setSettingsList] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SettingItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const res = await fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/settings", {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSettingsList(data.data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const openCreateModal = () => {
    setEditingSetting(null);
    setFormData({
      key: "",
      value: "",
      description: "",
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: SettingItem) => {
    setEditingSetting(item);
    setFormData({
      key: item.key,
      value: item.value,
      description: item.description || "",
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    const token = getAuthToken();
    const isEdit = Boolean(editingSetting);
    const url = isEdit
      ? `https://portfolio-backend-kofh.onrender.com/api/v1/admin/settings/${editingSetting?.key}`
      : "https://portfolio-backend-kofh.onrender.com/api/v1/admin/settings";
    const method = isEdit ? "PUT" : "POST";

    const payload = isEdit
      ? { value: formData.value, description: formData.description }
      : formData;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setFeedback("Setting updated successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          loadSettings();
        }, 500);
      } else {
        alert(data.error?.message || "Failed to save setting.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error saving configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete setting key "${key}"?`)) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/settings/${key}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setSettingsList((prev) => prev.filter((s) => s.key !== key));
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
            <Settings className="w-6 h-6 text-blue-500" />
            <span>Site Settings &amp; Configuration</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Global key-value configuration engine for portfolio metadata, SEO parameters, and system behaviors.
          </p>
        </div>
        <Button onClick={openCreateModal} size="sm" className="gap-2 text-xs self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add New Setting
        </Button>
      </div>

      {/* System Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
          <span className="text-[11px] text-zinc-400 font-mono uppercase">Config Engine</span>
          <p className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PostgreSQL Key-Value Store</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
          <span className="text-[11px] text-zinc-400 font-mono uppercase">Total Active Keys</span>
          <p className="text-sm font-bold text-blue-400 font-mono">
            {settingsList.length} configured
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
          <span className="text-[11px] text-zinc-400 font-mono uppercase">Cache Invalidation</span>
          <p className="text-sm font-bold text-white font-mono">
            Real-Time Sync (0s)
          </p>
        </div>
      </div>

      {/* Settings Grid / Table */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading system parameters...</span>
        </div>
      ) : settingsList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <Sliders className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No Custom Settings Configured</h3>
          <p className="text-xs text-zinc-500">
            Click &quot;Add New Setting&quot; to define your first global site parameter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 flex items-center gap-1.5">
                    <Key className="w-3 h-3" />
                    {item.key}
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    ID: {item.id}
                  </Badge>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 break-all">
                  {item.value}
                </div>

                {item.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500">
                <span>Updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 h-7 w-7 text-blue-400 hover:text-blue-300"
                    title="Edit Setting"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.key)}
                    className="p-1.5 h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Delete Setting"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Setting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-500" />
                <span>{editingSetting ? `Edit Parameter: ${editingSetting.key}` : "Define New Parameter"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Configuration Key *</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingSetting)}
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g. site_title, maintenance_mode, support_email"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Value *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter configuration value..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explaining what this parameter controls..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Parameter
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}