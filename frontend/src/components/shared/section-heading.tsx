interface SectionHeadingProps {
  badge: string;
  title: string;
  description?: string;
}

export function SectionHeading({ badge, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3 text-center sm:text-left mb-12">
      <span className="inline-block text-xs font-mono font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
        {badge}
      </span>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}