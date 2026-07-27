import { Bell, Languages, Search, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockAssets, mockVulnerabilities, sectors } from '../data/ministryData';
import { labels } from '../services/i18n';
import { safeNavigate } from '../services/navigation';
import { usePrototype } from '../state/AlertStatusContext';

export function TopBar() {
  const navigate = useNavigate();
  const { findings, cases, notifications, language, setLanguage } = usePrototype();
  const [query, setQuery] = useState('');
  const t = labels[language];
  const unread = notifications.filter((notification) => !notification.read).length;
  const results = (query: string) => {
    const value = query.trim().toLowerCase();
    if (value.length < 2) {
      return [];
    }
    return [
      ...findings.filter((item) => [item.id, item.category, item.originalFinding, item.detectedEntities.join(' ')].join(' ').toLowerCase().includes(value)).slice(0, 3).map((item) => ({ group: 'Findings', label: `${item.id} - ${item.category}`, to: `/investigation/${item.id}` })),
      ...cases.filter((item) => [item.id, item.title, item.summary].join(' ').toLowerCase().includes(value)).slice(0, 2).map((item) => ({ group: 'Cases', label: `${item.id} - ${item.title}`, to: `/cases/${item.id}` })),
      ...mockAssets.filter((item) => [item.vendor, item.product, item.owner, item.sectorName].join(' ').toLowerCase().includes(value)).slice(0, 2).map((item) => ({ group: 'Assets', label: `${item.vendor} ${item.product}`, to: '/vulnerabilities' })),
      ...mockVulnerabilities.filter((item) => [item.cveId, item.title, item.vendor, item.product].join(' ').toLowerCase().includes(value)).slice(0, 2).map((item) => ({ group: 'Vulnerabilities', label: `${item.cveId} - ${item.product}`, to: '/vulnerabilities' })),
      ...sectors.filter((item) => [item.name, item.shortName, item.nameAr].join(' ').toLowerCase().includes(value)).slice(0, 2).map((item) => ({ group: 'Sectors', label: item.name, to: `/?sector=${item.id}` }))
    ];
  };

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-graphite/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 pl-16 sm:flex-nowrap sm:gap-3 sm:px-6 lg:px-8">
        <div className="group order-3 relative min-w-0 flex-none basis-[calc(100vw-5rem)] sm:order-none sm:flex-1 sm:basis-auto">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              className="min-h-11 w-full rounded-lg border border-line bg-panel py-2 pl-10 pr-4 text-sm leading-5 outline-none transition placeholder:text-slate-500 focus:border-signal"
              placeholder={t.search}
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </label>
          <SearchResults results={results(query)} />
        </div>
        <button onClick={() => safeNavigate('/notifications', navigate)} className="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-panel text-slate-300 hover:text-white" title={t.notifications}>
          <Bell size={18} />
          {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">{unread}</span>}
        </button>
        <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="inline-flex min-h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-line bg-panel px-0 py-2 text-sm text-slate-300 hover:text-white sm:w-auto sm:px-3" title="Language">
          <Languages size={18} />
          <span className="hidden sm:inline">{language === 'en' ? 'AR' : 'EN'}</span>
        </button>
        <div className="hidden min-h-11 shrink-0 items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-slate-300 sm:flex">
          <ShieldCheck size={18} className="text-signal" />
          {t.researchMode}
        </div>
      </div>
    </header>
  );
}

function SearchResults({ results }: { results: Array<{ group: string; label: string; to: string }> }) {
  if (results.length === 0) {
    return null;
  }
  return (
    <div className="invisible absolute left-0 right-0 top-12 z-40 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-panel p-2 shadow-glow group-focus-within:visible">
      {results.map((item) => (
        <Link key={`${item.group}-${item.label}`} to={item.to} className="block rounded-lg px-3 py-2 text-sm leading-6 transition hover:bg-panelSoft">
          <span className="mr-2 text-[0.78rem] uppercase text-signal">{item.group}</span>
          <span className="text-slate-200">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
