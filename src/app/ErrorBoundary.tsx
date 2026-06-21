import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches render-time errors so a thrown component doesn't blank the app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In a real app this would go to Sentry/Datadog/etc.
    console.error('Uncaught render error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="grid min-h-screen place-items-center p-6 text-center text-[0.95rem] text-muted">
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
