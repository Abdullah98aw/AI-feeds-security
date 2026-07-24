import { useState } from 'react';
import { storage } from '../services/storage';

export default function AuditLog() {
  const [query, setQuery] = useState('');
  const events = storage.audit().filter((event) => [event.action, event.description, event.user, event.findingId, event.caseId, event.sector].join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-signal">Audit Log</p>
        <h1 className="mt-2 text-3xl font-semibold">Platform action history</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Track finding, case, note, assignment, export, notification, and settings actions across the local prototype.</p>
      </div>

      <label className="block text-sm text-slate-300">
        Search audit events
        <input className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by date, user, action, sector, finding ID, or case ID..." />
      </label>

      <section className="grid gap-3 lg:hidden">
        {events.map((event) => (
          <article key={event.id} className="rounded-lg border border-line bg-panel p-4">
            <p className="text-sm text-slate-500">{event.date} {event.time}</p>
            <h2 className="mt-2 font-semibold leading-6 text-signal">{event.action}</h2>
            <p className="mt-1 text-sm leading-5 text-slate-400">{event.user} - {event.sector ?? 'Ministry'}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{event.description}</p>
            <p className="mt-2 text-sm leading-5 text-slate-500">{event.previousValue ?? '-'} -&gt; {event.newValue ?? '-'}</p>
          </article>
        ))}
      </section>

      <section className="hidden rounded-lg border border-line bg-panel lg:block">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="min-w-full divide-y divide-line text-left text-sm">
            <thead className="bg-panelSoft text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[10rem] px-4 py-3">Date</th>
                <th className="w-[10rem] px-4 py-3">User</th>
                <th className="w-[12rem] px-4 py-3">Action</th>
                <th className="px-4 py-3">Context</th>
                <th className="w-[9rem] px-4 py-3">Previous</th>
                <th className="w-[9rem] px-4 py-3">New</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-panelSoft/60">
                  <td className="px-4 py-4">{event.date} {event.time}</td>
                  <td className="px-4 py-4">{event.user}</td>
                  <td className="px-4 py-4 text-signal">{event.action}</td>
                  <td className="px-4 py-4 leading-6 text-slate-400">{event.description}</td>
                  <td className="px-4 py-4 text-slate-500">{event.previousValue ?? '-'}</td>
                  <td className="px-4 py-4 text-slate-300">{event.newValue ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {events.length === 0 && <p className="rounded-lg border border-dashed border-line bg-panel p-8 text-center text-slate-300">No Search Results</p>}
    </div>
  );
}
