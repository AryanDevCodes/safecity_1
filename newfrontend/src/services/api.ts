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
  timeout: 10000, // Increased timeout for better reliability
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('safecity_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add request timestamp for monitoring
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfig & { metadata?: { startTime: Date } };
    if (config.metadata) {
      const endTime = new Date();
      const duration = endTime.getTime() - config.metadata.startTime.getTime();
      // Log slow requests (over 1 second)
      if (duration > 1000) {
        console.warn(`Slow API call to ${config.url}: ${duration}ms`);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }

    switch (error.response.status) {
      case 401:
        localStorage.removeItem('safecity_token');
        localStorage.removeItem('safecity_user');
        window.location.href = '/login';
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        break;
      case 403:
        toast({
          title: "Access Denied",
          description: "You don't have permission to perform this action.",
          variant: "destructive",
        });
        break;
      case 404:
        toast({
          title: "Not Found",
          description: "The requested resource was not found.",
          variant: "destructive",
        });
        break;
      case 422:
        toast({
          title: "Validation Error",
          description: error.response.data?.message || "Please check your input.",
          variant: "destructive",
        });
        break;
      case 500:
      toast({
          title: "Server Error",
          description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
        break;
      default:
      toast({
        title: "Error",
          description: error.response.data?.message || "An unexpected error occurred.",
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
