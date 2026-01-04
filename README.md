# Project Present Madani

Repo: https://github.com/fahmiXD/project_present_madani

## Ringkasan
Proyek ini berisi sebuah halaman PHP sederhana `index.php` sebagai titik masuk.

## Menjalankan secara lokal (Windows)

Prerequisite: PHP harus terpasang dan tersedia di PATH.

1. Buka PowerShell, lalu jalankan:

```powershell
cd 'D:\Project Present'
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