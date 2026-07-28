import type { Severity } from '../types';

const colors: Record<Severity, string> = {
  Informational: 'border-line bg-panelSoft text-slate-300',
  Low: 'border-[color:var(--color-low-background)] bg-[var(--color-low-background)] text-[var(--color-low-text)]',
  Medium: 'border-[color:var(--color-medium-background)] bg-[var(--color-medium-background)] text-[var(--color-medium-text)]',
  High: 'border-[color:var(--color-high-background)] bg-[var(--color-high-background)] text-[var(--color-high-text)]',
  Critical: 'border-[color:var(--color-critical-background)] bg-[var(--color-critical-background)] text-[var(--color-critical-text)]'
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-[0.78rem] font-semibold leading-snug whitespace-normal break-words ${colors[severity]}`}>{severity}</span>;
}
