const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk membuat pengaduan baru
const createPengaduan = async (req, res) => {
  try {
    const { nama, nomor_hp, kategori, judul, deskripsi, lokasi } = req.body;
    const userId = req.user ? req.user.id : null; // Opsional jika user login
    
    // Debug: Log data yang diterima
    console.log('=== Data yang diterima di backend ===');
    console.log('req.body:', req.body);
    console.log('nama:', nama);
    console.log('nomor_hp:', nomor_hp);
    console.log('kategori:', kategori);
    console.log('judul:', judul);
    console.log('deskripsi:', deskripsi);
    console.log('lokasi:', lokasi);
    console.log('userId:', userId);
    console.log('=====================================');

    // Validasi input
    if (!nama || !nomor_hp || !kategori || !deskripsi) {
      return res.status(400).json({
        success: false,
        message: 'Field nama, nomor_hp, kategori, dan deskripsi wajib diisi'
      });
    }

    // Validasi nomor HP (minimal 10 digit)
    if (nomor_hp.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Nomor HP minimal 10 digit'
      });
    }

    // Validasi kategori
    const validKategori = ['infrastruktur', 'kebersihan', 'keamanan', 'pelayanan publik', 'lingkungan', 'transportasi', 'lainnya'];
    if (!validKategori.includes(kategori.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak valid. Pilihan: infrastruktur, kebersihan, keamanan, pelayanan publik, lingkungan, transportasi, lainnya'
      });
    }

    // Buat pengaduan baru
    const pengaduan = await prisma.pengaduan.create({
      data: {
        judul: judul ? judul.trim() : 'Laporan Pengaduan',
        nama: nama.trim(),
        alamat: lokasi ? lokasi.trim() : null,
        nomor_hp: nomor_hp.trim(),
        kategori: kategori.toLowerCase(),
        isi: deskripsi.trim(),
        status: 'pending',
        userId: userId // Hubungkan dengan user jika login
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nama: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Pengaduan berhasil dibuat',
      data: pengaduan
    });

  } catch (error) {
    console.error('Error creating pengaduan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat pengaduan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk mendapatkan semua pengaduan
const getAllPengaduan = async (req, res) => {
  try {
    const { status, kategori, userId, page = 1, limit = 10 } = req.query;
    const currentUser = req.user;
    
    // Build filter object
    const where = {};
    if (status) where.status = status;
    if (kategori) where.kategori = kategori.toLowerCase();
    
    // Filter berdasarkan user role
    if (currentUser && currentUser.role === 'masyarakat') {
      where.userId = currentUser.id; // User biasa hanya bisa lihat pengaduan sendiri
    } else if (currentUser && currentUser.role === 'admin') {
      // Admin bisa melihat semua pengaduan atau filter berdasarkan user tertentu
      if (userId) {
        where.userId = parseInt(userId);
      }
      // Jika tidak ada userId, admin melihat semua pengaduan (tidak ada filter userId)
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get pengaduan with pagination
    const [pengaduan, total] = await Promise.all([
      prisma.pengaduan.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              nama: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.pengaduan.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / take);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      message: 'Data pengaduan berhasil diambil',
      data: pengaduan,
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
    console.error('Error getting pengaduan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengaduan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk mendapatkan pengaduan berdasarkan ID
const getPengaduanById = async (req, res) => {
  try {
    const { id } = req.params;

    const pengaduan = await prisma.pengaduan.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nama: true,
            role: true
          }
        }
      }
    });

    if (!pengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Pengaduan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data pengaduan berhasil diambil',
      data: pengaduan
    });

  } catch (error) {
    console.error('Error getting pengaduan by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengaduan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk update status pengaduan
const updateStatusPengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    const validStatus = ['pending', 'diproses', 'selesai', 'ditolak'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid. Pilihan: pending, diproses, selesai, ditolak'
      });
    }

    const pengaduan = await prisma.pengaduan.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nama: true,
            role: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Status pengaduan berhasil diupdate',
      data: pengaduan
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Pengaduan tidak ditemukan'
      });
    }

    console.error('Error updating pengaduan status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status pengaduan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk update pengaduan (hanya oleh pembuat atau admin)
const updatePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, nama, alamat, nomor_hp, kategori, isi } = req.body;
    const currentUser = req.user;

    // Cek apakah pengaduan ada
    const existingPengaduan = await prisma.pengaduan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Pengaduan tidak ditemukan'
      });
    }

    // Cek authorization - hanya pembuat atau admin yang bisa update
    if (currentUser.role !== 'admin' && existingPengaduan.userId !== currentUser.id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengupdate pengaduan ini'
      });
    }

    // Validasi input jika ada
    const updateData = {};
    if (judul) updateData.judul = judul.trim();
    if (nama) updateData.nama = nama.trim();
    if (alamat !== undefined) updateData.alamat = alamat ? alamat.trim() : null;
    if (nomor_hp) {
      if (nomor_hp.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Nomor HP minimal 10 digit'
        });
      }
      updateData.nomor_hp = nomor_hp.trim();
    }
    if (kategori) {
      const validKategori = ['infrastruktur', 'pelayanan', 'keamanan', 'kebersihan', 'lainnya'];
      if (!validKategori.includes(kategori.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Kategori tidak valid. Pilihan: infrastruktur, pelayanan, keamanan, kebersihan, lainnya'
        });
      }
      updateData.kategori = kategori.toLowerCase();
    }
    if (isi) updateData.isi = isi.trim();

    // Update pengaduan
    const updatedPengaduan = await prisma.pengaduan.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nama: true,
            role: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Pengaduan berhasil diupdate',
      data: updatedPengaduan
    });

  } catch (error) {
    console.error('Error updating pengaduan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate pengaduan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk delete pengaduan (hanya oleh admin)
const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Hanya admin yang bisa delete
    if (currentUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Hanya admin yang dapat menghapus pengaduan'
      });
    }

    // Cek apakah pengaduan ada
    const existingPengaduan = await prisma.pengaduan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Pengaduan tidak ditemukan'
      });
    }

    // Delete pengaduan
    await prisma.pengaduan.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Pengaduan berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting pengaduan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pengaduan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk mendapatkan statistik pengaduan (untuk admin dashboard)
const getPengaduanStats = async (req, res) => {
  try {
    const currentUser = req.user;

    // Hanya admin yang bisa akses statistik
    if (currentUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin yang dapat melihat statistik'
      });
    }

    // Hitung total pengaduan
    const totalPengaduan = await prisma.pengaduan.count();

    // Hitung berdasarkan status
    const statusStats = await prisma.pengaduan.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Hitung berdasarkan kategori
    const kategoriStats = await prisma.pengaduan.groupBy({
      by: ['kategori'],
      _count: {
        kategori: true
      }
    });

    // Pengaduan terbaru (5 terakhir)
    const recentPengaduan = await prisma.pengaduan.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      }
    });

    // Format data statistik
    const formattedStatusStats = statusStats.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    const formattedKategoriStats = kategoriStats.reduce((acc, item) => {
      acc[item.kategori] = item._count.kategori;
      return acc;
    }, {});

    res.json({
      success: true,
      message: 'Statistik pengaduan berhasil diambil',
      data: {
        total: totalPengaduan,
        byStatus: formattedStatusStats,
        byKategori: formattedKategoriStats,
        recent: recentPengaduan
      }
    });

  } catch (error) {
    console.error('Error getting pengaduan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik pengaduan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createPengaduan,
  getAllPengaduan,
  getPengaduanById,
  updateStatusPengaduan,
  updatePengaduan,
  deletePengaduan,
  getPengaduanStats
};