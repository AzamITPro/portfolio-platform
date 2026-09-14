"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ContactSectionProps {
  email: string;
}

export function ContactSection({ email }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setResponseMsg(data.message || "Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setResponseMsg(data.error?.message || "Failed to deliver message. Please try again.");
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
          badge="Get in Touch"
          title="Let's Build Something Together"
          description="Have a question, a project collaboration idea, or an opportunity? Send me a direct message."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl">
          {/* Left Contact Card */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6">
            <h3 className="text-xl font-bold text-white">Direct Communication</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              I am available for software engineering opportunities, contract projects, and technical collaborations.
            </p>
            <div className="space-y-4 pt-2">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-zinc-300 hover:text-blue-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
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
                  <label className="text-xs font-semibold text-zinc-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Project Inquiry / Job Opportunity"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your project, question, or timeline..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="w-full sm:w-auto gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
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