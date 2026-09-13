import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Shield,
  Building,
  ArrowRight,
  Share2,
  Plus,
  BookOpen,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import { analyzeSkillsMatch } from '../utils/skillMatcher';

export default function DriveDetailsPage() {
  const { id } = useParams();
  const { user, role, isAuthenticated } = useAuth();
  const { getDriveById, hasApplied, profile, addSkillToProfile } = usePlacement();
  const navigate = useNavigate();

  const drive = getDriveById(id);

  if (!drive) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Recruitment Drive Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested campus drive could not be located or may have closed.
        </p>
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Drives
        </Link>
      </div>
    );
  }

  const applied = hasApplied(drive.id);
  const studentCgpa = profile?.cgpa ?? user?.cgpa ?? 8.8;
  const studentBranch = profile?.branch ?? user?.branch ?? 'CSE';
  const studentSkills = profile?.skills || [];

  const isCgpaEligible = studentCgpa >= drive.minCgpa;
  const isBranchEligible = drive.eligibleBranches.includes(studentBranch);
  const isFullyEligible = isCgpaEligible && isBranchEligible;

  // Real-time resume skill match comparison
  const skillMatch = analyzeSkillsMatch(studentSkills, drive.skillsRequired);

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-2xl text-slate-800 shadow-inner shrink-0">
              {drive.company[0]}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">
                  {drive.company}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {drive.jobType || 'Full-time'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  {drive.status}
                </span>
                {skillMatch.hasGaps ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {skillMatch.missing.length} Skill Gap(s) - Still Eligible
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    100% Skill Fit
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {drive.role}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {drive.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Deadline: <strong className="text-slate-700">{drive.deadline}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA & Package Header */}
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Offered CTC</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                {drive.ctc}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {applied ? (
                <div className="px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Already Applied
                </div>
              ) : role === 'student' || !isAuthenticated ? (
                <Link
                  to={`/drives/${drive.id}/apply`}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center gap-2"
                >
                  <span>Apply to Drive</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                  TPO View ({drive.applicantsCount || 0} applicants)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Resume Skill Match & Gap Analysis Card */}
        {role === 'student' && (
          <div className="bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-purple-50/70 rounded-2xl p-5 border border-brand-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    AI Resume vs Requirements Compatibility
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live cross-check of your profile against {drive.company}'s tech stack
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-700 shadow-xs">
                  {skillMatch.matchPercentage}% Skill Match
                </span>
                {isFullyEligible ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Academic Cutoff Met
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Criteria Check
                  </span>
                )}
              </div>
            </div>

            {/* Matched vs Missing Skills Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-100 space-y-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Skills Found on Your Resume ({skillMatch.matched.length}/{skillMatch.totalRequired})
                </span>
                {skillMatch.matched.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillMatch.matched.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-600" /> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No exact skill matches recorded on your profile.</p>
                )}
              </div>

              {/* Missing Skills (Skill Gaps) */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-amber-100 space-y-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Missing Skills / Skill Gaps ({skillMatch.missing.length})
                </span>
                {skillMatch.missing.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillMatch.missing.map((skill) => (
                      <div
                        key={skill}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1.5"
                      >
                        <span>•</span>
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => addSkillToProfile(skill)}
                          className="ml-1 text-[10px] font-extrabold text-brand-600 hover:text-brand-800 bg-white px-1.5 py-0.5 rounded border border-brand-200 hover:bg-brand-50 transition-colors"
                          title={`Add ${skill} to your profile if you already know it`}
                        >
                          +Add to Resume
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-semibold">🎉 Zero skill gaps! You match all required skills.</p>
                )}
              </div>
            </div>

            {/* Advisory guidance */}
            <div className="p-3 bg-white/60 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                {skillMatch.hasGaps ? (
                  <>
                    <strong>Application Advice:</strong> Even with {skillMatch.missing.length} missing skill(s), you meet the CGPA cutoff ({drive.minCgpa}) and eligible branch ({studentBranch}). Technical recruiters frequently shortlist motivated students who excel at programming foundations. You are encouraged to apply!
                  </>
                ) : (
                  <>
                    <strong>High Compatibility:</strong> Your skill stack matches {drive.company}'s engineering expectations perfectly. Ensure your resume highlights your recent projects using these tools.
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Details + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Responsibilities, Rounds */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Company & Role */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About the Opportunity</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {drive.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {drive.responsibilities && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Key Responsibilities</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                {drive.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recruitment Rounds Timeline */}
          {drive.recruitmentRounds && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Hiring Process & Rounds</h2>
              <div className="space-y-4 pt-2">
                {drive.recruitmentRounds.map((round, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs shrink-0">
                      R{round.round}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{round.title}</h4>
                        {round.duration && (
                          <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {round.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Mode: {round.mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Eligibility & Quick specs */}
        <div className="space-y-6">
          {/* Eligibility Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Eligibility Criteria</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-semibold">Cutoff CGPA</span>
                <span className="font-bold text-slate-900 text-sm">{drive.minCgpa} & Above</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-slate-500 font-semibold block">Eligible Disciplines</span>
                <div className="flex flex-wrap gap-1.5">
                  {drive.eligibleBranches.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-semibold">Service Bond</span>
                <span className="font-bold text-slate-900">{drive.bondPeriod || 'None'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-semibold">Work Arrangement</span>
                <span className="font-bold text-slate-900">{drive.workMode || 'Hybrid'}</span>
              </div>
            </div>

            {/* Apply Action in Sidebar */}
            <div className="pt-2">
              {applied ? (
                <div className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Application Submitted
                </div>
              ) : role === 'student' || !isAuthenticated ? (
                <Link
                  to={`/drives/${drive.id}/apply`}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : null}
            </div>
          </div>

          {/* Required Skills */}
          {drive.skillsRequired && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Key Technical Competencies</h3>
              <div className="flex flex-wrap gap-1.5">
                {drive.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Perks */}
          {drive.perks && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Benefits & Perks</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {drive.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
