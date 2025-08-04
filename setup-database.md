# Setup Database PostgreSQL

## 1. Install PostgreSQL

### Windows:
1. Download PostgreSQL dari https://www.postgresql.org/download/windows/
2. Install dengan mengikuti wizard
3. Catat username dan password yang dibuat

### Atau menggunakan Docker:
```bash
docker run --name postgres-pengaduan -e POSTGRES_PASSWORD=password -e POSTGRES_DB=pengaduan_db -p 5432:5432 -d postgres:15
```

## 2. Buat Database

### Menggunakan psql:
```sql
-- Login ke PostgreSQL
psql -U postgres -h localhost

-- Buat database
CREATE DATABASE pengaduan_db;

-- Buat user (opsional)
CREATE USER pengaduan_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pengaduan_db TO pengaduan_user;
```

### Menggunakan pgAdmin:
1. Buka pgAdmin
2. Connect ke server PostgreSQL
3. Klik kanan "Databases" → "Create" → "Database"
4. Nama database: `pengaduan_db`

## 3. Update File .env

Sesuaikan URL database di file `.env`:

```env
# Untuk user postgres default
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/pengaduan_db?schema=public"

# Atau untuk user custom
DATABASE_URL="postgresql://pengaduan_user:your_password@localhost:5432/pengaduan_db?schema=public"

# Untuk Docker
DATABASE_URL="postgresql://postgres:password@localhost:5432/pengaduan_db?schema=public"
```

## 4. Jalankan Migration

```bash
npm run prisma:migrate
```

## 5. Test Koneksi

```bash
npm run dev
```

Jika berhasil, akan muncul pesan:
```
✅ Database connected successfully
🚀 Server started successfully!
📍 Server running on: http://localhost:5000
```

## Troubleshooting

### Error: Can't reach database server
- Pastikan PostgreSQL service berjalan
- Cek port 5432 tidak digunakan aplikasi lain
- Pastikan firewall tidak memblokir koneksi

### Error: Authentication failed
- Cek username dan password di DATABASE_URL
- Pastikan user memiliki akses ke database

### Error: Database does not exist
- Pastikan database `pengaduan_db` sudah dibuat
- Cek nama database di DATABASE_URL