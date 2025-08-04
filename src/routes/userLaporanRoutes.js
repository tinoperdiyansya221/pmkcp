const express = require('express');
const {
  createPengaduan,
  getAllPengaduan,
  getPengaduanById,
  updatePengaduan,
  deletePengaduan,
  getPengaduanStats
} = require('../controllers/pengaduanController');
const {
  authenticateToken
} = require('../middleware/auth');

const router = express.Router();

// Middleware untuk memastikan user sudah login
router.use(authenticateToken);

// Routes untuk laporan user

// POST /api/user/laporan - Membuat laporan baru (user yang login)
router.post('/', createPengaduan);

// GET /api/user/laporan - Mendapatkan laporan milik user yang login
router.get('/', async (req, res) => {
  try {
    // Override req.query untuk filter berdasarkan userId
    req.query.userId = req.user.id;
    
    // Panggil controller getAllPengaduan dengan filter userId
    await getAllPengaduan(req, res);
  } catch (error) {
    console.error('Error getting user reports:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil laporan user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/user/laporan/stats - Statistik laporan user yang login
router.get('/stats', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const userId = req.user.id;
    
    const [total, pending, diproses, selesai, ditolak] = await Promise.all([
      prisma.pengaduan.count({ where: { userId } }),
      prisma.pengaduan.count({ where: { userId, status: 'pending' } }),
      prisma.pengaduan.count({ where: { userId, status: 'diproses' } }),
      prisma.pengaduan.count({ where: { userId, status: 'selesai' } }),
      prisma.pengaduan.count({ where: { userId, status: 'ditolak' } })
    ]);
    
    const stats = {
      total,
      pending,
      diproses,
      selesai,
      ditolak,
      byStatus: {
        pending,
        diproses,
        selesai,
        ditolak
      }
    };
    
    res.json({
      success: true,
      message: 'Statistik laporan user berhasil diambil',
      data: stats
    });
    
  } catch (error) {
    console.error('Error getting user report stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik laporan user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/user/laporan/:id - Mendapatkan detail laporan berdasarkan ID (hanya milik user)
router.get('/:id', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const { id } = req.params;
    const userId = req.user.id;
    
    const pengaduan = await prisma.pengaduan.findFirst({
      where: {
        id: parseInt(id),
        userId: userId // Hanya bisa akses laporan sendiri
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!pengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan atau Anda tidak memiliki akses'
      });
    }
    
    res.json({
      success: true,
      message: 'Detail laporan berhasil diambil',
      data: pengaduan
    });
    
  } catch (error) {
    console.error('Error getting user report detail:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail laporan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/user/laporan/:id - Update laporan (hanya milik user dan status pending)
router.put('/:id', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const { id } = req.params;
    const userId = req.user.id;
    
    // Cek apakah laporan ada dan milik user
    const existingPengaduan = await prisma.pengaduan.findFirst({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });
    
    if (!existingPengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan atau Anda tidak memiliki akses'
      });
    }
    
    // Hanya bisa edit jika status masih pending
    if (existingPengaduan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Laporan hanya bisa diedit jika status masih pending'
      });
    }
    
    // Override req.params dan req.user untuk controller
    req.params.id = id;
    req.user = { id: userId, role: 'masyarakat' };
    
    // Panggil controller updatePengaduan
    await updatePengaduan(req, res);
    
  } catch (error) {
    console.error('Error updating user report:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate laporan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/user/laporan/:id - Hapus laporan (hanya milik user dan status pending)
router.delete('/:id', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const { id } = req.params;
    const userId = req.user.id;
    
    // Cek apakah laporan ada dan milik user
    const existingPengaduan = await prisma.pengaduan.findFirst({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });
    
    if (!existingPengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan atau Anda tidak memiliki akses'
      });
    }
    
    // Hanya bisa hapus jika status masih pending
    if (existingPengaduan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Laporan hanya bisa dihapus jika status masih pending'
      });
    }
    
    // Hapus laporan
    await prisma.pengaduan.delete({
      where: {
        id: parseInt(id)
      }
    });
    
    res.json({
      success: true,
      message: 'Laporan berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleting user report:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus laporan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;