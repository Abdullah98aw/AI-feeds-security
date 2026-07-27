import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCcw } from 'lucide-react';

type ErrorFallbackProps = {
  title?: string;
  message?: string;
  detail?: string;
  retry?: () => void;
  listRoute?: string;
  listLabel?: string;
};

export function ErrorFallback({
  title = 'Page could not be loaded',
  message = 'Something went wrong while displaying this prototype page.',
  detail = 'The application is still usable. You can return to the dashboard, go back, or retry the page.',
  retry,
  listRoute,
  listLabel
}: ErrorFallbackProps) {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <section className="rounded-lg border border-danger/40 bg-panel p-8 text-center shadow-glow">
      <AlertTriangle className="mx-auto text-danger" size={34} />
      <p className="mt-4 text-sm uppercase tracking-[0.18em] text-danger">Recovery Available</p>
      <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">{message}</p>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">{detail}</p>
      <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap sm:justify-center">
        {retry && (
          <button onClick={retry} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">
            <RotateCcw size={16} /> Retry
          </button>
        )}
        <button onClick={goBack} className="min-h-11 rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100">Previous Page</button>
        <Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Dashboard</Link>
        <Link to="/alerts" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100">Findings Queue</Link>
        {listRoute && listLabel && <Link to={listRoute} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100">{listLabel}</Link>}
      </div>
    </section>
  );
}
