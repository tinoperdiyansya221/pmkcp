# User Management & Authentication API

## Base URL
```
http://localhost:5000/api/users
```

## Authentication

Semua endpoint yang memerlukan authentication menggunakan Bearer Token di header:
```
Authorization: Bearer <your_jwt_token>
```

## 1. Register User Baru

### Request
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "masyarakat",
    "nama": "John Doe"
  }'
```

### Request Body
- `email` (required): Email user
- `password` (required): Password minimal 6 karakter
- `role` (optional): "masyarakat" atau "admin", default "masyarakat"
- `nama` (optional): Nama lengkap user

### Response
```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "masyarakat",
    "nama": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
}
```

## 2. Login User

### Request
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "masyarakat",
      "nama": "John Doe",
      "isActive": true,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 3. Get Profile User (Authenticated)

### Request
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <your_token>"
```

### Response
```json
{
  "success": true,
  "message": "Profile berhasil diambil",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "masyarakat",
    "nama": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "_count": {
      "pengaduan": 3
    }
  }
}
```

## 4. Get All Users (Admin Only)

### Request
```bash
# Basic request
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <admin_token>"

# With filters
curl -X GET "http://localhost:5000/api/users?role=masyarakat&isActive=true&page=1&limit=5" \
  -H "Authorization: Bearer <admin_token>"
```

### Query Parameters
- `role`: Filter berdasarkan role (masyarakat, admin)
- `isActive`: Filter berdasarkan status aktif (true, false)
- `page`: Halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)

### Response
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "role": "masyarakat",
      "nama": "John Doe",
      "isActive": true,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z",
      "_count": {
        "pengaduan": 3
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

## 5. Get User by ID

### Request
```bash
# Admin bisa akses semua user
curl -X GET http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer <admin_token>"

# User biasa hanya bisa akses data sendiri
curl -X GET http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer <user_token>"
```

### Response
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "masyarakat",
    "nama": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "_count": {
      "pengaduan": 3
    }
  }
}
```

## 6. Update User

### Request
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "nama": "John Doe Updated",
    "role": "admin",
    "isActive": true
  }'
```

### Request Body (semua field opsional)
- `email`: Email baru
- `nama`: Nama baru
- `role`: Role baru (admin only bisa mengubah)
- `isActive`: Status aktif (admin only bisa mengubah)

### Response
```json
{
  "success": true,
  "message": "User berhasil diupdate",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "role": "admin",
    "nama": "John Doe Updated",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:05:00.000Z"
  }
}
```

## 7. Update Password

### Request
```bash
curl -X PUT http://localhost:5000/api/users/1/password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Password berhasil diupdate"
}
```

## 8. Delete User (Admin Only)

### Request
```bash
curl -X DELETE http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer <admin_token>"
```

### Response
```json
{
  "success": true,
  "message": "User berhasil dihapus (dinonaktifkan)",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "masyarakat",
    "nama": "John Doe",
    "isActive": false
  }
}
```

## 9. Get Roles List

### Request
```bash
curl -X GET http://localhost:5000/api/users/roles/list
```

### Response
```json
{
  "success": true,
  "message": "Daftar role berhasil diambil",
  "data": [
    {
      "value": "masyarakat",
      "label": "Masyarakat",
      "description": "User biasa yang bisa membuat pengaduan"
    },
    {
      "value": "admin",
      "label": "Administrator",
      "description": "Admin yang bisa mengelola pengaduan dan user"
    }
  ]
}
```

## 10. Get User Statistics (Admin Only)

### Request
```bash
curl -X GET http://localhost:5000/api/users/stats/summary \
  -H "Authorization: Bearer <admin_token>"
```

### Response
```json
{
  "success": true,
  "message": "Statistik user berhasil diambil",
  "data": {
    "totalUsers": 10,
    "activeUsers": 8,
    "inactiveUsers": 2,
    "adminUsers": 2,
    "masyarakatUsers": 8,
    "usersByRole": {
      "admin": 2,
      "masyarakat": 8
    },
    "usersByStatus": {
      "active": 8,
      "inactive": 2
    }
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Email dan password wajib diisi"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Token akses diperlukan"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Akses ditolak. Role tidak memiliki izin"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

## Contoh Penggunaan dengan JavaScript/Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Setup axios interceptor untuk token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register user
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response.data);
    throw error;
  }
};

// Login user
const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    const { token } = response.data.data;
    
    // Simpan token ke localStorage
    localStorage.setItem('token', token);
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};

// Get profile
const getProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.response.data);
    throw error;
  }
};

// Get all users (admin)
const getAllUsers = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, { params });
    return response.data;
  } catch (error) {
    console.error('Get users error:', error.response.data);
    throw error;
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error.response.data);
    throw error;
  }
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
};

// Contoh penggunaan
const main = async () => {
  try {
    // Register
    await registerUser({
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      nama: 'Administrator'
    });
    
    // Login
    const loginResult = await loginUser({
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('Login berhasil:', loginResult);
    
    // Get profile
    const profile = await getProfile();
    console.log('Profile:', profile);
    
    // Get all users (jika admin)
    if (profile.data.role === 'admin') {
      const users = await getAllUsers({ page: 1, limit: 10 });
      console.log('All users:', users);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
```

## Authorization Rules

### Public Endpoints (tidak perlu login)
- POST `/api/users/register`
- POST `/api/users/login`
- GET `/api/users/roles/list`

### Authenticated Endpoints (perlu login)
- GET `/api/users/profile`

### Owner or Admin (user bisa akses data sendiri, admin bisa akses semua)
- GET `/api/users/:id`
- PUT `/api/users/:id`
- PUT `/api/users/:id/password`

### Admin Only
- GET `/api/users`
- DELETE `/api/users/:id`
- GET `/api/users/stats/summary`

## Integration dengan Pengaduan

Setelah login, user bisa:
1. **Masyarakat**: Membuat pengaduan dan melihat pengaduan sendiri
2. **Admin**: Melihat semua pengaduan, mengubah status pengaduan, mengelola user

Pengaduan akan otomatis terhubung dengan user yang login (jika ada).