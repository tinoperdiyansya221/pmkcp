# Backend API Pengaduan Masyarakat

Backend Express.js dengan Prisma ORM untuk sistem pengaduan masyarakat.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database

1. Pastikan PostgreSQL sudah terinstall dan berjalan
2. Buat database baru:
   ```sql
   CREATE DATABASE pengaduan_db;
   ```

3. Update file `.env` dengan URL database yang benar:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pengaduan_db?schema=public"
   ```

### 3. Generate Prisma Client & Migrate
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📋 API Endpoints

### Health Check
- **GET** `/api/health` - Cek status server

### Authentication
- **POST** `/api/users/register` - Registrasi user baru
- **POST** `/api/users/login` - Login user
- **GET** `/api/users/profile` - Get profile user yang login

### User Management
- **GET** `/api/users` - Ambil semua user (admin only)
- **GET** `/api/users/:id` - Ambil user berdasarkan ID
- **PUT** `/api/users/:id` - Update data user
- **PUT** `/api/users/:id/password` - Update password user
- **DELETE** `/api/users/:id` - Hapus user (admin only)
- **GET** `/api/users/roles/list` - Daftar role user
- **GET** `/api/users/stats/summary` - Statistik user (admin only)

### Pengaduan
- **POST** `/api/pengaduan` - Buat pengaduan baru (opsional login)
- **GET** `/api/pengaduan` - Ambil semua pengaduan (dengan pagination)
- **GET** `/api/pengaduan/:id` - Ambil pengaduan berdasarkan ID
- **PUT** `/api/pengaduan/:id/status` - Update status pengaduan (admin only)

### Utility
- **GET** `/api/pengaduan/kategori/list` - Daftar kategori pengaduan
- **GET** `/api/pengaduan/status/list` - Daftar status pengaduan

## 📝 Request Examples

### Buat Pengaduan Baru
```javascript
// POST /api/pengaduan
{
  "nama": "John Doe",
  "alamat": "Jl. Merdeka No. 123",
  "nomor_hp": "081234567890",
  "kategori": "infrastruktur",
  "isi": "Jalan rusak di depan rumah"
}
```

### Response Format
```javascript
{
  "success": true,
  "message": "Pengaduan berhasil dibuat",
  "data": {
    "id": 1,
    "nama": "John Doe",
    "alamat": "Jl. Merdeka No. 123",
    "nomor_hp": "081234567890",
    "kategori": "infrastruktur",
    "isi": "Jalan rusak di depan rumah",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Query Parameters untuk GET /api/pengaduan
- `status` - Filter berdasarkan status (pending, diproses, selesai, ditolak)
- `kategori` - Filter berdasarkan kategori
- `page` - Halaman (default: 1)
- `limit` - Jumlah item per halaman (default: 10)

Contoh: `/api/pengaduan?status=pending&page=1&limit=5`

## 🗂️ Struktur Project

```
backend/
├── prisma/
│   └── schema.prisma       # Skema database
├── src/
│   ├── controllers/
│   │   └── pengaduanController.js
│   ├── routes/
│   │   └── pengaduanRoutes.js
│   └── app.js              # Konfigurasi Express
├── .env                    # Environment variables
├── index.js                # Entry point
├── package.json
└── README.md
```

## 🛠️ Available Scripts

- `npm start` - Jalankan server production
- `npm run dev` - Jalankan server development dengan nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Jalankan database migration
- `npm run prisma:studio` - Buka Prisma Studio

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pengaduan_db?schema=public"

# Server
PORT=5000

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Environment
NODE_ENV="development"
```

## 📊 Database Schema

### Model User
- `id` - Integer, Primary Key, Auto Increment
- `email` - String, Unique, Required
- `password` - String, Required
- `role` - String, Default "masyarakat" (masyarakat, admin)
- `nama` - String, Optional
- `isActive` - Boolean, Default true
- `createdAt` - DateTime, Default now
- `updatedAt` - DateTime, Auto update
- `pengaduan` - Relation to Pengaduan[]

### Model Pengaduan
- `id` - Integer, Primary Key, Auto Increment
- `nama` - String, Required
- `alamat` - String, Optional
- `nomor_hp` - String, Required
- `kategori` - String, Required (infrastruktur, pelayanan, keamanan, kebersihan, lainnya)
- `isi` - String, Required
- `status` - String, Default "pending" (pending, diproses, selesai, ditolak)
- `createdAt` - DateTime, Default now
- `updatedAt` - DateTime, Auto update
- `userId` - Integer, Optional (Foreign Key to User)
- `user` - Relation to User

## 👥 User Roles & Permissions

### Masyarakat
- Registrasi dan login
- Membuat pengaduan baru
- Melihat pengaduan sendiri
- Update profil sendiri
- Update password sendiri

### Admin
- Semua hak akses masyarakat
- Melihat semua pengaduan
- Update status pengaduan
- Mengelola semua user (CRUD)
- Melihat statistik user
- Filter pengaduan berdasarkan user

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication:

1. **Register/Login**: Dapatkan JWT token
2. **Protected Routes**: Sertakan token di header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token Expiry**: Token berlaku selama yang ditentukan di JWT_SECRET

## 🔗 Frontend Integration

Backend ini siap dihubungkan dengan frontend React menggunakan Axios:

```javascript
// Contoh penggunaan di React
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

// Login
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
    const { token } = response.data.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};

// Buat pengaduan (dengan atau tanpa login)
const createPengaduan = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/pengaduan`, data);
  return response.data;
};

// Ambil semua pengaduan (admin bisa lihat semua, user biasa hanya milik sendiri)
const getAllPengaduan = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/pengaduan`, { params });
  return response.data;
};
```

## 🚨 Error Handling

Semua endpoint menggunakan format response yang konsisten:

```javascript
// Success Response
{
  "success": true,
  "message": "Pesan sukses",
  "data": { /* data response */ }
}

// Error Response
{
  "success": false,
  "message": "Pesan error",
  "error": "Detail error (hanya di development)"
}
```

## 📝 Notes

- CORS sudah dikonfigurasi untuk frontend di `localhost:3000` dan `localhost:5173`
- Semua input akan divalidasi sebelum disimpan ke database
- Error handling sudah diimplementasi di semua endpoint
- Pagination tersedia untuk endpoint GET pengaduan
- Database connection akan ditest saat server start