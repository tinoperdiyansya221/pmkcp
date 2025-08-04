const app = require('./src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Function to test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n📝 Pastikan:');
    console.log('1. PostgreSQL server sudah berjalan');
    console.log('2. Database sudah dibuat');
    console.log('3. URL database di .env sudah benar');
    console.log('4. Jalankan: npm run prisma:migrate\n');
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    // Test database connection first
    await testDatabaseConnection();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log('🚀 Server started successfully!');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📋 API Base URL: http://localhost:${PORT}/api`);
      console.log('\n📚 Available endpoints:');
      console.log('\n🔐 Authentication:');
      console.log(`   POST   /api/users/register      - Register user baru`);
      console.log(`   POST   /api/users/login         - Login user`);
      console.log(`   GET    /api/users/profile       - Profile user login`);
      console.log('\n👥 User Management:');
      console.log(`   GET    /api/users               - Semua user (admin)`);
      console.log(`   GET    /api/users/:id           - User by ID`);
      console.log(`   PUT    /api/users/:id           - Update user`);
      console.log(`   PUT    /api/users/:id/password  - Update password`);
      console.log(`   DELETE /api/users/:id           - Delete user (admin)`);
      console.log('\n📋 Pengaduan:');
      console.log(`   POST   /api/pengaduan           - Buat pengaduan baru`);
      console.log(`   GET    /api/pengaduan           - Ambil semua pengaduan`);
      console.log(`   GET    /api/pengaduan/:id       - Ambil pengaduan by ID`);
      console.log(`   PUT    /api/pengaduan/:id/status - Update status (admin)`);
      console.log(`   GET    /api/pengaduan/kategori/list - Daftar kategori`);
      console.log(`   GET    /api/pengaduan/status/list   - Daftar status`);
      console.log('\n⚡ Ready to accept requests!');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n🛑 SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  await prisma.$disconnect();
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('❌ Uncaught Exception:', err);
  await prisma.$disconnect();
  process.exit(1);
});

// Start the application
startServer();