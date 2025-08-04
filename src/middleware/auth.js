const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware untuk verifikasi JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token akses diperlukan'
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek apakah user masih ada dan aktif
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak aktif'
      });
    }

    // Tambahkan user info ke request object
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error dalam verifikasi token'
    });
  }
};

// Middleware untuk authorization berdasarkan role
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Role tidak memiliki izin'
      });
    }

    next();
  };
};

// Middleware untuk memastikan user hanya bisa akses data sendiri atau admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User tidak terautentikasi'
    });
  }

  const targetUserId = parseInt(req.params.id);
  const currentUserId = req.user.userId;
  const userRole = req.user.role;

  // Admin bisa akses semua, user biasa hanya bisa akses data sendiri
  if (userRole === 'admin' || currentUserId === targetUserId) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak. Anda hanya bisa mengakses data sendiri'
    });
  }
};

// Middleware opsional untuk authentication (tidak wajib login)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // Jika tidak ada token, lanjutkan tanpa user info
      req.user = null;
      return next();
    }

    // Jika ada token, verifikasi
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (user && user.isActive) {
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // Jika token invalid, lanjutkan tanpa user info
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeOwnerOrAdmin,
  optionalAuth
};