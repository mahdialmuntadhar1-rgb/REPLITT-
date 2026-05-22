import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    (this as any).state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if ((this as any).state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[40px] border-2 border-dashed border-neutral-100 m-6">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">حدث خطأ ما</h2>
          <p className="text-neutral-500 font-medium mb-8">Something went wrong, please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-[#0F7B6C] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0F7B6C]/20 hover:scale-105 active:scale-95 transition-all"
          >
            إعادة تحميل الصفجة | Reload
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
