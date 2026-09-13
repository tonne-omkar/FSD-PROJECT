import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Briefcase,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  PlusCircle,
  Search,
  Filter,
  Sparkles,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import StatCard from '../components/common/StatCard';
import PostDriveModal from '../components/drives/PostDriveModal';

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const { drives, applications, showToast } = usePlacement();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const recruiterCompany = user?.company || 'Google';

  // Drives posted by this company
  const companyDrives = drives.filter(
    (d) => d.company.toLowerCase() === recruiterCompany.toLowerCase()
  );

  // Initial candidate applicants for this company
  const [candidates, setCandidates] = useState([
    {
      id: 'CAND-01',
      name: 'Omkar Sharma',
      email: 'omkar.sharma@campus.edu',
      branch: 'CSE',
      cgpa: 8.8,
      role: 'Associate Software Engineer',
      appliedDate: '2026-09-02',
      status: 'Shortlisted for Interview',
      matchScore: 94,
      matchedSkills: ['Python', 'Data Structures', 'Git'],
      missingSkills: ['C++', 'Distributed Systems'],
      resumeLink: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9-sample-resume/view',
    },
    {
      id: 'CAND-02',
      name: 'Priya Patel',
      email: 'priya.patel@campus.edu',
      branch: 'IT',
      cgpa: 9.1,
      role: 'Associate Software Engineer',
      appliedDate: '2026-09-03',
      status: 'Under Review',
      matchScore: 89,
      matchedSkills: ['C++', 'Algorithms', 'Data Structures'],
      missingSkills: ['System Design'],
      resumeLink: 'https://drive.google.com/file/d/sample-resume-priya/view',
    },
    {
      id: 'CAND-03',
      name: 'Rohit Kulkarni',
      email: 'rohit.k@campus.edu',
      branch: 'ECE',
      cgpa: 8.4,
      role: 'Associate Software Engineer',
      appliedDate: '2026-09-04',
      status: 'Interview Scheduled',
      matchScore: 82,
      matchedSkills: ['Python', 'C++'],
      missingSkills: ['Algorithms', 'Distributed Systems'],
      resumeLink: 'https://drive.google.com/file/d/sample-resume-rohit/view',
    },
    {
      id: 'CAND-04',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@campus.edu',
      branch: 'CSE',
      cgpa: 9.4,
      role: 'Associate Software Engineer',
      appliedDate: '2026-09-05',
      status: 'Offer Extended',
      matchScore: 98,
      matchedSkills: ['Python', 'C++', 'Algorithms', 'Data Structures', 'System Design'],
      missingSkills: [],
      resumeLink: 'https://drive.google.com/file/d/sample-resume-ananya/view',
    },
  ]);

  const handleStatusChange = (candidateId, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );
    showToast(`Candidate evaluation status updated to: ${newStatus}`, 'success');
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const shortlistedCount = candidates.filter(
    (c) => c.status === 'Shortlisted for Interview' || c.status === 'Interview Scheduled'
  ).length;

  const offersCount = candidates.filter((c) => c.status === 'Offer Extended').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Recruitment Partner: {recruiterCompany}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Recruiter'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {user?.title || 'Senior University Talent Acquisition Lead'} at {recruiterCompany}.
            Review candidate applications, screen verified resume skill matches, and manage hiring stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Drive</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Openings"
          value={companyDrives.length || 1}
          subtitle={`Campus openings for ${recruiterCompany}`}
          icon={Briefcase}
          trend={10}
          trendLabel="live drives"
          color="brand"
        />
        <StatCard
          title="Applicants Screened"
          value={candidates.length + 138}
          subtitle="Total university applications"
          icon={Users}
          trend={24}
          trendLabel="candidate volume"
          color="purple"
        />
        <StatCard
          title="In Interview Pipeline"
          value={shortlistedCount}
          subtitle="Selected for technical rounds"
          icon={UserCheck}
          trend={12}
          trendLabel="shortlisted"
          color="emerald"
        />
        <StatCard
          title="Offers Extended"
          value={offersCount}
          subtitle="Final campus job offers"
          icon={Award}
          trend={50}
          trendLabel="accepted"
          color="amber"
        />
      </div>

      {/* Candidate Pipeline Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Candidate Screening & Evaluation Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live AI resume match scores, verified skills, and hiring stage transitions
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate or skill..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 bg-white"
            >
              <option value="ALL">All Evaluation Stages</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted for Interview">Shortlisted for Interview</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer Extended">Offer Extended</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <th className="py-3.5 px-6">Candidate</th>
                <th className="py-3.5 px-4">Branch & CGPA</th>
                <th className="py-3.5 px-4">AI Resume Fit</th>
                <th className="py-3.5 px-4">Skills Breakdown</th>
                <th className="py-3.5 px-4">Evaluation Stage</th>
                <th className="py-3.5 px-6 text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{candidate.name}</div>
                      <div className="text-slate-400 text-[11px]">{candidate.email}</div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800">{candidate.branch}</div>
                    <div className="text-brand-600 font-semibold">{candidate.cgpa} CGPA</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${candidate.matchScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900">{candidate.matchScore}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {candidate.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                      {candidate.missingSkills.length > 0 && (
                        <div className="text-[10px] text-amber-800 font-medium">
                          Gap: {candidate.missingSkills.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <select
                      value={candidate.status}
                      onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                      className={`py-1 px-2.5 rounded-lg text-xs font-bold border focus:outline-none transition-colors ${
                        candidate.status === 'Offer Extended'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : candidate.status.includes('Interview')
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : candidate.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted for Interview">Shortlisted for Interview</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Extended">Offer Extended</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <a
                      href={candidate.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-brand-600 hover:bg-brand-50 hover:border-brand-300 transition-colors text-[11px] font-semibold"
                    >
                      <FileText className="w-3 h-3" />
                      View CV
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Posted Drives for this Recruiter */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Active Campus Drives for {recruiterCompany}
            </h3>
            <p className="text-xs text-slate-500">
              Opportunities published and accepting applications from eligible students
            </p>
          </div>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Role</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {companyDrives.map((drive) => (
            <div
              key={drive.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  {drive.role}
                </span>
                <span className="text-xs font-extrabold text-emerald-600">{drive.ctc}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{drive.description}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="text-slate-400">Min CGPA: {drive.minCgpa}</span>
                <Link
                  to={`/drives/${drive.id}`}
                  className="text-brand-600 font-bold hover:underline flex items-center gap-0.5"
                >
                  View Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Drive Modal */}
      <PostDriveModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
}
