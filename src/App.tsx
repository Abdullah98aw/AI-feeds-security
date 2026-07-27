import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LiveSimulationToasts } from './components/LiveSimulationToasts';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { AlertStatusProvider, usePrototype } from './state/AlertStatusContext';
import { labels } from './services/i18n';

export default function App() {
  return (
    <AppErrorBoundary>
      <AlertStatusProvider>
        <AppShell />
      </AlertStatusProvider>
    </AppErrorBoundary>
  );
}

function AppShell() {
  const { language } = usePrototype();
  const t = labels[language];
  return (
    <div className="min-h-screen bg-graphite text-slate-100" dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
      <div className="min-h-screen">
        <Sidebar />
        <main className="app-main min-w-0">
          <TopBar />
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-col gap-2 rounded-lg border border-signal/25 bg-panelSoft px-4 py-3 text-sm text-slate-200 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <span>Ministry of Interior Threat Intelligence prototype - simulated intelligence findings only - no live dark web access and no automatic incident confirmation.</span>
              <span className="w-fit rounded-full bg-signal/15 px-3 py-1 text-xs font-semibold text-signal">{t.simulated}</span>
            </div>
            <Outlet />
          </div>
          <LiveSimulationToasts />
        </main>
      </div>
    </div>
  );
}
