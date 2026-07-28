import type { AlertStatus } from '../types';

const colors: Record<AlertStatus, string> = {
  New: 'bg-[var(--color-unassigned-background)] text-[var(--color-unassigned-text)]',
  'Verification Required': 'bg-[var(--color-medium-background)] text-[var(--color-medium-text)]',
  Assigned: 'bg-[var(--color-success-background)] text-[var(--color-success-text)]',
  Investigating: 'bg-[var(--color-investigating-background)] text-[var(--color-investigating-text)]',
  Resolved: 'bg-[var(--color-success-background)] text-[var(--color-success-text)]',
  Closed: 'bg-[var(--color-success-background)] text-[var(--color-success-text)]',
  Overdue: 'bg-[var(--color-critical-background)] text-[var(--color-critical-text)]',
  Collected: 'bg-[var(--color-investigating-background)] text-[var(--color-investigating-text)]',
  Normalizing: 'bg-[var(--color-investigating-background)] text-[var(--color-investigating-text)]',
  'Entity Extraction': 'bg-[var(--color-low-background)] text-[var(--color-low-text)]',
  'Sector Classification': 'bg-[var(--color-low-background)] text-[var(--color-low-text)]',
  'Risk Assessment': 'bg-[var(--color-medium-background)] text-[var(--color-medium-text)]'
};

export function StatusBadge({ status }: { status: AlertStatus }) {
  return <span className={`inline-flex max-w-full items-center rounded-full px-3 py-1.5 text-[0.78rem] font-medium leading-snug whitespace-normal break-words ${colors[status]}`}>{status}</span>;
}
