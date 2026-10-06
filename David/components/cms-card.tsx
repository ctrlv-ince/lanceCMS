"use client";

import { useEffect, useState } from "react";
import type { CmsProject } from "./cms-data";

type CmsCardProps = { project: CmsProject };

const stackItems = (project: CmsProject) => [
  ["Frontend", project.frontend],
  ["Backend", project.backend],
  ["Database", project.database],
];

export function CmsCard({ project }: CmsCardProps) {
  const [targetUrl, setTargetUrl] = useState<string>(project.studioUrl ?? "#");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (project.studioPort !== undefined) {
        const portStr = project.studioPort !== "" ? `:${project.studioPort}` : "";
        setTargetUrl(`http://${hostname}${portStr}`);
      } else if (project.studioUrl) {
        try {
          const parsed = new URL(project.studioUrl);
          parsed.hostname = hostname;
          setTargetUrl(parsed.toString());
        } catch {
          // ignore
        }
      }
    }
  }, [project]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      let url = targetUrl;
      if (project.studioPort !== undefined) {
        const portStr = project.studioPort !== "" ? `:${project.studioPort}` : "";
        url = `http://${hostname}${portStr}`;
      }
      if (url && url !== "#") {
        e.preventDefault();
        window.open(url, "_blank");
      }
    }
  };

  const hasLink = project.studioPort !== undefined || !!project.studioUrl;

  return (
    <article id={project.name.toLowerCase().replaceAll(" ", "-")} className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-lift sm:p-7">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: project.accent }} />
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl text-xl font-black" style={{ backgroundColor: project.accentSoft, color: project.accent }}>
            {project.mark}
          </div>
          <span className="text-base font-semibold text-slate">CMS project</span>
        </div>
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.accent }} />
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-ink">{project.name}</h3>
      <p className="mt-3 min-h-[72px] text-lg leading-7 text-slate">{project.description}</p>

      <div className="my-7 border-t border-line" />
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate">Tech stack</p>
      <dl className="space-y-3">
        {stackItems(project).map(([label, value]) => (
          <div className="flex items-start justify-between gap-4 text-base" key={label}>
            <dt className="text-slate">{label}</dt>
            <dd className="max-w-[65%] text-right font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 rounded-2xl p-4" style={{ backgroundColor: project.accentSoft }}>
        <p className="text-sm font-bold uppercase tracking-[0.12em]" style={{ color: project.accent }}>LEC topics</p>
        <p className="mt-2 text-base font-semibold leading-7 text-ink">{project.lectureTopics.join(" / ")}</p>
      </div>

      <a
        href={targetUrl}
        onClick={handleClick}
        target={hasLink ? "_blank" : undefined}
        rel={hasLink ? "noopener noreferrer" : undefined}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-violet/20"
        style={{ backgroundColor: project.accent }}
      >
        {hasLink ? `Open ${project.name}` : "Open CMS"} <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
