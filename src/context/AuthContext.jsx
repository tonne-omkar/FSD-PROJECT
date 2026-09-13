import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
  student: {
    id: 'usr-student-01',
    name: 'Omkar Sharma',
    email: 'omkar.sharma@campus.edu',
    role: 'student',
    branch: 'CSE',
    cgpa: 8.8,
    avatar: 'OS',
  },
  tpo: {
    id: 'usr-tpo-01',
    name: 'Dr. Rajesh Verma',
    email: 'tpo.head@campus.edu',
    role: 'tpo',
    title: 'Head of Training & Placement Cell',
    avatar: 'RV',
  },
  recruiter: {
    id: 'usr-recruiter-01',
    name: 'Sarah Jenkins',
    email: 'sarah.j@google.com',
    role: 'recruiter',
    company: 'Google',
    title: 'University Talent Acquisition Lead',
    avatar: 'SJ',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('placementpulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Start in logged-out state so the user lands on the Login page
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('placementpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('placementpulse_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('placementpulse_token', data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      console.error('Network/login error:', err);
      return {
        success: false,
        message: 'Unable to reach server. Is the backend running?',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          branch: userData.branch,
          cgpa: userData.cgpa,
          company: userData.company,
          designation: userData.designation,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('placementpulse_token', data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      console.error('Network/register error:', err);
      return {
        success: false,
        message: 'Unable to reach server. Is the backend running?',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('placementpulse_token');
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (newRole === 'student') {
      setUser(DEFAULT_USERS.student);
    } else if (newRole === 'tpo') {
      setUser(DEFAULT_USERS.tpo);
    } else if (newRole === 'recruiter') {
      setUser(DEFAULT_USERS.recruiter);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
