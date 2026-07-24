import type { RiskFactor } from '../types';

export function ConfidenceBreakdown({ risk, finalConfidence }: { risk?: RiskFactor; finalConfidence: number }) {
  const factors = risk?.factors ?? [];
  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <h2 className="text-lg font-semibold">Confidence breakdown</h2>
      <div className="mt-5 space-y-4">
        {factors.map((factor) => (
          <div key={factor.label} className="grid grid-cols-[1fr_3rem] items-center gap-3 text-sm">
            <span className="text-slate-300">{factor.label}</span>
            <span className="text-right font-semibold text-signal">{factor.contribution}%</span>
            <div className="col-span-2 h-2 rounded-full bg-panelSoft">
              <div className="h-2 rounded-full bg-signal transition-all duration-700" style={{ width: `${factor.contribution}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-lg bg-signal/10 px-4 py-3">
        <span className="font-medium text-slate-100">Final Confidence</span>
        <span className="text-2xl font-semibold text-signal">{finalConfidence}%</span>
      </div>
    </section>
  );
}
