"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Star,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
  CheckCircle2,
  Check,
  Image as ImageIcon,
} from "lucide-react";

interface CertificateItem {
  id: number;
  title: string;
  issuer: string;
  description?: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  certificate_media_id?: number | null;
  certificate_media_url?: string;
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
}

interface MediaAsset {
  id: number;
  original_name: string;
  url: string;
  file_type: string;
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [availableImages, setAvailableImages] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    description: "",
    issue_date: "2025-01-01",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
    certificate_media_id: null as number | null,
    is_featured: true,
    is_visible: true,
    display_order: 1,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const [certRes, mediaRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/v1/admin/certificates", { headers, credentials: "include" }),
        fetch("http://127.0.0.1:8000/api/v1/admin/media?file_type=image", { headers, credentials: "include" }),
      ]);

      const certData = await certRes.json();
      const mediaData = await mediaRes.json();

      if (certData.success && certData.data) setCertificates(certData.data);
      if (mediaData.success && mediaData.data) setAvailableImages(mediaData.data);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      title: "",
      issuer: "",
      description: "",
      issue_date: new Date().toISOString().split("T")[0],
      expiry_date: "",
      credential_id: "",
      credential_url: "",
      certificate_media_id: null,
      is_featured: true,
      is_visible: true,
      display_order: certificates.length + 1,
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      description: cert.description || "",
      issue_date: cert.issue_date,
      expiry_date: cert.expiry_date || "",
      credential_id: cert.credential_id || "",
      credential_url: cert.credential_url || "",
      certificate_media_id: cert.certificate_media_id || null,
      is_featured: cert.is_featured,
      is_visible: cert.is_visible,
      display_order: cert.display_order,
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    const token = getAuthToken();
    const url = editingCert
      ? `http://127.0.0.1:8000/api/v1/admin/certificates/${editingCert.id}`
      : "http://127.0.0.1:8000/api/v1/admin/certificates";
    const method = editingCert ? "PUT" : "POST";

    const payload = {
      ...formData,
      expiry_date: formData.expiry_date || null,
      credential_id: formData.credential_id || null,
      credential_url: formData.credential_url || null,
    };

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
        setFeedback("Certificate saved successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          loadData();
        }, 500);
      } else {
        alert(data.error?.message || "Failed to save certificate.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error saving certificate.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete certificate "${title}"?`)) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/certificates/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setCertificates((prev) => prev.filter((c) => c.id !== id));
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
            <Award className="w-6 h-6 text-blue-500" />
            <span>Certificates & Credentials CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Manage your verified technical certifications, badge credentials, and verified scanned documents.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/#journey"
            target="_blank"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Preview on Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Button onClick={openCreateModal} size="sm" className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Add New Certificate
          </Button>
        </div>
      </div>

      <div className="text-xs text-zinc-400">
        Total Certificates: <strong className="text-white">{certificates.length}</strong>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading certificates from PostgreSQL...</span>
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <Award className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No Certificates Found</h3>
          <p className="text-xs text-zinc-500">
            Click &quot;Add New Certificate&quot; to publish your first credential.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{cert.title}</h3>
                      <span className="text-xs text-blue-400 font-medium">{cert.issuer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Order: {cert.display_order}
                    </Badge>
                   {cert.is_featured && (
                      <span title="Featured"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /></span>
                    )}
                    {cert.is_visible ? (
                      <span title="Visible"><Eye className="w-3.5 h-3.5 text-emerald-400" /></span>
                    ) : (
                      <span title="Hidden"><EyeOff className="w-3.5 h-3.5 text-zinc-500" /></span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1 bg-zinc-950 px-2.5 py-0.5 rounded-md border border-zinc-800">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    Issued: {cert.issue_date}
                  </span>
                  {cert.credential_id && (
                    <span className="text-zinc-400">ID: {cert.credential_id}</span>
                  )}
                  {cert.certificate_media_id && (
                    <Badge variant="success" className="text-[10px]">
                      Badge Image Linked
                    </Badge>
                  )}
                </div>

                {cert.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {cert.description}
                  </p>
                )}

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium pt-1"
                  >
                    <span>Verify Credential Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/80">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(cert)}
                  className="gap-1.5 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(cert.id, cert.title)}
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

      {/* Add / Edit Certificate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingCert ? `Edit: ${editingCert.title}` : "Add New Certificate / Credential"}
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
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="AWS Solutions Architect / Meta Professional"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Amazon Web Services / Google / Meta"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    placeholder="CERT-123456"
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono"
                  />
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
                <label className="font-semibold text-zinc-300">Official Verification URL</label>
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://credly.com/badges/... or https://coursera.org/verify/..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Certificate Image/Badge Selector */}
              <div className="space-y-2 border-t border-zinc-800 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Certificate Badge / Document Scan Image:</span>
                  </label>
                  <Link href="/admin/media" target="_blank" className="text-[11px] text-blue-400 hover:underline">
                    Upload to Media Library
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, certificate_media_id: null }))}
                    className={`p-2 rounded-lg border text-center cursor-pointer text-[11px] flex items-center justify-center transition-colors ${
                      !formData.certificate_media_id
                        ? "border-blue-500 bg-blue-500/10 text-blue-400 font-bold"
                        : "border-zinc-800 text-zinc-500 hover:text-white"
                    }`}
                  >
                    No Image / Default Badge
                  </div>
                  {availableImages.map((media) => {
                    const isSelected = formData.certificate_media_id === media.id;
                    return (
                      <div
                        key={media.id}
                        onClick={() => setFormData((prev) => ({ ...prev, certificate_media_id: media.id }))}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected ? "border-amber-500 shadow-md shadow-amber-500/20" : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={media.url} alt={media.original_name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-amber-500 rounded-full p-0.5">
                            <Check className="w-3 h-3 text-black stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Skills validated, topics covered, and achievements..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 resize-none"
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
                  <span>Featured Credential</span>
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
                  {editingCert ? "Update Certificate" : "Save Certificate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}