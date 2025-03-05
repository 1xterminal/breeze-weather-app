const helpers = {
    // Temperature conversion functions
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    },

    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    },

    // Format temperature with unit
    formatTemperature(temp, unit = 'C') {
        const temperature = Math.round(temp);
        return `${temperature}°${unit}`;
    },

    // Debounce function to limit API calls
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

    // Cache management
    cache: new Map(),
    
    // Add rate limiting
    lastApiCall: 0,
    minCallInterval: 1000, // minimum 1 second between calls

    async checkRateLimit() {
        const now = Date.now();
        if (now - this.lastApiCall < this.minCallInterval) {
            throw new Error('Please wait before making another request');
        }
        this.lastApiCall = now;
    },

    setCacheItem(key, value, expirationMinutes = 30) {
        const item = {
            value,
            timestamp: Date.now(),
            expirationMinutes
        };
        this.cache.set(key, item);
    },

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