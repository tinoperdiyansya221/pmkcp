import axios from "axios";

// Base URL untuk API backend
const API_BASE_URL = "http://localhost:5000/api";

// Membuat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Meningkatkan timeout dari 10 detik menjadi 30 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error global
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, redirect ke login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Login user biasa
  loginUser: (credentials) => api.post("/users/login", credentials),

  // Login admin
  loginAdmin: (credentials) =>
    api.post("/users/login", { ...credentials, role: "admin" }),

  // Register user
  register: (userData) => api.post("/users/register", userData),

  // Get profile
  getProfile: () => api.get("/users/profile"),

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Pengaduan API functions
export const pengaduanAPI = {
  // Buat pengaduan baru
  create: (data) => api.post("/pengaduan", data),

  // Get semua pengaduan
  getAll: (params) => api.get("/pengaduan", { params }),

  // Get pengaduan by ID
  getById: (id) => api.get(`/pengaduan/${id}`),

  // Update pengaduan (pembuat atau admin)
  update: (id, data) => api.put(`/pengaduan/${id}`, data),

  // Update status pengaduan (admin only)
  updateStatus: (id, statusData) =>
    api.patch(`/pengaduan/${id}/status`, statusData),

  // Delete pengaduan (admin only)
  delete: (id) => api.delete(`/pengaduan/${id}`),

  // Get statistik pengaduan (admin only)
  getStats: () => api.get("/pengaduan/stats"),

  // Get kategori list
  getKategoriList: () => api.get("/pengaduan/kategori/list"),

  // Get status list
  getStatusList: () => api.get("/pengaduan/status/list"),
};

// User management API functions (admin only)
export const userAPI = {
  // Get all users
  getAll: (params) => api.get("/users", { params }),

  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),

  // Update user
  update: (id, data) => api.put(`/users/${id}`, data),

  // Delete user
  delete: (id) => api.delete(`/users/${id}`),

  // Get user statistics
  getStats: () => api.get("/users/stats/summary"),
};

export default api;
