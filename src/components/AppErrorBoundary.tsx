import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-6 text-center bg-white rounded-3xl border-2 border-sky-200 shadow-sm m-auto max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-3 shadow-inner">
            🌈
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-1">
            {this.props.fallbackTitle || 'Bé ơi đừng lo, cùng thử lại nhé!'}
          </h3>
          <p className="text-xs text-slate-500 mb-5 max-w-xs leading-relaxed">
            Trò chơi gặp chút gián đoạn nhỏ. Bố mẹ hoặc bé bấm nút bên dưới để tiếp tục vui chơi nhé!
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-2xl bg-[#1E88E5] hover:bg-[#1565C0] text-white font-extrabold text-sm flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Chơi tiếp nào</span>
            </button>
            {this.props.onReset && (
              <button
                type="button"
                onClick={this.props.onReset}
                className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4 stroke-[2.5]" />
                <span>Về trang chính</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
