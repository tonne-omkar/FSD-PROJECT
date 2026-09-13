import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Award,
  AlertTriangle,
  Lightbulb,
  Plus,
  BookOpen,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import Badge from '../components/common/Badge';
import { analyzeSkillsMatch } from '../utils/skillMatcher';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { drives, applications, hasApplied, profile, addSkillToProfile } = usePlacement();

  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'applications'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [minCtcFilter, setMinCtcFilter] = useState('ALL');
  const [skillFitFilter, setSkillFitFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'GAPS'

  const studentCgpa = profile?.cgpa ?? user?.cgpa ?? 8.8;
  const studentBranch = profile?.branch ?? user?.branch ?? 'CSE';
  const studentSkills = profile?.skills || [];

  // Calculate skill match for all drives
  const drivesWithSkillMatch = useMemo(() => {
    return drives.map((drive) => {
      const matchData = analyzeSkillsMatch(studentSkills, drive.skillsRequired);
      const isCgpaEligible = studentCgpa >= drive.minCgpa;
      const isBranchEligible = drive.eligibleBranches.includes(studentBranch);
      const isAcademicallyEligible = isCgpaEligible && isBranchEligible;

      return {
        ...drive,
        skillMatch: matchData,
        isCgpaEligible,
        isBranchEligible,
        isAcademicallyEligible,
      };
    });
  }, [drives, studentSkills, studentCgpa, studentBranch]);

  // Aggregate in-demand missing skills across all campus drives
  const topMissingSkills = useMemo(() => {
    const frequencyMap = {};
    drivesWithSkillMatch.forEach((d) => {
      d.skillMatch.missing.forEach((skill) => {
        frequencyMap[skill] = (frequencyMap[skill] || 0) + 1;
      });
    });

    return Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));
  }, [drivesWithSkillMatch]);

  // Filter drives based on user inputs
  const filteredDrives = drivesWithSkillMatch.filter((drive) => {
    const matchesSearch =
      drive.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.skillsRequired.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch =
      selectedBranch === 'ALL' || drive.eligibleBranches.includes(selectedBranch);

    const matchesCtc =
      minCtcFilter === 'ALL' || drive.ctcNumber >= parseFloat(minCtcFilter);

    const matchesSkillFit =
      skillFitFilter === 'ALL'
        ? true
        : skillFitFilter === 'HIGH'
        ? drive.skillMatch.matchPercentage >= 50
        : skillFitFilter === 'GAPS'
        ? drive.skillMatch.hasGaps
        : true;

    return matchesSearch && matchesBranch && matchesCtc && matchesSkillFit;
  });

  const gapDrivesCount = drivesWithSkillMatch.filter((d) => d.skillMatch.hasGaps).length;
  const highFitCount = drivesWithSkillMatch.filter((d) => d.skillMatch.matchPercentage >= 50).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-200 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Placement Season 2026-2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || profile?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Your profile is matched with <strong className="text-white">{drives.length} active placement drives</strong>.
              Review your academic eligibility, verify resume skill matches, and explore skill-gap upskilling opportunities.
            </p>
          </div>

          {/* Student Quick Pill Stats */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="px-3 border-r border-white/15 text-center">
              <div className="text-xs text-brand-200 uppercase font-semibold">My CGPA</div>
              <div className="text-xl font-bold text-white mt-0.5">{studentCgpa}</div>
            </div>
            <div className="px-3 border-r border-white/15 text-center">
              <div className="text-xs text-brand-200 uppercase font-semibold">Branch</div>
              <div className="text-xl font-bold text-white mt-0.5">{studentBranch}</div>
            </div>
            <div className="px-3 text-center">
              <div className="text-xs text-brand-200 uppercase font-semibold">Resume Skills</div>
              <div className="text-xl font-bold text-brand-300 mt-0.5">{studentSkills.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Resume Skill Gap & Upskill Advisor Banner */}
      {topMissingSkills.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-brand-50 rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    AI Resume Skill Gap Advisor
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {gapDrivesCount} Companies with Skill Gaps Visible
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Companies where some skills are missing from your resume are <strong>still fully visible and open for you to apply</strong>!
                  Recruiters evaluate core computer science aptitude and problem solving. You can also add these skills to your profile if you have already learned them.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                onClick={() => setSkillFitFilter(skillFitFilter === 'GAPS' ? 'ALL' : 'GAPS')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  skillFitFilter === 'GAPS'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                    : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {skillFitFilter === 'GAPS' ? 'Showing Skill Gap Drives' : 'Filter Skill Gap Drives'}
              </button>
            </div>
          </div>

          {/* Top in-demand missing skills chips */}
          <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" /> High-Demand Missing Skills on Campus:
            </span>
            {topMissingSkills.map(({ skill, count }) => (
              <div
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-amber-200 text-slate-800 shadow-xs group"
              >
                <span className="font-semibold text-amber-900">{skill}</span>
                <span className="text-[10px] text-slate-400">({count} drives)</span>
                <button
                  type="button"
                  onClick={() => addSkillToProfile(skill)}
                  title={`Add ${skill} to your verified profile`}
                  className="ml-1 p-0.5 text-brand-600 hover:bg-brand-50 hover:text-brand-800 rounded transition-colors flex items-center gap-0.5 font-bold text-[10px]"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to Profile</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('drives')}
          className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'drives'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Available Placement Drives</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {drives.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>My Applications</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 font-bold">
            {applications.length}
          </span>
        </button>
      </div>

      {activeTab === 'drives' ? (
        <>
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by company, role, or skill (e.g. AWS, React, Python)..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              {/* Branch Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 shrink-0">Branch:</span>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full py-2 px-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 bg-white"
                >
                  <option value="ALL">All Branches</option>
                  <option value="CSE">CSE Only</option>
                  <option value="IT">IT Only</option>
                  <option value="ECE">ECE Only</option>
                  <option value="EE">EE Only</option>
                </select>
              </div>

              {/* CTC Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 shrink-0">Min CTC:</span>
                <select
                  value={minCtcFilter}
                  onChange={(e) => setMinCtcFilter(e.target.value)}
                  className="w-full py-2 px-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 bg-white"
                >
                  <option value="ALL">All Packages</option>
                  <option value="10">₹ 10+ LPA</option>
                  <option value="15">₹ 15+ LPA</option>
                  <option value="20">₹ 20+ LPA</option>
                  <option value="30">₹ 30+ LPA</option>
                </select>
              </div>
            </div>

            {/* Skill Fit Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-400">View By Skill Match:</span>

                <button
                  type="button"
                  onClick={() => setSkillFitFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    skillFitFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Active Drives ({drives.length})
                </button>

                <button
                  type="button"
                  onClick={() => setSkillFitFilter('HIGH')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    skillFitFilter === 'HIGH'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  High Skill Fit (&ge;50%) ({highFitCount})
                </button>

                <button
                  type="button"
                  onClick={() => setSkillFitFilter('GAPS')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    skillFitFilter === 'GAPS'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Companies with Skill Gaps ({gapDrivesCount})
                </button>
              </div>

              {(searchTerm || selectedBranch !== 'ALL' || minCtcFilter !== 'ALL' || skillFitFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBranch('ALL');
                    setMinCtcFilter('ALL');
                    setSkillFitFilter('ALL');
                  }}
                  className="text-brand-600 hover:underline font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Drives List */}
          {filteredDrives.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No matching recruitment drives found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or resetting the skill fit toggle to view all opportunities.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBranch('ALL');
                  setMinCtcFilter('ALL');
                  setSkillFitFilter('ALL');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
              >
                Show All Placement Drives
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDrives.map((drive) => {
                const applied = hasApplied(drive.id);
                const { matched, missing, matchPercentage, hasGaps } = drive.skillMatch;

                return (
                  <div
                    key={drive.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Top row: Company & CTC badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-slate-800 text-lg shadow-inner">
                            {drive.company[0]}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              {drive.company}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                              {drive.role}
                            </h3>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-sm whitespace-nowrap shadow-xs">
                          {drive.ctc}
                        </span>
                      </div>

                      {/* Criteria Highlights */}
                      <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-slate-50 rounded-xl px-3 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Min CGPA: <strong className="text-slate-800">{drive.minCgpa}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Deadline: <strong className="text-slate-800">{drive.deadline}</strong></span>
                        </div>
                      </div>

                      {/* Academic Eligibility & AI Skill Match Overview */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            {drive.isAcademicallyEligible ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Academically Eligible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                                ⚠️ Check Cutoff / Branch
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border bg-slate-50 border-slate-200 text-slate-700">
                            <Sparkles className="w-3 h-3 text-brand-600" />
                            <span>{matchPercentage}% Skill Match</span>
                          </div>
                        </div>

                        {/* Visual Skill Match Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              matchPercentage >= 70
                                ? 'bg-emerald-500'
                                : matchPercentage >= 40
                                ? 'bg-brand-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.max(matchPercentage, 8)}%` }}
                          />
                        </div>
                      </div>

                      {/* Detailed Skill Comparison: Matched vs Missing */}
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                        {/* Matched skills */}
                        {matched.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Matched on your Resume ({matched.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {matched.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1"
                                >
                                  <span>✓</span>
                                  <span>{skill}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing skills (Skill Gaps) */}
                        {missing.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" /> Missing from Resume ({missing.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {missing.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1 group/chip"
                                >
                                  <span>•</span>
                                  <span>{skill}</span>
                                  <button
                                    type="button"
                                    onClick={() => addSkillToProfile(skill)}
                                    title={`Add ${skill} to your profile`}
                                    className="text-amber-700 hover:text-amber-950 font-bold ml-0.5 hover:underline"
                                  >
                                    +Add
                                  </button>
                                </span>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-400 italic">
                              💡 You can still apply! Highlight related projects or fast learning.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom action bar */}
                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      {applied ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {drive.applicantsCount} students applied
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/drives/${drive.id}`}
                          className="px-4 py-2 text-xs font-bold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        {!applied && (
                          <Link
                            to={`/drives/${drive.id}/apply`}
                            className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors"
                          >
                            Apply Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Applications Tab View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base">Application Tracker</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor evaluation progress for companies you have submitted applications to.
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No applications submitted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the active recruitment drives and submit your first application!
              </p>
              <button
                onClick={() => setActiveTab('drives')}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Browse Drives
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {app.company}
                      </span>
                      <span className="text-xs text-slate-400">ID: {app.id}</span>
                      <span className="text-xs text-slate-400">• Applied {app.appliedDate}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{app.role}</h4>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>Current Stage: <strong className="text-slate-800">{app.currentRound}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${app.statusColor}`}>
                      {app.status}
                    </span>
                    <Link
                      to={`/drives/${app.driveId}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      Drive Info <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
