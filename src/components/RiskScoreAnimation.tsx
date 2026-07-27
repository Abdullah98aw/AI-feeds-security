import { useEffect, useState } from 'react';
import type { RiskFactor } from '../types';

export function RiskScoreAnimation({ score, risk }: { score: number; risk?: RiskFactor }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(score);
      return undefined;
    }
    const steps = [0, Math.round(score * 0.19), Math.round(score * 0.44), Math.round(score * 0.74), score];
    setValue(0);
    const timers = steps.map((step, index) => window.setTimeout(() => setValue(step), index * 420));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [score]);

  const level = score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 50 ? 'Medium' : 'Low';
  const factors = risk?.factors.slice(0, 3) ?? [
    { label: 'Confidence', contribution: score, detail: 'Final confidence score from the finding.' },
    { label: 'Sector relevance', contribution: Math.min(95, score + 5), detail: 'Routed sector relevance from simulated indicators.' },
    { label: 'Unknowns', contribution: 100 - score, detail: 'Unverified authenticity keeps uncertainty visible.' }
  ];

  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm text-slate-400">Animated risk score</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-5xl font-semibold text-signal transition-all duration-500">{value}%</p>
        <div className="flex h-24 w-5 items-end rounded-full bg-panelSoft">
          <div className="mt-auto w-full rounded-full bg-signal transition-all duration-500" style={{ height: `${value}%` }} />
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="rounded-lg bg-panelSoft p-3">
          <dt className="text-slate-500">Risk level</dt>
          <dd className="mt-1 font-semibold text-slate-100">{level}</dd>
        </div>
        <div className="rounded-lg bg-panelSoft p-3">
          <dt className="text-slate-500">Confidence</dt>
          <dd className="mt-1 font-semibold text-slate-100">{score}%</dd>
        </div>
      </div>
      <details className="mt-4 rounded-lg bg-panelSoft p-3 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-100">Main contributing factors</summary>
        <div className="mt-3 space-y-3">
          {factors.map((factor) => (
            <div key={factor.label}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-200">{factor.label}</p>
                <span className="text-slate-400">{factor.contribution}%</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{factor.detail}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
