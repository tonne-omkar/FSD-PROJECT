import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Users, GraduationCap, Award, FileText } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export default function TPODriveApplicantsPage() {
  const { id } = useParams();
  const { getDriveById, applications } = usePlacement();

  const drive = getDriveById(id);

  if (!drive) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Recruitment Drive Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested campus drive could not be located or may have been removed.
        </p>
        <Link
          to="/tpo/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to TPO Dashboard
        </Link>
      </div>
    );
  }

  const driveApplicants = applications.filter(
    (app) => app.driveId === id || app.drive?._id === id || app.drive === id
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Back Link */}
      <div>
        <Link
          to="/tpo/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to TPO Dashboard
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-brand-500/20 shrink-0">
              {drive.company?.[0] || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">
                  {drive.company}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {drive.jobType || 'Full-time'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  {drive.status || 'Active'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Applicants for {drive.role || drive.title}
              </h1>
              <p className="text-xs text-slate-500">
                Offered Package: <strong className="text-emerald-600">{drive.ctc || 'N/A'}</strong> • Min CGPA Cutoff: <strong className="text-slate-700">{drive.minCgpa}</strong>
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center gap-2 self-start md:self-center">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold">{driveApplicants.length} Total Applicant(s)</span>
          </div>
        </div>
      </div>

      {/* Applicants List / Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Registered Student Applicants</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Student details and academic information populated from verified user profiles
          </p>
        </div>

        <div className="p-6">
          {driveApplicants.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No applicants yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No students have registered an application for {drive.company} - {drive.role || drive.title} yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-4">USN</th>
                    <th className="py-3.5 px-4">Branch</th>
                    <th className="py-3.5 px-4">CGPA</th>
                    <th className="py-3.5 px-6">Skills</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {driveApplicants.map((app, idx) => (
                    <tr key={app.id || app._id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {app.student?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-600">
                        {app.student?.rollNo || 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {app.student?.branch || 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-bold text-brand-600">
                        {app.student?.cgpa !== undefined ? app.student.cgpa : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        {app.student?.skills?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {app.student.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">None listed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
