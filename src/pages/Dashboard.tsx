import { AlertTriangle, Clock, ShieldAlert, UserX } from 'lucide-react';
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
  { label: 'Unassigned Findings', icon: UserX, filter: 'unassigned' },
  { label: 'Under Investigation', status: 'Investigating', icon: Clock, filter: 'Investigating' }
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
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-signal">Central Ministry Experience</p>
          <h1 className="mt-2 text-[1.7rem] font-semibold leading-tight text-slate-100 sm:text-3xl lg:text-[2rem]">{t.overviewTitle}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{t.overviewSubtitle}</p>
        </div>
        <div className="grid gap-2 sm:flex sm:items-center">
          <Link to="/findings" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-signal px-4 py-2 text-sm font-semibold text-graphite transition hover:bg-[var(--color-primary-hover)]">Open Findings Queue</Link>
          <button onClick={() => setParams({ filter: listFilter })} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-panel px-4 py-2 text-sm font-semibold text-signal transition hover:border-signal">
            View All Sectors
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Findings Requiring Attention</h2>
            <p className="mt-1 text-sm leading-6 text-slate-300">The most relevant work for the selected sector and KPI filter.</p>
          </div>
          <Link to="/findings" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-panel px-3 py-2 text-sm font-semibold text-signal hover:border-signal">Open full queue</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.slice(0, 4).map((finding) => <PostCard key={finding.id} post={{ id: finding.postId, accountId: finding.primarySector, timestamp: finding.collectionTime, text: finding.originalFinding, language: 'English', category: finding.category, severity: finding.severity, confidence: finding.confidence, status: finding.status, sourceType: finding.source }} alert={finding} />)}
        </div>
        {filtered.length === 0 && <EmptyState title="No Findings" detail="No findings match this sector and KPI filter." />}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Sector Overview</h2>
          <p className="mt-1 text-sm leading-6 text-slate-300">Operational ownership and workload by Ministry sector.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {sectorCards.map((item) => (
            <button key={item.sector.id} onClick={() => setParams({ sector: item.sector.id, filter: listFilter })} className="h-auto min-w-0 rounded-2xl border border-line bg-panel p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 basis-56">
                  <h3 className="whitespace-normal break-words text-lg font-semibold leading-6 text-slate-100">{item.sector.shortName}</h3>
                  <p className="mt-1 whitespace-normal break-words text-sm leading-5 text-slate-400">Last activity: {item.last}</p>
                </div>
                <span className="inline-flex w-auto shrink-0 whitespace-nowrap rounded-full bg-[var(--color-critical-background)] px-3 py-1.5 text-sm font-semibold leading-5 text-[var(--color-critical-text)]">{item.critical} Critical</span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3">
                <Metric label="Open" value={item.open} />
                <Metric label="Investigating" value={item.investigating} />
                <Metric label="Overdue" value={item.overdue} />
                <Metric label="Avg. Response" value={item.avg} />
              </dl>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Charts and Analytics</h2>
          <p className="mt-1 text-sm leading-6 text-slate-300">Supporting trends are placed lower so urgent findings stay prominent.</p>
        </div>
        <section className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Threat Status Overview</h3>
              <p className="mt-1 text-sm text-slate-300">New, assigned, investigating, resolved, closed, and overdue work.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusCounts.map((item) => <StatusBadge key={item.label} status={item.label as AlertStatus} />)}
            </div>
          </div>
          <div className="flex h-4 overflow-hidden rounded-full bg-panelSoft">
            {statusCounts.map((item, index) => (
              <div key={item.label} title={`${item.label}: ${item.value}`} className={['bg-[var(--color-investigating-text)]', 'bg-[var(--color-medium-text)]', 'bg-[var(--color-success-text)]', 'bg-[var(--color-investigating-text)]', 'bg-[var(--color-success-text)]', 'bg-signal', 'bg-[var(--color-critical-text)]'][index]} style={{ width: `${Math.max(4, (item.value / Math.max(visible.length, 1)) * 100)}%` }} />
            ))}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <BarChartCard title="Findings by Source" data={Array.from(new Set(visible.map((finding) => finding.source))).map((source) => ({ label: source, value: visible.filter((finding) => finding.source === source).length }))} />
          <HeatMap data={sectorCards.map((item) => ({ region: item.sector.shortName, value: item.critical + item.overdue + item.open }))} />
        </div>
      </section>
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
    <div className="flex min-h-20 min-w-0 flex-col items-center justify-center rounded-xl bg-panelSoft px-3 py-3 text-center">
      <dt className="whitespace-normal break-words text-sm font-medium leading-5 text-slate-400">{label}</dt>
      <dd className="mt-1 text-xl font-semibold leading-6 text-slate-100">{value}</dd>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-panel p-8 text-center">
      <p className="font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </div>
  );
}
