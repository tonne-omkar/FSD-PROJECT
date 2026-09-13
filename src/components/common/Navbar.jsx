import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  Briefcase,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  GraduationCap,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PostDriveModal from '../drives/PostDriveModal';
import Logo from './Logo';

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPostDriveOpen, setIsPostDriveOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const homePath = isAuthenticated
    ? role === 'student'
      ? '/student/dashboard'
      : role === 'recruiter'
      ? '/recruiter/dashboard'
      : '/tpo/dashboard'
    : '/login';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to={homePath} className="flex items-center gap-2.5 group">
                <Logo size="md" theme="light" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                        isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </NavLink>
                </>
              ) : role === 'student' ? (
                <>
                  <NavLink
                    to="/student/dashboard"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'text-brand-600 bg-brand-50 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Briefcase className="w-4 h-4" />
                    Placement Drives
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'text-brand-600 bg-brand-50 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </NavLink>

                  {/* Student badge & logout */}
                  <div className="flex items-center gap-2 pl-3 ml-2 border-l border-slate-200">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-800">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                      <span className="font-semibold">{user?.name?.split(' ')[0] || 'Student'}</span>
                      <span className="text-[10px] bg-brand-200 text-brand-900 px-1.5 py-0.5 rounded-full font-bold">
                        {user?.branch || 'CSE'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      title="Log out"
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : role === 'recruiter' ? (
                /* Corporate Recruiter Navigation */
                <>
                  <NavLink
                    to="/recruiter/dashboard"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-50 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Building2 className="w-4 h-4" />
                    Hiring Portal
                  </NavLink>
                  <button
                    onClick={() => setIsPostDriveOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Drive
                  </button>

                  {/* Recruiter Badge & Logout */}
                  <div className="flex items-center gap-2 pl-3 ml-2 border-l border-slate-200">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold">{user?.company || 'Corporate'} Recruiter</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      title="Log out"
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* TPO Role Navigation */
                <>
                  <NavLink
                    to="/tpo/dashboard"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'text-brand-600 bg-brand-50 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    TPO Portal
                  </NavLink>
                  <button
                    onClick={() => setIsPostDriveOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Drive
                  </button>

                  {/* TPO Officer Badge & Logout */}
                  <div className="flex items-center gap-2 pl-3 ml-2 border-l border-slate-200">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span className="font-semibold">TPO Cell</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      title="Log out"
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </nav>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="flex flex-col gap-1">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Register
                  </Link>
                </>
              ) : role === 'student' ? (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-brand-600" /> Placement Drives
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-brand-600" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : role === 'recruiter' ? (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" /> Hiring Portal
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsPostDriveOpen(true);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Post Opening
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/tpo/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-600" /> TPO Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsPostDriveOpen(true);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Post New Drive
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Post Drive Modal triggered from TPO / Recruiter Nav */}
      <PostDriveModal isOpen={isPostDriveOpen} onClose={() => setIsPostDriveOpen(false)} />
    </>
  );
}
