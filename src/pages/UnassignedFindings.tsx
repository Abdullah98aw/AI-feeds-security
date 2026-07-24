import { Link } from 'react-router-dom';
import { sectors } from '../data/ministryData';
import { usePrototype } from '../state/AlertStatusContext';
import type { SectorId } from '../types';

export default function UnassignedFindings() {
  const { findings, assignFinding, setStatus } = usePrototype();
  const unassigned = findings.filter((finding) => finding.primarySector === 'admin' && finding.supportingSectors.length === 0);
  return (
    <div className="space-y-5">
      <div><p className="text-sm uppercase tracking-[0.18em] text-signal">Unassigned Findings</p><h1 className="mt-2 text-3xl font-semibold">Findings needing sector routing</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Review findings that could not be confidently routed to one sector. Assign, archive, mark irrelevant, or request additional verification.</p></div>
      <section className="grid gap-4">
        {unassigned.map((finding) => <article key={finding.id} className="rounded-lg border border-line bg-panel p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm leading-5 text-signal">{finding.id}</p>
              <h2 className="mt-1 text-lg font-semibold leading-7">{finding.category}</h2>
            </div>
            <span className="inline-flex w-auto shrink-0 rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{finding.confidence}% confidence</span>
          </div>
          <div className="mt-4 rounded-lg bg-panelSoft p-4 text-sm leading-6 text-slate-300">
            <p className="font-medium text-slate-100">Why sector was not identified</p>
            <p className="mt-2 text-slate-400">Detected terms were Ministry-wide or insufficient for confident sector routing.</p>
            <p className="mt-3">{finding.originalFinding}</p>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Detected entities" value={finding.detectedEntities.join(', ')} />
            <Info label="Verification status" value={finding.authenticity} />
          </dl>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <select className="min-h-11 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" onChange={(event) => assignFinding(finding.id, event.target.value as SectorId, [], 'Ministry Analyst', finding.priority ?? 'P3')} defaultValue=""><option value="" disabled>Assign sector</option>{sectors.filter((sector) => !['admin', 'multi-sector'].includes(sector.id)).map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}</select>
            <button onClick={() => assignFinding(finding.id, 'border-guard', ['narcotics'], 'Ministry Analyst', 'P2')} className="min-h-11 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm">Mark multi-sector</button>
            <button onClick={() => setStatus(finding.id, 'Verification Required')} className="min-h-11 rounded-lg bg-signal px-3 py-2 text-sm font-semibold text-graphite">Request verification</button>
            <button onClick={() => setStatus(finding.id, 'Closed')} className="min-h-11 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm">Archive</button>
            <button onClick={() => setStatus(finding.id, 'Resolved')} className="min-h-11 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm">Mark irrelevant</button>
            <Link to={`/investigation/${finding.id}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm">Open Investigation</Link>
          </div>
        </article>)}
        {unassigned.length === 0 && <p className="rounded-lg border border-dashed border-line bg-panel p-8 text-center text-slate-300">No Findings</p>}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 leading-6 text-slate-200">{value}</dd></div>;
}
