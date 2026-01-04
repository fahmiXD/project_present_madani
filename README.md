# Presensi Madani Creative

Monorepo with frontend (Next.js + Tailwind) and backend (Express + Prisma + MySQL).

## Quick start (recommended: Docker)

1. Start MySQL and Adminer:

```bash
docker-compose up -d
```

2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env if needed (DATABASE_URL, JWT_SECRET)
npx prisma generate
npm run dev
```

3. Frontend

```bash
cd frontend
npm install
export NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
```

Open `http://localhost:3000` for frontend, and `http://localhost:4000` for API. Adminer is on port `8080`.

## Notes

- Prisma schema located at `backend/prisma/schema.prisma`.
- API endpoints: `POST /auth/login`, `POST /attendance/checkin`, `POST /attendance/checkout`, `GET /attendance/history/:userId`.
- The `presensi` page implements basic camera capture and geolocation and posts to the API. Improve production handling for image storage, auth, and validation.
# Project Present Madani

Repo: https://github.com/fahmiXD/project_present_madani

## Ringkasan
Proyek ini berisi sebuah halaman PHP sederhana `index.php` sebagai titik masuk.

## Menjalankan secara lokal (Windows)

Prerequisite: PHP harus terpasang dan tersedia di PATH.

1. Buka PowerShell, lalu jalankan:

```powershell
cd 'D:\Project Present Madani'
php -S localhost:8000 -t .
```

2. Buka browser ke: http://localhost:8000

Jika menerima error `php` not found, instal salah satu cara berikut:

- Gunakan XAMPP/WampServer: unduh dan install XAMPP atau WampServer, lalu letakkan proyek di `htdocs` atau jalankan PHP dari folder instalasi.
- Atau pasang PHP via Chocolatey (butuh admin):

```powershell
choco install php
```

- Atau pasang manual dari https://windows.php.net dan tambahkan lokasi `php.exe` ke `PATH`.

## Git (sudah di-setup)

Repo sudah diinisialisasi dan `index.php` telah dipush ke remote `origin`:

```powershell
# jika perlu push perubahan lagi
git add .
git commit -m "Your message"
git push origin main
```

## Langkah selanjutnya (opsional)
- Setup GitHub Actions untuk CI/deploy.
- Deploy ke hosting yang mendukung PHP (shared host, DigitalOcean droplet, Heroku via buildpack, dsb.).