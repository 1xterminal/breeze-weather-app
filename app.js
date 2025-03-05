class WeatherApp {
    constructor() {
        // DOM Elements
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.celsiusBtn = document.getElementById('celsiusBtn');
        this.fahrenheitBtn = document.getElementById('fahrenheitBtn');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.errorMessage = document.getElementById('errorMessage');

        // State
        this.currentUnit = 'C';
        this.currentWeatherData = null;

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        // Search events
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Temperature unit toggle
        this.celsiusBtn.addEventListener('click', () => this.setTemperatureUnit('C'));
        this.fahrenheitBtn.addEventListener('click', () => this.setTemperatureUnit('F'));

        // Debounced search for input changes
        this.cityInput.addEventListener('input', 
            helpers.debounce(() => this.handleSearch(), 500)
        );
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) return;

        try {
            this.showLoading(true);
            this.hideError();

            // Check cache first
            const cachedData = helpers.getCacheItem(city);
            if (cachedData) {
                this.currentWeatherData = cachedData;
                this.updateUI();
                return;
            }

            // Fetch new data if not in cache
            const weatherData = await weatherService.getWeatherData(city);
            this.currentWeatherData = weatherData;
            
            // Cache the results
            helpers.setCacheItem(city, weatherData);
            
            this.updateUI();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    setTemperatureUnit(unit) {
        this.currentUnit = unit;
        this.celsiusBtn.classList.toggle('active', unit === 'C');
        this.fahrenheitBtn.classList.toggle('active', unit === 'F');
        if (this.currentWeatherData) {
            this.updateUI();
        }
    }

    updateUI() {
        if (!this.currentWeatherData) return;

        const { temperature, humidity, windSpeed, description } = this.currentWeatherData;
        
        let displayTemp = temperature;
        if (this.currentUnit === 'F') {
            displayTemp = helpers.celsiusToFahrenheit(temperature);
        }

        this.weatherInfo.querySelector('.current-weather').innerHTML = `
            <h2>${this.cityInput.value}</h2>
            <div class="temperature">${helpers.formatTemperature(displayTemp, this.currentUnit)}</div>
            <div class="description">${description}</div>
            <div class="details">
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    }

    showLoading(show) {
        this.loadingIndicator.classList.toggle('hidden', !show);
        this.weatherInfo.classList.toggle('hidden', show);
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.weatherInfo.classList.add('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
