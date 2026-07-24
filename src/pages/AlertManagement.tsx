import { Link } from 'react-router-dom';
import { useState } from 'react';
import { sectors } from '../data/ministryData';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { usePrototype } from '../state/AlertStatusContext';
import type { AlertStatus, Priority, SectorId, Severity } from '../types';

const severities: Array<'All' | Severity> = ['All', 'Informational', 'Low', 'Medium', 'High', 'Critical'];
const statuses: Array<'All' | AlertStatus> = ['All', 'New', 'Verification Required', 'Assigned', 'Investigating', 'Resolved', 'Closed', 'Overdue'];
const analysts = ['Ministry Analyst', 'Prisons Analyst', 'Public Security Analyst', 'Civil Defense Analyst', 'Narcotics Analyst', 'Border Guard Analyst', 'Passports Analyst'];

export default function AlertManagement() {
  const { findings, assignFinding, setStatus, updateFinding } = usePrototype();
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<'All' | Severity>('All');
  const [status, setStatusFilter] = useState<'All' | AlertStatus>('All');
  const [sector, setSector] = useState<'all' | SectorId>('all');
  const filtered = findings.filter((finding) => {
    const queryMatch = [finding.id, finding.category, finding.source, finding.sectorName, finding.originalFinding, finding.detectedEntities.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase());
    return queryMatch && (severity === 'All' || finding.severity === severity) && (status === 'All' || finding.status === status) && (sector === 'all' || finding.primarySector === sector || finding.supportingSectors.includes(sector));
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-signal">Findings Queue</p>
        <h1 className="mt-2 text-3xl font-semibold">Central finding assignment and routing</h1>
        <p className="mt-2 text-sm text-slate-300">Review simulated findings, route them to affected sectors, assign analysts, escalate work, or return items for verification.</p>
      </div>

      <section className="rounded-lg border border-line bg-panel p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm text-slate-300">Search
          <input className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm outline-none focus:border-signal" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search findings..." />
          </label>
          <label className="block text-sm text-slate-300">Sector
          <select className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={sector} onChange={(event) => setSector(event.target.value as SectorId | 'all')}>
            <option value="all">All sectors</option>
            {sectors.filter((item) => !['admin', 'multi-sector'].includes(item.id)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          </label>
          <label className="block text-sm text-slate-300">Severity
          <select className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={severity} onChange={(event) => setSeverity(event.target.value as 'All' | Severity)}>
            {severities.map((item) => <option key={item}>{item}</option>)}
          </select>
          </label>
          <label className="block text-sm text-slate-300">Status
          <select className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={status} onChange={(event) => setStatusFilter(event.target.value as 'All' | AlertStatus)}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 lg:hidden">
        {filtered.map((finding) => (
          <article key={finding.id} className="rounded-lg border border-line bg-panel p-5">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
              <div className="min-w-0">
                <p className="text-sm leading-5 text-signal">{finding.id}</p>
                <h2 className="mt-1 text-lg font-semibold leading-7">{finding.category}</h2>
              </div>
              <div className="flex max-w-full flex-wrap gap-2"><SeverityBadge severity={finding.severity} /><StatusBadge status={finding.status} /></div>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{finding.whyFlagged}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Primary sector" value={finding.sectorName} />
              <Info label="Supporting sectors" value={finding.supportingSectors.join(', ') || 'None'} />
              <Info label="Confidence" value={`${finding.confidence}%`} />
              <Info label="Assigned analyst" value={finding.assignedAnalyst} />
            </dl>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button onClick={() => setStatus(finding.id, 'Verification Required')} className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm">Return for verification</button>
              <Link className="inline-flex min-h-10 items-center justify-center rounded-lg bg-signal px-3 py-2 text-sm font-semibold text-graphite" to={`/investigation/${finding.id}`}>Open Investigation</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="hidden rounded-lg border border-line bg-panel lg:block">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="min-w-full divide-y divide-line text-left text-sm">
            <thead className="bg-panelSoft text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[34%] px-4 py-3">Finding</th>
                <th className="w-[18%] px-4 py-3">Sector Routing</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="w-[28%] px-4 py-3">Assignment Controls</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((finding) => (
                <tr key={finding.id} className="align-top hover:bg-panelSoft/60">
                  <td className="px-4 py-4">
                    <p className="font-medium leading-6 text-slate-100">{finding.category}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-400">{finding.id} - {finding.source} - {finding.confidence}% confidence</p>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{finding.whyFlagged}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    <p className="leading-6">Primary: {finding.primarySector}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Supporting: {finding.supportingSectors.join(', ') || 'None'}</p>
                  </td>
                  <td className="px-4 py-4"><SeverityBadge severity={finding.severity} /></td>
                  <td className="px-4 py-4"><StatusBadge status={finding.status} /></td>
                  <td className="px-4 py-4">
                    <div className="grid min-w-[20rem] max-w-xl gap-2 2xl:grid-cols-2">
                      <select className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5" defaultValue={finding.primarySector} onChange={(event) => assignFinding(finding.id, event.target.value as SectorId, finding.supportingSectors, finding.assignedAnalyst, finding.priority ?? 'P3')}>
                        {sectors.filter((item) => item.id !== 'multi-sector').map((item) => <option key={item.id} value={item.id}>{item.shortName}</option>)}
                      </select>
                      <select className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5" defaultValue={finding.assignedAnalyst} onChange={(event) => assignFinding(finding.id, finding.primarySector, finding.supportingSectors, event.target.value, finding.priority ?? 'P3')}>
                        {analysts.map((item) => <option key={item}>{item}</option>)}
                      </select>
                      <select className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5" defaultValue={finding.priority ?? 'P3'} onChange={(event) => assignFinding(finding.id, finding.primarySector, finding.supportingSectors, finding.assignedAnalyst, event.target.value as Priority)}>
                        {['P1', 'P2', 'P3', 'P4'].map((item) => <option key={item}>{item}</option>)}
                      </select>
                      <select className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5" value={finding.status} onChange={(event) => setStatus(finding.id, event.target.value as AlertStatus)}>
                        {statuses.filter((item): item is AlertStatus => item !== 'All').map((item) => <option key={item}>{item}</option>)}
                      </select>
                      <button onClick={() => updateFinding(finding.id, { escalationLevel: 'Immediate Review', priority: 'P1' }, 'Finding escalated')} className="min-h-10 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm font-semibold leading-5 text-danger">Escalate</button>
                      <button onClick={() => setStatus(finding.id, 'Verification Required')} className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Return for verification</button>
                      <button onClick={() => assignFinding(finding.id, finding.primarySector, ['narcotics', 'border-guard'].filter((item) => item !== finding.primarySector) as SectorId[], finding.assignedAnalyst, finding.priority ?? 'P3')} className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Mark multi-sector</button>
                      <button onClick={() => assignFinding(finding.id, finding.primarySector, [], finding.assignedAnalyst, finding.priority ?? 'P3')} className="min-h-10 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Remove supporting</button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link className="inline-flex min-h-10 items-center justify-center rounded-lg bg-signal px-3 py-2 text-center text-sm font-semibold leading-5 text-graphite transition hover:bg-signal/85" to={`/investigation/${finding.id}`}>Open Investigation</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-300">No Findings</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 leading-6 text-slate-200">{value}</dd></div>;
}
