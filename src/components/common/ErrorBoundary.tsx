import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Component:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f5f1ec] text-[#111111] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-[#d3cec6] rounded-2xl p-6 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-[#eb5757]/10 border border-[#eb5757]/30 text-[#eb5757] rounded-xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111111]">Something went wrong</h3>
              <p className="text-xs text-[#626260] mt-1">
                {this.state.error?.message || 'An unexpected rendering error occurred'}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="ic-btn-primary py-2.5 px-5 text-xs flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
