const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
  getProfile,
  updateProfile
} = require('../controllers/userController');
const {
  authenticateToken,
  authorizeRole,
  authorizeOwnerOrAdmin
} = require('../middleware/auth');

const router = express.Router();

// Routes untuk authentication

// POST /api/users/register - Register user baru
router.post('/register', registerUser);

// POST /api/users/login - Login user
router.post('/login', loginUser);

// GET /api/users/profile - Mendapatkan profile user yang sedang login
router.get('/profile', authenticateToken, getProfile);

// PUT /api/users/profile - Update profile user yang sedang login
router.put('/profile', authenticateToken, updateProfile);

// Routes untuk user management (perlu authentication)

// GET /api/users - Mendapatkan semua user (admin only)
// Query parameters: role, isActive, page, limit
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);

// GET /api/users/:id - Mendapatkan user berdasarkan ID
// Admin bisa akses semua, user biasa hanya bisa akses data sendiri
router.get('/:id', authenticateToken, authorizeOwnerOrAdmin, getUserById);

// PUT /api/users/:id - Update user
// Admin bisa update semua, user biasa hanya bisa update data sendiri
router.put('/:id', authenticateToken, authorizeOwnerOrAdmin, updateUser);

// PUT /api/users/:id/password - Update password user
// Admin bisa update semua, user biasa hanya bisa update password sendiri
router.put('/:id/password', authenticateToken, authorizeOwnerOrAdmin, updatePassword);

// DELETE /api/users/:id - Delete user (soft delete, admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteUser);

// Routes untuk utility

// GET /api/users/roles/list - Mendapatkan daftar role
router.get('/roles/list', (req, res) => {
  const roles = [
    { value: 'masyarakat', label: 'Masyarakat', description: 'User biasa yang bisa membuat pengaduan' },
    { value: 'admin', label: 'Administrator', description: 'Admin yang bisa mengelola pengaduan dan user' }
  ];

  res.json({
    success: true,
    message: 'Daftar role berhasil diambil',
    data: roles
  });
});

// GET /api/users/stats/summary - Statistik user (admin only)
router.get('/stats/summary', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const [totalUsers, activeUsers, adminUsers, masyarakatUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'masyarakat' } })
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminUsers,
      masyarakatUsers,
      usersByRole: {
        admin: adminUsers,
        masyarakat: masyarakatUsers
      },
      usersByStatus: {
        active: activeUsers,
        inactive: totalUsers - activeUsers
      }
    };

    res.json({
      success: true,
      message: 'Statistik user berhasil diambil',
      data: stats
    });

  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;