import { Link } from 'react-router-dom';
import { ChevronDown, ImageIcon, MessageCircle, Repeat2, ThumbsUp } from 'lucide-react';
import type { Alert, Post } from '../types';
import { mockAccounts } from '../data/mockAccounts';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';

function formatDetectedAgo(detectedAt?: number) {
  if (!detectedAt) {
    return 'Collected before live session';
  }

  const seconds = Math.max(0, Math.floor((Date.now() - detectedAt) / 1000));
  if (seconds < 5) {
    return 'Collected just now';
  }
  if (seconds < 60) {
    return `Collected ${seconds} seconds ago`;
  }
  return `Collected ${Math.floor(seconds / 60)} minutes ago`;
}

export function PostCard({ post, alert, detectedAt, isNew = false }: { post: Post; alert: Alert; detectedAt?: number; isNew?: boolean }) {
  const account = mockAccounts.find((item) => item.id === post.accountId)!;
  const sector = alert.sectorName;
  const isArabic = post.language === 'Arabic';

  return (
    <article className={`rounded-2xl border border-line bg-panel p-5 shadow-sm transition duration-300 hover:border-signal ${isNew ? 'animate-feed-in ring-1 ring-signal/30' : ''}`}>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-low-background)] text-sm font-bold text-[var(--color-low-text)]">{account.avatarInitials}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="min-w-0 text-lg font-semibold leading-6 text-slate-100">{alert.category}</h3>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={post.severity} />
            <StatusBadge status={alert.status} />
            <span className="inline-flex max-w-full rounded-full bg-[var(--color-low-background)] px-3 py-1.5 text-[0.78rem] font-semibold leading-snug text-[var(--color-low-text)]">{post.confidence}% confidence</span>
          </div>
          <p className={`mt-3 text-base leading-7 text-slate-100 ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
            {post.text}
          </p>
          <div className="mt-4 grid gap-2 text-sm leading-5 text-slate-300 sm:grid-cols-3">
            <span className="inline-flex min-w-0 items-center gap-2"><Repeat2 size={14} className="shrink-0 text-signal" /> {sector}</span>
            <span className="inline-flex min-w-0 items-center gap-2"><MessageCircle size={14} className="shrink-0 text-signal" /> {alert.source}</span>
            <span className="inline-flex min-w-0 items-center gap-2"><ThumbsUp size={14} className="shrink-0 text-signal" /> {alert.confidence}% confidence</span>
          </div>
          {post.imageLabel && (
            <div className="mt-4 flex min-h-32 items-center gap-3 rounded-xl border border-dashed border-line bg-panelSoft p-4 text-sm text-slate-300">
              <ImageIcon size={22} className="text-signal" />
              <span>{post.imageLabel}</span>
            </div>
          )}
          <details className="mt-4 rounded-xl border border-line bg-panelSoft px-3 py-2 text-sm text-slate-300">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-signal">
              More details
              <ChevronDown size={16} />
            </summary>
            <div className="grid gap-2 pb-2 pt-3 sm:grid-cols-2">
              <span>Account: {account.username}</span>
              <span>Collected: {alert.collectionTime}</span>
              <span>First observed: {alert.firstObserved}</span>
              <span>Last update: {alert.lastUpdate}</span>
              <span>Analyst: {alert.assignedAnalyst}</span>
              <span>Authenticity: {alert.authenticity}</span>
              <span>{formatDetectedAgo(detectedAt)}</span>
            </div>
          </details>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-signal px-4 py-2 text-center text-sm font-semibold leading-5 text-graphite hover:bg-[var(--color-primary-hover)] sm:w-auto" to={`/investigation/${alert.id}`}>
          Open Investigation
        </Link>
      </div>
    </article>
  );
}
