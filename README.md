# Breeze - Aplikasi Cuaca

Breeze adalah aplikasi cuaca modern dengan antarmuka pengguna yang intuitif untuk menampilkan informasi cuaca saat ini dan perkiraan cuaca per jam. Aplikasi ini menggunakan API Tomorrow.io untuk mendapatkan data cuaca terkini dengan tampilan visual yang menarik.

## Fitur Aplikasi

- **Pencarian Kota**: Cari informasi cuaca untuk lokasi manapun di dunia
- **Tampilan Cuaca Saat Ini**: Menampilkan suhu, deskripsi cuaca, kelembaban, dan kecepatan angin
- **Perkiraan Per Jam**: Lihat perkiraan cuaca untuk 5 jam ke depan
- **Konversi Satuan**: Beralih antara derajat Celcius (°C) dan Fahrenheit (°F)
- **Tema Dinamis**: Warna latar belakang berubah sesuai dengan kondisi cuaca dan waktu hari
- **UI Responsif**: Tampilan yang menyesuaikan dengan ukuran layar perangkat
- **Ikon Cuaca**: Representasi visual dari kondisi cuaca saat ini
- **Waktu Lokal**: Menampilkan waktu dan tanggal saat ini

## Struktur Direktori

```js
breeze-weather-app/               // root folder kita
├── index.html                    // file html -> titik masuk pertama aplikasi, hubungin css dan js
├── css/                       
│   └── styles.css                // untuk mengatur tampilan dan layout aplikasi            
├── app.js                        // file js utama -> mengatur logika aplikasi, event, dan interaksi pengguna
├── api/
│   ├── weatherService.js         // modul api isinya fungsi untuk ngambil dan memproses data cuaca dari API eksternal (Tomorrow.io)
├── utils/
│   ├── helpers.js                // util nyimpen helper functions untuk format data, konversi satuan, validasi, dll.
├── assets/                       // folder aset utk nyimpen file statis kek gambar, ikon, dan font
│   ├── icons/
├── breeze-postman-collection.json // kumpulan request API untuk Postman
├── breeze-environment.json       // variabel lingkungan untuk Postman
└── README.md                     // dokumentasi (cara pengunaan, etc)
```

## Cara Menjalankan Aplikasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/1xterminal/breeze-weather-app.git
   cd breeze-weather-app
   ```

2. **Buka Aplikasi**
   - Buka file `index.html` di browser web Anda
   - Atau gunakan server lokal seperti Live Server di VSCode

3. **API Key**
   - Aplikasi ini menggunakan API key Tomorrow.io yang sudah disediakan
   - Jika ingin menggunakan API key sendiri, ganti nilai `API_KEY` di file `weatherService.js`

## Contoh Penggunaan

1. **Mencari Informasi Cuaca**
   - Ketik nama kota di kotak pencarian (misalnya "Jakarta", "Surabaya", "Bandung")
   - Tekan Enter atau klik ikon pencarian
   - Informasi cuaca saat ini dan perkiraan per jam akan ditampilkan

2. **Mengubah Satuan Suhu**
   - Klik tombol °C atau °F di pojok kanan atas kartu cuaca
   - Semua nilai suhu akan dikonversi ke satuan yang dipilih

3. **Melihat Perkiraan Per Jam**
   - Perkiraan per jam ditampilkan di bagian bawah aplikasi
   - Geser ke kiri/kanan untuk melihat perkiraan jam berikutnya

## Menggunakan Postman Collection

Repository ini dilengkapi dengan file Postman Collection dan Environment untuk memudahkan pengujian API:

1. **Import ke Postman**
   - Buka Postman
   - Klik tombol "Import" di kiri atas
   - Pilih file `breeze-postman-collection.json` dan `breeze-environment.json`

2. **Mengaktifkan Environment**
   - Setelah import, pilih "Breeze Weather Environment" dari dropdown environment di kanan atas
   - Environment berisi variabel seperti API key, koordinat default, dan nama kota

3. **Menggunakan Collection**
   - Kumpulan request dibagi menjadi dua folder:
     - **Tomorrow.io**: Untuk mengakses data cuaca (realtime dan forecast)
     - **Geocoding**: Untuk mengkonversi nama kota menjadi koordinat

4. **Alur Pengujian API**
   - Pertama, jalankan request "Get City Coordinates" untuk mendapatkan koordinat dari nama kota
   - Salin nilai latitude dan longitude ke variabel environment
   - Kemudian jalankan "Get Current Weather" atau "Get Weather Forecast"

5. **Melihat dan Mengubah Variabel**
   - Klik ikon mata (Environment quick look) di kanan atas
   - Anda dapat melihat dan mengubah variabel seperti api_key, lat, lon, dan city

Collection ini mencerminkan cara aplikasi Breeze berkomunikasi dengan API eksternal dan dapat digunakan untuk pengujian atau pengembangan lebih lanjut.

## Teknologi yang Digunakan

- HTML5, CSS3, dan JavaScript murni (tanpa framework)
- API Tomorrow.io untuk data cuaca
- OpenStreetMap Nominatim API untuk pencarian lokasi
- Font Awesome untuk ikon

## Batasan

- API Tomorrow.io memiliki batas penggunaan 25 permintaan per hari untuk versi gratis
- Beberapa data seperti rentang suhu min/max disimulasikan

## Pengembang

### Tim Pengembang:
- Gian Kenar Javier (535240066) - [1xterminal](https://github.com/1xterminal)
- Martin Cahyadi (535240069) - [CheeseCakeBernatrium](https://github.com/CheeseCakeBernatrium)
- Advendra Adeswanta (535240073) - [ADeswanta](https://github.com/ADeswanta)

### API yang Digunakan:
- Data Cuaca: [Tomorrow.io](https://www.tomorrow.io/)
- Layanan Geocoding: [OpenStreetMap Nominatim](https://nominatim.org/)