import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function KpiCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
  const numeric = Number(value.replace(/[^\d.]/g, ''));
  const suffix = value.replace(/[\d.]/g, '');
  const [display, setDisplay] = useState(Number.isFinite(numeric) ? 0 : value);

  useEffect(() => {
    if (!Number.isFinite(numeric)) {
      setDisplay(value);
      return;
    }

    const duration = 650;
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(numeric * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [numeric, value]);

  return (
    <section className="h-full rounded-2xl border border-line bg-panel p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-signal">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-slate-300">{label}</p>
          <p className="mt-2 text-3xl font-semibold leading-tight text-slate-100">{display}{Number.isFinite(numeric) ? suffix : ''}</p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-low-background)] text-[var(--color-low-text)]">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-5 text-slate-400">{detail}</p>
    </section>
  );
}
