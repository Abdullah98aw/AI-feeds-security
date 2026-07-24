import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="rounded-lg border border-line bg-panel p-8 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-danger">Invalid Route</p>
      <h1 className="mt-3 text-3xl font-semibold">404 Page Not Found</h1>
      <p className="mt-2 text-slate-400">The requested prototype page does not exist.</p>
      <div className="mt-5 flex justify-center gap-2">
        <Link to="/" className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-graphite">Dashboard</Link>
        <Link to="/alerts" className="rounded-lg border border-line bg-panelSoft px-4 py-2 text-sm text-slate-100">Findings</Link>
      </div>
    </div>
  );
}
