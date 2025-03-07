const helpers = {
    // Fungsi konversi celcius ke fahrenheit
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    },

    // Fungsi konversi fahrenheit ke celcius
    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    },

    // Mengformat temperatur dengan satuan ukurnya
    formatTemperature(temp, unit = 'C') {
        const temperature = Math.round(temp);
        return `${temperature}°${unit}`;
    },

    // Untuk membatasi pemanggilan API
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Manajemen cache
    cache: new Map(),
    
    // Menambahkan rate limiting
    lastApiCall: 0,
    minCallInterval: 1000, // minimal 1 detik sebelum pemanggilan selanjutnya

    // Mengecek rate limit
    async checkRateLimit() {
        const now = Date.now();
        if (now - this.lastApiCall < this.minCallInterval) {
            throw new Error('Please wait before making another request');
        }
        this.lastApiCall = now;
    },

    // Menetapkan dan menyimpan data yang telah diambil dari API
    setCacheItem(key, value, expirationMinutes = 30) {
        const item = {
            value,
            timestamp: Date.now(),
            expirationMinutes
        };
        this.cache.set(key, item);
    },

    // Mengambil data yang telah disimpan (data yang terambil dari API)
    getCacheItem(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        const now = Date.now();
        const expirationMs = item.expirationMinutes * 60 * 1000;
        
        if (now - item.timestamp > expirationMs) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }
}; 