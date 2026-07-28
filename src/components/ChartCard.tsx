export function BarChartCard({ title, data }: { title: string; data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <section className="min-w-0 rounded-2xl border border-line bg-panel p-5 shadow-sm">
      <h2 className="text-lg font-semibold leading-6 text-slate-100">{title}</h2>
      <div className="mt-5 space-y-4">
        {data.map((item) => (
          <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-3 text-sm sm:grid-cols-[minmax(8rem,11rem)_minmax(5rem,1fr)_2.5rem]">
            <span className="min-w-0 leading-5 text-slate-300">{item.label}</span>
            <div className="h-2 rounded-full bg-panelSoft">
              <div className="h-2 rounded-full bg-signal" style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
            <span className="text-right font-semibold text-slate-100">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrendChartCard({ title, data }: { title: string; data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * 300;
    const y = 110 - (item.value / max) * 92;
    return `${x},${y}`;
  });

  return (
    <section className="min-w-0 rounded-2xl border border-line bg-panel p-5 shadow-sm">
      <h2 className="text-lg font-semibold leading-6 text-slate-100">{title}</h2>
      <svg viewBox="0 0 300 140" className="mt-4 min-h-44 w-full overflow-visible">
        <polyline fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" points={points.join(' ')} />
        {data.map((item, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 300;
          const y = 110 - (item.value / max) * 92;
          return (
            <g key={item.label}>
              <circle cx={x} cy={y} r="4" fill="var(--color-primary)" />
              <text x={x} y="134" textAnchor="middle" className="fill-[var(--color-text-muted)] text-[11px]">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
