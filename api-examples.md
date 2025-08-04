# Contoh Penggunaan API

## Base URL
```
http://localhost:5000/api
```

## 1. Health Check

### Request
```bash
curl -X GET http://localhost:5000/api/health
```

### Response
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 2. Buat Pengaduan Baru

### Request
```bash
curl -X POST http://localhost:5000/api/pengaduan \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Doe",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nomor_hp": "081234567890",
    "kategori": "infrastruktur",
    "isi": "Jalan berlubang di depan rumah saya, mohon segera diperbaiki"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Pengaduan berhasil dibuat",
  "data": {
    "id": 1,
    "nama": "John Doe",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nomor_hp": "081234567890",
    "kategori": "infrastruktur",
    "isi": "Jalan berlubang di depan rumah saya, mohon segera diperbaiki",
    "status": "pending",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "userId": null
  }
}
```

## 3. Ambil Semua Pengaduan

### Request Dasar
```bash
curl -X GET http://localhost:5000/api/pengaduan
```

### Request dengan Filter
```bash
# Filter berdasarkan status
curl -X GET "http://localhost:5000/api/pengaduan?status=pending"

# Filter berdasarkan kategori
curl -X GET "http://localhost:5000/api/pengaduan?kategori=infrastruktur"

# Dengan pagination
curl -X GET "http://localhost:5000/api/pengaduan?page=1&limit=5"

# Kombinasi filter
curl -X GET "http://localhost:5000/api/pengaduan?status=pending&kategori=infrastruktur&page=1&limit=10"
```

### Response
```json
{
  "success": true,
  "message": "Data pengaduan berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama": "John Doe",
      "alamat": "Jl. Merdeka No. 123, Jakarta",
      "nomor_hp": "081234567890",
      "kategori": "infrastruktur",
      "isi": "Jalan berlubang di depan rumah saya",
      "status": "pending",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z",
      "userId": null
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

## 4. Ambil Pengaduan Berdasarkan ID

### Request
```bash
curl -X GET http://localhost:5000/api/pengaduan/1
```

### Response
```json
{
  "success": true,
  "message": "Data pengaduan berhasil diambil",
  "data": {
    "id": 1,
    "nama": "John Doe",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nomor_hp": "081234567890",
    "kategori": "infrastruktur",
    "isi": "Jalan berlubang di depan rumah saya",
    "status": "pending",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "userId": null
  }
}
```

## 5. Update Status Pengaduan

### Request
```bash
curl -X PUT http://localhost:5000/api/pengaduan/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "diproses"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Status pengaduan berhasil diupdate",
  "data": {
    "id": 1,
    "nama": "John Doe",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nomor_hp": "081234567890",
    "kategori": "infrastruktur",
    "isi": "Jalan berlubang di depan rumah saya",
    "status": "diproses",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:05:00.000Z",
    "userId": null
  }
}
```

## 6. Daftar Kategori

### Request
```bash
curl -X GET http://localhost:5000/api/pengaduan/kategori/list
```

### Response
```json
{
  "success": true,
  "message": "Daftar kategori berhasil diambil",
  "data": [
    { "value": "infrastruktur", "label": "Infrastruktur" },
    { "value": "pelayanan", "label": "Pelayanan Publik" },
    { "value": "keamanan", "label": "Keamanan" },
    { "value": "kebersihan", "label": "Kebersihan" },
    { "value": "lainnya", "label": "Lainnya" }
  ]
}
```

## 7. Daftar Status

### Request
```bash
curl -X GET http://localhost:5000/api/pengaduan/status/list
```

### Response
```json
{
  "success": true,
  "message": "Daftar status berhasil diambil",
  "data": [
    { "value": "pending", "label": "Menunggu", "color": "orange" },
    { "value": "diproses", "label": "Sedang Diproses", "color": "blue" },
    { "value": "selesai", "label": "Selesai", "color": "green" },
    { "value": "ditolak", "label": "Ditolak", "color": "red" }
  ]
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Field nama, nomor_hp, kategori, dan isi wajib diisi"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Pengaduan tidak ditemukan"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Gagal membuat pengaduan",
  "error": "Detail error (hanya di development)"
}
```

## Contoh Penggunaan dengan JavaScript/Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Buat pengaduan
const createPengaduan = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pengaduan`, data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};

// Ambil semua pengaduan
const getAllPengaduan = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pengaduan`, { params });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};

// Contoh penggunaan
const main = async () => {
  // Buat pengaduan baru
  const newPengaduan = await createPengaduan({
    nama: 'Jane Doe',
    alamat: 'Jl. Sudirman No. 456',
    nomor_hp: '081987654321',
    kategori: 'pelayanan',
    isi: 'Pelayanan di kantor kelurahan sangat lambat'
  });
  
  console.log('Pengaduan baru:', newPengaduan);
  
  // Ambil semua pengaduan
  const allPengaduan = await getAllPengaduan({ status: 'pending', page: 1, limit: 10 });
  console.log('Semua pengaduan:', allPengaduan);
};

main();
```