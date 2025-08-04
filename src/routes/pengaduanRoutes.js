const express = require('express');
const multer = require('multer');
const {
  createPengaduan,
  getAllPengaduan,
  getPengaduanById,
  updateStatusPengaduan,
  updatePengaduan,
  deletePengaduan,
  getPengaduanStats
} = require('../controllers/pengaduanController');
const {
  optionalAuth,
  authenticateToken,
  authorizeRole
} = require('../middleware/auth');

// Konfigurasi multer untuk menangani FormData
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Routes untuk pengaduan

// POST /api/pengaduan - Membuat pengaduan baru (opsional login)
router.post('/', upload.single('foto'), optionalAuth, createPengaduan);

// GET /api/pengaduan - Mendapatkan semua pengaduan (opsional login)
// GET /api/pengaduan/stats - Statistik pengaduan (hanya admin) - HARUS DI ATAS :id
router.get('/stats', authenticateToken, authorizeRole('admin'), getPengaduanStats);

// GET /api/pengaduan - Mendapatkan semua pengaduan dengan pagination
router.get('/', optionalAuth, getAllPengaduan);

// GET /api/pengaduan/:id - Mendapatkan pengaduan berdasarkan ID
router.get('/:id', optionalAuth, getPengaduanById);

// PUT /api/pengaduan/:id/status - Update status pengaduan (admin only)
router.put('/:id/status', authenticateToken, authorizeRole('admin'), updateStatusPengaduan);

// PUT /api/pengaduan/:id - Update pengaduan (pembuat atau admin)
router.put('/:id', authenticateToken, updatePengaduan);

// DELETE /api/pengaduan/:id - Delete pengaduan (hanya admin)
router.delete('/:id', authenticateToken, authorizeRole('admin'), deletePengaduan);

// GET /api/pengaduan/kategori/list - Mendapatkan daftar kategori
router.get('/kategori/list', (req, res) => {
  const kategori = [
    { value: 'infrastruktur', label: 'Infrastruktur' },
    { value: 'pelayanan', label: 'Pelayanan Publik' },
    { value: 'keamanan', label: 'Keamanan' },
    { value: 'kebersihan', label: 'Kebersihan' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  res.json({
    success: true,
    message: 'Daftar kategori berhasil diambil',
    data: kategori
  });
});

// GET /api/pengaduan/status/list - Mendapatkan daftar status
router.get('/status/list', (req, res) => {
  const status = [
    { value: 'pending', label: 'Menunggu', color: 'orange' },
    { value: 'diproses', label: 'Sedang Diproses', color: 'blue' },
    { value: 'selesai', label: 'Selesai', color: 'green' },
    { value: 'ditolak', label: 'Ditolak', color: 'red' }
  ];

  res.json({
    success: true,
    message: 'Daftar status berhasil diambil',
    data: status
  });
});

module.exports = router;