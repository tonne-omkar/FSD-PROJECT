import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (email, password, role = 'student') => {
    const baseUser = DEFAULT_USERS[role] || DEFAULT_USERS.student;
    const authenticatedUser = {
      ...baseUser,
      email: email.trim(),
      role: role,
    };
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      branch: userData.branch || 'CSE',
      cgpa: userData.cgpa ? parseFloat(userData.cgpa) : 8.0,
      avatar: (userData.name || 'User')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
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
