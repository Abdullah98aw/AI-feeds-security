import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { AlertTriangle, Copy, Download, Eye, ShieldCheck } from 'lucide-react';
import { ConfidenceBreakdown } from '../components/ConfidenceBreakdown';
import { RiskScoreAnimation } from '../components/RiskScoreAnimation';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { mockRiskFactors, sectors } from '../data/ministryData';
import { storage } from '../services/storage';
import { usePrototype } from '../state/AlertStatusContext';
import type { AlertStatus, SectorId } from '../types';

const statuses: AlertStatus[] = ['New', 'Verification Required', 'Assigned', 'Investigating', 'Resolved', 'Closed', 'Overdue'];

export default function Investigation() {
  const { alertId } = useParams();
  const { findings, notes, addNote, updateNote, deleteNote, setStatus, assignFinding } = usePrototype();
  const finding = findings.find((item) => item.id === alertId);
  const [noteText, setNoteText] = useState('');
  const [visibility, setVisibility] = useState<'Ministry Internal' | 'Shared With Assigned Sectors'>('Ministry Internal');
  const [revealed, setRevealed] = useState(false);
  const [warning, setWarning] = useState(false);

  if (!finding) {
    return <NotFound title="Finding Not Found" detail="The requested simulated finding does not exist." />;
  }

  const risk = mockRiskFactors.find((item) => item.alertId === finding.id);
  const findingNotes = notes.filter((note) => note.targetId === finding.id);
  const audit = storage.audit().filter((event) => event.findingId === finding.id);

  const add = () => {
    if (!noteText.trim()) return;
    addNote({ targetId: finding.id, targetType: 'finding', author: 'Ministry Analyst', text: noteText, visibility });
    setNoteText('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-signal">Threat Investigation</p>
          <h1 className="mt-2 text-3xl font-semibold">{finding.category}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Review classification, credibility, sector routing, evidence, notes, and status history for this simulated intelligence finding.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/alerts" className="rounded-lg border border-line bg-panel px-4 py-2 text-sm text-slate-100 hover:border-signal">Back to Queue</Link>
          <button onClick={() => storage.event('Export generated', `Finding report generated for ${finding.id}.`, { findingId: finding.id, sector: finding.primarySector })} className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-sm text-slate-100 hover:border-signal">Finding Report <Download size={16} /></button>
          <button onClick={() => navigator.clipboard.writeText(`${finding.id}\n${finding.aiExplanation}`)} className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-sm text-slate-100 hover:border-signal">Copy <Copy size={16} /></button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <section className="space-y-4">
          <section className="rounded-lg border border-line bg-panel p-5">
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={finding.severity} />
              <StatusBadge status={finding.status} />
              <span className="inline-flex max-w-full rounded-full bg-signal/10 px-3 py-1.5 text-[0.78rem] font-semibold leading-snug text-signal">{finding.confidence}% confidence</span>
              <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{finding.authenticity}</span>
              <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">Due {finding.dueDate}</span>
            </div>
            <h2 className="mt-5 text-lg font-semibold">Summary</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{finding.aiExplanation}</p>
            <h2 className="mt-5 text-lg font-semibold">Original Finding</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{finding.originalFinding}</p>
            {finding.maskedPreview && (
              <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-danger">Sensitive Data - Restricted Preview</p>
                    <p className="mt-1 text-sm text-slate-300">{revealed ? finding.maskedPreview : 'Masked for Prototype'}</p>
                  </div>
                  <button onClick={() => { setWarning(true); storage.event('Sensitive reveal requested', `Reveal warning acknowledged for ${finding.id}.`, { findingId: finding.id }); }} className="inline-flex items-center gap-2 rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger"><Eye size={16} /> Reveal</button>
                </div>
                {warning && <div className="mt-3 rounded-lg bg-panel p-3 text-sm text-slate-300">This prototype never reveals real sensitive data. <button onClick={() => setRevealed(true)} className="ml-2 text-signal">Confirm simulated reveal</button></div>}
              </div>
            )}
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Detail title="Source Reliability" items={[`Source reliability: ${finding.reliability}`, `Information credibility: ${finding.credibility}`, `Previous accuracy: ${finding.previousAccuracy}%`, `Independent confirmation: ${finding.independentConfirmation ? 'Yes' : 'No'}`, `Sample availability: ${finding.sampleAvailability}`, `First observed: ${finding.firstObserved}`, `Last observed: ${finding.lastObserved}`, `Verification status: ${finding.authenticity}`]} />
            <Detail title="Sector Assignment" items={[`Primary Sector: ${finding.primarySector}`, `Supporting Sectors: ${finding.supportingSectors.join(', ') || 'None'}`, ...Object.entries(finding.sectorReasons).map(([sector, reason]) => `${sector}: ${reason}`)]} />
            <Detail title="Evidence" items={finding.evidence} />
            <Detail title="Detected Entities" items={finding.detectedEntities} />
            <Detail title="Risk Explanation" items={[finding.riskExplanation]} />
            <Detail title="AI Explanation" items={[finding.aiExplanation, finding.confidenceReasoning]} />
            <Detail title="What remains unknown?" items={finding.notDetected} iconSafe />
            <Detail title="Recommended Actions" items={[finding.recommendedAction, finding.suggestedNextAction]} />
          </div>

          <ConfidenceBreakdown risk={risk} finalConfidence={finding.confidence} />

          <section className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Analyst Notes</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)_auto]">
              <textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} className="min-h-24 rounded-lg border border-line bg-panelSoft p-3 text-sm outline-none focus:border-signal" placeholder="Add analyst note..." />
              <select value={visibility} onChange={(event) => setVisibility(event.target.value as typeof visibility)} className="min-h-11 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5">
                <option>Ministry Internal</option>
                <option>Shared With Assigned Sectors</option>
              </select>
              <button onClick={add} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold leading-5 text-graphite">Add note</button>
            </div>
            <div className="mt-4 space-y-3">
              {findingNotes.map((note) => (
                <div key={note.id} className="rounded-lg bg-panelSoft p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{note.author} - {note.createdAt} - {note.visibility}</span>
                    <button onClick={() => deleteNote(note.id)} className="text-danger">Delete</button>
                  </div>
                  <textarea className="mt-2 w-full rounded-lg border border-line bg-panel p-2 text-sm text-slate-200" value={note.text} onChange={(event) => updateNote(note.id, event.target.value)} />
                </div>
              ))}
              {findingNotes.length === 0 && <p className="text-sm text-slate-400">No notes yet.</p>}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Real Status History and Audit Events</h2>
            <div className="mt-4 space-y-3">
              {[...audit, ...finding.detectionTimeline.map((item, index) => ({ id: `${finding.id}-${index}`, date: finding.createdAt?.slice(0, 10) ?? '2026-07-23', time: finding.collectionTime.slice(11), user: 'Prototype System', action: item, previousValue: index === 0 ? '-' : finding.detectionTimeline[index - 1], newValue: item, description: item }))].map((event) => (
                <div key={event.id} className="grid gap-3 rounded-lg bg-panelSoft p-3 text-sm md:grid-cols-[minmax(7rem,9rem)_minmax(0,1fr)]">
                  <span className="text-slate-500">{event.date} {event.time}</span>
                  <div>
                    <p className="font-medium text-slate-100">{event.action}</p>
                    <p className="mt-1 text-slate-400">{event.description}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{event.previousValue ?? '-'} → {event.newValue ?? '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <RiskScoreAnimation score={finding.confidence} />
          <section className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Assignment Controls</h2>
            <label className="mt-4 block text-sm text-slate-300">Primary sector
              <select value={finding.primarySector} onChange={(event) => assignFinding(finding.id, event.target.value as SectorId, finding.supportingSectors, finding.assignedAnalyst, finding.priority ?? 'P3')} className="mt-2 w-full rounded-lg border border-line bg-panelSoft px-3 py-2">
                {sectors.filter((sector) => sector.id !== 'multi-sector').map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm text-slate-300">Status
              <select value={finding.status} onChange={(event) => setStatus(finding.id, event.target.value as AlertStatus)} className="mt-2 w-full rounded-lg border border-line bg-panelSoft px-3 py-2">
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button onClick={() => setStatus(finding.id, 'Closed')} className="mt-4 min-h-11 w-full rounded-lg bg-signal px-3 py-2 text-sm font-semibold leading-5 text-graphite">Close finding</button>
            <button onClick={() => setStatus(finding.id, 'Investigating')} className="mt-3 min-h-11 w-full rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Reopen / Investigate</button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Detail({ title, items, iconSafe = false }: { title: string; items: string[]; iconSafe?: boolean }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <div className="flex items-center gap-2">
        {iconSafe && <ShieldCheck size={18} className="text-signal" />}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-400">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </section>
  );
}

function NotFound({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-8 text-center">
      <AlertTriangle className="mx-auto text-danger" />
      <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-slate-400">{detail}</p>
      <Link to="/alerts" className="mt-5 inline-block rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Back to Findings</Link>
    </div>
  );
}
