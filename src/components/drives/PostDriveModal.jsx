import React, { useState } from 'react';
import { X, Briefcase, DollarSign, GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { BRANCH_OPTIONS } from '../../mock/mockData';

export default function PostDriveModal({ isOpen, onClose }) {
  const { postNewDrive } = usePlacement();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    ctcNumber: '',
    minCgpa: '7.0',
    deadline: '',
    location: 'Bengaluru / Hybrid',
    jobType: 'Full-time',
    eligibleBranches: ['CSE', 'IT'],
    description: '',
    workMode: 'Hybrid',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const exists = prev.eligibleBranches.includes(branch);
      const nextBranches = exists
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch];
      return { ...prev, eligibleBranches: nextBranches };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.role.trim()) errs.role = 'Job role is required';

    const ctc = parseFloat(formData.ctcNumber);
    if (!formData.ctcNumber || isNaN(ctc) || ctc <= 0) {
      errs.ctcNumber = 'Enter a valid package in LPA (e.g. 12.5)';
    }

    const cgpa = parseFloat(formData.minCgpa);
    if (!formData.minCgpa || isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      errs.minCgpa = 'Minimum CGPA must be between 0.0 and 10.0';
    }

    if (!formData.deadline) {
      errs.deadline = 'Application deadline is required';
    }

    if (formData.eligibleBranches.length === 0) {
      errs.eligibleBranches = 'Select at least one eligible branch';
    }

    if (!formData.description.trim()) {
      errs.description = 'Brief job description is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    postNewDrive(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Post New Recruitment Drive</h2>
              <p className="text-xs text-slate-500">Publish a new company opening to eligible students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Cisco Systems"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.company ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
              />
              {errors.company && <p className="text-xs text-rose-500 mt-1">{errors.company}</p>}
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Role / Title *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Software Engineer - Cloud"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.role ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
              />
              {errors.role && <p className="text-xs text-rose-500 mt-1">{errors.role}</p>}
            </div>

            {/* CTC Package */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Package CTC (in LPA) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.ctcNumber}
                  onChange={(e) => setFormData({ ...formData, ctcNumber: e.target.value })}
                  placeholder="e.g. 14.5"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.ctcNumber ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                />
              </div>
              {errors.ctcNumber && <p className="text-xs text-rose-500 mt-1">{errors.ctcNumber}</p>}
            </div>

            {/* Min CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum Cutoff CGPA *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.minCgpa}
                onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                placeholder="e.g. 7.5"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.minCgpa ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
              />
              {errors.minCgpa && <p className="text-xs text-rose-500 mt-1">{errors.minCgpa}</p>}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Application Deadline *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.deadline ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                }`}
              />
              {errors.deadline && <p className="text-xs text-rose-500 mt-1">{errors.deadline}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location & Mode
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru / Hybrid"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Eligible Branches */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Eligible Branches *
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {BRANCH_OPTIONS.map((branch) => {
                const isSelected = formData.eligibleBranches.includes(branch);
                return (
                  <button
                    type="button"
                    key={branch}
                    onClick={() => handleBranchToggle(branch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && '✓'}
                    </span>
                    {branch}
                  </button>
                );
              })}
            </div>
            {errors.eligibleBranches && (
              <p className="text-xs text-rose-500 mt-1">{errors.eligibleBranches}</p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description & Overview *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline role responsibilities, key requirements, and company mission..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                errors.description ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Publish Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
