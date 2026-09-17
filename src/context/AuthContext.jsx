import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usersApi } from '../services/api.js';
import { INITIAL_USER } from '../services/mockData.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);
const SESSION_KEY = 'mavric_auth_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USER; // default authenticated demo for smooth preview
    } catch {
      return INITIAL_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem(SESSION_KEY) || true; // initialize authenticated with demo account
    } catch {
      return true;
    }
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Load latest user profile from API on mount
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const res = await usersApi.getUser(user?.id || '1');
        if (isMounted && res?.data) {
          setUser(res.data);
          localStorage.setItem(SESSION_KEY, JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Could not fetch user from MockAPI, using local state', err);
      }
    };
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await usersApi.authenticate(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
        showToast({
          title: 'Welcome Back, ' + (result.user.name || 'Karthick'),
          message: 'Signed in successfully to your personal financial workspace.',
          type: 'success'
        });
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: result.error || 'Authentication failed' };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, error: 'Connection error during login. Please try again.' };
    }
  }, [showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
    showToast({
      title: 'Signed Out',
      message: 'You have been securely signed out.',
      type: 'info'
    });
  }, [showToast]);

  const updateProfile = useCallback(async (updatedFields) => {
    setLoading(true);
    try {
      const res = await usersApi.updateUser(user?.id || '1', updatedFields);
      const updated = res.data;
      setUser(updated);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      showToast({
        title: 'Profile Updated',
        message: 'Your personal details have been saved successfully.',
        type: 'success'
      });
      setLoading(false);
      return { success: true, user: updated };
    } catch (err) {
      setLoading(false);
      showToast({
        title: 'API Sync Error',
        message: 'Could not sync profile to MockAPI. Local copy updated.',
        type: 'warning',
        action: { label: 'Retry', onClick: () => updateProfile(updatedFields) }
      });
      // update local
      const updated = { ...user, ...updatedFields };
      setUser(updated);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return { success: true, user: updated };
    }
  }, [user, showToast]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
