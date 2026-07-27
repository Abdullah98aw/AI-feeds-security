import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, VolumeX, X } from 'lucide-react';
import { sectors } from '../data/ministryData';
import { usePrototype } from '../state/AlertStatusContext';

export function LiveSimulationToasts() {
  const { liveToasts, settings, dismissLiveToast, setLiveToastsMuted, simulation } = usePrototype();

  useEffect(() => {
    if (liveToasts.length === 0) return undefined;
    const timeout = window.setTimeout(() => dismissLiveToast(liveToasts[liveToasts.length - 1].id), Math.max(3, settings.notificationDuration) * 1000);
    return () => window.clearTimeout(timeout);
  }, [dismissLiveToast, liveToasts, settings.notificationDuration]);

  if (liveToasts.length === 0) return null;

  return (
    <div className="fixed inset-x-3 top-20 z-50 mx-auto grid max-w-md gap-2 sm:inset-x-auto sm:right-4 sm:top-24 sm:w-[24rem]" aria-live="polite">
      {liveToasts.map((toast) => (
        <article key={toast.id} className="rounded-lg border border-signal/35 bg-panel/95 p-3 text-sm shadow-glow backdrop-blur">
          <div className="flex items-start gap-3">
            <Bell className="mt-1 shrink-0 text-signal" size={18} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[0.7rem] font-semibold text-signal">Simulated Live Intelligence Event</span>
                <span className="rounded-full bg-panelSoft px-2 py-0.5 text-[0.7rem] text-slate-300">{toast.severity}</span>
              </div>
              <h2 className="mt-2 break-words font-semibold leading-5 text-slate-100">{toast.title}</h2>
              <p className="mt-1 leading-5 text-slate-400">{toast.sectorName} - {toast.source} - {toast.time}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {toast.findingId && <Link to={`/investigation/${toast.findingId}`} className="inline-flex min-h-9 items-center rounded-lg bg-signal px-3 py-1.5 text-xs font-semibold text-graphite">Open Finding</Link>}
                <button onClick={() => dismissLiveToast(toast.id)} className="inline-flex min-h-9 items-center rounded-lg border border-line bg-panelSoft px-3 py-1.5 text-xs text-slate-100">Dismiss</button>
                <button onClick={() => setLiveToastsMuted(true)} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-line bg-panelSoft px-3 py-1.5 text-xs text-slate-100"><VolumeX size={13} /> Mute</button>
              </div>
            </div>
            <button onClick={() => dismissLiveToast(toast.id)} className="shrink-0 text-slate-500 hover:text-slate-100" aria-label="Dismiss simulated event toast"><X size={16} /></button>
          </div>
        </article>
      ))}
      {simulation.muted && (
        <button onClick={() => setLiveToastsMuted(false)} className="justify-self-end rounded-lg border border-line bg-panel px-3 py-2 text-xs text-slate-200">
          Toasts muted for {sectors.find((sector) => sector.id === 'admin')?.shortName ?? 'Ministry'} demo - unmute
        </button>
      )}
    </div>
  );
}
