import { Link, useParams } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Download, Eye, Plus, Trash2, X } from 'lucide-react';
import { ConfidenceBreakdown } from '../components/ConfidenceBreakdown';
import { RiskScoreAnimation } from '../components/RiskScoreAnimation';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { mockAssets, mockRiskFactors, sectors } from '../data/ministryData';
import { storage } from '../services/storage';
import { usePrototype } from '../state/AlertStatusContext';
import type { AlertStatus, AnalystNote, InvestigationCase, Priority, SectorId } from '../types';

const statuses: AlertStatus[] = ['New', 'Verification Required', 'Assigned', 'Investigating', 'Resolved', 'Closed', 'Overdue'];
const analysts = ['Ministry Analyst', 'Prisons Analyst', 'Public Security Analyst', 'Civil Defense Analyst', 'Narcotics Analyst', 'Border Guard Analyst', 'Passports Analyst'];
const priorities: Priority[] = ['P1', 'P2', 'P3', 'P4'];

type Feedback = { tone: 'success' | 'warning' | 'error'; message: string } | null;
type FeedbackTone = NonNullable<Feedback>['tone'];

export default function Investigation() {
  const { alertId } = useParams();
  const { findings, cases, notes, addNote, updateNote, deleteNote, setStatus, assignFinding, saveCase, updateFinding } = usePrototype();
  const finding = findings.find((item) => item.id === alertId);
  const notesSectionRef = useRef<HTMLElement | null>(null);
  const [noteText, setNoteText] = useState('');
  const [visibility, setVisibility] = useState<'Ministry Internal' | 'Shared With Assigned Sectors'>('Ministry Internal');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [noteError, setNoteError] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [newNoteId, setNewNoteId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [warning, setWarning] = useState(false);
  const [targetCaseId, setTargetCaseId] = useState('');

  if (!finding) {
    return <NotFound title="Finding Not Found" detail="The requested simulated finding does not exist. Return to the queue and select an available finding." />;
  }

  const risk = mockRiskFactors.find((item) => item.alertId === finding.id);
  const findingNotes = notes.filter((note) => note.targetId === finding.id && note.targetType === 'finding');
  const audit = storage.audit().filter((event) => event.findingId === finding.id);
  const relatedCases = cases.filter((item) => item.findingIds.includes(finding.id));
  const availableCases = cases.filter((item) => !item.findingIds.includes(finding.id));
  const relatedFindings = findings.filter((item) => finding.relatedAlertIds?.includes(item.id));
  const assets = mockAssets.filter((asset) => asset.sectorId === finding.primarySector || finding.supportingSectors.includes(asset.sectorId));

  const timeline = useMemo(() => {
    const seeded = finding.detectionTimeline.map((item, index) => ({
      id: `${finding.id}-seed-${index}`,
      date: finding.createdAt?.slice(0, 10) ?? '2026-07-23',
      time: finding.collectionTime.slice(11),
      user: 'Prototype System',
      action: item,
      previousValue: index === 0 ? '-' : finding.detectionTimeline[index - 1],
      newValue: item,
      description: item
    }));
    return [...audit, ...seeded].sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }, [audit, finding]);

  const show = (message: string, tone: FeedbackTone = 'success') => setFeedback({ tone, message });

  const add = () => {
    const trimmed = noteText.trim();
    if (!trimmed) {
      setNoteError('Note cannot be empty.');
      show('Note could not be saved. Enter a note first.', 'error');
      return;
    }
    const created = addNote({ targetId: finding.id, targetType: 'finding', author: 'Ministry Analyst', text: trimmed, visibility });
    setNoteText('');
    setNoteError('');
    setNewNoteId(created.id);
    show('Note added successfully.');
    window.setTimeout(() => document.getElementById(created.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  const beginEdit = (note: AnalystNote) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
    setNoteError('');
  };

  const saveEdit = (noteId: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setNoteError('Edited note cannot be empty.');
      show('Note update failed. Enter note text first.', 'error');
      return;
    }
    updateNote(noteId, trimmed);
    setEditingNoteId(null);
    setEditText('');
    show('Note updated successfully.');
  };

  const removeNote = (noteId: string) => {
    if (!window.confirm('Delete this analyst note? This action cannot be undone.')) return;
    deleteNote(noteId);
    show('Note deleted successfully.', 'warning');
  };

  const changeStatus = (status: AlertStatus) => {
    if (status === 'Closed' && !window.confirm('Close this finding?')) return;
    setStatus(finding.id, status);
    show(`Finding status updated to ${status}.`);
  };

  const changePrimarySector = (primarySector: SectorId) => {
    const supporting = finding.supportingSectors.filter((sector) => sector !== primarySector);
    assignFinding(finding.id, primarySector, supporting, finding.assignedAnalyst, finding.priority ?? 'P3');
    show('Primary sector updated.');
  };

  const addSupportingSector = (supportingSector: SectorId) => {
    if (supportingSector === finding.primarySector) {
      show('Supporting sector cannot match the primary sector.', 'error');
      return;
    }
    if (finding.supportingSectors.includes(supportingSector)) {
      show('Supporting sector is already assigned.', 'error');
      return;
    }
    assignFinding(finding.id, finding.primarySector, [...finding.supportingSectors, supportingSector], finding.assignedAnalyst, finding.priority ?? 'P3');
    show('Supporting sector added.');
  };

  const removeSupportingSector = (supportingSector: SectorId) => {
    if (!window.confirm('Remove this supporting sector from the finding?')) return;
    assignFinding(finding.id, finding.primarySector, finding.supportingSectors.filter((sector) => sector !== supportingSector), finding.assignedAnalyst, finding.priority ?? 'P3');
    show('Supporting sector removed.', 'warning');
  };

  const changeAnalyst = (analyst: string) => {
    assignFinding(finding.id, finding.primarySector, finding.supportingSectors, analyst, finding.priority ?? 'P3');
    show('Assigned analyst updated.');
  };

  const changePriority = (priority: Priority) => {
    assignFinding(finding.id, finding.primarySector, finding.supportingSectors, finding.assignedAnalyst, priority);
    show('Priority updated.');
  };

  const addToCase = () => {
    const target = cases.find((item) => item.id === targetCaseId);
    if (!target) {
      show('Select a case before adding this finding.', 'error');
      return;
    }
    const next: InvestigationCase = { ...target, findingIds: [finding.id, ...target.findingIds] };
    saveCase(next);
    setTargetCaseId('');
    show(`Finding added to ${target.id}.`);
  };

  const closeFinding = () => changeStatus('Closed');
  const reopenFinding = () => changeStatus('Investigating');

  return (
    <div className="space-y-5">
      {feedback && <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />}

      <header className="rounded-lg border border-line bg-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.18em] text-signal">Threat Investigation</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight">{finding.category}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Review the finding, understand the risk, assign responsibility, record notes, and track the response.</p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap lg:justify-end">
            <button onClick={() => notesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite"><Plus size={16} /> Add Note</button>
            <Link to="/alerts" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100 hover:border-signal">Return to Queue</Link>
            <button onClick={() => { storage.event('Export generated', `Finding report generated for ${finding.id}.`, { findingId: finding.id, sector: finding.primarySector }); show('Report generated. Audit event recorded.'); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100 hover:border-signal">Export <Download size={16} /></button>
            <button onClick={() => { navigator.clipboard.writeText(`${finding.id}\n${finding.aiExplanation}`); show('Finding summary copied.'); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100 hover:border-signal">Copy Summary <Copy size={16} /></button>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <HeaderItem label="Finding ID" value={finding.id} />
          <HeaderItem label="Primary sector" value={finding.sectorName} />
          <HeaderItem label="Supporting sectors" value={finding.supportingSectors.join(', ') || 'No supporting sectors assigned'} />
          <HeaderItem label="Assigned analyst" value={finding.assignedAnalyst} />
          <HeaderItem label="Confidence" value={`${finding.confidence}%`} />
          <HeaderItem label="Last updated" value={finding.lastUpdate} />
          <HeaderItem label="Priority" value={finding.priority ?? 'P3'} />
          <HeaderItem label="Due date" value={finding.dueDate} />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <SeverityBadge severity={finding.severity} />
          <StatusBadge status={finding.status} />
          <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{finding.authenticity}</span>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,25rem)]">
        <main className="space-y-5">
          <Section title="Finding Summary" helper="The original finding and current interpretation shown together for fast review.">
            <p className="text-sm leading-7 text-slate-300 sm:text-base">{finding.aiExplanation}</p>
            <div className="mt-4 rounded-lg bg-panelSoft p-4 text-sm leading-7 text-slate-300">
              <p className="font-medium text-slate-100">Original finding</p>
              <p className="mt-2">{finding.originalFinding}</p>
            </div>
            {finding.maskedPreview && (
              <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-danger">Sensitive Data - Restricted Preview</p>
                    <p className="mt-1 text-sm text-slate-300">{revealed ? finding.maskedPreview : 'Masked for Prototype'}</p>
                  </div>
                  <button onClick={() => { setWarning(true); storage.event('Sensitive reveal requested', `Reveal warning acknowledged for ${finding.id}.`, { findingId: finding.id }); show('Sensitive preview warning acknowledged.', 'warning'); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger"><Eye size={16} /> Reveal</button>
                </div>
                {warning && <div className="mt-3 rounded-lg bg-panel p-3 text-sm leading-6 text-slate-300">This prototype never reveals real sensitive data. <button onClick={() => { setRevealed(true); show('Simulated preview revealed.', 'warning'); }} className="ms-2 font-semibold text-signal">Confirm simulated reveal</button></div>}
              </div>
            )}
          </Section>

          <Section title="Source and Sector Context" helper="Why this finding reached the Ministry workflow and how it was routed.">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Source reliability" value={finding.reliability} />
              <Info label="Information credibility" value={finding.credibility} />
              <Info label="Previous source accuracy" value={`${finding.previousAccuracy}%`} />
              <Info label="Independent confirmation" value={finding.independentConfirmation ? 'Yes' : 'No'} />
              <Info label="Sample availability" value={finding.sampleAvailability} />
              <Info label="Verification status" value={finding.authenticity} />
            </dl>
            <div className="mt-4 rounded-lg bg-panelSoft p-4 text-sm leading-6 text-slate-300">{finding.sectorMatching}</div>
          </Section>

          <div className="grid gap-5 lg:grid-cols-2">
            <Section title="Evidence" helper="Evidence is simulated and must be validated by a human analyst.">
              <List items={finding.evidence} />
            </Section>
            <Section title="Detected Entities" helper="Local prototype extraction output.">
              <List items={finding.detectedEntities} />
            </Section>
          </div>

          <Section title="AI and Risk Explanation" helper="This is simulated explainable AI output, not a real model result.">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg bg-panelSoft p-4">
                <h3 className="font-semibold text-slate-100">AI explanation</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{finding.aiExplanation}</p>
              </div>
              <div className="rounded-lg bg-panelSoft p-4">
                <h3 className="font-semibold text-slate-100">Risk explanation</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{finding.riskExplanation}</p>
              </div>
            </div>
            <div className="mt-4">
              <ConfidenceBreakdown risk={risk} finalConfidence={finding.confidence} />
            </div>
          </Section>

          <Section title="Recommended Actions" helper="Suggested next steps for the analyst.">
            <List items={[finding.recommendedAction, finding.suggestedNextAction, ...finding.notDetected.map((item) => `Unknown: ${item}`)]} />
          </Section>

          <NotesSection
            notesSectionRef={notesSectionRef}
            notes={findingNotes}
            noteText={noteText}
            setNoteText={setNoteText}
            visibility={visibility}
            setVisibility={setVisibility}
            noteError={noteError}
            add={add}
            editingNoteId={editingNoteId}
            editText={editText}
            setEditText={setEditText}
            beginEdit={beginEdit}
            saveEdit={saveEdit}
            cancelEdit={() => { setEditingNoteId(null); setEditText(''); setNoteError(''); }}
            removeNote={removeNote}
            newNoteId={newNoteId}
          />

          <Section title="Status Timeline" helper="Newest workflow activity appears first.">
            {timeline.length ? <Timeline events={timeline} /> : <EmptyState title="No workflow activity has been recorded yet." detail="Status changes, assignments, notes, and case actions will appear here." />}
          </Section>

          <Section title="Audit Events" helper="Local browser audit records related to this finding.">
            {audit.length ? <Timeline events={audit} /> : <EmptyState title="No audit events for this finding yet." detail="Actions taken in this prototype will create local audit records." />}
          </Section>

          <div className="grid gap-5 lg:grid-cols-2">
            <Section title="Related Findings and Cases" helper="Links to connected local prototype records.">
              <div className="space-y-3">
                {relatedFindings.map((item) => <Link key={item.id} to={`/investigation/${item.id}`} className="block rounded-lg bg-panelSoft p-3 text-sm leading-6 text-slate-200 hover:bg-line">{item.id} - {item.category}</Link>)}
                {relatedCases.map((item) => <Link key={item.id} to={`/cases/${item.id}`} className="block rounded-lg bg-panelSoft p-3 text-sm leading-6 text-slate-200 hover:bg-line">{item.id} - {item.title}</Link>)}
                {!relatedFindings.length && !relatedCases.length && <EmptyState title="This finding is not currently linked to a case." detail="Use the workflow panel to add it to an existing case." />}
              </div>
            </Section>

            <Section title="Asset Context" helper="Registered mock assets associated with the current sector routing.">
              {assets.length ? <div className="space-y-3">{assets.slice(0, 4).map((asset) => <Info key={asset.id} label={`${asset.vendor} ${asset.product}`} value={`${asset.sectorName} - ${asset.owner} - ${asset.version}`} />)}</div> : <EmptyState title="No asset context available." detail="No mock asset is linked to the current sector selection." />}
            </Section>
          </div>
        </main>

        <aside className="investigation-workflow-panel space-y-5">
          <section className="rounded-lg border border-line bg-panel p-5">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-signal">Supporting Panel</p>
                <h2 className="mt-1 text-lg font-semibold">Risk and Workflow</h2>
              </div>
              <RiskScoreAnimation score={finding.confidence} risk={risk} />
              <div className="flex flex-wrap gap-2">
                <SeverityBadge severity={finding.severity} />
                <StatusBadge status={finding.status} />
              </div>
              <dl className="grid gap-3 text-sm">
                <Info label="Primary sector" value={finding.sectorName} />
                <Info label="Supporting sectors" value={finding.supportingSectors.join(', ') || 'No supporting sectors assigned'} />
                <Info label="Assigned analyst" value={finding.assignedAnalyst} />
                <Info label="Priority" value={finding.priority ?? 'P3'} />
                <Info label="Due date" value={finding.dueDate} />
                <Info label="Escalation status" value={finding.escalationLevel ?? 'None'} />
              </dl>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold">Current Workflow Status</h3>
              <WorkflowStepper status={finding.status} />
            </div>

            <div className="mt-5">
              <h3 className="font-semibold">Main Workflow Actions</h3>
              <div className="mt-4 space-y-4">
                <Control label="Change status">
                  <select value={finding.status} onChange={(event) => changeStatus(event.target.value as AlertStatus)} className="control-input">
                    {statuses.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Control>
                <Control label="Primary sector">
                  <select value={finding.primarySector} onChange={(event) => changePrimarySector(event.target.value as SectorId)} className="control-input">
                    {sectors.filter((sector) => sector.id !== 'multi-sector').map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
                  </select>
                </Control>
                <Control label="Add supporting sector">
                  <select defaultValue="" onChange={(event) => { if (event.target.value) { addSupportingSector(event.target.value as SectorId); event.currentTarget.value = ''; } }} className="control-input">
                    <option value="" disabled>Select sector</option>
                    {sectors.filter((sector) => !['admin', 'multi-sector', finding.primarySector].includes(sector.id)).map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
                  </select>
                </Control>
                <div>
                  <p className="text-sm text-slate-300">Supporting sectors</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {finding.supportingSectors.map((sector) => <button key={sector} onClick={() => removeSupportingSector(sector)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm text-slate-100">{sector} <X size={14} /></button>)}
                    {finding.supportingSectors.length === 0 && <p className="text-sm leading-6 text-slate-500">No supporting sectors have been assigned.</p>}
                  </div>
                </div>
                <Control label="Assigned analyst">
                  <select value={finding.assignedAnalyst} onChange={(event) => changeAnalyst(event.target.value)} className="control-input">
                    {analysts.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Control>
                <Control label="Priority">
                  <select value={finding.priority ?? 'P3'} onChange={(event) => changePriority(event.target.value as Priority)} className="control-input">
                    {priorities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Control>
                <Control label="Due date">
                  <input value={finding.dueDate} onChange={(event) => { updateFinding(finding.id, { dueDate: event.target.value }, 'Due date updated'); show('Due date updated.'); }} className="control-input" />
                </Control>
                <Control label="Add to case">
                  <div className="grid gap-2">
                    <select value={targetCaseId} onChange={(event) => setTargetCaseId(event.target.value)} className="control-input">
                      <option value="">Select case</option>
                      {availableCases.map((item) => <option key={item.id} value={item.id}>{item.id} - {item.title}</option>)}
                    </select>
                    <button onClick={addToCase} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Add to Case</button>
                  </div>
                </Control>
                <div className="grid gap-2">
                  <button onClick={closeFinding} className="min-h-11 rounded-lg bg-signal px-3 py-2 text-sm font-semibold text-graphite">Close finding</button>
                  <button onClick={reopenFinding} className="min-h-11 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100">Reopen / Investigate</button>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function FeedbackToast({ feedback, onClose }: { feedback: NonNullable<Feedback>; onClose: () => void }) {
  const tone = feedback.tone === 'error' ? 'border-danger/50 bg-danger/15 text-danger' : feedback.tone === 'warning' ? 'border-amber/50 bg-amber/15 text-amber' : 'border-signal/50 bg-signal/15 text-signal';
  return (
    <div className={`fixed right-4 top-20 z-50 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-glow ${tone}`}>
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      <p className="leading-5">{feedback.message}</p>
      <button onClick={onClose} className="ms-2 text-slate-300"><X size={16} /></button>
    </div>
  );
}

function Section({ title, helper, children }: { title: string; helper: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <div>
        <h2 className="text-lg font-semibold leading-6">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">{helper}</p>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function NotesSection(props: {
  notesSectionRef: MutableRefObject<HTMLElement | null>;
  notes: AnalystNote[];
  noteText: string;
  setNoteText: (value: string) => void;
  visibility: 'Ministry Internal' | 'Shared With Assigned Sectors';
  setVisibility: (value: 'Ministry Internal' | 'Shared With Assigned Sectors') => void;
  noteError: string;
  add: () => void;
  editingNoteId: string | null;
  editText: string;
  setEditText: (value: string) => void;
  beginEdit: (note: AnalystNote) => void;
  saveEdit: (noteId: string) => void;
  cancelEdit: () => void;
  removeNote: (noteId: string) => void;
  newNoteId: string | null;
}) {
  return (
    <section ref={props.notesSectionRef} className="rounded-lg border border-line bg-panel p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold leading-6">Analyst Notes</h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">{props.notes.length} note{props.notes.length === 1 ? '' : 's'} recorded for this finding.</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {props.notes.length === 0 && <EmptyState title="No analyst notes have been added yet." detail="Add the first note using the form below." />}
        {props.notes.map((note) => (
          <article id={note.id} key={note.id} className={`rounded-lg border border-line bg-panelSoft p-4 ${props.newNoteId === note.id ? 'ring-1 ring-signal/70' : ''}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="text-sm leading-6">
                <p className="font-semibold text-slate-100">{note.author}</p>
                <p className="text-slate-500">{note.createdAt} - {note.visibility}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => props.beginEdit(note)} className="min-h-10 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-slate-100">Edit</button>
                <button onClick={() => props.removeNote(note.id)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
            {props.editingNoteId === note.id ? (
              <div className="mt-3 space-y-3">
                <textarea className="min-h-32 w-full rounded-lg border border-line bg-panel p-3 text-base leading-6 text-slate-200 outline-none focus:border-signal" value={props.editText} onChange={(event) => props.setEditText(event.target.value)} />
                <div className="grid gap-2 sm:flex sm:flex-wrap">
                  <button onClick={() => props.saveEdit(note.id)} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Save note</button>
                  <button onClick={props.cancelEdit} className="min-h-11 rounded-lg border border-line bg-panel px-4 py-2 text-sm text-slate-100">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300 sm:text-base">{note.text}</p>
            )}
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-line bg-panelSoft p-4">
        <label className="block text-sm font-medium text-slate-200">Add analyst note</label>
        <textarea value={props.noteText} onChange={(event) => props.setNoteText(event.target.value)} className="mt-2 min-h-36 w-full resize-y rounded-lg border border-line bg-panel p-3 text-base leading-6 text-slate-200 outline-none focus:border-signal" placeholder="Record verification result, assignment rationale, or next action..." />
        <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{props.noteText.length} characters</span>
          {props.noteError && <span className="text-danger">{props.noteError}</span>}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,16rem)_auto]">
          <select value={props.visibility} onChange={(event) => props.setVisibility(event.target.value as typeof props.visibility)} className="control-input">
            <option>Ministry Internal</option>
            <option>Shared With Assigned Sectors</option>
          </select>
          <button onClick={props.add} className="min-h-11 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Add Note</button>
        </div>
      </div>
    </section>
  );
}

function HeaderItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-semibold leading-6 text-slate-100">{value}</dd></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 leading-6 text-slate-200">{value}</dd></div>;
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm text-slate-300">{label}<div className="mt-2">{children}</div></label>;
}

function List({ items }: { items: string[] }) {
  return <ul className="space-y-2 text-sm leading-6 text-slate-300">{items.map((item) => <li key={item} className="rounded-lg bg-panelSoft p-3">- {item}</li>)}</ul>;
}

function WorkflowStepper({ status }: { status: AlertStatus }) {
  const steps: AlertStatus[] = ['Collected', 'Normalizing', 'Entity Extraction', 'Sector Classification', 'Risk Assessment', 'Verification Required', 'Assigned', 'Investigating', 'Resolved', 'Closed'];
  const normalized = status === 'New' ? 'Collected' : status === 'Overdue' ? 'Verification Required' : status;
  const currentIndex = Math.max(0, steps.indexOf(normalized));
  return (
    <ol className="mt-3 space-y-2">
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'Completed' : index === currentIndex ? 'Current' : 'Remaining';
        return (
          <li key={step} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 text-sm">
            <span className={`mt-1 grid h-5 w-5 place-items-center rounded-full border text-[0.65rem] ${state === 'Completed' ? 'border-signal bg-signal text-graphite' : state === 'Current' ? 'border-signal text-signal' : 'border-line text-slate-500'}`}>{index + 1}</span>
            <div className="min-w-0">
              <p className={state === 'Current' ? 'font-semibold text-signal' : state === 'Completed' ? 'text-slate-200' : 'text-slate-500'}>{step}</p>
              <p className="text-xs text-slate-600">{state}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Timeline({ events }: { events: Array<{ id: string; date: string; time: string; user?: string; action: string; description: string; previousValue?: string; newValue?: string }> }) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <article key={event.id} className="grid gap-3 rounded-lg bg-panelSoft p-3 text-sm sm:grid-cols-[minmax(7rem,9rem)_minmax(0,1fr)]">
          <div className="leading-6 text-slate-500">{event.date}<br />{event.time}</div>
          <div>
            <p className="font-medium text-slate-100">{event.action}</p>
            <p className="mt-1 leading-6 text-slate-400">{event.description}</p>
            <p className="mt-1 leading-5 text-slate-500">{event.user ?? 'Ministry Analyst'} - {event.previousValue ?? '-'} -&gt; {event.newValue ?? '-'}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-lg border border-dashed border-line bg-panel/60 p-4 text-sm leading-6 text-slate-400"><p className="font-semibold text-slate-200">{title}</p><p className="mt-1">{detail}</p></div>;
}

function NotFound({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-8 text-center">
      <AlertTriangle className="mx-auto text-danger" />
      <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-slate-400">{detail}</p>
      <Link to="/alerts" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Back to Findings</Link>
    </div>
  );
}
