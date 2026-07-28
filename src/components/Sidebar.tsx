import { BarChart3, Bell, BookOpenCheck, ClipboardList, FileWarning, Globe2, LayoutDashboard, Menu, Network, RadioTower, SearchCheck, Settings, ShieldAlert, Siren, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { usePrototype } from '../state/AlertStatusContext';
import { labels } from '../services/i18n';

type LabelKey = keyof typeof labels.en;

const links = [
  { to: '/', key: 'dashboard' as LabelKey, icon: LayoutDashboard },
  { to: '/findings', key: 'findings' as LabelKey, icon: ClipboardList },
  { to: '/vulnerabilities', key: 'vulnerabilities' as LabelKey, icon: ShieldAlert },
  { to: '/dark-web', key: 'darkWeb' as LabelKey, icon: Globe2 },
  { to: '/social-osint', key: 'social' as LabelKey, icon: SearchCheck },
  { to: '/cases', key: 'cases' as LabelKey, icon: BookOpenCheck },
  { to: '/unassigned', key: 'unassigned' as LabelKey, icon: FileWarning },
  { to: '/sources', key: 'sources' as LabelKey, icon: RadioTower },
  { to: '/notifications', key: 'notifications' as LabelKey, icon: Bell },
  { to: '/audit', key: 'audit' as LabelKey, icon: Siren },
  { to: '/analytics', key: 'analytics' as LabelKey, icon: BarChart3 },
  { to: '/settings', key: 'settings' as LabelKey, icon: Settings },
  { to: '/accounts', key: 'accounts' as LabelKey, icon: Network }
];

export function Sidebar() {
  const { language } = usePrototype();
  const [open, setOpen] = useState(false);
  const t = labels[language];
  const nav = (
    <>
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-signal/15 text-signal">
          <ShieldAlert size={24} />
        </div>
        <div>
          <p className="sidebar-brand-title text-lg font-semibold leading-6 tracking-wide">MOI Threat Intel</p>
          <p className="sidebar-brand-subtitle text-[0.78rem] uppercase leading-5">AI SOC Prototype</p>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              [
                'flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-sm leading-5 transition',
                isActive ? 'bg-[var(--color-sidebar-active-background)] text-[var(--color-sidebar-active-text)]' : 'text-[var(--color-sidebar-text)] hover:bg-white/10 hover:text-white'
              ].join(' ')
            }
          >
            <Icon size={18} />
            <span className="min-w-0 break-words">{t[key]}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 rounded-lg border border-line bg-panelSoft p-4 text-xs text-slate-400">
        <p className="font-medium text-slate-200">Research boundary</p>
        <p className="mt-2 leading-5">All findings, assets, users, notifications, and correlations are local mock data for defensive workflow evaluation.</p>
      </div>
    </>
  );

  return (
    <>
      <button className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-signal shadow-glow lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
        <Menu size={20} />
      </button>
      <aside className="sidebar-shell fixed inset-y-0 start-0 z-40 hidden h-dvh w-80 overflow-y-auto border-e border-[color:var(--color-border)] bg-[var(--color-sidebar-background)] p-5 lg:block">
        {nav}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--color-overlay)] backdrop-blur lg:hidden" onClick={() => setOpen(false)}>
          <aside className="mobile-drawer h-dvh w-[min(24rem,92vw)] overflow-y-auto border-e border-line bg-panel p-5 shadow-glow [padding-bottom:calc(1.25rem+env(safe-area-inset-bottom))] [padding-top:calc(1.25rem+env(safe-area-inset-top))]" onClick={(event) => event.stopPropagation()}>
            <button className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-line bg-panelSoft text-signal" onClick={() => setOpen(false)} aria-label="Close navigation">
              <X size={18} />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
