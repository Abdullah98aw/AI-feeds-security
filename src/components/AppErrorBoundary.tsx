import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

type State = { error: Error | null };

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
      console.error('Application render error', error, errorInfo);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-graphite p-5 text-slate-100">
          <ErrorFallback
            title="The page recovered from an error"
            message="A component failed while rendering, but the prototype did not lose navigation."
            retry={() => this.setState({ error: null })}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
