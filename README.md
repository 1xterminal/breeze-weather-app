```js
breeze-weather-app/               // root folder kita
├── index.html                    // file html -> titik masuk pertama aplikasi, hubungin css dan js
├── css/                       
│   └── styles.css                // untuk mengatur tampilan dan layout aplikasi            
├── app.js                        // file js utama -> mengatur logika aplikasi, event, dan interaksi pengguna
├── api/
│   ├── weatherService.js         // modul api isinya fungsi untuk ngambil dan memproses data cuaca dari API eksternal (OpenWeather)
├── utils/
│   ├── helpers.js                // util nyimpen helper functions untuk format data, konversi satuan, validasi, dll.
├── assets/                       // folder aset utk nyimpen file statis kek gambar, ikon, dan font
│   ├── icons/
└── README.md                     // dokumentasi (cara pengunaan, etc)
```