class WeatherApp {
    constructor() {
        // Inisialisasi elemen-elemen DOM yang akan digunakan
        this.cityInput = document.getElementById('cityInput');
        this.weatherInfo = document.querySelector('.weather-info');
        this.forecastList = document.querySelector('.forecast-list');
        this.dateDisplay = document.getElementById('date-display');
        this.weatherIcon = document.getElementById("weather-icon");

        // Menjalankan fungsi inisialisasi waktu dan event listener
        this.initializeDateTime();
        this.bindEvents();

        // Menambahkan fungsi drag scroll untuk forecast
        this.initDragScroll();

        // Set background based on time of day
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

        // Search icon click
        document.querySelector('.search-icon').addEventListener('click', () => {
            this.handleSearch();
        });
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

        // Clear any existing classes
        document.body.classList.remove('weather-clear', 'weather-cloudy', 'weather-night');

        // Night time (7PM - 6AM)
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
            this.showError('Could not fetch weather data. Please try again.');
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
            this.forecastList.innerHTML = '<div class="forecast-item">Loading forecasts...</div>';
        }
    }

    updateWeatherInfo(data) {
        // Mengekstrak data cuaca yang diperlukan
        const { temperature, description, icon, humidity, windSpeed, precipitationProbability } = data;

        // Memperbarui informasi cuaca utama
        // document.querySelector('.location-text').textContent = this.cityInput.value;
        document.querySelector('.temp-value').textContent = Math.round(temperature);
        document.querySelector('.description').textContent = description;

        // Min/max temperature (simulated for now)
        const minTemp = Math.round(temperature - 2);
        const maxTemp = Math.round(temperature + 2);
        document.querySelector('.min-temp').innerHTML = `<i class="fas fa-arrow-down"></i> ${minTemp}°`;
        document.querySelector('.max-temp').innerHTML = `<i class="fas fa-arrow-up"></i> ${maxTemp}°`;

        // Update weather details
        document.querySelector('.humidity').textContent = `${Math.round(humidity)}%`;
        document.querySelector('.wind-speed').textContent = `${Math.round(windSpeed)} km/h`;

        // Mengubah background berdasarkan deskripsi cuaca
        document.body.classList.remove('weather-clear', 'weather-cloudy', 'weather-night');

        this.weatherIcon.data = `./assets/icons/weather-${icon}.svg`;

        const hour = new Date().getHours();

        // Night time (7PM - 6AM)
        if (hour >= 19 || hour < 6) {
            document.body.classList.add('weather-night');
        } else {
            // Day time backgrounds
            if (description.includes('Clear') || description.includes('Sunny')) {
                document.body.classList.add('weather-clear');
            } else if (description.includes('Cloud') || description.includes('Fog') ||
                      description.includes('Rain') || description.includes('Snow') ||
                      description.includes('Drizzle')) {
                document.body.classList.add('weather-cloudy');
            }
        }
        
        // Force logo to update its appearance based on current weather
        const logo = document.querySelector('.logo');
        if (logo) {
            // This triggers a DOM reflow which ensures the filter transition is applied
            void logo.offsetWidth;
        }
    }

    updateForecast(forecast) {
        // Membersihkan daftar ramalan cuaca yang lama
        this.forecastList.innerHTML = '';

        // Menampilkan pesan jika tidak ada data ramalan
        if (!forecast || forecast.length === 0) {
            this.forecastList.innerHTML = '<div class="forecast-item">No forecast available</div>';
            return;
        }

        // Menambahkan item ramalan cuaca baru
        forecast.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-time">${item.time}</div>
                <div class="forecast-icon">
                    <i class="${this.getWeatherIcon(item.description)}"></i>
                </div>
                <div class="forecast-temp">${Math.round(item.temperature)}°</div>
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
}

// Menginisialisasi aplikasi ketika DOM sudah dimuat
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
