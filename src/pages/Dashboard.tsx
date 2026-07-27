import { AlertTriangle, CheckCircle2, Clock, FileWarning, ShieldAlert, UserX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { BarChartCard } from '../components/ChartCard';
import { HeatMap } from '../components/HeatMap';
import { KpiCard } from '../components/KpiCard';
import { PostCard } from '../components/PostCard';
import { StatusBadge } from '../components/StatusBadge';
import { sectors } from '../data/ministryData';
import { labels } from '../services/i18n';
import { validSectorParam } from '../services/safeActions';
import { usePrototype } from '../state/AlertStatusContext';
import type { Alert, AlertStatus, SectorId } from '../types';

const kpis: Array<{ label: string; status?: AlertStatus; icon: LucideIcon; filter: string }> = [
  { label: 'Active Findings', icon: ShieldAlert, filter: 'active' },
  { label: 'Critical Findings', icon: AlertTriangle, filter: 'critical' },
  { label: 'Under Investigation', status: 'Investigating', icon: Clock, filter: 'Investigating' },
  { label: 'Closed This Week', status: 'Closed', icon: CheckCircle2, filter: 'Closed' },
  { label: 'Overdue Findings', status: 'Overdue', icon: FileWarning, filter: 'Overdue' },
  { label: 'Unassigned Findings', icon: UserX, filter: 'unassigned' }
];

export default function Dashboard() {
  const { findings, language } = usePrototype();
  const [params, setParams] = useSearchParams();
  const sectorFilter = validSectorParam(params.get('sector'), sectors.map((sector) => sector.id)) as SectorId | 'all';
  const listFilter = params.get('filter') ?? 'active';
  const t = labels[language];
  const visible = sectorFilter === 'all' ? findings : findings.filter((finding) => finding.primarySector === sectorFilter || finding.supportingSectors.includes(sectorFilter));
  const filtered = applyFilter(visible, listFilter).slice(0, 8);
  const statusCounts = ['New', 'Verification Required', 'Assigned', 'Investigating', 'Resolved', 'Closed', 'Overdue'].map((status) => ({
    label: status,
    value: visible.filter((finding) => finding.status === status).length
  }));
  const sectorCards = sectors.filter((sector) => !['admin', 'multi-sector'].includes(sector.id)).map((sector) => {
    const items = findings.filter((finding) => finding.primarySector === sector.id || finding.supportingSectors.includes(sector.id));
    return {
      sector,
      open: items.filter((item) => !['Resolved', 'Closed'].includes(item.status)).length,
      investigating: items.filter((item) => item.status === 'Investigating').length,
      closed: items.filter((item) => item.status === 'Closed').length,
      overdue: items.filter((item) => item.status === 'Overdue').length,
      critical: items.filter((item) => item.severity === 'Critical').length,
      avg: `${8 + items.length}h`,
      last: items[0]?.lastUpdate ?? 'No activity'
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-signal">Central Ministry Experience</p>
          <h1 className="mt-2 text-3xl font-semibold">{t.overviewTitle}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{t.overviewSubtitle}</p>
        </div>
        <button onClick={() => setParams({ filter: listFilter })} className="rounded-lg border border-line bg-panel px-4 py-2 text-sm text-slate-100 transition hover:border-signal">
          View All Sectors
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => {
          const count = kpi.filter === 'active'
            ? visible.filter((item) => !['Closed', 'Resolved'].includes(item.status)).length
            : kpi.filter === 'critical'
              ? visible.filter((item) => item.severity === 'Critical').length
              : kpi.filter === 'unassigned'
                ? findings.filter((item) => item.primarySector === 'admin' && item.supportingSectors.length === 0).length
                : visible.filter((item) => item.status === kpi.status).length;
          return (
            <button key={kpi.label} onClick={() => setParams({ sector: sectorFilter, filter: kpi.filter })} className="h-full min-w-0 text-left">
              <KpiCard label={kpi.label} value={String(count)} detail="Click to filter findings" icon={kpi.icon} />
            </button>
          );
        })}
      </div>

      <section className="rounded-lg border border-line bg-panel p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Threat Status Overview</h2>
            <p className="mt-1 text-sm text-slate-400">A quick operational view of new, assigned, investigating, resolved, closed, and overdue work.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusCounts.map((item) => <StatusBadge key={item.label} status={item.label as AlertStatus} />)}
          </div>
        </div>
        <div className="flex h-4 overflow-hidden rounded-full bg-panelSoft">
          {statusCounts.map((item, index) => (
            <div key={item.label} title={`${item.label}: ${item.value}`} className={['bg-sky-400', 'bg-danger', 'bg-critical', 'bg-amber', 'bg-emerald-300', 'bg-emerald-500', 'bg-danger'][index]} style={{ width: `${Math.max(4, (item.value / Math.max(visible.length, 1)) * 100)}%` }} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {sectorCards.map((item) => (
              <button key={item.sector.id} onClick={() => setParams({ sector: item.sector.id, filter: listFilter })} className="h-auto min-w-0 rounded-lg border border-line bg-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-signal/40 focus:outline-none focus:ring-2 focus:ring-signal/50">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 basis-56">
                    <h2 className="whitespace-normal break-words text-lg font-semibold leading-6 text-slate-100">{item.sector.shortName}</h2>
                    <p className="mt-1 whitespace-normal break-words text-sm leading-5 text-slate-500">Last activity: {item.last}</p>
                  </div>
                  <span className="inline-flex w-auto shrink-0 whitespace-nowrap rounded-full bg-signal/10 px-3 py-1.5 text-sm font-semibold leading-5 text-signal">{item.critical} Critical</span>
                </div>
                <dl className="mt-5 grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 min-[900px]:grid-cols-3">
                  <Metric label="Open" value={item.open} />
                  <Metric label="Investigating" value={item.investigating} />
                  <Metric label="Closed" value={item.closed} />
                  <Metric label="Overdue" value={item.overdue} />
                  <Metric label="Critical" value={item.critical} />
                  <Metric label="Avg. Response" value={item.avg} />
                </dl>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Priority Findings</h2>
              <p className="mt-1 text-sm text-slate-400">Most relevant work for the selected sector and KPI filter.</p>
            </div>
            <Link to="/alerts" className="rounded-lg border border-line bg-panel px-3 py-2 text-sm text-slate-100 hover:border-signal">Open full queue</Link>
          </div>
          {filtered.map((finding) => <PostCard key={finding.id} post={{ id: finding.postId, accountId: finding.primarySector, timestamp: finding.collectionTime, text: finding.originalFinding, language: 'English', category: finding.category, severity: finding.severity, confidence: finding.confidence, status: finding.status, sourceType: finding.source }} alert={finding} />)}
          {filtered.length === 0 && <EmptyState title="No Findings" detail="No findings match this sector and KPI filter." />}
        </section>

        <aside className="space-y-4">
          <BarChartCard title="Findings by Source" data={Array.from(new Set(visible.map((finding) => finding.source))).map((source) => ({ label: source, value: visible.filter((finding) => finding.source === source).length }))} />
          <HeatMap data={sectorCards.map((item) => ({ region: item.sector.shortName, value: item.critical + item.overdue + item.open }))} />
        </aside>
      </div>
    </div>
  );
}

function applyFilter(findings: Alert[], filter: string) {
  if (filter === 'active') return findings.filter((item) => !['Closed', 'Resolved'].includes(item.status));
  if (filter === 'critical') return findings.filter((item) => item.severity === 'Critical');
  if (filter === 'unassigned') return findings.filter((item) => item.primarySector === 'admin' && item.supportingSectors.length === 0);
  return findings.filter((item) => item.status === filter);
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex min-h-20 min-w-0 flex-col items-center justify-center rounded-lg bg-panelSoft px-3 py-3 text-center">
      <dt className="whitespace-normal break-words text-sm font-medium leading-5 text-slate-400">{label}</dt>
      <dd className="mt-1 text-xl font-semibold leading-6 text-slate-100">{value}</dd>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-panel p-8 text-center">
      <p className="font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </div>
  );
}
