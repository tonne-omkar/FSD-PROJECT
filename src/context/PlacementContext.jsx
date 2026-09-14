import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_STUDENT_PROFILE,
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

export function PlacementProvider({ children }) {
  const { user } = useAuth();

  // Drives (Backend-synced)
  const [drives, setDrives] = useState([]);

  // Applications (Backend-synced, role-scoped)
  const [applications, setApplications] = useState([]);

  // Student Profile (User-scoped)
  const [profile, setProfile] = useState(() => getDefaultProfile(user));

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3800 ? null : prev));
    }, 4000);
  };

  const closeToast = () => setToast(null);

  // Fetch drives from backend API
  const fetchDrives = async () => {
    try {
      const token = localStorage.getItem('placementpulse_token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/drives', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map((d) => ({ ...d, id: d._id }));
          setDrives(normalized);
        }
      }
    } catch (e) {
      console.error('Error fetching drives:', e);
    }
  };

  // Fetch role-scoped applications from backend API
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('placementpulse_token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map((a) => ({ ...a, driveId: a.drive?._id, id: a._id }));
          setApplications(normalized);
        }
      }
    } catch (e) {
      console.error('Error fetching applications:', e);
    }
  };

  // Trigger data fetch on login/logout/user change
  useEffect(() => {
    if (user?.id) {
      fetchDrives();
      fetchApplications();
    } else {
      setDrives([]);
      setApplications([]);
    }
  }, [user?.id]);

  // Re-load profile whenever user?.id changes
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

  const getDriveById = (id) => {
    return drives.find((d) => d._id === id || d.id === id) || null;
  };

  const hasApplied = (driveId) => {
    return applications.some(
      (app) => app.drive === driveId || app.drive?._id === driveId || app.driveId === driveId
    );
  };

  const applyToDrive = async (driveId) => {
    try {
      const token = localStorage.getItem('placementpulse_token');
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ driveId }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchApplications();
        showToast('Application submitted successfully!', 'success');
        return { success: true, application: data };
      } else {
        showToast(data.message || 'Failed to submit application', 'error');
        return { success: false, message: data.message };
      }
    } catch (e) {
      showToast('Network error submitting application', 'error');
      return { success: false, message: e.message };
    }
  };

  const postNewDrive = async (driveData) => {
    try {
      const token = localStorage.getItem('placementpulse_token');
      const res = await fetch('http://localhost:5000/api/drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(driveData),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchDrives();
        showToast(`New recruitment drive for ${data.company || driveData.company} published!`, 'success');
        return { success: true, drive: data };
      } else {
        showToast(data.message || 'Failed to post drive', 'error');
        return { success: false, message: data.message };
      }
    } catch (e) {
      showToast('Network error posting drive', 'error');
      return { success: false, message: e.message };
    }
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
    setDrives((prev) => prev.filter((d) => d._id !== driveId && d.id !== driveId));
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
        fetchDrives,
        fetchApplications,
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
