import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  GraduationCap,
  ShieldCheck,
  Building2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import Logo from '../components/common/Logo';

/* ─────────── role definitions ─────────── */
const ROLES = [
  {
    key: 'student',
    label: 'Student',
    subtitle: 'Find drives, track applications & prep for interviews',
    icon: GraduationCap,
    demo: { email: 'omkar.sharma@campus.edu', password: 'Password123!' },
  },
  {
    key: 'tpo',
    label: 'Placement Officer',
    subtitle: 'Manage drives, analytics & campus recruitment pipeline',
    icon: ShieldCheck,
    demo: { email: 'tpo.head@campus.edu', password: 'Password123!' },
  },
  {
    key: 'recruiter',
    label: 'Recruiter',
    subtitle: 'Post openings, screen candidates & manage hiring',
    icon: Building2,
    demo: { email: 'sarah.j@google.com', password: 'Password123!' },
  },
];

/* ─────────── main component ─────────── */
export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = usePlacement();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const role = ROLES.find((r) => r.key === selectedRole);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const e = {};
    if (touched.email || formData.email.length > 0) {
      if (!formData.email.trim()) e.email = 'Email address is required';
      else if (!emailRegex.test(formData.email.trim())) e.email = 'Enter a valid email address';
    }
    if (touched.password || formData.password.length > 0) {
      if (!formData.password) e.password = 'Password is required';
      else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
    }
    setErrors(e);
  }, [formData, touched]);

  const isFormValid =
    formData.email.trim() !== '' &&
    emailRegex.test(formData.email.trim()) &&
    formData.password.length >= 6 &&
    Object.keys(errors).length === 0;

  const goToCredentials = () => {
    setStep(2);
    setFormData({ email: '', password: '' });
    setTouched({ email: false, password: false });
    setErrors({});
    setShowPassword(false);
  };

  const goBack = () => {
    setStep(1);
    setFormData({ email: '', password: '' });
    setTouched({ email: false, password: false });
    setErrors({});
  };

  const handleAutofill = () => {
    setFormData({ email: role.demo.email, password: role.demo.password });
    setTouched({ email: true, password: true });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const submitErrors = {};
    if (!formData.email.trim()) submitErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email.trim())) submitErrors.email = 'Enter a valid email address';
    if (!formData.password) submitErrors.password = 'Password is required';
    else if (formData.password.length < 6) submitErrors.password = 'Minimum 6 characters';
    if (Object.keys(submitErrors).length > 0) { setErrors(submitErrors); return; }

    login(formData.email, formData.password, selectedRole);
    showToast(`Welcome! Signed in as ${role.label}.`, 'success');
    const dest = { student: '/student/dashboard', tpo: '/tpo/dashboard', recruiter: '/recruiter/dashboard' };
    navigate(dest[selectedRole]);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8f9fb]">

      {/* ═══════════  LEFT — Visual Panel  ═══════════ */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] relative overflow-hidden bg-navy-900">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Soft glow accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-brand-600/8 blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-500/6 blur-[120px]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          {/* Logo */}
          <Logo theme="dark" size="md" />

          {/* Center content */}
          <div className="space-y-8 max-w-md">
            <div>
              <p className="text-accent-400 text-[13px] font-semibold tracking-wide uppercase mb-4">
                Campus Recruitment Platform
              </p>
              <h1 className="text-[38px] xl:text-[42px] leading-[1.15] font-extrabold text-white tracking-tight">
                Where talent meets
                <br />
                opportunity.
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed text-navy-300">
                One platform for students, placement cells, and recruiters to
                manage the complete campus hiring lifecycle.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2.5">
              {[
                'AI Resume Matching',
                'Drive Management',
                'Real-time Analytics',
                'Interview Prep',
              ].map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] text-navy-200"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                  {f}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {[
                { value: '10K+', label: 'Students' },
                { value: '120+', label: 'Companies' },
                { value: '95%', label: 'Placement Rate' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-[22px] font-bold text-white">{s.value}</div>
                  <div className="text-[12px] text-navy-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-[12px] text-navy-500">
            Trusted by leading universities and Fortune 500 recruiters
          </p>
        </div>
      </div>

      {/* ═══════════  RIGHT — Content Panel  ═══════════ */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo theme="light" size="sm" />
          </div>

          {/* ──── Step 1: Role Selection ──── */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <h2 className="text-[26px] font-bold text-navy-900 tracking-tight leading-tight">
                  Sign in to your account
                </h2>
                <p className="text-[14px] text-navy-500 mt-2">
                  Select your role to get started
                </p>
              </div>

              <div className="space-y-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isActive = selectedRole === r.key;

                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setSelectedRole(r.key)}
                      className={`w-full text-left rounded-xl border-[1.5px] p-4 transition-all duration-150 cursor-pointer group ${
                        isActive
                          ? 'border-navy-900 bg-navy-900/[0.03] shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-navy-900 text-white'
                              : 'bg-gray-100 text-navy-600 group-hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[15px] font-semibold ${isActive ? 'text-navy-900' : 'text-navy-800'}`}>
                            {r.label}
                          </div>
                          <div className="text-[13px] text-navy-400 mt-0.5 leading-snug">
                            {r.subtitle}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-5 h-5 rounded-full bg-navy-900 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goToCredentials}
                className="w-full mt-7 py-3 rounded-xl text-[14px] font-semibold bg-navy-900 text-white hover:bg-navy-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[13px] text-navy-400 mt-7">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-navy-900 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          )}

          {/* ──── Step 2: Credentials ──── */}
          {step === 2 && (
            <div>
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-[13px] text-navy-500 hover:text-navy-800 font-medium mb-7 transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Change role
              </button>

              <div className="mb-7">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <role.icon className="w-[18px] h-[18px] text-navy-700" />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-bold text-navy-900 tracking-tight">
                      {role.label} Login
                    </h2>
                  </div>
                </div>
                <p className="text-[13px] text-navy-400 mt-1">
                  Enter your credentials to access the dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-[13px] font-medium text-navy-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-[15px] h-[15px] text-navy-300 absolute left-3 top-[13px]" />
                    <input
                      id="login-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      placeholder={role.demo.email}
                      autoComplete="email"
                      className={`w-full pl-9 pr-3 py-[10px] rounded-lg border text-[14px] transition-all focus:outline-none placeholder:text-navy-300 ${
                        touched.email && errors.email
                          ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="flex items-center gap-1 text-[12px] text-red-500 mt-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="text-[13px] font-medium text-navy-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[12px] text-navy-500 hover:text-navy-800 hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-[15px] h-[15px] text-navy-300 absolute left-3 top-[13px]" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`w-full pl-9 pr-10 py-[10px] rounded-lg border text-[14px] transition-all focus:outline-none placeholder:text-navy-300 ${
                        touched.password && errors.password
                          ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[11px] text-navy-300 hover:text-navy-600 transition-colors cursor-pointer bg-transparent border-none p-0"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="flex items-center gap-1 text-[12px] text-red-500 mt-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full py-[11px] rounded-lg text-[14px] font-semibold transition-all flex items-center justify-center gap-2 ${
                      isFormValid
                        ? 'bg-navy-900 text-white hover:bg-navy-800 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Sign in
                  </button>
                </div>
              </form>

              {/* Demo autofill */}
              <button
                type="button"
                onClick={handleAutofill}
                className="w-full mt-4 py-[9px] rounded-lg border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-[13px] text-navy-500 hover:text-navy-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Use demo credentials
              </button>

              <p className="text-center text-[13px] text-navy-400 mt-7">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-navy-900 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════  FORGOT PASSWORD MODAL  ═══════════ */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm">
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Reset password"
          >
            <div className="p-5 pb-4 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                  <KeyRound className="w-[18px] h-[18px] text-navy-700" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-navy-900">Reset password</h3>
                  <p className="text-[12px] text-navy-400">We'll send a reset link to your email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setForgotEmail(''); }}
                className="p-1 rounded-md hover:bg-gray-100 text-navy-400 hover:text-navy-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-[13px] font-medium text-navy-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-[15px] h-[15px] text-navy-300 absolute left-3 top-[13px]" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@campus.edu"
                    className="w-full pl-9 pr-3 py-[10px] rounded-lg border border-gray-200 text-[14px] focus:outline-none focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10 bg-white placeholder:text-navy-300 transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={!forgotEmail.trim() || !emailRegex.test(forgotEmail.trim())}
                onClick={() => {
                  showToast(`Reset link sent to ${forgotEmail}`, 'success');
                  setShowForgotPassword(false);
                  setForgotEmail('');
                }}
                className={`w-full py-[10px] rounded-lg text-[14px] font-semibold transition-all flex items-center justify-center gap-2 ${
                  forgotEmail.trim() && emailRegex.test(forgotEmail.trim())
                    ? 'bg-navy-900 text-white hover:bg-navy-800 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Send reset link
              </button>

              <p className="text-center text-[12px] text-navy-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setForgotEmail(''); }}
                  className="font-semibold text-navy-900 hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Back to sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
