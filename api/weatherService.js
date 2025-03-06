class WeatherService {
    constructor() {
        // Konfigurasi API Tomorrow.io
        // API key disimpan sebagai variabel
        this.API_KEY = 'FN3WzABuPoKVyMlymqyssgF7a0Bq26qx';
        // URL dasar untuk API Tomorrow.io
        this.BASE_URL = 'https://api.tomorrow.io/v4/weather';
    }

    async getWeatherData(city) {
        try {
            // Mendapatkan koordinat dari nama kota
            const coords = await this.getCoordinates(city);
            
            // Menentukan field data cuaca yang akan diminta
            const fields = [
                'temperature',     // Suhu
                'weatherCode',     // Kode kondisi cuaca
                'precipitationProbability', // Probabilitas hujan
                'humidity',        // Kelembaban
                'windSpeed'        // Kecepatan angin
            ].join(',');

            // Mengambil data cuaca saat ini dan prakiraan secara bersamaan
            const [currentWeather, forecast] = await Promise.all([
                this.getCurrentWeather(coords, fields),
                this.getForecast(coords, fields)
            ]);

            // Menggabungkan data cuaca saat ini dengan prakiraan
            return {
                ...currentWeather,
                forecast: forecast
            };
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    async getCurrentWeather(coords, fields) {
        // Mengambil data cuaca saat ini dari API
        const response = await fetch(
            `${this.BASE_URL}/realtime?location=${coords.lat},${coords.lon}&apikey=${this.API_KEY}&units=metric&fields=${fields}`
        );

        if (!response.ok) {
            throw new Error('Weather data not available');
        }

        const data = await response.json();
        return this.processWeatherData(data);
    }

    async getForecast(coords, fields) {
        // Mengambil data prakiraan cuaca dari API
        const response = await fetch(
            `${this.BASE_URL}/forecast?location=${coords.lat},${coords.lon}&apikey=${this.API_KEY}&units=metric&fields=${fields}&timesteps=1h`
        );

        if (!response.ok) {
            throw new Error('Forecast data not available');
        }

        const data = await response.json();
        return this.processForecastData(data);
    }

    processForecastData(data) {
        // Mengolah data prakiraan untuk 5 jam ke depan
        return data.timelines.hourly
            .slice(1, 6) // Mengambil 5 data pertama setelah saat ini
            .map(hour => ({
                // Memformat waktu ke format 24 jam
                time: new Date(hour.time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                temperature: hour.values.temperature,
                description: this.getWeatherDescription(hour.values.weatherCode)
            }));
    }

    async getCoordinates(city) {
        try {
            // Menggunakan layanan OpenStreetMap Nominatim untuk geocoding
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

            // Mengembalikan koordinat latitude dan longitude
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
        // Mengolah data cuaca dari response API
        const values = data.data.values;

        // Mengembalikan objek dengan data yang sudah diformat
        return {
            temperature: values.temperature,
            description: this.getWeatherDescription(values.weatherCode),
            humidity: values.humidity,
            windSpeed: values.windSpeed,
            precipitationProbability: values.precipitationProbability
        };
    }

    getWeatherDescription(code) {
        // Mengkonversi kode cuaca dari Tomorrow.io ke deskripsi yang mudah dibaca
        const weatherCodes = {
            1000: 'Clear',               // Cerah
            1100: 'Mostly Clear',        // Sebagian besar cerah
            1101: 'Partly Cloudy',       // Berawan sebagian
            1102: 'Mostly Cloudy',       // Sebagian besar berawan
            1001: 'Cloudy',              // Berawan
            2000: 'Fog',                 // Berkabut
            4000: 'Drizzle',             // Gerimis
            4001: 'Rain',                // Hujan
            4200: 'Light Rain',          // Hujan ringan
            4201: 'Heavy Rain',          // Hujan lebat
            5000: 'Snow',                // Salju
            5001: 'Flurries',            // Salju ringan
            5100: 'Light Snow',          // Salju ringan
            5101: 'Heavy Snow',          // Salju lebat
            6000: 'Freezing Drizzle',    // Gerimis membeku
            6001: 'Freezing Rain',       // Hujan membeku
            7000: 'Sleet',               // Hujan es
            7101: 'Heavy Sleet',         // Hujan es lebat
            8000: 'Thunderstorm'         // Badai petir
        };

        return weatherCodes[code] || 'Unknown';
    }
}

// Membuat dan mengekspor instance tunggal dari WeatherService
const weatherService = new WeatherService(); 