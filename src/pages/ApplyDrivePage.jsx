import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Link2,
  CheckSquare,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  Building,
  Sparkles,
  ExternalLink,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import { analyzeSkillsMatch } from '../utils/skillMatcher';

export default function ApplyDrivePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getDriveById, hasApplied, applyToDrive, profile } = usePlacement();
  const navigate = useNavigate();

  const drive = getDriveById(id);
  const studentSkills = profile?.skills || [];
  const skillMatch = drive ? analyzeSkillsMatch(studentSkills, drive.skillsRequired) : null;

  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeLink: profile?.resumeLink || 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9-sample-resume/view',
    confirmEligibility: false,
  });

  const [touched, setTouched] = useState({
    coverLetter: false,
    resumeLink: false,
    confirmEligibility: false,
  });

  const [errors, setErrors] = useState({});
  const [submittedApp, setSubmittedApp] = useState(null);

  // URL regex validation
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  useEffect(() => {
    const newErrors = {};

    // Cover letter validation (>= 50 chars)
    if (touched.coverLetter || formData.coverLetter.length > 0) {
      if (!formData.coverLetter.trim()) {
        newErrors.coverLetter = 'Cover letter / statement of purpose is required';
      } else if (formData.coverLetter.trim().length < 50) {
        newErrors.coverLetter = `Cover letter must be at least 50 characters (currently ${formData.coverLetter.trim().length} chars)`;
      }
    }

    // Resume link validation (valid URL)
    if (touched.resumeLink || formData.resumeLink.length > 0) {
      if (!formData.resumeLink.trim()) {
        newErrors.resumeLink = 'Resume URL link is required';
      } else if (!urlRegex.test(formData.resumeLink.trim())) {
        newErrors.resumeLink = 'Please provide a valid URL (e.g. https://drive.google.com/... or https://linkedin.com/...)';
      }
    }

    // Checkbox validation
    if (touched.confirmEligibility) {
      if (!formData.confirmEligibility) {
        newErrors.confirmEligibility = 'You must confirm that you meet all eligibility criteria before submitting';
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  if (!drive) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Recruitment Drive Not Found</h2>
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Drives
        </Link>
      </div>
    );
  }

  // Already applied state
  if (hasApplied(drive.id) && !submittedApp) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Application Already Active</h2>
        <p className="text-sm text-slate-500">
          You have already submitted an application for <strong className="text-slate-800">{drive.company} - {drive.role}</strong>.
          You can track its status in your dashboard.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/student/dashboard"
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold shadow-sm"
          >
            Go to Applications Tracker
          </Link>
        </div>
      </div>
    );
  }

  // Form validity check
  const isFormValid =
    formData.coverLetter.trim().length >= 50 &&
    formData.resumeLink.trim() !== '' &&
    urlRegex.test(formData.resumeLink.trim()) &&
    formData.confirmEligibility === true &&
    Object.keys(errors).length === 0;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      coverLetter: true,
      resumeLink: true,
      confirmEligibility: true,
    });

    if (!isFormValid) return;

    const newApp = applyToDrive(drive.id, {
      coverLetter: formData.coverLetter.trim(),
      resumeLink: formData.resumeLink.trim(),
    });

    setSubmittedApp(newApp);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <Link
          to={`/drives/${drive.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {drive.company} Drive Details
        </Link>
      </div>

      {/* Success Modal / Screen */}
      {submittedApp ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Application Submitted</span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Successfully Applied to {drive.company}!
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Your application has been registered with the placement cell. Keep an eye on your dashboard for assessment notifications.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Application ID:</span>
              <strong className="text-slate-800 font-mono">{submittedApp.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Role:</span>
              <strong className="text-slate-800">{submittedApp.role}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Offered CTC:</span>
              <strong className="text-emerald-600">{drive.ctc}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Initial Status:</span>
              <span className="font-bold text-blue-600">{submittedApp.status}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/25 transition-all"
            >
              View in My Applications
            </button>
            <Link
              to={`/drives/${drive.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              Return to Drive
            </Link>
          </div>
        </div>
      ) : (
        /* Application Form Card */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Summary */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Campus Application Portal
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Apply for {drive.role}
                </h1>
                <p className="text-xs text-slate-500">
                  Target Company: <strong className="text-slate-800">{drive.company}</strong> • Package: <strong className="text-emerald-600">{drive.ctc}</strong>
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-extrabold text-lg border border-brand-100 shrink-0">
                {drive.company[0]}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Applicant Details Pill */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Applicant:</span>
                <strong className="text-slate-800">{user?.name || profile?.name}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Branch:</span>
                <strong className="text-slate-800">{user?.branch || profile?.branch}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">CGPA:</span>
                <strong className="text-brand-600">{user?.cgpa || profile?.cgpa}</strong>
              </div>
            </div>

            {/* Skill Match & Gap Notice */}
            {skillMatch && skillMatch.missing.length > 0 && (
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Skill Match Notice: {skillMatch.missing.length} Preferred Skill(s) Missing from Your Resume</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  This role lists <strong className="text-slate-800">{skillMatch.missing.join(', ')}</strong>. You are still eligible to apply! We recommend highlighting relevant coursework, self-learning, or related projects in your cover letter below.
                </p>
              </div>
            )}

            {/* Resume Link */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Resume Link (Google Drive / Notion / Portfolio) *
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={formData.resumeLink}
                  onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                  onBlur={() => handleBlur('resumeLink')}
                  placeholder="https://drive.google.com/file/d/..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    touched.resumeLink && errors.resumeLink
                      ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                      : touched.resumeLink && !errors.resumeLink && formData.resumeLink
                      ? 'border-emerald-300 ring-1 ring-emerald-50'
                      : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                />
              </div>
              {touched.resumeLink && errors.resumeLink && (
                <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.resumeLink}</span>
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Why are you a strong fit for this role? * (min 50 characters)
                </label>
                <span
                  className={`text-[11px] font-semibold ${
                    formData.coverLetter.trim().length >= 50 ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {formData.coverLetter.trim().length}/50 chars
                </span>
              </div>
              <textarea
                rows={5}
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                onBlur={() => handleBlur('coverLetter')}
                placeholder="Describe your technical projects, core strengths in data structures, algorithms, and why you are excited to build with this engineering team..."
                className={`w-full p-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                  touched.coverLetter && errors.coverLetter
                    ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                    : touched.coverLetter && !errors.coverLetter && formData.coverLetter.trim().length >= 50
                    ? 'border-emerald-300 ring-1 ring-emerald-50'
                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
              />
              {touched.coverLetter && errors.coverLetter && (
                <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.coverLetter}</span>
                </p>
              )}
            </div>

            {/* Checkbox: Confirm Eligibility */}
            <div className="space-y-1">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.confirmEligibility}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmEligibility: e.target.checked });
                    setTouched((prev) => ({ ...prev, confirmEligibility: true }));
                  }}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-0.5"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I solemnly declare that my academic CGPA meets the cutoff of{' '}
                  <strong>{drive.minCgpa}</strong>, I belong to one of the eligible engineering branches ({drive.eligibleBranches.join(', ')}), and I do not have active backlogs violating university placement policy.
                </span>
              </label>
              {touched.confirmEligibility && errors.confirmEligibility && (
                <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.confirmEligibility}</span>
                </p>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                  isFormValid
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Submit Campus Application</span>
              </button>
              {!isFormValid && (
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Complete all 3 requirements (Cover letter &ge; 50 chars, valid resume URL, eligibility confirmed) to submit.
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
