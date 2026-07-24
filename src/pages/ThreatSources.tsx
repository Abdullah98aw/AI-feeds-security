import { mockThreatSources } from '../data/ministryData';

export default function ThreatSources() {
  return (
    <div className="space-y-5">
      <div><p className="text-sm uppercase tracking-[0.18em] text-signal">Threat Sources</p><h1 className="mt-2 text-3xl font-semibold">Simulated feed health monitoring</h1><p className="mt-2 text-sm text-slate-300">Monitor source health only. This page is not a dark web browser.</p></div>
      <section className="grid gap-4 lg:grid-cols-2">
        {mockThreatSources.map((source) => <article key={source.id} className="min-w-0 rounded-lg border border-line bg-panel p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className="text-sm leading-5 text-signal">{source.type}</p><h2 className="mt-1 font-semibold leading-7">{source.name}</h2></div><span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug">{source.healthStatus}</span></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Info label="Status" value={source.status} /><Info label="Reliability" value={source.reliability} /><Info label="Last update" value={source.lastSuccessfulUpdate} /><Info label="Findings" value={String(source.findingsCollected)} /><Info label="Average delay" value={source.averageDelay} /><Info label="Method" value={source.collectionMethod} /></dl></article>)}
      </section>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 leading-6 text-slate-200">{value}</dd></div>; }
