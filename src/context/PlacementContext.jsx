import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DRIVES,
  INITIAL_STUDENT_PROFILE,
  INITIAL_APPLICATIONS,
  TPO_STATS,
} from '../mock/mockData';
import { useAuth } from './AuthContext';

const PlacementContext = createContext(null);

const getDefaultProfile = (currUser) => {
  if (currUser?.id) {
    return {
      name: currUser?.name || '',
      email: currUser?.email || '',
      role: currUser?.role || 'student',
      branch: currUser?.branch || '',
      cgpa: currUser?.cgpa || '',
      skills: currUser?.skills || [],
      resumeLink: '',
      phone: '',
      rollNo: '',
      graduationYear: '',
      bio: '',
    };
  }
  return INITIAL_STUDENT_PROFILE;
};

const getDefaultApplications = (currUser) => {
  if (currUser?.id) {
    return [];
  }
  return INITIAL_APPLICATIONS;
};

export function PlacementProvider({ children }) {
  const { user } = useAuth();

  // Drives (Global/Shared)
  const [drives, setDrives] = useState(() => {
    const saved = localStorage.getItem('placementpulse_drives');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DRIVES;
  });

  // Student Profile (User-scoped)
  const [profile, setProfile] = useState(() => {
    const key = user?.id ? `placementpulse_profile_${user.id}` : 'placementpulse_profile';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return getDefaultProfile(user);
  });

  // Applications submitted by student (User-scoped)
  const [applications, setApplications] = useState(() => {
    const key = user?.id ? `placementpulse_applications_${user.id}` : 'placementpulse_applications';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return getDefaultApplications(user);
  });

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3800 ? null : prev));
    }, 4000);
  };

  const closeToast = () => setToast(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('placementpulse_drives', JSON.stringify(drives));
  }, [drives]);

  // Re-load profile whenever user?.id changes (e.g. login/switch user)
  useEffect(() => {
    const key = user?.id ? `placementpulse_profile_${user.id}` : 'placementpulse_profile';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setProfile(getDefaultProfile(user));
  }, [user?.id]);

  useEffect(() => {
    const key = user?.id ? `placementpulse_profile_${user.id}` : 'placementpulse_profile';
    localStorage.setItem(key, JSON.stringify(profile));
  }, [profile, user?.id]);

  // Re-load applications whenever user?.id changes
  useEffect(() => {
    const key = user?.id ? `placementpulse_applications_${user.id}` : 'placementpulse_applications';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setApplications(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setApplications(getDefaultApplications(user));
  }, [user?.id]);

  useEffect(() => {
    const key = user?.id ? `placementpulse_applications_${user.id}` : 'placementpulse_applications';
    localStorage.setItem(key, JSON.stringify(applications));
  }, [applications, user?.id]);

  const getDriveById = (id) => {
    return drives.find((d) => d.id === id) || null;
  };

  const hasApplied = (driveId) => {
    return applications.some((app) => app.driveId === driveId);
  };

  const applyToDrive = (driveId, applicationData) => {
    const targetDrive = getDriveById(driveId);
    if (!targetDrive) return null;

    const newApp = {
      id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      driveId: driveId,
      company: targetDrive.company,
      role: targetDrive.role,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Application Received',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      coverLetter: applicationData.coverLetter,
      resumeLink: applicationData.resumeLink,
      currentRound: 'Round 1: Document & Profile Screening',
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update drive applicant count
    setDrives((prev) =>
      prev.map((d) =>
        d.id === driveId ? { ...d, applicantsCount: (d.applicantsCount || 0) + 1 } : d
      )
    );

    showToast(`Application successfully submitted for ${targetDrive.company}!`, 'success');
    return newApp;
  };

  const postNewDrive = (driveData) => {
    const newDrive = {
      id: `drive-${Date.now()}`,
      company: driveData.company,
      badgeColor: 'from-brand-600 to-indigo-700',
      role: driveData.role,
      jobType: driveData.jobType || 'Full-time',
      location: driveData.location || 'Pan India (Hybrid)',
      ctc: `₹ ${parseFloat(driveData.ctcNumber).toFixed(1)} LPA`,
      ctcNumber: parseFloat(driveData.ctcNumber) || 10,
      minCgpa: parseFloat(driveData.minCgpa) || 7.0,
      eligibleBranches: driveData.eligibleBranches || ['CSE', 'IT', 'ECE'],
      deadline: driveData.deadline || '2026-10-31',
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      applicantsCount: 0,
      shortlistedCount: 0,
      placedCount: 0,
      workMode: driveData.workMode || 'Hybrid',
      bondPeriod: driveData.bondPeriod || 'None',
      description: driveData.description || 'Exciting career opportunity posted by the campus TPO cell.',
      responsibilities: driveData.responsibilities?.length
        ? driveData.responsibilities
        : ['Execute critical engineering deliverables', 'Collaborate with multidisciplinary squads', 'Maintain high engineering hygiene and tests'],
      requirements: driveData.requirements?.length
        ? driveData.requirements
        : [`CGPA >= ${driveData.minCgpa}`, 'Strong fundamentals and problem solving attitude'],
      skillsRequired: driveData.skillsRequired?.length
        ? driveData.skillsRequired
        : ['Problem Solving', 'Data Structures', 'Communication'],
      recruitmentRounds: [
        { round: 1, title: 'Campus Online Assessment', mode: 'Virtual / Lab', duration: '90 mins' },
        { round: 2, title: 'Technical Interview', mode: 'Campus / Virtual', duration: '45 mins' },
        { round: 3, title: 'HR & Cultural Alignment', mode: 'Campus / Virtual', duration: '30 mins' },
      ],
      perks: ['Health Insurance', 'Signing Bonus', 'Annual Incentive Program'],
      aiInsights: {
        matchScore: 88,
        verdict: 'Newly published campus drive matching candidate profile',
        keyStrengths: ['Fresh opportunity', 'Direct campus placement'],
      },
    };

    setDrives((prev) => [newDrive, ...prev]);
    showToast(`New recruitment drive for ${newDrive.company} published!`, 'success');
    return newDrive;
  };

  const updateProfile = async (updatedFields) => {
    try {
      const token = localStorage.getItem('placementpulse_token');
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfile((prev) => ({ ...prev, ...data.user }));
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      } else {
        showToast(data.message || 'Failed to update profile', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      showToast('Unable to reach server. Is the backend running?', 'error');
      return { success: false, message: 'Network error' };
    }
  };

  const addSkillToProfile = (skillName) => {
    if (!skillName) return;
    setProfile((prev) => {
      const existing = prev.skills || [];
      const alreadyHas = existing.some((s) => s.toLowerCase() === skillName.toLowerCase());
      if (alreadyHas) return prev;
      return {
        ...prev,
        skills: [...existing, skillName],
      };
    });
    showToast(`Added "${skillName}" to your verified profile skills!`, 'success');
  };

  const deleteDrive = (driveId) => {
    setDrives((prev) => prev.filter((d) => d.id !== driveId));
    showToast('Drive archived from active listings.', 'info');
  };

  return (
    <PlacementContext.Provider
      value={{
        drives,
        applications,
        profile,
        tpoStats: TPO_STATS,
        toast,
        getDriveById,
        hasApplied,
        applyToDrive,
        postNewDrive,
        updateProfile,
        addSkillToProfile,
        deleteDrive,
        showToast,
        closeToast,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
}

export function usePlacement() {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
}
