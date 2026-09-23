"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  X,
  FileText,
  Upload,
  Camera,
  Check,
} from "lucide-react";

interface SocialLinkItem {
  id: number;
  platform: string;
  url: string;
  username: string;
  icon?: string;
  display_order: number;
  is_visible: boolean;
}

interface MediaAsset {
  id: number;
  original_name: string;
  url: string;
  file_type: string;
}

interface CVData {
  id: number;
  title: string;
  url: string;
  file_size: number;
  updated_at: string;
}

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState("");

  // Available Images from Media Library
  const [availableImages, setAvailableImages] = useState<MediaAsset[]>([]);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    full_name: "",
    professional_title: "",
    short_bio: "",
    about_me: "",
    location: "Yemen",
    email: "",
    phone: "",
    availability: "Available for Opportunities",
    profile_image_id: null as number | null,
  });

  // CV Upload State
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvFeedback, setCvFeedback] = useState("");

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [savingLink, setSavingLink] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: "LinkedIn",
    url: "",
    username: "",
    display_order: 1,
    is_visible: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const [profileRes, socialRes, cvRes, mediaRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/v1/admin/profile", { headers, credentials: "include" }),
        fetch("http://127.0.0.1:8000/api/v1/admin/social-links", { headers, credentials: "include" }),
        fetch("http://127.0.0.1:8000/api/v1/admin/documents/cv", { headers, credentials: "include" }),
        fetch("http://127.0.0.1:8000/api/v1/admin/media?file_type=image", { headers, credentials: "include" }),
      ]);

      const profileJson = await profileRes.json();
      const socialJson = await socialRes.json();
      const cvJson = await cvRes.json();
      const mediaJson = await mediaRes.json();

      if (profileJson.success && profileJson.data) {
        setProfileData({
          full_name: profileJson.data.full_name || "",
          professional_title: profileJson.data.professional_title || "",
          short_bio: profileJson.data.short_bio || "",
          about_me: profileJson.data.about_me || "",
          location: profileJson.data.location || "Yemen",
          email: profileJson.data.email || "",
          phone: profileJson.data.phone || "",
          availability: profileJson.data.availability || "Available for Opportunities",
          profile_image_id: profileJson.data.profile_image_id || null,
        });
      }

      if (socialJson.success && socialJson.data) setSocialLinks(socialJson.data);
      if (cvJson.success && cvJson.data) setCurrentCV(cvJson.data);
      if (mediaJson.success && mediaJson.data) setAvailableImages(mediaJson.data);
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileFeedback("");

    const token = getAuthToken();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(profileData),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setProfileFeedback("Profile updated successfully! Avatar and details applied.");
        setTimeout(() => setProfileFeedback(""), 3500);
      } else {
        alert(data.error?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Network error updating profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUploadCV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;

    setUploadingCV(true);
    setCvFeedback("");
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", cvFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/admin/documents/upload-cv", {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCurrentCV(data.data);
        setCvFile(null);
        setCvFeedback("Resume PDF uploaded successfully!");
        setTimeout(() => setCvFeedback(""), 3500);
      } else {
        alert(data.error?.message || "Failed to upload CV.");
      }
    } catch (err) {
      console.error("CV upload error:", err);
    } finally {
      setUploadingCV(false);
    }
  };

  const handleAddSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLink(true);
    const token = getAuthToken();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/admin/social-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newLink),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setIsSocialModalOpen(false);
        setNewLink({ platform: "LinkedIn", url: "", username: "", display_order: socialLinks.length + 1, is_visible: true });
        loadData();
      }
    } catch (err) {
      console.error("Social link creation error:", err);
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteSocialLink = async (id: number, platform: string) => {
    if (!confirm(`Delete ${platform} link?`)) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/social-links/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      if (res.ok) {
        setSocialLinks((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete link:", err);
    }
  };

  const currentAvatar = availableImages.find((img) => img.id === profileData.profile_image_id);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading developer profile from database...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-500" />
            <span>Profile & Avatar Management</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Manage your personal avatar photo, identity, bio, resume file, and social profiles.
          </p>
        </div>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium self-start sm:self-auto"
        >
          <span>View Live Changes</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {profileFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{profileFeedback}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6 text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Identity & Personal Avatar</span>
          </h2>
          <Button type="submit" size="sm" disabled={savingProfile} className="gap-2 text-xs">
            {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Profile Changes
          </Button>
        </div>

        {/* Profile Avatar Selection Box */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-zinc-900 flex items-center justify-center flex-shrink-0">
            {currentAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={currentAvatar.url} alt="Profile Avatar" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-zinc-600" />
            )}
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <h3 className="font-semibold text-white text-sm">Profile Avatar Photo</h3>
            <p className="text-zinc-400 text-[11px]">
              {currentAvatar ? `Active photo: ${currentAvatar.original_name}` : "No photo selected yet. Choose your uploaded portrait from the library."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
              className="gap-2 text-xs mt-1"
            >
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              {isAvatarPickerOpen ? "Close Image Picker" : "Choose from Media Library"}
            </Button>
          </div>
        </div>

        {/* Inline Avatar Picker Grid */}
        {isAvatarPickerOpen && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-blue-500/30 space-y-3">
            <span className="font-semibold text-blue-400 text-[11px] block">
              Click an image below to set as your public profile photo:
            </span>
            {availableImages.length === 0 ? (
              <p className="text-zinc-500 text-xs">No images in Media Library. Upload your photo from Media Library first.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {availableImages.map((img) => {
                  const isSelected = profileData.profile_image_id === img.id;
                  return (
                    <div
                      key={img.id}
                      onClick={() => {
                        setProfileData((prev) => ({ ...prev, profile_image_id: img.id }));
                        setIsAvatarPickerOpen(false);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
                        isSelected ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.original_name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white bg-blue-600 rounded-full p-0.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Full Name *</label>
            <input
              type="text"
              required
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Professional Title *</label>
            <input
              type="text"
              required
              value={profileData.professional_title}
              onChange={(e) => setProfileData({ ...profileData, professional_title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Short Introduction (Hero Bio) *</label>
          <textarea
            rows={2}
            required
            value={profileData.short_bio}
            onChange={(e) => setProfileData({ ...profileData, short_bio: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">About Me (Full Narrative) *</label>
          <textarea
            rows={4}
            required
            value={profileData.about_me}
            onChange={(e) => setProfileData({ ...profileData, about_me: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-800/80 pt-4">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <span>Public Email</span>
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone / WhatsApp Number</span>
            </label>
            <input
              type="text"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              placeholder="+967770000000"
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none font-mono"
            />
          </div>
        </div>

        <div className="space-y-1 border-t border-zinc-800/80 pt-4">
          <label className="font-semibold text-zinc-300">Availability Status Badge</label>
          <input
            type="text"
            value={profileData.availability}
            onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
            placeholder="Available for Opportunities"
            className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-blue-500 outline-none"
          />
        </div>
      </form>

      {/* Resume / CV PDF Upload Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6 text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Resume & Curriculum Vitae (PDF)</span>
            </h2>
            <p className="text-[11px] text-zinc-400 pt-0.5">
              Upload your official resume. Visitors downloading your CV on the homepage will receive this file.
            </p>
          </div>
          {currentCV && (
            <a href={currentCV.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ExternalLink className="w-3.5 h-3.5" />
                View Current CV
              </Button>
            </a>
          )}
        </div>

        {cvFeedback && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{cvFeedback}</span>
          </div>
        )}

        <form onSubmit={handleUploadCV} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-400 truncate">
              {cvFile ? cvFile.name : currentCV ? `Current active: ${currentCV.title}` : "Select a PDF file to upload..."}
            </span>
            <input
              type="file"
              accept=".pdf"
              required
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCvFile(e.target.files[0]);
                }
              }}
            />
          </label>
          <Button type="submit" size="md" disabled={uploadingCV || !cvFile} className="gap-2 text-xs">
            {uploadingCV ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Upload & Activate CV
          </Button>
        </form>
      </div>

      {/* Social Links Management Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6 text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>External Social & Developer Profiles</span>
            </h2>
            <p className="text-[11px] text-zinc-400 pt-0.5">
              Profiles linked here appear automatically in your site hero and navbar.
            </p>
          </div>
          <Button onClick={() => setIsSocialModalOpen(true)} size="sm" variant="outline" className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" />
            Add Social Link
          </Button>
        </div>

        {socialLinks.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-2">
            No social links configured yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white">{link.platform}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                      Order: {link.display_order}
                    </Badge>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 text-[11px] font-mono truncate max-w-[170px]"
                  >
                    <span>{link.username || link.url}</span>
                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSocialLink(link.id, link.platform)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Social Link Modal */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add Social Profile Link</h3>
              <button onClick={() => setIsSocialModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSocialLink} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  placeholder="GitHub / LinkedIn / WhatsApp / Telegram"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Profile URL *</label>
                <input
                  type="url"
                  required
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Username / Label</label>
                <input
                  type="text"
                  value={newLink.username}
                  onChange={(e) => setNewLink({ ...newLink, username: e.target.value })}
                  placeholder="@username or phone number"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Display Order</label>
                <input
                  type="number"
                  value={newLink.display_order}
                  onChange={(e) => setNewLink({ ...newLink, display_order: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsSocialModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={savingLink} className="gap-1.5">
                  {savingLink ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}