import type { Severity } from '../types';

const colors: Record<Severity, string> = {
  Informational: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
  Low: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  Medium: 'border-amber/30 bg-amber/10 text-amber',
  High: 'border-danger/30 bg-danger/10 text-danger',
  Critical: 'border-critical/40 bg-critical/15 text-fuchsia-200'
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-[0.78rem] font-semibold leading-snug whitespace-normal break-words ${colors[severity]}`}>{severity}</span>;
}
