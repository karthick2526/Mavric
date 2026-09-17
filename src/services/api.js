/**
 * API Service for Mavric Personal Finance
 * Uses Axios to connect to MockAPI (2 resources: /users and /finance)
 * Provides automatic fallback to local persistent cache if MockAPI is down or unreachable
 */

import axios from 'axios';
import { INITIAL_USER, INITIAL_FINANCE } from './mockData.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://6aaa779aff4dd5698b4e92e8.mockapi.io/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const CACHE_KEYS = {
  USER: 'mavric_cached_user',
  FINANCE: 'mavric_cached_finance',
  SESSION: 'mavric_auth_session'
};

// Safe local persistence helper for cache/fallbacks
const getCache = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
};

/**
 * Users API Service
 */
export const usersApi = {
  // Fetch primary user or validate email
  async getUser(id = '1') {
    try {
      const response = await apiClient.get(`/users/${id}`);
      if (response.data) {
        setCache(CACHE_KEYS.USER, response.data);
        return { data: response.data, isMock: false };
      }
    } catch {
      // If resource not found on remote, attempt to list or fallback
      try {
        const listRes = await apiClient.get('/users');
        if (listRes.data && listRes.data.length > 0) {
          setCache(CACHE_KEYS.USER, listRes.data[0]);
          return { data: listRes.data[0], isMock: false };
        }
      } catch {
        // Fallback to local
      }
    }
    const cached = getCache(CACHE_KEYS.USER, INITIAL_USER);
    return { data: cached, isMock: true };
  },

  // Update profile details dynamically
  async updateUser(id, updateData) {
    try {
      const response = await apiClient.put(`/users/${id}`, updateData);
      setCache(CACHE_KEYS.USER, response.data);
      return { data: response.data, isMock: false };
    } catch {
      // Fallback local update
      const cached = getCache(CACHE_KEYS.USER, INITIAL_USER);
      const updated = { ...cached, ...updateData, id };
      setCache(CACHE_KEYS.USER, updated);
      return { data: updated, isMock: true };
    }
  },

  // Authenticate user against users resource
  async authenticate(email, password) {
    try {
      const res = await apiClient.get('/users');
      if (res.data && res.data.length > 0) {
        const found = res.data.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (found) {
          // If password matches or is demo
          if (found.password === password || password === 'karthick123') {
            setCache(CACHE_KEYS.USER, found);
            return { success: true, user: found };
          }
        }
      }
    } catch {
      // Offline / API error fallback check
    }

    const cached = getCache(CACHE_KEYS.USER, INITIAL_USER);
    if (
      email.toLowerCase() === cached.email.toLowerCase() &&
      (password === cached.password || password === 'karthick123')
    ) {
      return { success: true, user: cached };
    }

    // Also support direct login for Karthick demo
    if (email.toLowerCase() === 'karthick@mavric.demo' && password === 'karthick123') {
      return { success: true, user: cached };
    }

    return { success: false, error: 'Invalid email or password. Use demo credentials.' };
  }
};

/**
 * Finance API Service
 * Manages the single finance record containing monthlyIncome, transactions, goals, recurringExpenses, scenarios, snapshots, notifications
 */
export const financeApi = {
  async getFinance(id = '1') {
    try {
      const response = await apiClient.get(`/finance/${id}`);
      if (response.data) {
        setCache(CACHE_KEYS.FINANCE, response.data);
        return { data: response.data, isMock: false };
      }
    } catch {
      try {
        const listRes = await apiClient.get('/finance');
        if (listRes.data && listRes.data.length > 0) {
          setCache(CACHE_KEYS.FINANCE, listRes.data[0]);
          return { data: listRes.data[0], isMock: false };
        }
      } catch {
        // Fall through
      }
    }
    const cached = getCache(CACHE_KEYS.FINANCE, INITIAL_FINANCE);
    return { data: cached, isMock: true };
  },

  async updateFinance(id = '1', data) {
    try {
      const response = await apiClient.put(`/finance/${id}`, data);
      setCache(CACHE_KEYS.FINANCE, response.data);
      return { data: response.data, isMock: false };
    } catch {
      try {
        // If put failed because record does not exist on new MockAPI, attempt POST
        const postRes = await apiClient.post('/finance', { ...data, id });
        setCache(CACHE_KEYS.FINANCE, postRes.data);
        return { data: postRes.data, isMock: false };
      } catch {
        // Fallback local update
        setCache(CACHE_KEYS.FINANCE, data);
        return { data, isMock: true };
      }
    }
  },

  async resetSeedData() {
    setCache(CACHE_KEYS.USER, INITIAL_USER);
    setCache(CACHE_KEYS.FINANCE, INITIAL_FINANCE);
    try {
      await apiClient.put('/users/1', INITIAL_USER);
      await apiClient.put('/finance/1', INITIAL_FINANCE);
    } catch {
      // non-fatal
    }
    return { user: INITIAL_USER, finance: INITIAL_FINANCE };
  }
};
