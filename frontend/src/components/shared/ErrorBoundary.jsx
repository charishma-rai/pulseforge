import React from 'react';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.group('🚀 PulseForge Runtime Error');
    console.error('Error:', error);
    console.error('ErrorInfo:', errorInfo);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-6">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-h2 text-white mb-2">Something went wrong</h2>
          <p className="text-body text-fg-tertiary mb-8 max-w-md">
            The module crashed during rendering. This is usually due to unexpected data structures or a network interruption.
          </p>
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCcw size={16} />
              Reload Application
            </Button>
            <Button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 rounded-xl bg-void/50 border border-border-subtle text-left text-micro font-mono text-danger overflow-auto max-w-full">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
