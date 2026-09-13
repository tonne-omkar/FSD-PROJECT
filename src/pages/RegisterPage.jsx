import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  GraduationCap,
  Award,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import { BRANCH_OPTIONS } from '../mock/mockData';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = usePlacement();
  const navigate = useNavigate();

  const [role, setRole] = useState('student'); // 'student' | 'tpo'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    branch: 'CSE',
    cgpa: '8.5',
    designation: 'Placement Officer',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const newErrors = {};

    // Name
    if (touched.name || formData.name.length > 0) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    // Email
    if (touched.email || formData.email.length > 0) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Enter a valid email address (e.g. name@campus.edu)';
      }
    }

    // Password
    if (touched.password || formData.password.length > 0) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
    }

    // Confirm Password
    if (touched.confirmPassword || formData.confirmPassword.length > 0) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm your password';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Student-specific fields: Branch & CGPA
    if (role === 'student') {
      if (touched.branch || formData.branch) {
        if (!formData.branch) {
          newErrors.branch = 'Please select your engineering branch';
        }
      }

      if (touched.cgpa || formData.cgpa.length > 0) {
        const parsed = parseFloat(formData.cgpa);
        if (!formData.cgpa) {
          newErrors.cgpa = 'CGPA is required';
        } else if (isNaN(parsed) || parsed < 0 || parsed > 10) {
          newErrors.cgpa = 'CGPA must be a valid number between 0.0 and 10.0';
        }
      }
    }

    setErrors(newErrors);
  }, [formData, touched, role]);

  // Overall form validation check
  const isFormValid = (() => {
    if (!formData.name.trim() || formData.name.trim().length < 2) return false;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) return false;
    if (!formData.password || formData.password.length < 8) return false;
    if (formData.password !== formData.confirmPassword) return false;

    if (role === 'student') {
      if (!formData.branch) return false;
      const parsed = parseFloat(formData.cgpa);
      if (!formData.cgpa || isNaN(parsed) || parsed < 0 || parsed > 10) return false;
    }

    return Object.keys(errors).length === 0;
  })();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      branch: true,
      cgpa: true,
    };
    setTouched(allTouched);

    if (!isFormValid) {
      return;
    }

    // Create user via context
    register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: role,
      branch: role === 'student' ? formData.branch : undefined,
      cgpa: role === 'student' ? parseFloat(formData.cgpa) : undefined,
    });

    showToast(`Account registered successfully as ${role === 'student' ? 'Student' : 'TPO Officer'}!`, 'success');

    if (role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/tpo/dashboard');
    }
  };

  return (
    <div className="max-w-lg mx-auto my-6 sm:my-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create PlacementPulse Account</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Join the automated campus placement ecosystem
          </p>

          {/* Role Toggle */}
          <div className="mt-6 p-1 bg-slate-100 rounded-2xl flex items-center gap-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setTouched({});
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'student'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('tpo');
                setTouched({});
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'tpo'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              TPO Cell Registration
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder={role === 'student' ? 'e.g. Omkar Sharma' : 'e.g. Dr. Rajesh Verma'}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                  touched.name && errors.name
                    ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                    : touched.name && !errors.name && formData.name
                    ? 'border-emerald-300 ring-1 ring-emerald-50'
                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
              />
            </div>
            {touched.name && errors.name && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              College Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder={role === 'student' ? 'student.id@campus.edu' : 'tpo.cell@campus.edu'}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                  touched.email && errors.email
                    ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                    : touched.email && !errors.email && formData.email
                    ? 'border-emerald-300 ring-1 ring-emerald-50'
                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Passwords row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password * (min 8)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="At least 8 chars"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    touched.password && errors.password
                      ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                      : touched.password && !errors.password && formData.password
                      ? 'border-emerald-300 ring-1 ring-emerald-50'
                      : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                />
              </div>
              {touched.password && errors.password && (
                <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Repeat password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                      : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword
                      ? 'border-emerald-300 ring-1 ring-emerald-50'
                      : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
          </div>

          {/* Student Specific Fields: Branch & CGPA */}
          {role === 'student' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Branch */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Academic Branch *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    onBlur={() => handleBlur('branch')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm bg-white focus:outline-none transition-all"
                  >
                    {BRANCH_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b} Engineering
                      </option>
                    ))}
                  </select>
                </div>
                {touched.branch && errors.branch && (
                  <p className="text-xs text-rose-500 font-medium mt-1.5">{errors.branch}</p>
                )}
              </div>

              {/* CGPA */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current CGPA (0.0 - 10.0) *
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => handleChange('cgpa', e.target.value)}
                    onBlur={() => handleBlur('cgpa')}
                    placeholder="e.g. 8.75"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                      touched.cgpa && errors.cgpa
                        ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                        : touched.cgpa && !errors.cgpa && formData.cgpa
                        ? 'border-emerald-300 ring-1 ring-emerald-50'
                        : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                    }`}
                  />
                </div>
                {touched.cgpa && errors.cgpa && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.cgpa}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                Registering as university <strong>Training & Placement Officer</strong>. Grants authority to create drives and analyze cohort metrics.
              </span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                isFormValid
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Complete Registration as {role === 'student' ? 'Student' : 'TPO'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!isFormValid && (
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Fill in all required fields accurately (Password &ge; 8 characters)
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
