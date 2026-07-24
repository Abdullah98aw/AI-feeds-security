import { useEffect, useState } from 'react';

export function RiskScoreAnimation({ score }: { score: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const steps = [0, Math.round(score * 0.19), Math.round(score * 0.44), Math.round(score * 0.74), score];
    setValue(0);
    const timers = steps.map((step, index) => window.setTimeout(() => setValue(step), index * 420));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [score]);

  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm text-slate-400">Animated risk score</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-5xl font-semibold text-signal transition-all duration-500">{value}%</p>
        <div className="flex h-24 w-5 items-end rounded-full bg-panelSoft">
          <div className="mt-auto w-full rounded-full bg-signal transition-all duration-500" style={{ height: `${value}%` }} />
        </div>
      </div>
    </div>
  );
}
