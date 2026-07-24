import { Link, useParams } from 'react-router-dom';
import { Activity, ArrowLeft, Clock, Eye, Radio, ShieldAlert } from 'lucide-react';
import { mockAccounts } from '../data/mockAccounts';
import { mockAlerts } from '../data/mockAlerts';
import { mockPosts } from '../data/mockPosts';
import { KpiCard } from '../components/KpiCard';
import { SeverityBadge } from '../components/SeverityBadge';

export default function AccountIntelligence() {
  const { accountId } = useParams();
  const account = accountId ? mockAccounts.find((item) => item.id === accountId) : undefined;

  if (!account) {
    return <AccountList />;
  }

  const accountAlerts = mockAlerts.filter((alert) => mockPosts.find((post) => post.id === alert.postId)?.accountId === account.id);
  const related = account.relatedAccounts.map((id) => mockAccounts.find((item) => item.id === id)).filter(Boolean);
  const isArabic = account.language === 'Arabic';

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-signal">Account Intelligence</p>
          <h1 className={`mt-2 text-3xl font-semibold ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>{account.name}</h1>
          <p className="mt-2 text-slate-300">{account.username} - Simulated Research Data</p>
        </div>
        <Link to="/accounts" className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-sm text-slate-100 transition hover:border-signal hover:bg-panelSoft">
          <ArrowLeft size={16} /> Back to account list
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Risk Score" value={`${account.riskScore}`} detail="Mock account risk model" icon={ShieldAlert} />
        <KpiCard label="Account Age" value={account.accountAge.split(',')[0]} detail={account.accountAge} icon={Clock} />
        <KpiCard label="Posting Frequency" value={account.postingFrequency.split(' ')[0]} detail={account.postingFrequency} icon={Radio} />
        <KpiCard label="Previous Alerts" value={String(account.previousAlerts)} detail="Simulated historical alerts" icon={Activity} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_26rem]">
        <section className="space-y-5">
          <div className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Profile summary</h2>
            <p className={`mt-3 leading-7 text-slate-300 ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>{account.profileSummary}</p>
          </div>

          <div className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Suspicious indicators</h2>
            <div className="mt-5 space-y-4">
              {account.indicators.map((indicator, index) => (
                <div key={indicator} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-signal/15 text-xs text-signal">{index + 1}</span>
                    {index < account.indicators.length - 1 && <span className="h-full w-px bg-line" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-slate-100">{indicator}</p>
                    <p className="mt-1 text-sm text-slate-400">Fictional behavioral signal for analyst review.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Repeated patterns</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(account.repeatedPatterns ?? []).map((item) => (
                <div key={item} className="rounded-lg bg-panelSoft p-3 text-sm text-slate-200">{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Interaction history</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {account.interactionHistory.map((item) => (
                <div key={item} className="rounded-lg bg-panelSoft p-3 text-sm text-slate-200">{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Analyst notes</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{account.notes ?? 'No simulated analyst notes recorded for this account.'}</p>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Simulated relationship graph</h2>
            <svg viewBox="0 0 320 260" className="mt-4 h-72 w-full rounded-lg bg-panelSoft">
              <line x1="160" y1="130" x2="80" y2="62" stroke="#5b6975" strokeWidth="2" />
              <line x1="160" y1="130" x2="250" y2="78" stroke="#5b6975" strokeWidth="2" />
              <line x1="160" y1="130" x2="248" y2="198" stroke="#5b6975" strokeWidth="2" />
              <circle cx="160" cy="130" r="42" fill="#39d7b4" opacity="0.18" />
              <text x="160" y="126" textAnchor="middle" className="fill-slate-100 text-[13px] font-bold">{account.avatarInitials}</text>
              <text x="160" y="145" textAnchor="middle" className="fill-slate-300 text-[11px]">selected</text>
              {related.map((item, index) => {
                const points = [
                  { x: 80, y: 62 },
                  { x: 250, y: 78 },
                  { x: 248, y: 198 }
                ];
                const point = points[index] ?? points[0];
                return (
                  <g key={item!.id}>
                    <circle cx={point.x} cy={point.y} r="31" fill="#303c47" stroke="#39d7b4" strokeOpacity="0.45" />
                    <text x={point.x} y={point.y + 4} textAnchor="middle" className="fill-slate-100 text-[12px] font-bold">{item!.avatarInitials}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="rounded-lg border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">Related alerts</h2>
            <div className="mt-4 space-y-3">
              {accountAlerts.map((alert) => (
                <Link key={alert.id} to={`/investigation/${alert.id}`} className="block rounded-lg bg-panelSoft p-3 text-sm transition hover:bg-line">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-100">{alert.category}</p>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <p className="mt-1 text-slate-300">{alert.confidence}% confidence</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AccountList() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-signal">Account Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold">Simulated accounts</h1>
        <p className="mt-2 text-sm text-slate-300">Select an account to open its detailed intelligence profile. All accounts are fictional.</p>
      </div>

      <section className="grid gap-3 lg:hidden">
        {mockAccounts.map((account) => (
          <article key={account.id} className="rounded-lg border border-line bg-panel p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-panelSoft text-xs font-bold text-signal">{account.avatarInitials}</div>
              <div className="min-w-0">
                <h2 className="font-semibold leading-6 text-slate-100">{account.name}</h2>
                <p className="mt-1 text-sm leading-5 text-slate-400">{account.username}</p>
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Risk score" value={String(account.riskScore)} />
              <Info label="Risk level" value={account.riskLevel ?? 'Medium'} />
              <Info label="Previous alerts" value={String(account.previousAlerts)} />
              <Info label="Last activity" value={account.lastActivity} />
            </dl>
            <Link className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-signal px-3 py-2 text-center text-sm font-semibold leading-5 text-graphite transition hover:bg-signal/85" to={`/accounts/${account.id}`}>
              <Eye size={14} /> View Profile
            </Link>
          </article>
        ))}
      </section>

      <section className="hidden rounded-lg border border-line bg-panel lg:block">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="min-w-full divide-y divide-line text-left text-sm">
            <thead className="bg-panelSoft text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Account name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Risk score</th>
                <th className="px-4 py-3">Risk level</th>
                <th className="px-4 py-3">Previous alerts</th>
                <th className="px-4 py-3">Posting frequency</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Last activity</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mockAccounts.map((account) => (
                <tr key={account.id} className="transition hover:bg-panelSoft/70">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-panelSoft text-xs font-bold text-signal">{account.avatarInitials}</div>
                      <span className="font-medium text-slate-100">{account.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{account.username}</td>
                  <td className="px-4 py-4 font-semibold text-signal">{account.riskScore}</td>
                  <td className="px-4 py-4 text-slate-300">{account.riskLevel ?? 'Medium'}</td>
                  <td className="px-4 py-4 text-slate-300">{account.previousAlerts}</td>
                  <td className="px-4 py-4 text-slate-300">{account.postingFrequency}</td>
                  <td className="px-4 py-4 text-slate-300">{account.language}</td>
                  <td className="px-4 py-4 text-slate-300">{account.lastActivity}</td>
                  <td className="px-4 py-4">
                    <Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-signal px-3 py-2 text-center text-sm font-semibold leading-5 text-graphite transition hover:bg-signal/85" to={`/accounts/${account.id}`}>
                      <Eye size={14} /> View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 leading-6 text-slate-200">{value}</dd></div>;
}
