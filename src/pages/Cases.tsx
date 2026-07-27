import { Link } from 'react-router-dom';
import { useState } from 'react';
import { sectors } from '../data/ministryData';
import { usePrototype } from '../state/AlertStatusContext';
import type { InvestigationCase, Priority, SectorId } from '../types';

export default function Cases() {
  const { cases, findings, saveCase, closeCase, reopenCase } = usePrototype();
  const [draft, setDraft] = useState({ title: '', primarySector: 'prisons' as SectorId, analyst: 'Ministry Analyst', priority: 'P2' as Priority, notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const createCase = () => {
    if (!draft.title.trim()) {
      setError('Case title is required.');
      setMessage('');
      return;
    }
    if (findings.length === 0) {
      setError('A case must contain at least one finding.');
      setMessage('');
      return;
    }
    const selected = findings.slice(0, 2).map((item) => item.id);
    const record: InvestigationCase = {
      id: `case-${Date.now()}`,
      findingIds: selected,
      title: draft.title,
      summary: 'Created by Ministry analyst in the local prototype.',
      primarySector: draft.primarySector,
      supportingSectors: [],
      sectorName: sectors.find((item) => item.id === draft.primarySector)?.name ?? draft.primarySector,
      owner: draft.analyst,
      priority: draft.priority,
      status: 'Open',
      openedAt: new Date().toLocaleString(),
      notes: draft.notes,
      recommendedActions: ['Review related findings', 'Validate evidence', 'Update status'],
      attachments: ['Attachment placeholder'],
      timeline: []
    };
    saveCase(record);
    setDraft({ title: '', primarySector: 'prisons', analyst: 'Ministry Analyst', priority: 'P2', notes: '' });
    setError('');
    setMessage(`Case ${record.id} created and displayed below.`);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-signal">Cases</p>
        <h1 className="mt-2 text-3xl font-semibold">Case management workflow</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Create cases, link findings, assign sectors and analysts, change status, close or reopen cases, and preserve actions in localStorage.</p>
      </div>
      <section className="rounded-lg border border-line bg-panel p-4">
        <h2 className="font-semibold">Create Case</h2>
        {message && <p className="mt-3 rounded-lg border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-signal">{message}</p>}
        {error && <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm text-slate-300">Case title<input className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
          <label className="block text-sm text-slate-300">Primary sector<select className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={draft.primarySector} onChange={(event) => setDraft({ ...draft, primarySector: event.target.value as SectorId })}>{sectors.filter((item) => !['admin', 'multi-sector'].includes(item.id)).map((item) => <option key={item.id} value={item.id}>{item.shortName}</option>)}</select></label>
          <label className="block text-sm text-slate-300">Assigned analyst<input className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={draft.analyst} onChange={(event) => setDraft({ ...draft, analyst: event.target.value })} /></label>
          <label className="block text-sm text-slate-300">Priority<select className="mt-2 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Priority })}>{['P1', 'P2', 'P3', 'P4'].map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <label className="mt-3 block text-sm text-slate-300">Notes<textarea className="mt-2 min-h-24 w-full rounded-lg border border-line bg-panelSoft p-3 text-sm" value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>
        <button onClick={createCase} className="mt-4 min-h-11 w-full rounded-lg bg-signal px-4 py-2 text-sm font-semibold leading-5 text-graphite sm:w-auto">Create case</button>
      </section>
      <section className="grid gap-4">
        {cases.map((item) => (
          <article key={item.id} className="rounded-lg border border-line bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-signal">{item.id} - {item.priority}</p>
                <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{item.summary}</p>
              </div>
              <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{item.status}</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
              <Info label="Primary sector" value={item.sectorName} />
              <Info label="Supporting sectors" value={item.supportingSectors.join(', ') || 'None'} />
              <Info label="Assigned analyst" value={item.owner} />
              <Info label="Related findings" value={item.findingIds.join(', ')} />
            </div>
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
              <Link to={`/cases/${item.id}`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm text-slate-100">View case</Link>
              <button onClick={() => { if (item.status === 'Closed') { reopenCase(item.id); setMessage(`${item.id} reopened.`); } else if (window.confirm('Close this case?')) { closeCase(item.id); setMessage(`${item.id} closed.`); } setError(''); }} className="min-h-10 rounded-lg bg-signal px-3 py-2 text-sm font-semibold leading-5 text-graphite">{item.status === 'Closed' ? 'Reopen' : 'Close case'}</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><p className="text-slate-500">{label}</p><p className="mt-1 leading-6 text-slate-100">{value}</p></div>;
}
