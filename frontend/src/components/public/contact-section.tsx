"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { Mail, Phone, Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from "lucide-react";

interface ContactSectionProps {
  email: string;
  phone?: string;
}

export function ContactSection({ email, phone }: ContactSectionProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-kofh.onrender.com/api/v1";

    try {
      const res = await fetch(`${apiUrl}/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setResponseMsg(data.message || t.contact.successMsg);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setResponseMsg(data.error?.message || "Failed to deliver message.");
      }
    } catch {
      setStatus("error");
      setResponseMsg("Network error. Please make sure the backend server is running.");
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge={t.headings.contactBadge}
          title={t.headings.contactTitle}
          description={t.contact.directDesc}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl">
          {/* Channels Card */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6 text-start">
            <h3 className="text-xl font-bold text-white">{t.contact.directComm}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {t.contact.directDesc}
            </p>

            <div className="space-y-4 pt-2">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-zinc-300 hover:text-blue-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="truncate">{email}</span>
              </a>

              {phone && (
                <>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-sm text-zinc-300 hover:text-emerald-400 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-mono">{phone}</span>
                  </a>

                  {cleanPhone && (
                    <a
                      href={`https://wa.me/${cleanPhone}?text=Hello%20Azzam,%20I%20saw%20your%20portfolio...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-emerald-400 hover:underline font-medium pt-1"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span>{t.contact.chatWhatsapp}</span>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 text-start">
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>{responseMsg}</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{responseMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">{t.contact.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">{t.contact.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">{t.contact.subjectLabel}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">{t.contact.messageLabel}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="w-full sm:w-auto gap-2 font-semibold"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.contact.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t.contact.sendButton}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}