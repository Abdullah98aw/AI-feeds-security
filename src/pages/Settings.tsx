import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { sectors } from '../data/ministryData';
import { usePrototype } from '../state/AlertStatusContext';
import type { PrototypeSettings, SectorId, Severity } from '../types';

export default function Settings() {
  const { settings, updateSettings, resetDemoData } = usePrototype();
  const [draft, setDraft] = useState<PrototypeSettings>(settings);
  return (
    <div className="space-y-5">
      <div><p className="text-sm uppercase tracking-[0.18em] text-signal">Settings</p><h1 className="mt-2 text-3xl font-semibold">Prototype behavior and presentation mode</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Configure language, simulation speed, notification duration, dashboard defaults, and demo reset behavior. Settings persist in localStorage.</p></div>
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Local settings">
          <Field label="Language"><select value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value as PrototypeSettings['language'] })}><option value="en">English</option><option value="ar">Arabic</option></select></Field>
          <Field label="Notification duration"><input type="number" value={draft.notificationDuration} onChange={(event) => setDraft({ ...draft, notificationDuration: Number(event.target.value) })} /></Field>
          <Field label="Simulation speed"><select value={draft.simulationSpeed} onChange={(event) => setDraft({ ...draft, simulationSpeed: event.target.value as PrototypeSettings['simulationSpeed'] })}><option>Slow</option><option>Normal</option><option>Fast</option></select></Field>
          <Field label="Default date range"><input value={draft.defaultDateRange} onChange={(event) => setDraft({ ...draft, defaultDateRange: event.target.value })} /></Field>
          <Field label="Default sector"><select value={draft.defaultSector} onChange={(event) => setDraft({ ...draft, defaultSector: event.target.value as SectorId | 'all' })}><option value="all">All sectors</option>{sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}</select></Field>
          <Field label="Risk threshold"><select value={draft.riskThreshold} onChange={(event) => setDraft({ ...draft, riskThreshold: event.target.value as Severity })}>{['Informational', 'Low', 'Medium', 'High', 'Critical'].map((item) => <option key={item}>{item}</option>)}</select></Field>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={draft.liveSimulation} onChange={(event) => setDraft({ ...draft, liveSimulation: event.target.checked })} /> Enable live simulation</label>
          <button onClick={() => updateSettings(draft)} className="mt-4 min-h-11 w-full rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite sm:w-auto">Save settings</button>
        </Panel>
        <Panel title="Presentation Mode">
          {['Scenario 1: Vulnerability matched to Civil Defense asset', 'Scenario 2: Claimed inmate data leak assigned to Prisons', 'Scenario 3: Border route smuggling assigned to Border Guard and Narcotics'].map((item) => <div key={item} className="rounded-lg bg-panelSoft p-3 text-sm text-slate-200">{item}</div>)}
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {['Start Scenario', 'Pause', 'Resume', 'Restart', 'Inject Next Finding', 'Reset Demo Data'].map((item) => <button key={item} onClick={item === 'Reset Demo Data' ? resetDemoData : undefined} className="min-h-11 rounded-lg border border-line bg-panelSoft px-3 py-2 text-sm leading-5 text-slate-100 hover:border-signal">{item}</button>)}
          </div>
          <p className="mt-4 text-sm text-slate-400">Scenario controls are local prototype controls; they do not connect to real feeds or real AI processing.</p>
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-lg border border-line bg-panel p-5"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-4 space-y-3">{children}</div></section>; }
function Field({ label, children }: { label: string; children: ReactElement }) { return <label className="block text-sm text-slate-300">{label}<div className="mt-2 [&>input]:min-h-11 [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-line [&>input]:bg-panelSoft [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>select]:min-h-11 [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-line [&>select]:bg-panelSoft [&>select]:px-3 [&>select]:py-2 [&>select]:text-sm">{children}</div></label>; }
