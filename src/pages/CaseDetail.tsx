import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ErrorFallback } from '../components/ErrorFallback';
import { safeRecordLookup } from '../services/safeActions';
import { usePrototype } from '../state/AlertStatusContext';

export default function CaseDetail() {
  const { caseId } = useParams();
  const { cases, findings, notes, addNote, updateNote, deleteNote, closeCase, reopenCase } = usePrototype();
  const item = safeRecordLookup(cases, caseId);
  const [text, setText] = useState('');
  if (!item) {
    return <ErrorFallback title="Record not found" message="The requested case does not exist or is no longer available in localStorage." detail="Open the cases list to choose an available case, or return to the dashboard." listRoute="/cases" listLabel="Cases" />;
  }
  const related = findings.filter((finding) => item.findingIds.includes(finding.id));
  const caseNotes = notes.filter((note) => note.targetId === item.id);
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-signal">Case Detail</p>
          <h1 className="mt-2 text-3xl font-semibold">{item.title}</h1>
          <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
        </div>
        <button onClick={() => item.status === 'Closed' ? reopenCase(item.id) : closeCase(item.id)} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">{item.status === 'Closed' ? 'Reopen case' : 'Close case'}</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Info label="Status" value={item.status} />
        <Info label="Priority" value={item.priority} />
        <Info label="Primary sector" value={item.sectorName} />
        <Info label="Assigned analyst" value={item.owner} />
      </div>
      <section className="rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold">Related Findings</h2>
        <div className="mt-4 grid gap-3">
          {related.map((finding) => <Link key={finding.id} to={`/investigation/${finding.id}`} className="rounded-lg bg-panelSoft p-3 text-sm leading-6 text-slate-200 hover:bg-line">{finding.id} - {finding.category} - {finding.status}</Link>)}
        </div>
      </section>
      <section className="rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold">Analyst Notes</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input className="min-h-11 min-w-0 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm" value={text} onChange={(event) => setText(event.target.value)} placeholder="Add case note..." />
          <button onClick={() => { if (text.trim()) { addNote({ targetId: item.id, targetType: 'case', author: 'Ministry Analyst', text, visibility: 'Ministry Internal' }); setText(''); } }} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Add</button>
        </div>
        <div className="mt-4 space-y-3">
          {caseNotes.map((note) => <div key={note.id} className="rounded-lg bg-panelSoft p-3"><input className="w-full bg-transparent text-sm text-slate-200 outline-none" value={note.text} onChange={(event) => updateNote(note.id, event.target.value)} /><button onClick={() => deleteNote(note.id)} className="mt-2 text-xs text-danger">Delete</button></div>)}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Detail title="Recommended Actions" items={item.recommendedActions} />
        <Detail title="Attachments placeholders" items={item.attachments} />
        <Detail title="Audit history" items={['Case created', `Current status: ${item.status}`, `Opened at: ${item.openedAt}`]} />
        <Detail title="Timeline" items={item.timeline.length ? item.timeline.map((event) => event.description) : ['No additional timeline events yet.']} />
      </section>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <div className="min-w-0 rounded-lg border border-line bg-panel p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 font-semibold leading-6">{value}</p></div>; }
function Detail({ title, items }: { title: string; items: string[] }) { return <section className="rounded-lg border border-line bg-panel p-5"><h2 className="text-lg font-semibold">{title}</h2><ul className="mt-4 space-y-2 text-sm leading-6 text-slate-400">{items.map((item) => <li key={item}>- {item}</li>)}</ul></section>; }
