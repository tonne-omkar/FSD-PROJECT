import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-2">
            <Logo theme="dark" size="sm" />
            <p className="text-sm text-slate-400 max-w-sm">
              Next-generation AI-driven campus recruitment and placement intelligence platform.
              Bridging university talent with premier global tech employers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-brand-300 border border-slate-700">
                <Sparkles className="w-3 h-3 text-brand-400" /> Phase 1 UI Prototype
              </span>
              <span>•</span>
              <span>Zero Backend / Local State</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Student Hub</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">
                  Available Drives
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Profile & Resume
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">TPO Cell</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/tpo/dashboard" className="hover:text-white transition-colors">
                  Recruitment Analytics
                </Link>
              </li>
              <li>
                <Link to="/tpo/dashboard" className="hover:text-white transition-colors">
                  Drive Management
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register TPO Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} PlacementPulse Campus Recruitment Platform. Built with React & Tailwind.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for university placements with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
