class WeatherApp {
    constructor() {
        // Inisialisasi elemen-elemen DOM yang akan digunakan
        this.cityInput = document.getElementById('cityInput');
        this.weatherInfo = document.querySelector('.weather-info');
        this.forecastList = document.querySelector('.forecast-list');
        this.dateDisplay = document.getElementById('date-display');
        this.weatherIcon = document.getElementById("weather-icon");

        // Menambahkan properti baru
        this.tempUnit = 'C'; // Default menggunakan Celsius
        this.tempValue = null; // Menyimpan nilai suhu saat ini
        this.forecast = null; // Menyimpan data prakiraan cuaca

        // Menjalankan fungsi inisialisasi waktu dan event listener
        this.initializeDateTime();
        this.bindEvents();

        // Menambahkan fungsi drag scroll untuk forecast
        this.initDragScroll();

        // Mengatur latar belakang berdasarkan waktu hari
        this.setTimeBasedBackground();
    }

    bindEvents() {
        // Menambahkan event listener untuk input pencarian
        // Ketika user menekan tombol Enter, jalankan fungsi handleSearch
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Event ketika klik icon pencarian
        const searchIcon = document.querySelector('.fa-location-dot');
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                this.handleSearch();
            });
        }

        // Menambahkan event listener untuk tombol pergantian unit suhu
        const unitButtons = document.querySelectorAll('.unit-btn');
        if (unitButtons.length > 0) {
            unitButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleUnitChange(e.target));
            });
        }
    }

    initializeDateTime() {
        // Inisialisasi waktu dan memperbarui setiap detik
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();

        // Memperbarui tampilan waktu dengan format 24 jam (HH:mm)
        const timeElement = document.querySelector('.time');
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // Memperbarui tanggal di tampilan
        this.dateDisplay.textContent = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    setTimeBasedBackground() {
        const hour = new Date().getHours();

        // Menghapus kelas yang ada
        document.body.classList.remove('weather-clear', 'weather-cloudy', 'weather-night');

        // Malam hari (19:00 - 06:00)
        if (hour >= 19 || hour < 6) {
            document.body.classList.add('weather-night');
        }
    }

    async handleSearch() {
        // Mengambil nilai input kota dan menghapus spasi di awal/akhir
        const city = this.cityInput.value.trim();
        if (!city) return;

        try {
            // Menampilkan status loading
            this.setLoadingState(true);

            // Mengambil data cuaca dari API
            const weatherData = await weatherService.getWeatherData(city);

            // Memperbarui tampilan dengan data yang baru
            this.updateWeatherInfo(weatherData);
            this.updateForecast(weatherData.forecast);

        } catch (error) {
            // Menangani error jika terjadi masalah saat mengambil data
            console.error('Error fetching weather:', error);
            this.showError('Tidak dapat mengambil data cuaca. Batas API tercapai. Silakan coba lagi nanti.');
        } finally {
            // Menghilangkan status loading
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        // Mengatur tampilan saat loading data
        if (isLoading) {
            document.querySelector('.temp-value').textContent = '--';
            document.querySelector('.description').textContent = 'Loading...';
            this.forecastList.innerHTML = '<div class="forecast-item">Memuat prakiraan...</div>';
        }
    }

    updateWeatherInfo(data) {
        // Menyimpan suhu dalam Celsius untuk konversi nantinya
        this.tempValue = data.temperature;

        // Mengekstrak data cuaca yang diperlukan
        const { description, icon, humidity, windSpeed, precipitationProbability } = data;

        // Memperbarui informasi cuaca utama
        let displayTemp = this.tempValue;
        if (this.tempUnit === 'F') {
            displayTemp = helpers.celsiusToFahrenheit(this.tempValue);
        }
        
        document.querySelector('.temp-value').textContent = Math.round(displayTemp);
        document.querySelector('.temp-unit').textContent = `°${this.tempUnit}`;
        document.querySelector('.description').textContent = description;

        // Suhu min/max (disimulasikan)
        const minTemp = Math.round(this.tempValue - 2);
        const maxTemp = Math.round(this.tempValue + 2);
        
        let displayMinTemp, displayMaxTemp;
        if (this.tempUnit === 'F') {
            displayMinTemp = Math.round(helpers.celsiusToFahrenheit(minTemp));
            displayMaxTemp = Math.round(helpers.celsiusToFahrenheit(maxTemp));
        } else {
            displayMinTemp = minTemp;
            displayMaxTemp = maxTemp;
        }
        
        document.querySelector('.min-temp').innerHTML = 
            `<i class="fas fa-arrow-down"></i> ${displayMinTemp}°`;
        document.querySelector('.max-temp').innerHTML = 
            `<i class="fas fa-arrow-up"></i> ${displayMaxTemp}°`;

        // Memperbarui detail cuaca
        document.querySelector('.humidity').textContent = `${Math.round(humidity)}%`;
        document.querySelector('.wind-speed').textContent = `${Math.round(windSpeed)} km/h`;

        // Mengubah background berdasarkan deskripsi cuaca
        document.body.classList.remove('weather-clear', 'weather-cloudy', 'weather-night');

        this.weatherIcon.data = `./assets/icons/weather-${icon}.svg`;

        const hour = new Date().getHours();

        // Malam hari (19:00 - 06:00)
        if (hour >= 19 || hour < 6) {
            document.body.classList.add('weather-night');
        } else {
            // Latar belakang siang hari
            if (description.includes('Clear') || description.includes('Sunny')) {
                document.body.classList.add('weather-clear');
            } else if (description.includes('Cloud') || description.includes('Fog') ||
                      description.includes('Rain') || description.includes('Snow') ||
                      description.includes('Drizzle')) {
                document.body.classList.add('weather-cloudy');
            }
        }
        
        // Memaksa logo untuk memperbarui tampilannya berdasarkan cuaca saat ini
        const logo = document.querySelector('.logo');
        if (logo) {
            // Ini memicu reflow DOM yang memastikan transisi filter diterapkan
            void logo.offsetWidth;
        }
    }

    updateForecast(forecast) {
        // Menyimpan data prakiraan untuk konversi unit
        this.forecast = forecast;
        
        this.forecastList.innerHTML = '';
        
        if (!forecast || forecast.length === 0) {
            this.forecastList.innerHTML = '<div class="forecast-item">Tidak ada prakiraan tersedia</div>';
            return;
        }
        
        // Memastikan kita memiliki unit yang terdefinisi
        const unit = this.tempUnit || 'C';
        
        forecast.forEach(item => {
            // Mengkonversi suhu jika diperlukan
            let displayTemp = item.temperature;
            if (unit === 'F') {
                displayTemp = helpers.celsiusToFahrenheit(item.temperature);
            }
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-time">${item.time}</div>
                <div class="forecast-icon">
                    <i class="${this.getWeatherIcon(item.description)}"></i>
                </div>
                <div class="forecast-temp">${Math.round(displayTemp)}°${unit}</div>
            `;
            this.forecastList.appendChild(forecastItem);
        });
    }

    getWeatherIcon(description) {
        // Memetakan deskripsi cuaca ke ikon Font Awesome
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Mostly Clear': 'fas fa-sun',
            'Partly Cloudy': 'fas fa-cloud-sun',
            'Mostly Cloudy': 'fas fa-cloud',
            'Cloudy': 'fas fa-cloud',
            'Fog': 'fas fa-smog',
            'Drizzle': 'fas fa-cloud-rain',
            'Rain': 'fas fa-cloud-showers-heavy',
            'Light Rain': 'fas fa-cloud-rain',
            'Heavy Rain': 'fas fa-cloud-showers-heavy',
            'Snow': 'fas fa-snowflake',
            'Flurries': 'fas fa-snowflake',
            'Light Snow': 'fas fa-snowflake',
            'Heavy Snow': 'fas fa-snowflake',
            'Freezing Drizzle': 'fas fa-icicles',
            'Freezing Rain': 'fas fa-icicles',
            'Sleet': 'fas fa-cloud-meatball',
            'Thunderstorm': 'fas fa-bolt'
        };
        return iconMap[description] || 'fas fa-cloud';
    }

    showError(message) {
        // Membuat elemen untuk menampilkan pesan error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        // Menambahkan pesan error setelah kotak pencarian
        const searchBox = document.querySelector('.search-box');
        searchBox.insertAdjacentElement('afterend', errorDiv);

        // Menghapus pesan error setelah 3 detik
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    initDragScroll() {
        // Inisialisasi variabel untuk fitur drag scroll
        const slider = this.forecastList;
        let isDown = false;
        let startX;
        let scrollLeft;

        // Event listener untuk mouse down
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('grabbing');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        // Event listener ketika mouse meninggalkan area
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('grabbing');
        });

        // Event listener ketika mouse dilepas
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('grabbing');
        });

        // Event listener untuk gerakan mouse
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Pengali kecepatan scroll
            slider.scrollLeft = scrollLeft - walk;
        });

        // Event listener untuk touch events (mobile)
        slider.addEventListener('touchstart', (e) => {
            isDown = true;
            slider.classList.add('grabbing');
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('touchend', () => {
            isDown = false;
            slider.classList.remove('grabbing');
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    handleUnitChange(btnElement) {
        const newUnit = btnElement.dataset.unit;
        
        if (newUnit === this.tempUnit) return; // Tidak perlu perubahan
        
        // Memperbarui status tombol aktif
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        btnElement.classList.add('active');
        
        // Menyimpan unit baru
        this.tempUnit = newUnit;
        
        // Memperbarui tampilan suhu jika kita memiliki data
        if (this.tempValue !== null) {
            this.updateTemperatureDisplays();
        }
    }
    
    updateTemperatureDisplays() {
        // Suhu utama
        let displayTemp = this.tempValue;
        if (this.tempUnit === 'F') {
            displayTemp = helpers.celsiusToFahrenheit(this.tempValue);
        }
        
        document.querySelector('.temp-value').textContent = Math.round(displayTemp);
        document.querySelector('.temp-unit').textContent = `°${this.tempUnit}`;
        
        // Suhu min/max
        const minTemp = this.tempValue - 2;
        const maxTemp = this.tempValue + 2;
        
        let displayMinTemp, displayMaxTemp;
        if (this.tempUnit === 'F') {
            displayMinTemp = helpers.celsiusToFahrenheit(minTemp);
            displayMaxTemp = helpers.celsiusToFahrenheit(maxTemp);
        } else {
            displayMinTemp = minTemp;
            displayMaxTemp = maxTemp;
        }
        
        document.querySelector('.min-temp').innerHTML = 
            `<i class="fas fa-arrow-down"></i> ${Math.round(displayMinTemp)}°`;
        document.querySelector('.max-temp').innerHTML = 
            `<i class="fas fa-arrow-up"></i> ${Math.round(displayMaxTemp)}°`;
        
        // Memperbarui prakiraan jika tersedia
        if (this.forecast) {
            this.updateForecast(this.forecast);
        }
    }
}

// Menginisialisasi aplikasi ketika DOM sudah dimuat
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
