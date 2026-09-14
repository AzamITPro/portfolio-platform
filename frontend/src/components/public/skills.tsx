import { SkillCategory } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Cpu, Star } from "lucide-react";

interface SkillsProps {
  categories: SkillCategory[];
}

export function SkillsSection({ categories }: SkillsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="skills" className="py-20 border-t border-zinc-900 bg-zinc-950/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Technical Arsenal"
          title="Skills & Core Technologies"
          description="A breakdown of my programming languages, frameworks, databases, and architectural proficiencies."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-zinc-400">{category.description}</p>
                  )}
                </div>
              </div>

              {/* Skills List with Proficiency Bars */}
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        {skill.name}
                        {skill.is_featured && (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        )}
                      </span>
                      <span className="font-mono text-zinc-400">
                        {skill.proficiency_level}%
                      </span>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500"
                        style={{ width: `${skill.proficiency_level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}