const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Fungsi untuk register user baru
const registerUser = async (req, res) => {
  try {
    const { email, password, role = 'masyarakat', nama, noHp } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }

    // Validasi role
    const validRoles = ['masyarakat', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid. Pilihan: masyarakat, admin'
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        nama: nama ? nama.trim() : null,
        nomor_hp: noHp ? noHp.trim() : null,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        nomor_hp: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'User berhasil didaftarkan',
      data: user
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mendaftarkan user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Cek apakah user aktif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak aktif. Hubungi administrator'
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Response tanpa password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk mendapatkan semua user (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          role: true,
          nama: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          pengaduan: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / take);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      message: 'Data user berhasil diambil',
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: take,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk mendapatkan user berdasarkan ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      },
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        pengaduan: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data user berhasil diambil',
      data: user
    });

  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nama, role, isActive } = req.body;

    // Validasi email jika diubah
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format email tidak valid'
        });
      }

      // Cek apakah email sudah digunakan user lain
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          NOT: {
            id: parseInt(id)
          }
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah digunakan user lain'
        });
      }
    }

    // Validasi role jika diubah
    if (role) {
      const validRoles = ['masyarakat', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role tidak valid. Pilihan: masyarakat, admin'
        });
      }
    }

    // Build update data
    const updateData = {};
    if (email) updateData.email = email.toLowerCase().trim();
    if (nama !== undefined) updateData.nama = nama ? nama.trim() : null;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User berhasil diupdate',
      data: user
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk update password
const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan password baru wajib diisi'
      });
    }

    // Validasi password baru minimal 6 karakter
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter'
      });
    }

    // Ambil user dengan password
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Verifikasi password lama
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password lama tidak benar'
      });
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Password berhasil diupdate'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Set user menjadi tidak aktif (soft delete)
    const user = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        isActive: false
      },
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      message: 'User berhasil dihapus (dinonaktifkan)',
      data: user
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk mendapatkan profile user yang sedang login
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        nomor_hp: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Profile berhasil diambil',
      data: user
    });

  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk update profile user yang sedang login
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nama, email, nomor_hp } = req.body;

    // Validasi email jika diubah
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format email tidak valid'
        });
      }

      // Cek apakah email sudah digunakan user lain
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan oleh user lain'
        });
      }
    }

    // Siapkan data untuk update
    const updateData = {};
    if (nama !== undefined) updateData.nama = nama ? nama.trim() : null;
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (nomor_hp !== undefined) updateData.nomor_hp = nomor_hp ? nomor_hp.trim() : null;

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        nomor_hp: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: user
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
  getProfile,
  updateProfile
};