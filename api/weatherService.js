class WeatherService {
    constructor() {
        // Tomorrow.io API configuration
        this.API_KEY = 'oOGfCx3mV4quIn19t5s1wlxM4YkD9RNF'; 
        this.BASE_URL = 'https://api.tomorrow.io/v4/weather';
    }

    async getWeatherData(city) {
        try {
            const coords = await this.getCoordinates(city);
            
            const response = await fetch(
                `${this.BASE_URL}/forecast?location=${coords.lat},${coords.lon}&apikey=${this.API_KEY}&units=metric`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Weather data not available');
            }

            if (!data.timelines || !data.timelines.minutely) {
                throw new Error('Invalid weather data format');
            }

            return this.processWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error(error.message || 'Failed to fetch weather data');
        }
    }

    async getCoordinates(city) {
        try {
            // Using a free geocoding service (OpenStreetMap Nominatim)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
            );
            
            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();
            if (!data.length) {
                throw new Error('City not found');
            }

            return {
                lat: data[0].lat,
                lon: data[0].lon
            };
        } catch (error) {
            console.error('Error getting coordinates:', error);
            throw error;
        }
    }

    processWeatherData(data) {
        // Update according to Tomorrow.io response structure
        return {
            temperature: data.timelines.minutely[0].values.temperature,
            humidity: data.timelines.minutely[0].values.humidity,
            windSpeed: data.timelines.minutely[0].values.windSpeed,
            description: this.getWeatherDescription(data.timelines.minutely[0].values)
        };
    }

    getWeatherDescription(values) {
        // Update conditions based on Tomorrow.io parameters
        if (values.cloudCover > 70) return 'Cloudy';
        if (values.precipitationProbability > 30) return 'Rainy';
        if (values.temperature < 0) return 'Freezing';
        if (values.temperature > 30) return 'Hot';
        return 'Clear';
    }
}

// Create and export a single instance
const weatherService = new WeatherService(); 