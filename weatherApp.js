const weatherIconElem = document.querySelector('.weatherIcon');
const temperatureElem = document.querySelector('.weatherTemperature');
const locationElem = document.querySelector('.weatherLocation');
const dateElem = document.querySelector('.weatherDate');
const daysElem = document.querySelector('.weatherDays');

let icon;

function updateWeatherIcon(temp, condition) {
    const t = parseFloat(temp);

    if (isNaN(t)) {
        icon = temp === "N/A" ? "❌" : "⚠️";
    } else {
        switch (condition.toLowerCase()) {
            case "clear":
                icon = t >= 30 ? "🌞" : "☀️";
                break;
            case "partly cloudy":
            case "mostly cloudy":
                icon = "⛅";
                break;
            case "cloudy":
                icon = "☁️";
                break;
            case "rain":
            case "showers":
            case "drizzle":
                icon = "🌧️";
                break;
            case "thunderstorm":
                icon = "⛈️";
                break;
            case "snow":
            case "snow showers":
                icon = "❄️";
                break;
            case "fog":
            case "mist":
                icon = "🌫️";
                break;
            default:
                icon = "❓";
        }
    }
    weatherIconElem.textContent = icon;
    return icon;
}

async function getWeather(cityName = null) {
    try {
        const { lat, lon, name } = await getCoordinates(cityName);
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`);
        const data = await res.json();
        if (!data.current || data.current.temperature_2m === undefined || data.current.weathercode === undefined) {
            throw new Error('Weather data not available');
        }
        
        const temp = data.current.temperature_2m;
        const weatherCode = data.current.weathercode;
        const condition = mapWeatherCodeToCondition(weatherCode);
        
        locationElem.textContent = name;
        temperatureElem.textContent = `${temp}°C`;
        updateWeatherIcon(temp, condition);
    } catch (err) {
        console.error("Error:", err);
        locationElem.textContent = "Error";
        temperatureElem.textContent = 'N/A';
        weatherIconElem.textContent = "⚠️";
    }
}

function mapWeatherCodeToCondition(code) {
    const codes = {
        0: "clear",
        1: "partly cloudy",
        2: "partly cloudy",
        3: "cloudy",
        45: "fog",
        48: "fog",
        51: "drizzle",
        53: "drizzle",
        55: "drizzle",
        61: "rain",
        63: "rain",
        65: "rain",
        66: "showers",
        67: "showers",
        71: "snow",
        73: "snow",
        75: "snow",
        77: "snow showers",
        80: "showers",
        81: "showers",
        82: "showers",
        95: "thunderstorm",
        96: "thunderstorm",
        99: "thunderstorm"
    };
    return codes[code] || "unknown";
}

async function getCurrentWeatherCondition() {
    try {
        const { lat, lon } = await getCoordinates();
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weathercode`);
        const data = await res.json();
        if (!data.current || data.current.weathercode === undefined) {
            throw new Error('Weather condition not available');
        }
        return mapWeatherCodeToCondition(data.current.weathercode);
    } catch {
        return "unknown";
    }
}

async function getCoordinates(cityName = null) {
    if (cityName) {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`);
        const data = await res.json();
        if (!data.results || data.results.length === 0) throw new Error('Location not found');
        const result = data.results[0];
        return { name: result.name, lat: result.latitude, lon: result.longitude };
    } else {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                async position => {
                    const { latitude, longitude } = position.coords;
                    const city = await getCityName(latitude, longitude);
                    resolve({ name: city, lat: latitude, lon: longitude });
                },
                error => reject(new Error("Unable to get location"))
            );
        });
    }
}

async function getCityName(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        return (
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            data.address.state ||
            "Unknown Location"
        );
    } catch (error) {
        console.error("Error fetching city:", error);
        return "Unknown Location";
    }
}

async function getWeatherForecast(cityName = null) {
    try {
        const { lat, lon } = await getCoordinates(cityName);
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&timezone=auto`);
        const data = await res.json();

        if (!data.daily || !data.daily.time || !data.daily.temperature_2m_max) {
            throw new Error('Weather forecast not available');
        }

        daysElem.innerHTML = '';

        for (let i = 0; i < data.daily.time.length; i++) {
            const date = new Date(data.daily.time[i]);
            const temp = data.daily.temperature_2m_max[i];
            const weatherCode = data.daily.weathercode ? data.daily.weathercode[i] : null;
            const condition = mapWeatherCodeToCondition(weatherCode);
            const icon = updateWeatherIcon(temp, condition);

            const dayElem = document.createElement('div');
            dayElem.className = 'weatherDay';
            dayElem.textContent = `${date.toLocaleDateString(navigator.language, { weekday: 'short', month: 'short', day: 'numeric' })} - ${temp}°C ${icon}`;
            
            daysElem.appendChild(dayElem);
        }
    } catch (err) {
        console.error("Error:", err);
        daysElem.textContent = 'N/A';
    }
}

getWeatherForecast();
setInterval(getWeatherForecast, 60000);

getWeather();
setInterval(getWeather, 60000);

setInterval(async () => {
    const temp = parseFloat(temperatureElem.textContent);
    const condition = await getCurrentWeatherCondition();
    updateWeatherIcon(temp, condition);
}, 10000);

