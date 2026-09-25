"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Upload,
  Search,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  FileText,
  Loader2,
  X,
  FileUp,
  Cloud,
  Save,
} from "lucide-react";

interface MediaItem {
  id: number;
  file_name: string;
  original_name: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  storage_key: string;
  url: string;
  alt_text?: string;
  width?: number;
  height?: number;
  created_at: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Upload Local Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);

  // Cloud URL Modal State
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [cloudForm, setCloudForm] = useState({
    url: "",
    original_name: "",
    file_type: "image",
    alt_text: "",
  });
  const [registeringCloud, setRegisteringCloud] = useState(false);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const res = await fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/media", {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMediaList(data.data);
      }
    } catch (err) {
      console.error("Failed to load media assets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (altText.trim()) formData.append("alt_text", altText.trim());

    try {
      const res = await fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/media/upload", {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setIsUploadOpen(false);
        setSelectedFile(null);
        setAltText("");
        loadMedia();
      } else {
        alert(data.error?.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRegisterCloudAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudForm.url.trim() || !cloudForm.original_name.trim()) return;

    setRegisteringCloud(true);
    const token = getAuthToken();

    try {
      const res = await fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/media/register-cloud-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(cloudForm),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setIsCloudModalOpen(false);
        setCloudForm({ url: "", original_name: "", file_type: "image", alt_text: "" });
        loadMedia();
      } else {
        alert(data.error?.message || "Failed to register cloud asset.");
      }
    } catch (err) {
      console.error("Register cloud error:", err);
    } finally {
      setRegisteringCloud(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/media/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const copyUrlToClipboard = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesFilter = filterType === "all" ? true : m.file_type === filterType;
    const matchesSearch =
      m.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.alt_text && m.alt_text.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-blue-500" />
            <span>Digital Asset Library (Media CMS)</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Central repository for images, video demos, and PDF documents hosted on Supabase Storage.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button onClick={() => setIsCloudModalOpen(true)} size="sm" variant="outline" className="gap-2 text-xs">
            <Cloud className="w-4 h-4 text-emerald-400" />
            + Register Supabase Asset
          </Button>
          <Button onClick={() => setIsUploadOpen(true)} size="sm" className="gap-2 text-xs">
            <Upload className="w-4 h-4" />
            Direct Upload
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 w-fit">
          {[
            { id: "all", label: "All Assets" },
            { id: "image", label: "Images" },
            { id: "video", label: "Videos" },
            { id: "document", label: "Documents (PDF)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name or alt text..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Scanning digital media repository...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No Media Files Found</h3>
          <p className="text-xs text-zinc-500">
            Click &quot;+ Register Supabase Asset&quot; to link your permanent cloud files.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-blue-500/5"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-zinc-950 flex items-center justify-center border-b border-zinc-800/80 overflow-hidden">
                {item.file_type === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.url}
                    alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : item.file_type === "video" ? (
                  <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-1">
                    <span className="text-xl">▶</span>
                    <span className="text-[10px] font-mono">Video Demo</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-zinc-500">
                    <FileText className="w-10 h-10 text-amber-400/80" />
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                      PDF Document
                    </span>
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-[9px] bg-zinc-950/80 backdrop-blur-md font-mono">
                    {formatBytes(item.file_size)}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white truncate max-w-[150px]" title={item.original_name}>
                    {item.original_name}
                  </span>
                  <Badge variant="outline" className="text-[9px] uppercase font-mono px-1.5 py-0 text-zinc-400">
                    {item.file_type}
                  </Badge>
                </div>

                {item.url.includes("supabase.co") && (
                  <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ☁️ Supabase S3
                  </span>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => copyUrlToClipboard(item.id, item.url)}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-white"
                      title="Open full asset"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.original_name)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Register Supabase Cloud Asset */}
      {isCloudModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Register Supabase Storage Asset</span>
              </h3>
              <button onClick={() => setIsCloudModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCloudAsset} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Public Supabase Asset URL *</label>
                <input
                  type="url"
                  required
                  value={cloudForm.url}
                  onChange={(e) => setCloudForm({ ...cloudForm, url: e.target.value })}
                  placeholder="https://jqkfwrsbqvaadohvrbdb.supabase.co/storage/v1/object/public/media/..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Asset Label / File Name *</label>
                <input
                  type="text"
                  required
                  value={cloudForm.original_name}
                  onChange={(e) => setCloudForm({ ...cloudForm, original_name: e.target.value })}
                  placeholder="Official Portrait Photo / Project Demo Video"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Asset Category Type</label>
                <select
                  value={cloudForm.file_type}
                  onChange={(e) => setCloudForm({ ...cloudForm, file_type: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                >
                  <option value="image">Image (Profile, Cover, Screenshots)</option>
                  <option value="video">Video (Project Demo &lt; 1 min)</option>
                  <option value="document">Document (PDF Resume / Certificate)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  value={cloudForm.alt_text}
                  onChange={(e) => setCloudForm({ ...cloudForm, alt_text: e.target.value })}
                  placeholder="Azzam AL-JARMOUZI Software Developer"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsCloudModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={registeringCloud} className="gap-1.5">
                  {registeringCloud ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Register Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Direct Upload */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileUp className="w-4 h-4 text-blue-500" />
                <span>Direct Upload</span>
              </h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <label className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer bg-zinc-950/60 transition-colors">
                <Upload className="w-6 h-6 text-blue-400" />
                <span className="font-semibold text-white block">
                  {selectedFile ? selectedFile.name : "Select image or PDF to upload"}
                </span>
                <input
                  type="file"
                  required
                  accept="image/*,video/mp4,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
                  }}
                />
              </label>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Alt Text</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Caption..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={uploading || !selectedFile} className="gap-1.5">
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}