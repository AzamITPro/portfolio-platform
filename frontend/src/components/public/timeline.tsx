"use client";

import { useState } from "react";
import { EducationItem, ExperienceItem, CertificateItem } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { GraduationCap, Briefcase, Award, Calendar, CheckCircle } from "lucide-react";

interface TimelineProps {
  education: EducationItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
}

export function JourneySection({ education, experience, certificates }: TimelineProps) {
  const [activeTab, setActiveTab] = useState<"education" | "experience" | "certificates">("education");

  return (
    <section id="journey" className="py-20 border-t border-zinc-900 bg-zinc-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Academic & Career"
          title="My Professional Journey"
          description="A chronological timeline of my academic milestones, technical achievements, and certifications."
        />

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mb-10 border-b border-zinc-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "education"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Education ({education.length})
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "experience"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Experience ({experience.length})
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "certificates"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            Certificates ({certificates.length})
          </button>
        </div>

        {/* Timeline Content */}
        <div className="max-w-3xl space-y-6">
          {activeTab === "education" && (
            <div className="space-y-6">
              {education.map((item) => (
                <div
                  key={item.id}
                  className="relative pl-6 border-l-2 border-blue-500/40 space-y-2 py-1"
                >
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-blue-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {item.degree} — <span className="text-blue-400">{item.field_of_study}</span>
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {item.start_date} {item.is_current ? "— Present" : `— ${item.end_date}`}
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

          {activeTab === "experience" && (
            <div className="space-y-6">
              {experience.length === 0 ? (
                <p className="text-sm text-zinc-400">Currently open to junior & entry-level software engineering roles.</p>
              ) : (
                experience.map((item) => (
                  <div key={item.id} className="relative pl-6 border-l-2 border-blue-500/40 space-y-2 py-1">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-blue-500" />
                    <h3 className="text-lg font-bold text-white">{item.position}</h3>
                    <p className="text-sm text-blue-400">{item.company_name}</p>
                    <p className="text-xs text-zinc-400">{item.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              {certificates.length === 0 ? (
                <p className="text-sm text-zinc-400">Certificates will be listed here with verified credential links.</p>
              ) : (
                certificates.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-blue-400">{item.issuer}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}