import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from '../hooks/use-toast';
import { UserRole } from "../contexts/AuthContext";

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('safecity_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('safecity_token');
        window.location.href = '/login';

        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      } else if (error.response.status === 403) {
        // Forbidden
        toast({
          title: "Access denied",
          description: "You don't have permission to perform this action.",
          variant: "destructive",
        });
      } else if (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        // Server provided error message
        toast({
          title: "Error",
          description: String(error.response.data.message),
          variant: "destructive",
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
    } else {
      // Something happened in setting up the request
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/signin', { email, password });
      if (response.data.token) {
        localStorage.setItem('safecity_token', response.data.token);
        localStorage.setItem('safecity_user', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.roles.find((role: string) => role.startsWith('ROLE_')).replace('ROLE_', '').toLowerCase(),
          roles: response.data.roles,
          avatar: response.data.avatar,
          badge: response.data.badge,
          aadharVerified: response.data.aadharVerified,
          performanceRating: response.data.performanceRating,
          token: response.data.token
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  loginWithAadhaar: async (aadhaarNumber: string, otp: string) => {
    try {
      const response = await apiClient.post('/auth/aadhaar-login/verify-otp', { aadhaarNumber, otp });
      if (response.data.token) {
        localStorage.setItem('safecity_token', response.data.token);
        localStorage.setItem('safecity_user', JSON.stringify({
          ...response.data,
          role: response.data.roles.find((role: string) => role.startsWith('ROLE_')).replace('ROLE_', '').toLowerCase(),
          token: response.data.token
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Aadhaar login failed:', error);
      throw error;
    }
  },

  loginAnonymously: async () => {
    const response = await apiClient.post('/auth/anonymous');
    if (response.data.token) {
      localStorage.setItem('safecity_token', response.data.token);
      localStorage.setItem('safecity_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (name: string, email: string, password: string, role: UserRole, aadharNumber?: string | undefined) => {
    const response = await apiClient.post('/auth/signup', { name, email, password, role, aadharNumber });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('safecity_token');
    localStorage.removeItem('safecity_user');
  },

  getCurrentUser: async () => {
    return await apiClient.get('/auth/user');
  },

  verifyAadhaar: async (aadhaarNumber: string) => {
    return await apiClient.post('/auth/verify-aadhaar', { aadhaarNumber });
  },

  requestAadhaarOtp: async (aadhaarNumber: string) => {
    try {
      return await apiClient.post('/auth/aadhaar-login/request-otp', { aadhaarNumber });
    } catch (error) {
      console.error('Aadhaar OTP request failed:', error);
      throw error;
    }
  }
};

// Case Services
export const caseService = {
  getAllCases: async (params?: Record<string, unknown>) => {
    return await apiClient.get('/cases', { params });
  },

  getCaseById: async (id: string) => {
    return await apiClient.get(`/cases/${id}`);
  },

  createCase: async (caseData: Record<string, unknown>) => {
    return await apiClient.post('/cases', caseData);
  },

  updateCase: async (id: string, caseData: Record<string, unknown>) => {
    return await apiClient.put(`/cases/${id}`, caseData);
  },

  deleteCase: async (id: string) => {
    return await apiClient.delete(`/cases/${id}`);
  },

  addCaseNote: async (id: string, noteData: Record<string, unknown>) => {
    return await apiClient.post(`/cases/${id}/notes`, noteData);
  }
};

// Report Services
export const reportService = {
  getAllReports: async (params?: Record<string, unknown>) => {
    return await apiClient.get('/reports', { params });
  },

  getReportById: async (id: string) => {
    return await apiClient.get(`/reports/${id}`);
  },

  createReport: async (reportData: Record<string, unknown>) => {
    return await apiClient.post('/reports', reportData);
  },

  createVoiceReport: async (audioBlob: Blob, metadata: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('metadata', JSON.stringify(metadata));
    return await apiClient.post('/reports/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  approveReport: async (id: string) => {
    return await apiClient.put(`/reports/${id}/approve`);
  },

  rejectReport: async (id: string) => {
    return await apiClient.put(`/reports/${id}/reject`);
  }
};

// User Services
export const userService = {
  getAllUsers: async (params?: Record<string, unknown>) => {
    return await apiClient.get('/users', { params });
  },

  getUserById: async (id: string) => {
    return await apiClient.get(`/users/${id}`);
  },

  updateUser: async (id: string, userData: Record<string, unknown>) => {
    return await apiClient.put(`/users/${id}`, userData);
  },

  updateUserRole: async (id: string, role: string) => {
    return await apiClient.put(`/users/${id}/role`, { role });
  },

  getOfficerPerformance: async (id: string) => {
    return await apiClient.get(`/users/${id}/performance`);
  },

  getAllOfficersPerformance: async () => {
    return await apiClient.get('/users/officers/performance');
  }
};

// Incident Services
export const incidentService = {
  getAllIncidents: async (params?: Record<string, unknown>) => {
    return await apiClient.get('/incidents', { params });
  },

  getIncidentById: async (id: string) => {
    return await apiClient.get(`/incidents/${id}`);
  },

  createIncident: async (incidentData: Record<string, unknown>) => {
    return await apiClient.post('/incidents', incidentData);
  },

  updateIncident: async (id: string, incidentData: Record<string, unknown>) => {
    return await apiClient.put(`/incidents/${id}`, incidentData);
  },

  deleteIncident: async (id: string) => {
    return await apiClient.delete(`/incidents/${id}`);
  },

  getIncidentsForMap: async (bounds?: { north: number, south: number, east: number, west: number }) => {
    return await apiClient.get('/incidents/map', { params: bounds });
  }
};

// SOS Services
export const sosService = {
  triggerSOS: async (location: { lat: number, lng: number }, details?: string) => {
    return await apiClient.post('/sos/trigger', { location, details });
  },

  getAllActiveSOSAlerts: async () => {
    return await apiClient.get('/sos/active');
  },

  respondToSOS: async (id: string, officerId: string) => {
    return await apiClient.post(`/sos/${id}/respond`, { officerId });
  },

  resolveSOS: async (id: string) => {
    return await apiClient.put(`/sos/${id}/resolve`);
  }
};

// Analytics Services
export const analyticsService = {
  getCrimeStatistics: async (params?: never) => {
    return await apiClient.get('/analytics/crime-statistics', { params });
  },

  getOfficerPerformanceMetrics: async () => {
    return await apiClient.get('/analytics/officer-performance');
  },

  getCrimeTrends: async (timeframe: string = 'monthly') => {
    return await apiClient.get(`/analytics/crime-trends?timeframe=${timeframe}`);
  },

  getPredictiveAnalysis: async (area: string) => {
    return await apiClient.get(`/analytics/predictive?area=${area}`);
  }
};

export default {
  authService,
  caseService,
  reportService,
  userService,
  incidentService,
  sosService,
  analyticsService
};
