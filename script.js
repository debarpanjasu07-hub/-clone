// Weather icons mapping
const weatherIcons = {
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'rainy': '🌧️',
    'stormy': '⛈️',
    'snowy': '❄️',
    'foggy': '🌫️',
    'windy': '💨'
};

// Weather descriptions
const weatherDescriptions = {
    'sunny': 'Sunny',
    'partly-cloudy': 'Partly Cloudy',
    'cloudy': 'Cloudy',
    'rainy': 'Rainy',
    'stormy': 'Stormy',
    'snowy': 'Snowy',
    'foggy': 'Foggy',
    'windy': 'Windy'
};

// Location data with different weather patterns
const locationData = {
    'new-york': { name: 'New York, NY', tempRange: { min: 5, max: 25 }, conditions: ['sunny', 'partly-cloudy', 'cloudy', 'rainy'] },
    'london': { name: 'London, UK', tempRange: { min: 3, max: 18 }, conditions: ['cloudy', 'rainy', 'foggy', 'partly-cloudy'] },
    'tokyo': { name: 'Tokyo, Japan', tempRange: { min: 8, max: 28 }, conditions: ['sunny', 'partly-cloudy', 'rainy', 'cloudy'] },
    'sydney': { name: 'Sydney, Australia', tempRange: { min: 12, max: 30 }, conditions: ['sunny', 'partly-cloudy', 'windy', 'rainy'] },
    'paris': { name: 'Paris, France', tempRange: { min: 4, max: 22 }, conditions: ['cloudy', 'partly-cloudy', 'rainy', 'sunny'] },
    'dubai': { name: 'Dubai, UAE', tempRange: { min: 20, max: 42 }, conditions: ['sunny', 'partly-cloudy', 'windy', 'cloudy'] }
};

let currentView = 'past';
let currentLocation = 'new-york';

// Generate random weather data for a specific date
function generateWeatherData(date, location) {
    const loc = locationData[location];
    const dayOfYear = date.getDay();
    const randomSeed = date.getTime() % 1000;
    
    // Use date-based seed for consistent randomness per day
    const temp = Math.floor(Math.random() * (loc.tempRange.max - loc.tempRange.min + 1)) + loc.tempRange.min;
    const condition = loc.conditions[Math.floor((randomSeed + dayOfYear) % loc.conditions.length)];
    const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
    const windSpeed = Math.floor(Math.random() * 25) + 5; // 5-30 km/h
    const precipitation = condition === 'rainy' || condition === 'stormy' 
        ? (Math.random() * 15 + 5).toFixed(1) 
        : (Math.random() * 3).toFixed(1);
    
    return {
        date: date,
        temperature: temp,
        condition: condition,
        humidity: humidity,
        windSpeed: windSpeed,
        precipitation: parseFloat(precipitation)
    };
}

// Generate weather data for past 7 days
function generatePastWeather(location) {
    const weatherData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        weatherData.push(generateWeatherData(date, location));
    }
    
    return weatherData;
}

// Generate weather data for next 7 days
function generateFutureWeather(location) {
    const weatherData = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        weatherData.push(generateWeatherData(date, location));
    }
    
    return weatherData;
}

// Format date for display
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === new Date(today.getTime() - 86400000).toDateString();
    const isTomorrow = date.toDateString() === new Date(today.getTime() + 86400000).toDateString();
    
    if (isToday) {
        return { dayName: 'Today', date: `${month} ${day}, ${year}` };
    } else if (isYesterday) {
        return { dayName: 'Yesterday', date: `${month} ${day}, ${year}` };
    } else if (isTomorrow) {
        return { dayName: 'Tomorrow', date: `${month} ${day}, ${year}` };
    } else {
        return { dayName: dayName, date: `${month} ${day}, ${year}` };
    }
}

// Create weather card HTML
function createWeatherCard(weather) {
    const formatted = formatDate(weather.date);
    const icon = weatherIcons[weather.condition];
    const description = weatherDescriptions[weather.condition];
    
    return `
        <div class="weather-card">
            <div class="date">${formatted.date}</div>
            <div class="day-name">${formatted.dayName}</div>
            <div class="weather-icon">${icon}</div>
            <div class="temperature">${weather.temperature}°C</div>
            <div class="description">${description}</div>
            <div class="details">
                <div class="detail-item">
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${weather.humidity}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Wind</div>
                    <div class="detail-value">${weather.windSpeed} km/h</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Precip</div>
                    <div class="detail-value">${weather.precipitation}mm</div>
                </div>
            </div>
        </div>
    `;
}

// Calculate summary statistics
function calculateSummary(weatherData) {
    const temps = weatherData.map(w => w.temperature);
    const humidities = weatherData.map(w => w.humidity);
    const precipitations = weatherData.map(w => w.precipitation);
    
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const avgHumidity = (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(0);
    const totalPrecipitation = precipitations.reduce((a, b) => a + b, 0).toFixed(1);
    
    // Most common condition
    const conditions = weatherData.map(w => w.condition);
    const conditionCounts = {};
    conditions.forEach(c => {
        conditionCounts[c] = (conditionCounts[c] || 0) + 1;
    });
    const mostCommonCondition = Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b
    );
    
    return {
        avgTemp,
        maxTemp,
        minTemp,
        avgHumidity,
        totalPrecipitation,
        mostCommonCondition
    };
}

// Create summary HTML
function createSummaryHTML(summary, isPast) {
    const period = isPast ? 'Past 7 Days' : 'Next 7 Days';
    return `
        <div class="summary-item">
            <div class="summary-label">Average Temperature</div>
            <div class="summary-value">${summary.avgTemp}°C</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">High / Low</div>
            <div class="summary-value">${summary.maxTemp}°C / ${summary.minTemp}°C</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Average Humidity</div>
            <div class="summary-value">${summary.avgHumidity}%</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Total Precipitation</div>
            <div class="summary-value">${summary.totalPrecipitation}mm</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Most Common Condition</div>
            <div class="summary-value">${weatherIcons[summary.mostCommonCondition]} ${weatherDescriptions[summary.mostCommonCondition]}</div>
        </div>
    `;
}

// Display weather data
function displayWeather() {
    const weatherGrid = document.getElementById('weatherGrid');
    const summaryContent = document.getElementById('summaryContent');
    
    let weatherData;
    if (currentView === 'past') {
        weatherData = generatePastWeather(currentLocation);
    } else {
        weatherData = generateFutureWeather(currentLocation);
    }
    
    // Clear previous content
    weatherGrid.innerHTML = '';
    
    // Create and append weather cards
    weatherData.forEach(weather => {
        const cardHTML = createWeatherCard(weather);
        weatherGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    // Calculate and display summary
    const summary = calculateSummary(weatherData);
    summaryContent.innerHTML = createSummaryHTML(summary, currentView === 'past');
}

// Initialize the application
function init() {
    // Set up navigation buttons
    const pastBtn = document.getElementById('pastBtn');
    const futureBtn = document.getElementById('futureBtn');
    
    pastBtn.addEventListener('click', () => {
        currentView = 'past';
        pastBtn.classList.add('active');
        futureBtn.classList.remove('active');
        displayWeather();
    });
    
    futureBtn.addEventListener('click', () => {
        currentView = 'future';
        futureBtn.classList.add('active');
        pastBtn.classList.remove('active');
        displayWeather();
    });
    
    // Set up location selector
    const locationSelect = document.getElementById('locationSelect');
    locationSelect.addEventListener('change', (e) => {
        currentLocation = e.target.value;
        displayWeather();
    });
    
    // Initial display
    displayWeather();
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
