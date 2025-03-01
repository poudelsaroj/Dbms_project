import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    throw error;
};

export const apiService = {
  // Authentication
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/auth/logout');
  },
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Invigilators
  getInvigilators: () => api.get('/invigilators'),
  getInvigilator: (id) => api.get(`/invigilators/${id}`),
  createInvigilator: (data) => api.post('/invigilators', data),
  updateInvigilator: (id, data) => api.put(`/invigilators/${id}`, data),
  deleteInvigilator: (id) => api.delete(`/invigilators/${id}`),

  // Classes
  getClasses: () => api.get('/classes'),
  getClass: (id) => api.get(`/classes/${id}`),
  createClass: async (classData) => {
    try {
      const response = await api.post('/classes', classData);
      toast.success('Class created successfully');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating class');
      throw error;
    }
  },
  updateClass: (id, data) => api.put(`/classes/${id}`),
  deleteClass: (id) => api.delete(`/classes/${id}`),

  // Exams
  getExams: async () => {
    try {
      const response = await api.get('/exams');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  getExam: (id) => api.get(`/exams/${id}`),
  createExam: async (examData) => {
    try {
      const response = await api.post('/exams', {
        ...examData,
        invigilator_ids: examData.invigilator_ids.map(id => parseInt(id))
      });
      toast.success('Exam created successfully');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating exam');
      throw error;
    }
  },
  updateExam: async (id, examData) => {
    try {
      const response = await api.put(`/exams/${id}`, examData);
      toast.success('Exam updated successfully');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  deleteExam: async (id) => {
    try {
      const response = await api.delete(`/exams/${id}`);
      toast.success('Exam deleted successfully');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Schedules
  getSchedules: () => api.get('/scheduling'),
  getSchedule: (id) => api.get(`/scheduling/${id}`),
  createSchedule: (data) => api.post('/scheduling', data),
  updateSchedule: (id, data) => api.put(`/scheduling/${id}`),
  deleteSchedule: (id) => api.delete(`/scheduling/${id}`),

  getDashboardData: async () => {
    return await api.get('/dashboard');
  },

  registerInvigilator: async (data) => {
    const response = await api.post('/invigilators', data);
    return response.data;
  },

  // Add these department-related methods
  getAllDepartments: async () => {
    try {
      const response = await api.get('/departments');
      // Return the response object with data property
      return { data: response.data || [] };
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get('/departments');
      return response.data || []; // Ensure we return an array
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getDepartment: async (id) => {
    try {
      const response = await api.get(`/departments/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
  },

  createDepartment: async (data) => {
    try {
      const response = await api.post('/departments', data);
      return response;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  updateDepartment: async (id, data) => {
    try {
      const response = await api.put(`/departments/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  },

  // Rooms
  getRooms: () => api.get('/rooms'),
  getRoom: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

export default api;