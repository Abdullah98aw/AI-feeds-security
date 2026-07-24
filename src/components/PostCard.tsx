import { Link } from 'react-router-dom';
import { Eye, ImageIcon, MessageCircle, Repeat2, ThumbsUp } from 'lucide-react';
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
    <article className={`rounded-lg border border-line bg-panel/95 p-5 transition duration-300 hover:border-signal/30 ${isNew ? 'animate-feed-in ring-1 ring-signal/40' : ''}`}>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-panelSoft text-sm font-bold text-signal">{account.avatarInitials}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <p className="min-w-0 text-base font-semibold leading-6 text-slate-100">{alert.category}</p>
            <p className="text-sm leading-6 text-slate-500">{account.username}</p>
            <span className="text-[0.78rem] leading-5 text-slate-600">{alert.collectionTime}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={post.severity} />
            <StatusBadge status={alert.status} />
            <span className="inline-flex max-w-full rounded-full bg-signal/10 px-3 py-1.5 text-[0.78rem] font-medium leading-snug text-signal">{post.confidence}% confidence</span>
          </div>
          <p className={`mt-3 text-sm leading-7 text-slate-300 sm:text-base ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
            {post.text}
          </p>
          {post.imageLabel && (
            <div className="mt-4 flex min-h-32 items-center gap-3 rounded-lg border border-dashed border-line bg-panelSoft/90 p-4 text-sm text-slate-400">
              <ImageIcon size={22} className="text-signal" />
              <span>{post.imageLabel}</span>
            </div>
          )}
          <div className="mt-4 grid gap-3 rounded-lg bg-panelSoft/70 px-3 py-3 text-sm leading-5 text-slate-400 sm:grid-cols-2 xl:grid-cols-3">
            <span className="inline-flex min-w-0 items-center gap-2"><MessageCircle size={14} className="shrink-0 text-signal" /> Source: {alert.source}</span>
            <span className="inline-flex min-w-0 items-center gap-2"><Repeat2 size={14} className="shrink-0 text-signal" /> Sector: {sector}</span>
            <span className="inline-flex min-w-0 items-center gap-2"><ThumbsUp size={14} className="shrink-0 text-signal" /> Confidence: {alert.confidence}%</span>
            <span className="inline-flex min-w-0 items-center gap-2"><Eye size={14} className="shrink-0 text-signal" /> First observed: {alert.firstObserved}</span>
            <span className="inline-flex min-w-0 items-center gap-2">Last update: {alert.lastUpdate}</span>
            <span className="inline-flex min-w-0 items-center gap-2">Analyst: {alert.assignedAnalyst}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{post.category}</span>
            <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{sector}</span>
            <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{alert.authenticity}</span>
            <span className="inline-flex max-w-full rounded-full bg-signal/10 px-3 py-1.5 text-[0.78rem] font-semibold leading-snug text-signal">{formatDetectedAgo(detectedAt)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-signal px-4 py-2 text-center text-sm font-semibold leading-5 text-graphite hover:bg-signal/90 sm:w-auto" to={`/investigation/${alert.id}`}>
          Open Investigation
        </Link>
      </div>
    </article>
  );
}
