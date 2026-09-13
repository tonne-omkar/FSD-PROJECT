import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Error 404</span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/student/dashboard"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
        >
          Student Dashboard
        </Link>
      </div>
    </div>
  );
}
