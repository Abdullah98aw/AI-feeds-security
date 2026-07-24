export function HeatMap({ data }: { data: Array<{ region: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="min-w-0 rounded-lg border border-line bg-panel p-5">
      <h2 className="text-base font-semibold leading-6 text-slate-100">Fictional Heat Map</h2>
      <p className="mt-1 text-sm leading-5 text-slate-500">Abstract regions only, no real geography.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {data.map((item) => {
          const strength = item.value / max;
          return (
            <div
              key={item.region}
              className="min-w-0 rounded-lg border border-line p-4 transition duration-500"
              style={{ background: `rgba(80, 227, 194, ${0.08 + strength * 0.28})` }}
            >
              <p className="text-sm font-semibold leading-5">{item.region}</p>
              <p className="mt-3 text-2xl font-semibold text-signal">{item.value}</p>
              <p className="text-xs text-slate-500">simulated alerts</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
