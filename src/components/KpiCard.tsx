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
    <section className="h-full rounded-lg border border-line bg-panel/90 p-4 shadow-glow transition duration-300 hover:-translate-y-0.5 hover:border-signal/40">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm leading-5 text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{display}{Number.isFinite(numeric) ? suffix : ''}</p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-500">{detail}</p>
    </section>
  );
}
