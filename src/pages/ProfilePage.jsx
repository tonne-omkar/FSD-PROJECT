import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  GraduationCap,
  Award,
  Link2,
  Mail,
  Phone,
  FileText,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  Loader2,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlacement } from '../context/PlacementContext';
import SkillTagInput from '../components/profile/SkillTagInput';
import { BRANCH_OPTIONS } from '../mock/mockData';

const API_BASE = 'http://localhost:5000';

const isValidUrl = (value) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, updateProfile, applications } = usePlacement();

  const [formData, setFormData] = useState({
    name: user?.name || profile.name || '',
    branch: user?.branch || profile.branch || 'CSE',
    cgpa: (user?.cgpa ?? profile.cgpa ?? 8.8).toString(),
    skills: profile.skills || ['React', 'JavaScript', 'Node.js', 'Python'],
    phone: profile.phone || '',
    rollNo: profile.rollNo || '',
    bio: profile.bio || '',
    links: profile.links || [],
  });

  // Resume upload state
  const [resumeState, setResumeState] = useState({
    uploading: false,
    fileName: profile.resumeOriginalName || null,
    resumeUrl: profile.resumeFileName
      ? `${API_BASE}/uploads/resumes/${profile.resumeFileName}`
      : null,
    error: null,
  });
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Sync resumeState when profile data arrives (e.g. after login re-load)
  useEffect(() => {
    if (profile.resumeOriginalName) {
      setResumeState((prev) => ({
        ...prev,
        fileName: profile.resumeOriginalName,
        resumeUrl: profile.resumeFileName
          ? `${API_BASE}/uploads/resumes/${profile.resumeFileName}`
          : prev.resumeUrl,
      }));
    }
  }, [profile.resumeOriginalName, profile.resumeFileName]);

  // ---------- Validation ----------
  useEffect(() => {
    const newErrors = {};

    if (touched.name || formData.name.length > 0) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
    }

    if (touched.branch || formData.branch) {
      if (!formData.branch) newErrors.branch = 'Academic branch is required';
    }

    if (touched.cgpa || formData.cgpa.length > 0) {
      const parsed = parseFloat(formData.cgpa);
      if (!formData.cgpa) {
        newErrors.cgpa = 'CGPA is required';
      } else if (isNaN(parsed) || parsed < 0 || parsed > 10) {
        newErrors.cgpa = 'CGPA must be a valid number between 0.0 and 10.0';
      }
    }

    if (touched.skills || formData.skills.length >= 0) {
      if (!formData.skills || formData.skills.length === 0) {
        newErrors.skills = 'Please add at least one verified skill tag';
      }
    }

    // Per-row link URL validation
    const linkErrors = {};
    formData.links.forEach((link, i) => {
      if (link.url && !isValidUrl(link.url)) {
        linkErrors[i] = 'Please enter a valid URL (https://...)';
      }
    });
    if (Object.keys(linkErrors).length > 0) newErrors.links = linkErrors;

    setErrors(newErrors);
  }, [formData, touched]);

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.branch !== '' &&
    formData.cgpa !== '' &&
    !isNaN(parseFloat(formData.cgpa)) &&
    parseFloat(formData.cgpa) >= 0 &&
    parseFloat(formData.cgpa) <= 10 &&
    formData.skills.length > 0 &&
    !errors.links &&
    Object.keys(errors).length === 0;

  const handleBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSkillsChange = (newSkills) => {
    setFormData((prev) => ({ ...prev, skills: newSkills }));
    setTouched((prev) => ({ ...prev, skills: true }));
  };

  // ---------- Resume Upload ----------
  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeState({ uploading: true, fileName: null, resumeUrl: null, error: null });

    const formPayload = new FormData();
    formPayload.append('resume', file);

    try {
      const token = localStorage.getItem('placementpulse_token');
      const res = await fetch(`${API_BASE}/api/users/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        // NOTE: do NOT set Content-Type — browser sets multipart boundary automatically
        body: formPayload,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResumeState({
          uploading: false,
          fileName: data.originalName,
          resumeUrl: `${API_BASE}${data.resumeUrl}`,
          error: null,
        });
      } else {
        setResumeState({ uploading: false, fileName: null, resumeUrl: null, error: data.message || 'Upload failed' });
      }
    } catch {
      setResumeState({ uploading: false, fileName: null, resumeUrl: null, error: 'Unable to reach server. Is the backend running?' });
    }

    // Reset the file input so the same file can be re-uploaded after an error
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ---------- Links ----------
  const addLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, { label: '', url: '' }] }));
  };

  const updateLink = (index, field, value) => {
    setFormData((prev) => {
      const updated = prev.links.map((l, i) => (i === index ? { ...l, [field]: value } : l));
      return { ...prev, links: updated };
    });
    setTouched((prev) => ({ ...prev, links: true }));
  };

  const removeLink = (index) => {
    setFormData((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, branch: true, cgpa: true, skills: true, links: true });

    if (!isFormValid) return;

    setIsSaving(true);
    const result = await updateProfile({
      name: formData.name.trim(),
      branch: formData.branch,
      cgpa: parseFloat(formData.cgpa),
      skills: formData.skills,
      phone: formData.phone.trim(),
      rollNo: formData.rollNo.trim(),
      bio: formData.bio.trim(),
      links: formData.links.filter((l) => l.label.trim() || l.url.trim()), // omit fully empty rows
    });
    setIsSaving(false);

    if (result?.success) {
      setIsEditing(false);
    }
    // On failure: updateProfile already showed a toast — nothing more to do here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Top Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/25">
              {formData.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'ST'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {formData.name || 'Student Profile'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  Verified Candidate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Roll No: <span className="font-mono font-medium text-slate-700">{formData.rollNo}</span> • Branch:{' '}
                <strong className="text-slate-800">{formData.branch}</strong>
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span>CGPA: <strong className="text-brand-600 font-bold">{formData.cgpa}</strong></span>
                <span>•</span>
                <span>Applications: <strong className="text-emerald-600 font-bold">{applications.length} Submitted</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('open-pulse-ai', {
                    detail: { prompt: '📄 Analyze my resume & suggest improvements' },
                  })
                );
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              AI Resume Audit
            </button>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic & Placement Profile</h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Make edits below and click Save Changes to persist' : 'Read-only profile preview'}
              </p>
            </div>
            {isEditing && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Editing Mode Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={() => handleBlur('name')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    !isEditing
                      ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                      : touched.name && errors.name
                      ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                      : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                />
              </div>
              {touched.name && errors.name && (
                <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Institutional Email (Campus Auth)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={user?.email || profile.email || 'student@campus.edu'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Engineering Discipline / Branch *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  disabled={!isEditing}
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  onBlur={() => handleBlur('branch')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none bg-white ${
                    !isEditing
                      ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                      : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
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
                Cumulative GPA (0.0 - 10.0) *
              </label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  disabled={!isEditing}
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  onBlur={() => handleBlur('cgpa')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    !isEditing
                      ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                      : touched.cgpa && errors.cgpa
                      ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                      : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                />
              </div>
              {touched.cgpa && errors.cgpa && (
                <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.cgpa}
                </p>
              )}
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <p className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Verified Master Resume (PDF, max 5 MB)
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleResumeChange}
                disabled={!isEditing || resumeState.uploading}
                id="resume-file-input"
              />

              {/* Upload trigger button */}
              <label
                htmlFor="resume-file-input"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !isEditing || resumeState.uploading
                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    : 'border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 cursor-pointer'
                }`}
              >
                {resumeState.uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {resumeState.uploading ? 'Uploading...' : 'Upload PDF'}
              </label>

              {/* Uploaded file info or placeholder */}
              {resumeState.fileName ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                  <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium truncate max-w-[200px]">{resumeState.fileName}</span>
                  {resumeState.resumeUrl && (
                    <a
                      href={resumeState.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 flex items-center gap-1 font-bold text-brand-600 hover:text-brand-800"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">No resume uploaded yet</span>
              )}
            </div>

            {/* Upload error */}
            {resumeState.error && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {resumeState.error}
              </p>
            )}
          </div>

          {/* Technical Skills Tag Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Technical Skills & Competencies * (at least 1 required)
              </label>
              <span className="text-[11px] text-slate-400">{formData.skills.length} skills added</span>
            </div>
            <SkillTagInput
              skills={formData.skills}
              onChange={handleSkillsChange}
              error={touched.skills ? errors.skills : null}
              disabled={!isEditing}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Candidate Summary / Bio
            </label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of your technical interests and career aspirations..."
              className={`w-full p-3 rounded-xl border text-sm transition-all focus:outline-none ${
                !isEditing
                  ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
              }`}
            />
          </div>

          {/* Links Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Profile Links (LinkedIn, GitHub, Portfolio…)
              </p>
              {isEditing && (
                <button
                  type="button"
                  onClick={addLink}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              )}
            </div>

            {formData.links.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No links added yet.</p>
            ) : (
              <div className="space-y-2">
                {formData.links.map((link, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-2">
                    {/* Label */}
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={link.label}
                      onChange={(e) => updateLink(i, 'label', e.target.value)}
                      placeholder='e.g. "LinkedIn"'
                      className={`w-full sm:w-36 px-3 py-2 rounded-xl border text-sm focus:outline-none transition-all ${
                        !isEditing
                          ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                          : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                      }`}
                    />
                    {/* URL */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="relative">
                        <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={link.url}
                          onChange={(e) => updateLink(i, 'url', e.target.value)}
                          placeholder="https://..."
                          className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm focus:outline-none transition-all ${
                            !isEditing
                              ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                              : errors.links?.[i]
                              ? 'border-rose-300 ring-2 ring-rose-50 bg-rose-50/20'
                              : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                          }`}
                        />
                      </div>
                      {errors.links?.[i] && (
                        <p className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.links[i]}
                        </p>
                      )}
                    </div>
                    {/* Remove button */}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeLink(i)}
                        className="self-start sm:self-center p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors"
                        title="Remove link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Save Bar */}
          {isEditing && (
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                {!isFormValid ? (
                  <span className="text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Fix validation errors before saving
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All fields are valid
                  </span>
                )}
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSaving}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                    isFormValid && !isSaving
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
