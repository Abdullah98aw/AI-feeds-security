import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SeverityBadge } from '../components/SeverityBadge';
import { sectors } from '../data/ministryData';
import { usePrototype } from '../state/AlertStatusContext';
import type { NotificationRecord } from '../types';

export default function NotificationCenter() {
  const { notifications, findings, cases, markNotificationRead, markAllNotificationsRead } = usePrototype();
  const [message, setMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(60);
  const visible = notifications.slice(0, visibleCount);
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="text-sm uppercase tracking-[0.18em] text-signal">Notification Center</p><h1 className="mt-2 text-3xl font-semibold">Arabic operational notifications</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Review unread and read simulated notifications linked to findings and cases.</p></div><button onClick={() => { markAllNotificationsRead(); setMessage('All notifications marked as read.'); }} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Mark all as read</button></div>
      {message && <p className="rounded-lg border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-signal">{message}</p>}
      <section className="grid gap-3">
        {visible.map((item) => {
          const findingExists = item.findingId ? findings.some((finding) => finding.id === item.findingId) : false;
          const caseExists = item.caseId ? cases.some((caseRecord) => caseRecord.id === item.caseId) : false;
          return (
            <article key={item.id} className={`rounded-lg border ${item.read ? 'border-line bg-panel' : notificationBorder(item.outcome)} p-5 ${item.read ? '' : 'shadow-[inset_4px_0_0_rgba(57,215,180,0.65)]'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0" dir="rtl" lang="ar">
                  <div className="mb-2 flex flex-wrap gap-2" dir="ltr">
                    {item.simulated && <p className="inline-flex rounded-full bg-signal/10 px-2 py-1 text-xs font-semibold text-signal">Simulated Live Intelligence Event</p>}
                    {item.outcome && <p className="inline-flex rounded-full bg-panelSoft px-2 py-1 text-xs font-semibold text-slate-300">{outcomeLabel(item.outcome)}</p>}
                    {item.confidence !== undefined && <p className="inline-flex rounded-full bg-panelSoft px-2 py-1 text-xs font-semibold text-slate-300">{item.confidence}% confidence</p>}
                  </div>
                  <p className="font-semibold leading-7 text-slate-100">{item.messageAr}</p>
                  {item.messageEn && <p className="mt-2 text-sm leading-6 text-slate-300" dir="ltr">{item.messageEn}</p>}
                  {item.title && <p className="mt-2 text-sm font-semibold leading-5 text-slate-200" dir="ltr">{item.title}</p>}
                  <p className="mt-1 text-sm leading-6 text-slate-400" dir="ltr">{sectors.find((sector) => sector.id === item.sector)?.name ?? 'Unassigned'} - {item.source ? `${item.source} - ` : ''}{item.time}</p>
                  {item.assignmentReason && <p className="mt-2 text-sm leading-6 text-slate-400" dir="ltr">{item.assignmentReason}</p>}
                  {item.suggestedAction && <p className="mt-1 text-sm leading-6 text-slate-500" dir="ltr">Next action: {item.suggestedAction}</p>}
                  {item.suggestedSectors?.length ? <p className="mt-1 text-sm leading-6 text-amber" dir="ltr">Suggested sectors: {item.suggestedSectors.join(', ')}</p> : null}
                </div>
                <SeverityBadge severity={item.severity} />
              </div>
              <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                {item.findingId && findingExists && <Link to={`/investigation/${item.findingId}`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">{item.outcome === 'unassigned' ? 'Open Triage' : 'Related finding'}</Link>}
                {item.findingId && !findingExists && <span className="inline-flex min-h-10 items-center rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-amber">Finding target unavailable</span>}
                {item.caseId && caseExists && <Link to={`/cases/${item.caseId}`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Related case</Link>}
                {item.caseId && !caseExists && <span className="inline-flex min-h-10 items-center rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-amber">Case target unavailable</span>}
                <button onClick={() => { markNotificationRead(item.id); setMessage(`${item.id} marked as read.`); }} className="min-h-10 rounded-lg bg-signal px-3 py-2 text-sm font-semibold leading-5 text-graphite">Mark as read</button>
                {(!item.findingId && !item.caseId) && <Link to="/" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm text-slate-100">Dashboard</Link>}
              </div>
            </article>
          );
        })}
        {visibleCount < notifications.length && <button onClick={() => setVisibleCount((count) => count + 60)} className="min-h-11 rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100">Load more notifications</button>}
        {notifications.length === 0 && <p className="rounded-lg border border-dashed border-line bg-panel p-8 text-center text-slate-300">No Notifications</p>}
      </section>
    </div>
  );
}

function outcomeLabel(outcome: NonNullable<NotificationRecord['outcome']>) {
  const labels: Record<NonNullable<NotificationRecord['outcome']>, string> = {
    assigned: 'Assigned',
    unassigned: 'Unassigned',
    verification: 'Verification Required',
    'multi-sector': 'Multi-Sector',
    critical: 'Critical Escalation',
    vulnerability: 'Vulnerability Exposure',
    'dark-web': 'Dark Web',
    'social-osint': 'Social OSINT',
    'case-update': 'Case Update',
    'analyst-assignment': 'Analyst Assignment',
    closed: 'Finding Closed',
    reopened: 'Finding Reopened',
    completed: 'Completed'
  };
  return labels[outcome];
}

function notificationBorder(outcome?: NotificationRecord['outcome']) {
  if (outcome === 'unassigned') return 'border-amber/50 bg-panel';
  if (outcome === 'critical') return 'border-danger/50 bg-panel';
  if (outcome === 'assigned' || outcome === 'multi-sector') return 'border-signal/40 bg-panel';
  return 'border-line bg-panel';
}
