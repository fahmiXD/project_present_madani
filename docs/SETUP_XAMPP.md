# Setup XAMPP untuk "Project Present Madani"

> Petunjuk ini ditulis untuk Windows dengan XAMPP terinstal di `C:\xampp` dan project berada di `D:/Project Present Madani`.

## 1) Verifikasi PHP/XAMPP

- Buka XAMPP Control Panel, pastikan Apache (dan MySQL jika diperlukan) berjalan.
- Untuk mengecek PHP CLI (opsional), buka Command Prompt baru dan jalankan:

```powershell
"C:\xampp\php\php.exe" -v
php -v    # jika Anda menambahkan PHP ke PATH
php -m    # daftar ekstensi
php -i | findstr /C:"Loaded Configuration File"
```

## 2) Menambah `C:\xampp\php` ke PATH (opsional, kalau mau pakai `php` di CMD)

1. Buka Settings → System → About → Advanced system settings → Environment Variables.
2. Pilih `Path` pada `System variables` → Edit → New, tambahkan `C:\xampp\php`.
3. Tutup semua Command Prompt/terminal lalu buka lagi; jalankan `php -v` untuk verifikasi.

## 3) Konfigurasi `php.ini` dasar

- Lokasi: `C:\xampp\php\php.ini`
- Aktifkan ekstensi yang umum dipakai (hapus `;` di awal baris):

```
extension=mysqli
extension=pdo_mysql
```

- Setelah sunting, restart Apache lewat XAMPP Control Panel.

## 4) Meletakkan project Anda

- Letakkan sumber proyek di `D:/Project Present Madani` (sudah dalam kondisi ini menurut workspace).
- Untuk mengakses dari browser tanpa VirtualHost: copy/rename folder ke `C:\xampp\htdocs\your-folder` atau gunakan VirtualHost (direkomendasikan).

## 5) Menambahkan VirtualHost (direkomendasikan)

1. Edit file `C:\xampp\apache\conf\extra\httpd-vhosts.conf`, tambahkan:

```
<VirtualHost *:80>
    DocumentRoot "D:/Project Present Madani"
    ServerName project.local
    <Directory "D:/Project Present Madani">
        Require all granted
        AllowOverride All
    </Directory>
</VirtualHost>
```

2. Edit file hosts (`C:\Windows\System32\drivers\etc\hosts`) sebagai Administrator, tambahkan:

```
127.0.0.1 project.local
```

3. Restart Apache. Buka `http://project.local/` di browser.

## 6) Menguji PHP (phpinfo)

Letakkan file `index.php` berikut di root proyek (sudah ada di repo):

```php
<?php
phpinfo();
```

Lalu buka `http://project.local/` atau `http://localhost/`.

## 7) Troubleshooting singkat

- Apache tidak bisa start: cek port 80/443 conflict (mis. Skype/WSL). Ganti port Apache atau hentikan aplikasi lain.
- Ekstensi tidak aktif: pastikan Anda mengedit `C:\xampp\php\php.ini` yang benar, lalu restart Apache.
- Jika muncul error terkait Visual C++: install Visual C++ Redistributable (Microsoft).

## 8) Tips deploy & GitHub Actions

- Jika ingin deploy otomatis dari GitHub, tambahkan workflow di `.github/workflows/deploy.yml` dan simpan kredensial (FTP/SFTP) di _Repository Secrets_. Contoh workflow disediakan di repo.

---
Jika mau, saya bisa langsung membuat VirtualHost config file contoh atau menyiapkan skrip PowerShell untuk menambahkan PATH/hosts — beri konfirmasi untuk melanjutkan.
