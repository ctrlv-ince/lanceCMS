import { projects } from "./cms-data";

export function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead className="bg-mist text-sm uppercase tracking-[0.12em] text-slate">
            <tr>
              <th className="px-6 py-4 font-bold">CMS</th>
              <th className="px-6 py-4 font-bold">Frontend</th>
              <th className="px-6 py-4 font-bold">Backend</th>
              <th className="px-6 py-4 font-bold">Database</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {projects.map((project) => (
              <tr key={project.name} className="transition hover:bg-[#FAFBFF]">
                <td className="px-6 py-5 font-bold text-ink"><span className="mr-3 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.accent }} />{project.name}</td>
                <td className="px-6 py-5 text-base text-slate">{project.frontend}</td>
                <td className="px-6 py-5 text-base text-slate">{project.backend}</td>
                <td className="px-6 py-5 text-base text-slate">{project.database}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
