import type { CmsProject } from "./cms-data";

type CmsCardProps = { project: CmsProject };

const stackItems = (project: CmsProject) => [
  ["Frontend", project.frontend],
  ["Backend", project.backend],
  ["Database", project.database],
];

export function CmsCard({ project }: CmsCardProps) {
  return (
    <article id={project.name.toLowerCase().replaceAll(" ", "-")} className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-lift sm:p-7">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: project.accent }} />
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl text-xl font-black" style={{ backgroundColor: project.accentSoft, color: project.accent }}>
            {project.mark}
          </div>
          <span className="text-sm font-semibold text-slate">CMS project</span>
        </div>
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.accent }} />
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-ink">{project.name}</h3>
      <p className="mt-3 min-h-[72px] text-[15px] leading-6 text-slate">{project.description}</p>

      <div className="my-7 border-t border-line" />
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate">Tech stack</p>
      <dl className="space-y-3">
        {stackItems(project).map(([label, value]) => (
          <div className="flex items-start justify-between gap-4 text-sm" key={label}>
            <dt className="text-slate">{label}</dt>
            <dd className="max-w-[65%] text-right font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 rounded-2xl p-4" style={{ backgroundColor: project.accentSoft }}>
        <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: project.accent }}>LEC topics</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-ink">{project.lectureTopics.join(" / ")}</p>
      </div>

      <a
        href={project.studioUrl ?? `#${project.name.toLowerCase().replaceAll(" ", "-")}`}
        target={project.studioUrl ? "_blank" : undefined}
        rel={project.studioUrl ? "noopener noreferrer" : undefined}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-violet/20"
        style={{ backgroundColor: project.accent }}
      >
        {project.studioUrl ? `Open ${project.name}` : "Open CMS"} <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
