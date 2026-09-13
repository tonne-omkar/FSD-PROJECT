import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BarChart3,
  Search,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';

export default function LandingPage() {
  const { isAuthenticated, role, switchRole } = useAuth();
  const { drives } = usePlacement();
  const navigate = useNavigate();

  const handleQuickRole = (targetRole) => {
    switchRole(targetRole);
    if (targetRole === 'student') navigate('/student/dashboard');
    else if (targetRole === 'tpo') navigate('/tpo/dashboard');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI-Driven Placement Intelligence for Colleges</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Accelerate Campus Placements with{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Smart Precision
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            PlacementPulse connects ambitious students and college placement cells with top-tier recruiters.
            Automated eligibility scoring, real-time recruitment funnel tracking, and seamless application workflows.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Student Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Account</span>
                </Link>
              </>
            ) : role === 'student' ? (
              <Link
                to="/student/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/tpo/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Go to TPO Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Quick Demo Experience:</span>
            <button
              onClick={() => handleQuickRole('student')}
              className="text-brand-600 hover:text-brand-800 font-semibold underline underline-offset-4"
            >
              Preview as Student →
            </button>
            <span>•</span>
            <button
              onClick={() => handleQuickRole('tpo')}
              className="text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-4"
            >
              Preview as TPO Officer →
            </button>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">₹ 54 LPA</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Highest Package</div>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-600 tracking-tight">₹ 14.8 LPA</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Average Batch CTC</div>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">72.7%</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Current Placement Rate</div>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 tracking-tight">{drives.length}+</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Active Hiring Drives</div>
          </div>
        </div>
      </section>

      {/* Dual Roles Features Showcase */}
      <section id="features" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Tailored Experiences for Students & TPO Cells
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Eliminate spreadsheets and manual email threads with a unified placement management engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Pillar */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:border-brand-300 transition-all flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg">
                🎓
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">For University Students</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Discover, Validate & Apply</h3>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>AI Match Score:</strong> Instant compatibility analysis based on your CGPA and verified skills.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>One-Click Applications:</strong> Apply to top campus drives with validated profiles and cover letters.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Live Application Tracker:</strong> Clear status updates from Aptitude to Interview & Offers.</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => handleQuickRole('student')}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                Explore Student Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TPO Pillar */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:border-purple-300 transition-all flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                🏛️
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">For Placement Officers</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Publish Drives & Track Funnel</h3>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Fast Drive Publishing:</strong> Create company recruitment drives with automated CGPA & branch criteria.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Applicant Funnel Analytics:</strong> Real-time visibility into student shortlists and placement offers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Branch-Wise Placement KPIs:</strong> Identify department trends and package distributions easily.</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => handleQuickRole('tpo')}
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                Explore TPO Analytics <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drives Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Active Campus Drives</h2>
            <p className="text-sm text-slate-500">Live opportunities currently accepting university applications</p>
          </div>
          <Link
            to="/student/dashboard"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View all {drives.length} drives <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drives.slice(0, 3).map((drive) => (
            <div
              key={drive.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {drive.company}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {drive.ctc}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug">{drive.role}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{drive.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Min CGPA: <strong className="text-slate-700">{drive.minCgpa}</strong></span>
                  <span>•</span>
                  <span>{drive.eligibleBranches.join(', ')}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Deadline: {drive.deadline}</span>
                <Link
                  to={`/drives/${drive.id}`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-tr from-brand-600 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl shadow-brand-500/10">
        <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto leading-tight">
          Ready to experience the future of campus recruitment?
        </h2>
        <p className="text-brand-100 text-sm sm:text-base max-w-lg mx-auto">
          Sign up today to explore verified drive listings, test the interactive application forms, and manage your placement profile.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-brand-700/60 hover:bg-brand-700 border border-brand-400/40 text-white font-semibold transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </section>
    </div>
  );
}
