import type { Severity } from '../types';

const order: Severity[] = ['Low', 'Medium', 'High', 'Critical'];

export function ThreatTimeline({ current }: { current: Severity }) {
  const currentIndex = order.indexOf(current);
  return (
    <section className="rounded-lg border border-line bg-panel p-4">
      <h2 className="text-sm font-semibold text-slate-100">Threat progression</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {order.map((level, index) => (
          <div key={level} className={`min-w-0 rounded-lg border px-2 py-3 text-center text-xs transition ${index <= currentIndex ? 'border-signal/40 bg-signal/10 text-signal' : 'border-line bg-panelSoft text-slate-400'}`}>
            <p className="font-semibold">{level}</p>
            <p className="mt-1">T+{index * 8}s</p>
          </div>
        ))}
      </div>
    </section>
  );
}
