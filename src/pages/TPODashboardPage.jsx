import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Users,
  Award,
  TrendingUp,
  Building2,
  DollarSign,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import StatCard from '../components/common/StatCard';
import PostDriveModal from '../components/drives/PostDriveModal';

export default function TPODashboardPage() {
  const { user } = useAuth();
  const { drives, tpoStats, deleteDrive } = usePlacement();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalApplicantsAcrossDrives = drives.reduce(
    (acc, d) => acc + (d.applicantsCount || 0),
    0
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TPO Officer Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Training & Placement Cell Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Manage active campus recruitment drives, review applicant volumes, and monitor student hiring funnels.
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
          title="Active Drives"
          value={drives.length}
          subtitle="Recruitment drives open"
          icon={Briefcase}
          trend={12}
          trendLabel="vs last month"
          color="brand"
        />
        <StatCard
          title="Total Applications"
          value={totalApplicantsAcrossDrives}
          subtitle="Across all university drives"
          icon={Users}
          trend={18}
          trendLabel="active pipeline"
          color="purple"
        />
        <StatCard
          title="Placement Rate"
          value={`${tpoStats.placementRate}%`}
          subtitle={`${tpoStats.placedStudents} placed of ${tpoStats.totalStudents}`}
          icon={Award}
          trend={5.4}
          trendLabel="YoY growth"
          color="emerald"
        />
        <StatCard
          title="Average CTC"
          value={tpoStats.averagePackage}
          subtitle={`Highest: ${tpoStats.highestPackage}`}
          icon={DollarSign}
          trend={8.2}
          trendLabel="batch average"
          color="amber"
        />
      </div>

      {/* Recruitment Funnel & Branch Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Recruitment Pipeline Funnel
            </h3>
            <span className="text-xs text-slate-400">Current Season</span>
          </div>

          <div className="space-y-3 pt-2">
            {tpoStats.recruitmentFunnel.map((item, idx) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.stage}</span>
                  <span className="text-slate-900 font-bold">
                    {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Placement Rates */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Branch-Wise Placement Performance
            </h3>
            <span className="text-xs text-slate-400">B.Tech Cohort</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Branch</th>
                  <th className="pb-3 text-center">Placed / Total</th>
                  <th className="pb-3">Placement %</th>
                  <th className="pb-3 text-right">Avg CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {tpoStats.branchPlacement.map((b) => (
                  <tr key={b.branch} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{b.branch}</td>
                    <td className="py-3 text-center">
                      {b.placed} / {b.total}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              b.percentage >= 80
                                ? 'bg-emerald-500'
                                : b.percentage >= 60
                                ? 'bg-brand-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900">{b.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900">{b.avgCtc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Posted Drives Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Manage Posted Placement Drives</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, registered applicant counts, and drive configuration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search drives..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Drive</span>
            </button>
          </div>
        </div>

        {/* Drives Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <th className="py-3.5 px-6">Company & Role</th>
                <th className="py-3.5 px-4">Package CTC</th>
                <th className="py-3.5 px-4">Eligibility</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4 text-center">Applicants</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDrives.map((drive) => (
                <tr key={drive.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
                        {drive.company[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{drive.company}</div>
                        <div className="text-slate-500 text-[11px]">{drive.role}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-emerald-600 text-sm">
                    {drive.ctc}
                  </td>

                  <td className="py-4 px-4">
                    <div>Min CGPA: <strong className="text-slate-900">{drive.minCgpa}</strong></div>
                    <div className="text-slate-400 text-[11px]">{drive.eligibleBranches.join(', ')}</div>
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.deadline}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold">
                      {drive.applicantsCount || 0}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        drive.status === 'Closing Soon'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {drive.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/drives/${drive.id}`}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        Details <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => deleteDrive(drive.id)}
                        title="Archive drive"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
