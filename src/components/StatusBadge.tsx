import type { AlertStatus } from '../types';

const colors: Record<AlertStatus, string> = {
  New: 'bg-sky-400/10 text-sky-300',
  'Verification Required': 'bg-danger/10 text-danger',
  Assigned: 'bg-critical/15 text-fuchsia-200',
  Investigating: 'bg-amber/10 text-amber',
  Resolved: 'bg-emerald-400/10 text-emerald-300',
  Closed: 'bg-emerald-400/10 text-emerald-300',
  Overdue: 'bg-danger/15 text-danger',
  Collected: 'bg-sky-400/10 text-sky-300',
  Normalizing: 'bg-sky-400/10 text-sky-300',
  'Entity Extraction': 'bg-signal/10 text-signal',
  'Sector Classification': 'bg-signal/10 text-signal',
  'Risk Assessment': 'bg-amber/10 text-amber'
};

export function StatusBadge({ status }: { status: AlertStatus }) {
  return <span className={`inline-flex max-w-full items-center rounded-full px-3 py-1.5 text-[0.78rem] font-medium leading-snug whitespace-normal break-words ${colors[status]}`}>{status}</span>;
}
