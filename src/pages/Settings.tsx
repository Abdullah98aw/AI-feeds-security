import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { sectors } from '../data/ministryData';
import { usePrototype } from '../state/AlertStatusContext';
import type { PrototypeSettings, SectorId, Severity } from '../types';

export default function Settings() {
  const { settings, updateSettings, resetDemoData, simulation, simulationNow, startSimulation, pauseSimulation, resumeSimulation, stopSimulation, restartSimulation, clearSimulatedNotifications, setLiveToastsMuted } = usePrototype();
  const [draft, setDraft] = useState<PrototypeSettings>(settings);
  const [message, setMessage] = useState('');
  const remainingMs = simulation.status === 'Running' && simulation.startedAt
    ? Math.max(0, simulation.startedAt + simulation.durationMs - simulationNow)
    : simulation.status === 'Paused'
      ? simulation.pausedRemainingMs ?? simulation.durationMs
      : simulation.status === 'Completed'
        ? 0
        : simulation.durationMs;
  const nextEventMs = simulation.status === 'Running' && simulation.nextEventAt ? Math.max(0, simulation.nextEventAt - simulationNow) : simulation.pausedNextEventMs;
  return (
    <div className="space-y-5">
      <div><p className="text-sm uppercase tracking-[0.18em] text-signal">Settings</p><h1 className="mt-2 text-3xl font-semibold">Prototype behavior and presentation mode</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Configure language, simulation speed, notification duration, dashboard defaults, and demo reset behavior. Settings persist in localStorage.</p></div>
      {message && <p className="rounded-lg border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-signal">{message}</p>}
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Local settings">
          <Field label="Language"><select value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value as PrototypeSettings['language'] })}><option value="en">English</option><option value="ar">Arabic</option></select></Field>
          <Field label="Notification duration"><input type="number" value={draft.notificationDuration} onChange={(event) => setDraft({ ...draft, notificationDuration: Number(event.target.value) })} /></Field>
          <Field label="Simulation speed"><select value={draft.simulationSpeed} onChange={(event) => setDraft({ ...draft, simulationSpeed: event.target.value as PrototypeSettings['simulationSpeed'] })}><option>Slow</option><option>Normal</option><option>Fast</option></select></Field>
          <Field label="Default date range"><input value={draft.defaultDateRange} onChange={(event) => setDraft({ ...draft, defaultDateRange: event.target.value })} /></Field>
          <Field label="Default sector"><select value={draft.defaultSector} onChange={(event) => setDraft({ ...draft, defaultSector: event.target.value as SectorId | 'all' })}><option value="all">All sectors</option>{sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}</select></Field>
          <Field label="Risk threshold"><select value={draft.riskThreshold} onChange={(event) => setDraft({ ...draft, riskThreshold: event.target.value as Severity })}>{['Informational', 'Low', 'Medium', 'High', 'Critical'].map((item) => <option key={item}>{item}</option>)}</select></Field>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={draft.liveSimulation} onChange={(event) => setDraft({ ...draft, liveSimulation: event.target.checked })} /> Enable live simulation controls</label>
          <button onClick={() => { updateSettings(draft); setMessage('Settings updated successfully.'); }} className="mt-4 min-h-11 w-full rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite sm:w-auto">Save settings</button>
        </Panel>
        <Panel title="Controlled Live Threat Simulation">
          <div className="rounded-lg border border-signal/30 bg-signal/10 p-3 text-sm leading-6 text-slate-200">
            Simulated Live Intelligence Event controls are frontend-only. They do not connect to real Ministry systems, real dark web sources, or a backend.
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <StatusItem label="Status" value={simulation.status} />
            <StatusItem label="Remaining time" value={formatDuration(remainingMs)} />
            <StatusItem label="Generated events" value={String(simulation.generatedCount)} />
            <StatusItem label="Next event countdown" value={simulation.status === 'Running' ? formatDuration(nextEventMs ?? 0) : 'Not running'} />
          </dl>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <button disabled={simulation.status === 'Running'} onClick={() => { startSimulation(); setMessage('Live simulation started.'); }} className="control-button-primary disabled:cursor-not-allowed disabled:opacity-50">Start Live Simulation</button>
            <button disabled={simulation.status !== 'Running'} onClick={() => { pauseSimulation(); setMessage('Live simulation paused.'); }} className="control-button">Pause</button>
            <button disabled={simulation.status !== 'Paused'} onClick={() => { resumeSimulation(); setMessage('Live simulation resumed.'); }} className="control-button">Resume</button>
            <button disabled={!['Running', 'Paused'].includes(simulation.status)} onClick={() => { stopSimulation(); setMessage('Live simulation stopped.'); }} className="control-button">Stop</button>
            <button onClick={() => { restartSimulation(); setMessage('Live simulation restarted from the configured duration.'); }} className="control-button">Restart</button>
            <button onClick={() => { clearSimulatedNotifications(); setMessage('Simulated notifications cleared.'); }} className="control-button">Clear Simulated Notifications</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Event interval seconds"><input type="number" min={5} max={60} value={draft.liveSimulationSettings.eventIntervalSeconds} onChange={(event) => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, eventIntervalSeconds: Number(event.target.value) } })} /></Field>
            <Field label="Duration minutes"><input type="number" min={1} max={30} value={draft.liveSimulationSettings.durationMinutes} onChange={(event) => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, durationMinutes: Number(event.target.value) } })} /></Field>
            <Field label="Severity mix"><select value={draft.liveSimulationSettings.severityMix} onChange={(event) => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, severityMix: event.target.value as PrototypeSettings['liveSimulationSettings']['severityMix'] } })}><option>Balanced</option><option>High Priority</option><option>Lower Noise</option></select></Field>
            <Field label="Sector mix"><select value={draft.liveSimulationSettings.sectorMix} onChange={(event) => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, sectorMix: event.target.value as PrototypeSettings['liveSimulationSettings']['sectorMix'] } })}><option>Balanced</option><option>Operational Sectors</option><option>Technical Exposure</option></select></Field>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle label="Toast enabled" checked={draft.liveSimulationSettings.toastEnabled} onChange={(checked) => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, toastEnabled: checked } })} />
            <Toggle label="Sound disabled" checked={!draft.liveSimulationSettings.soundEnabled} onChange={() => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, soundEnabled: false } })} />
            <Toggle label="Auto-create findings" checked={draft.liveSimulationSettings.autoCreateFindings} onChange={(checked) => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, autoCreateFindings: checked } })} />
            <Toggle label="Auto-create audit events" checked={draft.liveSimulationSettings.autoCreateAuditEvents} onChange={(checked) => setDraft({ ...draft, liveSimulationSettings: { ...draft.liveSimulationSettings, autoCreateAuditEvents: checked } })} />
          </div>
          <button onClick={() => setLiveToastsMuted(!simulation.muted)} className="control-button">{simulation.muted ? 'Unmute Toast Popups' : 'Mute Toast Popups'}</button>
          <button onClick={() => { updateSettings(draft); setMessage('Simulation settings saved. New runs use these values.'); }} className="control-button-primary">Save Simulation Settings</button>
          <button onClick={() => { if (window.confirm('Reset demo data to the original mock dataset?')) { resetDemoData(); setDraft(settings); setMessage('Demo data reset.'); } }} className="control-button">Reset Demo Data</button>
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-lg border border-line bg-panel p-5"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-4 space-y-3">{children}</div></section>; }
function Field({ label, children }: { label: string; children: ReactElement }) { return <label className="block text-sm text-slate-300">{label}<div className="mt-2 [&>input]:min-h-11 [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-line [&>input]:bg-panelSoft [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>select]:min-h-11 [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-line [&>select]:bg-panelSoft [&>select]:px-3 [&>select]:py-2 [&>select]:text-sm">{children}</div></label>; }
function StatusItem({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-panelSoft p-3"><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 text-lg font-semibold text-slate-100">{value}</dd></div>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex min-h-11 items-center gap-2 rounded-lg bg-panelSoft px-3 py-2 text-sm text-slate-300"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /> {label}</label>; }
function formatDuration(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
