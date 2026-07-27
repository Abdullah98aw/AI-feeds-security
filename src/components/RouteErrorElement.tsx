import { useRouteError } from 'react-router-dom';
import { ErrorFallback } from './ErrorFallback';

export function RouteErrorElement() {
  const error = useRouteError();
  if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
    console.error('Route error', error);
  }
  return (
    <div className="min-h-screen bg-graphite p-5 text-slate-100">
      <ErrorFallback
        title="Route could not be displayed"
        message="The requested route failed to render safely."
        detail="Use the recovery buttons below to continue working in the prototype."
        retry={() => window.location.reload()}
      />
    </div>
  );
}
