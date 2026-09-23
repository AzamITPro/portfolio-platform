"use client";

import { useState, useEffect } from "react";
import { EducationItem, ExperienceItem, CertificateItem } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import {
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  ShieldCheck,
  Maximize2,
} from "lucide-react";

interface TimelineProps {
  education: EducationItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
}

export function JourneySection({ education, experience, certificates }: TimelineProps) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"education" | "experience" | "certificates">("education");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="journey" className="py-20 border-t border-zinc-900 bg-zinc-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge={t.headings.journeyBadge}
          title={t.headings.journeyTitle}
        />

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mb-10 border-b border-zinc-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "education"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            {lang === "ar" ? "التعليم الأكاديمي" : "Education"} ({education.length})
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "experience"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {lang === "ar" ? "الخبرات العملية" : "Experience"} ({experience.length})
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "certificates"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            {lang === "ar" ? "الشهادات والاعتمادات" : "Certificates"} ({certificates.length})
          </button>
        </div>

        {/* Timeline Content */}
        <div className="max-w-3xl space-y-6 text-start">
          {/* Education */}
          {activeTab === "education" && (
            <div className="space-y-6">
              {education.map((item) => (
                <div
                  key={item.id}
                  className="relative pl-6 rtl:pl-0 rtl:pr-6 border-l-2 rtl:border-l-0 rtl:border-r-2 border-blue-500/40 space-y-2 py-1"
                >
                  <div className="absolute -left-[9px] rtl:-left-auto rtl:-right-[9px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-blue-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {item.degree} — <span className="text-blue-400">{item.field_of_study}</span>
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {item.start_date} {item.is_current ? (lang === "ar" ? "— حتى الآن" : "— Present") : `— ${item.end_date}`}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-300">{item.institution}</p>
                  {item.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              {experience.length === 0 ? (
                <p className="text-sm text-zinc-400">Currently open to junior & entry-level software engineering roles.</p>
              ) : (
                experience.map((item) => (
                  <div
                    key={item.id}
                    className="relative pl-6 rtl:pl-0 rtl:pr-6 border-l-2 rtl:border-l-0 rtl:border-r-2 border-emerald-500/40 space-y-2.5 py-1"
                  >
                    <div className="absolute -left-[9px] rtl:-left-auto rtl:-right-[9px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{item.position}</h3>
                        <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                          {item.employment_type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          {item.start_date} {item.is_current ? (lang === "ar" ? "— حتى الآن" : "— Present") : `— ${item.end_date}`}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1 text-zinc-500">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-emerald-400">{item.company_name}</p>

                    <p className="text-xs text-zinc-300 leading-relaxed pt-1 whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Certificates */}
          {activeTab === "certificates" && (
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <p className="text-sm text-zinc-400">Certificates will be listed here with verified credential links.</p>
              ) : (
                certificates.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCert(item)}
                    className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 hover:border-amber-500/40 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-amber-500/5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {item.certificate_media_url ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex-shrink-0 group-hover:scale-105 transition-transform">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.certificate_media_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                            {item.title}
                          </h3>
                          <span className="text-xs text-blue-400 font-medium block pt-0.5">{item.issuer}</span>
                          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-zinc-500" />
                              {lang === "ar" ? "تاريخ الإصدار: " : "Issued: "} {item.issue_date}
                            </span>
                            {item.credential_id && (
                              <span>• ID: {item.credential_id}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto pt-1">
                        <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1 group-hover:underline">
                          <span>{lang === "ar" ? "معاينة الوثيقة والاعتماد" : "View Credential & Document"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    {lang === "ar" ? "اعتماد رسمي موثق" : "Verified Credential Proof"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedCert.title}</h3>
                <p className="text-xs text-blue-400 font-medium">{selectedCert.issuer}</p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedCert.certificate_media_url ? (
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 max-h-72 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedCert.certificate_media_url}
                  alt={selectedCert.title}
                  className="w-full h-full object-contain max-h-72"
                />
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-center space-y-2">
                <Award className="w-12 h-12 text-amber-400 mx-auto" />
                <p className="text-xs text-zinc-400">
                  {lang === "ar" ? "الاعتماد مسجل رسمياً في قاعدة بيانات المنصة" : "Digital verification recorded in platform database."}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <span className="text-zinc-500 text-[10px] font-mono uppercase">
                  {lang === "ar" ? "تاريخ الإصدار" : "Issue Date"}
                </span>
                <p className="text-white font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{selectedCert.issue_date}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <span className="text-zinc-500 text-[10px] font-mono uppercase">Credential ID</span>
                <p className="text-amber-400 font-mono font-semibold truncate">
                  {selectedCert.credential_id || "VERIFIED"}
                </p>
              </div>
            </div>

            {selectedCert.description && (
              <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/70 text-xs text-zinc-300 leading-relaxed">
                {selectedCert.description}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCert(null)} className="text-xs">
                {lang === "ar" ? "إغلاق" : "Close"}
              </Button>
              {selectedCert.credential_url && (
                <a
                  href={selectedCert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="sm" className="gap-2 text-xs font-semibold">
                    <span>{lang === "ar" ? "التحقق من الرابط الرسمي" : "Verify Official Credential"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}