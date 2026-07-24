import { Link } from 'react-router-dom';
import { SeverityBadge } from '../components/SeverityBadge';
import { sectors } from '../data/ministryData';
import { usePrototype } from '../state/AlertStatusContext';

export default function NotificationCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePrototype();
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="text-sm uppercase tracking-[0.18em] text-signal">Notification Center</p><h1 className="mt-2 text-3xl font-semibold">Arabic operational notifications</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Review unread and read simulated notifications linked to findings and cases.</p></div><button onClick={markAllNotificationsRead} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Mark all as read</button></div>
      <section className="grid gap-3">
        {notifications.map((item) => <article key={item.id} className={`rounded-lg border ${item.read ? 'border-line bg-panel' : 'border-signal/40 bg-panel'} p-5 ${item.read ? '' : 'shadow-[inset_4px_0_0_rgba(57,215,180,0.65)]'}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0" dir="rtl" lang="ar"><p className="font-semibold leading-7 text-slate-100">{item.messageAr}</p><p className="mt-1 text-sm leading-6 text-slate-400">{sectors.find((sector) => sector.id === item.sector)?.name} - {item.time}</p></div><SeverityBadge severity={item.severity} /></div>
          <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">{item.findingId && <Link to={`/investigation/${item.findingId}`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Related finding</Link>}{item.caseId && <Link to={`/cases/${item.caseId}`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Related case</Link>}<button onClick={() => markNotificationRead(item.id)} className="min-h-10 rounded-lg bg-signal px-3 py-2 text-sm font-semibold leading-5 text-graphite">Mark as read</button></div>
        </article>)}
        {notifications.length === 0 && <p className="rounded-lg border border-dashed border-line bg-panel p-8 text-center text-slate-300">No Notifications</p>}
      </section>
    </div>
  );
}
