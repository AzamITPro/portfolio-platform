import { ServiceItem } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Code, Terminal, Server, Cpu } from "lucide-react";

interface ServicesProps {
  services: ServiceItem[];
}

export function Services({ services }: ServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="py-20 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Capabilities"
          title="What I Can Build & Deliver"
          description="Full-cycle software development capabilities engineered to solve real-world problems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-blue-500/40 transition-all duration-300 space-y-4 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {service.short_description}
                </p>
              </div>
              <p className="text-xs text-zinc-500 border-t border-zinc-800/60 pt-3">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}