import { Link } from 'react-router-dom';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { usePrototype } from '../state/AlertStatusContext';

const categories = ['Data Leaks', 'Employee Credentials', 'Access for Sale', 'Inmate Data', 'Counterfeit Passports', 'Military Uniforms and Equipment', 'Government Documents', 'Facility Images', 'Threat Actor Discussions', 'Exploit Discussions', 'Smuggling Discussions', 'Drug Trafficking Discussions'];

export default function DarkWebIntelligence() {
  const { findings } = usePrototype();
  const darkFindings = findings.filter((finding) => ['Dark Web', 'Underground Forum', 'Paste Site', 'Messaging Channel'].includes(finding.source));
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-signal">Dark Web Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold">Review simulated underground-source findings</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">This page displays intelligence findings only. It is not a dark web browser and contains no illegal content, credentials, records, or operational instructions.</p>
      </div>
      <div className="flex flex-wrap gap-2">{categories.map((item) => <span key={item} className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{item}</span>)}</div>
      <section className="grid gap-4 2xl:grid-cols-2">
        {darkFindings.map((finding) => (
          <article key={finding.id} className="min-w-0 rounded-lg border border-line bg-panel p-5">
            <div className="mb-4 rounded-lg border border-dashed border-line bg-panelSoft p-4 text-sm text-slate-400">Safe simulated screenshot placeholder - restricted preview, no real content.</div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm leading-5 text-signal">{finding.source}</p>
                <h2 className="mt-1 text-lg font-semibold leading-7">{finding.category}</h2>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <SeverityBadge severity={finding.severity} />
                <StatusBadge status={finding.status} />
                <span className="inline-flex max-w-full rounded-full bg-signal/10 px-3 py-1.5 text-[0.78rem] leading-snug text-signal">{finding.confidence}% confidence</span>
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Source type" value={finding.source} />
              <Info label="Affected sector" value={finding.sectorName} />
              <Info label="Authenticity" value={finding.authenticity} />
              <Info label="Evidence" value={finding.evidenceAvailability} />
              <Info label="First observed" value={finding.firstObserved} />
              <Info label="Last observed" value={finding.lastObserved} />
              <Info label="Assigned analyst" value={finding.assignedAnalyst} />
            </dl>
            <Link to={`/investigation/${finding.id}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite sm:w-auto">Open Investigation</Link>
          </article>
        ))}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 leading-6 text-slate-200">{value}</dd></div>;
}
