import React from 'react';
import { AlertTriangle, Trash2, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-serif text-white">Something went wrong</h2>
              <p className="text-xs text-slate-400 mt-2 font-serif">
                A client cache or rendering error was detected. Clearing outdated local data will restore your portal immediately.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950/60 rounded-xl text-left border border-slate-700/50">
                <p className="text-[11px] font-mono text-red-400 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Local Data & Reload</span>
              </button>

              <button
                onClick={() => { window.location.href = '/login'; }}
                className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Go To Login Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
