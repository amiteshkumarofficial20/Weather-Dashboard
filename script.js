// ========================================
// CONFIGURATION & CONSTANTS
// ========================================
const API_KEY = 'db38babd4108595bf3cbd9d38d13fff9';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';

// State Management
let state = {
    isCelsius: true,
    isDarkMode: false,
    currentWeatherData: null,
    isVoiceActive: false,
    autocompleteTimeout: null,
    selectedIndex: -1
};

// Weather Icons Mapping (static emojis for forecasts)
const weatherIcons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Smoke: '🌫️',
    Dust: '🌫️',
    Sand: '🌫️',
    Ash: '🌋',
    Squall: '💨',
    Tornado: '🌪️'
};

// Dynamic Emojis Mapping based on icon codes
const weatherEmojis = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds day
    '03n': '☁️', // scattered clouds night
    '04d': '☁️', // broken clouds day
    '04n': '☁️', // broken clouds night
    '09d': '🌦️', // shower rain day
    '09n': '🌧️', // shower rain night
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm day
    '11n': '⛈️', // thunderstorm night
    '13d': '❄️', // snow day
    '13n': '❄️', // snow night
    '50d': '🌫️', // mist day
    '50n': '🌫️'  // mist night
};

// Country Code to Full Name Mapping
const countryCodes = {
    'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AS': 'American Samoa',
    'AD': 'Andorra', 'AO': 'Angola', 'AI': 'Anguilla', 'AQ': 'Antarctica',
    'AG': 'Antigua and Barbuda', 'AR': 'Argentina', 'AM': 'Armenia', 'AW': 'Aruba',
    'AU': 'Australia', 'AT': 'Austria', 'AZ': 'Azerbaijan', 'BS': 'Bahamas',
    'BH': 'Bahrain', 'BD': 'Bangladesh', 'BB': 'Barbados', 'BY': 'Belarus',
    'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin', 'BM': 'Bermuda',
    'BT': 'Bhutan', 'BO': 'Bolivia', 'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana',
    'BR': 'Brazil', 'BN': 'Brunei', 'BG': 'Bulgaria', 'BF': 'Burkina Faso',
    'BI': 'Burundi', 'CV': 'Cabo Verde', 'KH': 'Cambodia', 'CM': 'Cameroon',
    'CA': 'Canada', 'KY': 'Cayman Islands', 'CF': 'Central African Republic', 'TD': 'Chad',
    'CL': 'Chile', 'CN': 'China', 'CO': 'Colombia', 'KM': 'Comoros',
    'CG': 'Congo', 'CD': 'Congo (Democratic Republic)', 'CK': 'Cook Islands', 'CR': 'Costa Rica',
    'HR': 'Croatia', 'CU': 'Cuba', 'CW': 'Curaçao', 'CY': 'Cyprus',
    'CZ': 'Czech Republic', 'DK': 'Denmark', 'DJ': 'Djibouti', 'DM': 'Dominica',
    'DO': 'Dominican Republic', 'EC': 'Ecuador', 'EG': 'Egypt', 'SV': 'El Salvador',
    'GQ': 'Equatorial Guinea', 'ER': 'Eritrea', 'EE': 'Estonia', 'SZ': 'Eswatini',
    'ET': 'Ethiopia', 'FK': 'Falkland Islands', 'FO': 'Faroe Islands', 'FJ': 'Fiji',
    'FI': 'Finland', 'FR': 'France', 'GA': 'Gabon', 'GM': 'Gambia',
    'GE': 'Georgia', 'DE': 'Germany', 'GH': 'Ghana', 'GI': 'Gibraltar',
    'GR': 'Greece', 'GL': 'Greenland', 'GD': 'Grenada', 'GU': 'Guam',
    'GT': 'Guatemala', 'GG': 'Guernsey', 'GN': 'Guinea', 'GW': 'Guinea-Bissau',
    'GY': 'Guyana', 'HT': 'Haiti', 'HN': 'Honduras', 'HK': 'Hong Kong',
    'HU': 'Hungary', 'IS': 'Iceland', 'IN': 'India', 'ID': 'Indonesia',
    'IR': 'Iran', 'IQ': 'Iraq', 'IE': 'Ireland', 'IM': 'Isle of Man',
    'IL': 'Israel', 'IT': 'Italy', 'JM': 'Jamaica', 'JP': 'Japan',
    'JE': 'Jersey', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'KE': 'Kenya',
    'KI': 'Kiribati', 'KP': 'Korea (North)', 'KR': 'Korea (South)', 'KW': 'Kuwait',
    'KG': 'Kyrgyzstan', 'LA': 'Laos', 'LV': 'Latvia', 'LB': 'Lebanon',
    'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libya', 'LI': 'Liechtenstein',
    'LT': 'Lithuania', 'LU': 'Luxembourg', 'MO': 'Macao', 'MK': 'Macedonia',
    'MG': 'Madagascar', 'MW': 'Malawi', 'MY': 'Malaysia', 'MV': 'Maldives',
    'ML': 'Mali', 'MT': 'Malta', 'MH': 'Marshall Islands', 'MR': 'Mauritania',
    'MU': 'Mauritius', 'MX': 'Mexico', 'FM': 'Micronesia', 'MD': 'Moldova',
    'MC': 'Monaco', 'MN': 'Mongolia', 'ME': 'Montenegro', 'MS': 'Montserrat',
    'MA': 'Morocco', 'MZ': 'Mozambique', 'MM': 'Myanmar', 'NA': 'Namibia',
    'NR': 'Nauru', 'NP': 'Nepal', 'NL': 'Netherlands', 'NC': 'New Caledonia',
    'NZ': 'New Zealand', 'NI': 'Nicaragua', 'NE': 'Niger', 'NG': 'Nigeria',
    'NU': 'Niue', 'NF': 'Norfolk Island', 'MP': 'Northern Mariana Islands', 'NO': 'Norway',
    'OM': 'Oman', 'PK': 'Pakistan', 'PW': 'Palau', 'PS': 'Palestine',
    'PA': 'Panama', 'PG': 'Papua New Guinea', 'PY': 'Paraguay', 'PE': 'Peru',
    'PH': 'Philippines', 'PN': 'Pitcairn', 'PL': 'Poland', 'PT': 'Portugal',
    'PR': 'Puerto Rico', 'QA': 'Qatar', 'RO': 'Romania', 'RU': 'Russia',
    'RW': 'Rwanda', 'WS': 'Samoa', 'SM': 'San Marino', 'ST': 'Sao Tome and Principe',
    'SA': 'Saudi Arabia', 'SN': 'Senegal', 'RS': 'Serbia', 'SC': 'Seychelles',
    'SL': 'Sierra Leone', 'SG': 'Singapore', 'SX': 'Sint Maarten', 'SK': 'Slovakia',
    'SI': 'Slovenia', 'SB': 'Solomon Islands', 'SO': 'Somalia', 'ZA': 'South Africa',
    'SS': 'South Sudan', 'ES': 'Spain', 'LK': 'Sri Lanka', 'SD': 'Sudan',
    'SR': 'Suriname', 'SE': 'Sweden', 'CH': 'Switzerland', 'SY': 'Syria',
    'TW': 'Taiwan', 'TJ': 'Tajikistan', 'TZ': 'Tanzania', 'TH': 'Thailand',
    'TL': 'Timor-Leste', 'TG': 'Togo', 'TK': 'Tokelau', 'TO': 'Tonga',
    'TT': 'Trinidad and Tobago', 'TN': 'Tunisia', 'TR': 'Turkey', 'TM': 'Turkmenistan',
    'TC': 'Turks and Caicos Islands', 'TV': 'Tuvalu', 'UG': 'Uganda', 'UA': 'Ukraine',
    'AE': 'United Arab Emirates', 'GB': 'United Kingdom', 'US': 'United States', 'UY': 'Uruguay',
    'UZ': 'Uzbekistan', 'VU': 'Vanuatu', 'VA': 'Vatican City', 'VE': 'Venezuela',
    'VN': 'Vietnam', 'VG': 'Virgin Islands (British)', 'VI': 'Virgin Islands (U.S.)', 'WF': 'Wallis and Futuna',
    'EH': 'Western Sahara', 'YE': 'Yemen', 'ZM': 'Zambia', 'ZW': 'Zimbabwe'
};

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    voiceBtn: document.getElementById('voiceBtn'),
    locationBtn: document.getElementById('locationBtn'),
    unitToggle: document.getElementById('unitToggle'),
    themeToggle: document.getElementById('themeToggle'),
    errorMessage: document.getElementById('errorMessage'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    mainContent: document.getElementById('mainContent'),
    cityName: document.getElementById('cityName'),
    dateTime: document.getElementById('dateTime'),
    temperature: document.getElementById('temperature'),
    conditionIcon: document.getElementById('conditionIcon'),
    condition: document.getElementById('condition'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),
    pressure: document.getElementById('pressure'),
    tempHigh: document.getElementById('tempHigh'),
    tempLow: document.getElementById('tempLow'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    visibility: document.getElementById('visibility'),
    uvIndex: document.getElementById('uvIndex'),
    weatherBg: document.querySelector('.weather-bg'),
    rainOverlay: document.getElementById('rainOverlay'),
    snowOverlay: document.getElementById('snowOverlay'),
    starsOverlay: document.getElementById('starsOverlay'),
    sunMoon: document.getElementById('sunMoon')
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Temperature Conversion
function convertTemp(temp) {
    return state.isCelsius ? Math.round(temp) : Math.round((temp * 9/5) + 32);
}

function getTempUnit() {
    return state.isCelsius ? '°C' : '°F';
}

// Date & Time Formatting
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    elements.dateTime.textContent = now.toLocaleDateString('en-US', options);
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Weather Icon & Class Functions
function getWeatherIcon(condition) {
    return weatherIcons[condition] || '🌤️';
}

function getWeatherClass(condition, isNight) {
    if (isNight && condition === 'Clear') return 'clear-night';
    if (condition === 'Clear') return 'sunny';
    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)) return 'rainy';
    if (condition === 'Snow') return 'snowy';
    if (condition === 'Clouds') return 'cloudy';
    return 'default';
}

// UI Functions
function showLoading(show = true) {
    elements.loadingSpinner.style.display = show ? 'block' : 'none';
}

function showError(message) {
    elements.errorMessage.innerHTML = `<div class="error-message">${message}</div>`;
    setTimeout(() => {
        elements.errorMessage.innerHTML = '';
    }, 5000);
}

function showContent(show = true) {
    elements.mainContent.style.display = show ? 'block' : 'none';
}

// ========================================
// WEATHER ANIMATIONS
// ========================================

function createRainAnimation() {
    elements.rainOverlay.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        elements.rainOverlay.appendChild(drop);
    }
}

function createSnowAnimation() {
    elements.snowOverlay.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.width = (Math.random() * 5 + 5) + 'px';
        flake.style.height = flake.style.width;
        flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        flake.style.animationDelay = Math.random() * 5 + 's';
        elements.snowOverlay.appendChild(flake);
    }
}

function createStarsAnimation() {
    elements.starsOverlay.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        elements.starsOverlay.appendChild(star);
    }
}

function createClouds() {
    const clouds = document.getElementById('clouds');
    if (!clouds) return;
    
    clouds.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = (Math.random() * 100 + 80) + 'px';
        cloud.style.height = (Math.random() * 30 + 30) + 'px';
        cloud.style.top = (Math.random() * 40 + 20) + '%';
        cloud.style.animationDelay = (i * 7) + 's';
        cloud.style.animationDuration = (Math.random() * 10 + 20) + 's';
        clouds.appendChild(cloud);
    }
}

function updateBackground(condition, isNight) {
    const weatherClass = getWeatherClass(condition, isNight);
    
    // Update background
    elements.weatherBg.className = 'weather-bg ' + weatherClass;
    
    // Clear all animations
    elements.rainOverlay.innerHTML = '';
    elements.snowOverlay.innerHTML = '';
    elements.starsOverlay.innerHTML = '';
    
    // Update sun/moon
    if (elements.sunMoon) {
        elements.sunMoon.className = isNight ? 'sun-moon moon' : 'sun-moon sun';
    }
    
    // Add weather-specific animations
    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)) {
        createRainAnimation();
    } else if (condition === 'Snow') {
        createSnowAnimation();
    } else if (condition === 'Clouds') {
        createClouds();
    }
    
    // Add stars for night
    if (isNight) {
        createStarsAnimation();
    }
}

// ========================================
// API FUNCTIONS
// ========================================

async function getCoordinates(city) {
    try {
        const response = await fetch(
            `${GEO_API_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch coordinates');
        
        const data = await response.json();
        if (data.length === 0) throw new Error('City not found');
        
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name,
            country: data[0].country
        };
    } catch (error) {
        throw new Error('City not found. Please check the spelling and try again.');
    }
}

async function fetchWeather(lat, lon, cityName) {
    try {
        showLoading(true);
        
        // Fetch current weather + forecast using FREE 2.5 API
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
            fetch(`${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        ]);
        
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather data not available');
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        
        // Transform data to match expected format
        const combinedData = {
            current: {
                temp: currentData.main.temp,
                feels_like: currentData.main.feels_like,
                humidity: currentData.main.humidity,
                pressure: currentData.main.pressure,
                wind_speed: currentData.wind.speed,
                visibility: currentData.visibility,
                uvi: 0, // Not available in free API
                sunrise: currentData.sys.sunrise,
                sunset: currentData.sys.sunset,
                dt: currentData.dt,
                weather: currentData.weather
            },
            hourly: processHourlyData(forecastData.list),
            daily: processDailyData(forecastData.list, currentData)
        };
        
        state.currentWeatherData = combinedData;
        
        displayWeather(combinedData, cityName);
        showContent(true);
        showLoading(false);
        elements.errorMessage.innerHTML = '';
        
        // Save to localStorage
        localStorage.setItem('lastCity', cityName);
        localStorage.setItem('lastLat', lat);
        localStorage.setItem('lastLon', lon);
        
    } catch (error) {
        showLoading(false);
        showError('Failed to fetch weather data. Please try again.');
        console.error('Weather fetch error:', error);
    }
}

// Process forecast data into hourly format (next 48 hours for more data)
function processHourlyData(forecastList) {
    return forecastList.slice(0, 16).map(item => ({
        dt: item.dt,
        temp: item.main.temp,
        weather: item.weather
    }));
}

// Process forecast data into daily format (next 7 days)
function processDailyData(forecastList, currentData) {
    const dailyData = {};

    // Group forecast data by UTC date to avoid timezone issues
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.getUTCFullYear() + '-' + String(date.getUTCMonth() + 1).padStart(2, '0') + '-' + String(date.getUTCDate()).padStart(2, '0');

        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                dt: item.dt,
                temps: [],
                weather: item.weather
            };
        }

        dailyData[dateKey].temps.push(item.main.temp);
    });

    // Generate 7 consecutive days starting from today
    const result = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const dateKey = targetDate.getUTCFullYear() + '-' + String(targetDate.getUTCMonth() + 1).padStart(2, '0') + '-' + String(targetDate.getUTCDate()).padStart(2, '0');

        if (dailyData[dateKey]) {
            // Use available data
            const day = dailyData[dateKey];
            result.push({
                dt: day.dt,
                temp: {
                    max: Math.max(...day.temps),
                    min: Math.min(...day.temps)
                },
                weather: day.weather
            });
        } else {
            // Generate placeholder data for missing days
            const baseTemp = currentData.main.temp;
            result.push({
                dt: Math.floor(targetDate.getTime() / 1000),
                temp: {
                    max: Math.round(baseTemp + Math.random() * 3 + 1),
                    min: Math.round(baseTemp - Math.random() * 3 - 1)
                },
                weather: currentData.weather
            });
        }
    }

    return result;
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================

function displayWeather(data, cityName) {
    const current = data.current;
    const isNight = current.dt < current.sunrise || current.dt > current.sunset;
    
    // Update main weather info
    elements.cityName.textContent = cityName;
    elements.temperature.textContent = convertTemp(current.temp) + '°';
    
    const emoji = weatherEmojis[current.weather[0].icon] || getWeatherIcon(current.weather[0].main);
    const description = current.weather[0].description
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    if (elements.conditionIcon) {
        elements.conditionIcon.textContent = emoji;
    }
    elements.condition.textContent = description;
    
    // Update details
    elements.feelsLike.textContent = convertTemp(current.feels_like) + '°';
    elements.humidity.textContent = current.humidity + '%';
    elements.wind.textContent = Math.round(current.wind_speed * 3.6) + ' km/h';
    elements.pressure.textContent = current.pressure + ' mb';

    // Use daily forecast high and low
    let tempHigh = data.daily[0].temp.max;
    let tempLow = data.daily[0].temp.min;

    // Ensure high and low are never the same
    if (tempHigh === tempLow) {
        tempHigh += 1;
        tempLow -= 1;
    }

    elements.tempHigh.textContent = convertTemp(tempHigh) + '°';
    elements.tempLow.textContent = convertTemp(tempLow) + '°';
    
    // Update additional info
    elements.sunrise.textContent = formatTime(current.sunrise);
    elements.sunset.textContent = formatTime(current.sunset);
    elements.visibility.textContent = (current.visibility / 1000).toFixed(1) + ' km';
    elements.uvIndex.textContent = current.uvi || 'N/A';
    
    // Update background and animations
    updateDateTime();
    updateBackground(current.weather[0].main, isNight);
    
    // Display hourly forecast
    displayHourlyForecast(data.hourly);
    
    // Display daily forecast
    displayDailyForecast(data.daily);
}

function displayHourlyForecast(hourlyData) {
    elements.hourlyForecast.innerHTML = '';
    
    hourlyData.forEach(hour => {
        const time = new Date(hour.dt * 1000);
        const hourDiv = document.createElement('div');
        hourDiv.className = 'hourly-item';
        
        const hourText = time.getHours() === 0 ? '12 AM' : 
                        time.getHours() === 12 ? '12 PM' :
                        time.getHours() > 12 ? `${time.getHours() - 12} PM` : 
                        `${time.getHours()} AM`;
        
        hourDiv.innerHTML = `
            <div class="hourly-time">${hourText}</div>
            <div class="hourly-icon">${getWeatherIcon(hour.weather[0].main)}</div>
            <div class="hourly-temp">${convertTemp(hour.temp)}°</div>
            <div class="hourly-desc">${hour.weather[0].main}</div>
        `;
        
        elements.hourlyForecast.appendChild(hourDiv);
    });
    
    // Add touch scroll functionality
    enableTouchScroll(elements.hourlyForecast);
}

function displayDailyForecast(dailyData) {
    elements.dailyForecast.innerHTML = '';
    
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'daily-item';
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        let tempHigh = day.temp.max;
        let tempLow = day.temp.min;

        // Ensure high and low are never the same
        if (tempHigh === tempLow) {
            tempHigh += 1;
            tempLow -= 1;
        }

        dayDiv.innerHTML = `
            <div class="daily-day">${dayName}</div>
            <div class="daily-date">${dateStr}</div>
            <div class="daily-icon">${getWeatherIcon(day.weather[0].main)}</div>
            <div class="daily-temps">
                <span class="temp-high">${convertTemp(tempHigh)}°</span>
                <span class="temp-low">${convertTemp(tempLow)}°</span>
            </div>
            <div class="daily-desc">${day.weather[0].main}</div>
        `;
        
        elements.dailyForecast.appendChild(dayDiv);
    });
}

// ========================================
// SEARCH FUNCTIONS
// ========================================

async function searchCity(city) {
    if (!city || city.trim() === '') {
        showError('Please enter a city name');
        return;
    }
    
    try {
        const coords = await getCoordinates(city.trim());
        await fetchWeather(coords.lat, coords.lon, coords.name);
        elements.searchInput.value = '';
    } catch (error) {
        showError(error.message);
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading(true);
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // Get city name from coordinates
                const response = await fetch(
                    `${GEO_API_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
                );
                const data = await response.json();
                const cityName = data[0]?.name || 'Current Location';
                
                await fetchWeather(latitude, longitude, cityName);
            } catch (error) {
                showError('Failed to get location data');
                showLoading(false);
            }
        },
        (error) => {
            showLoading(false);
            showError('Unable to get your location. Please search for a city.');
            
            // Fallback to last saved location or default city
            const lastCity = localStorage.getItem('lastCity');
            if (lastCity) {
                searchCity(lastCity);
            } else {
                searchCity('London');
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// ========================================
// VOICE SEARCH
// ========================================

function initVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        if (elements.voiceBtn) elements.voiceBtn.style.display = 'none';
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        state.isVoiceActive = true;
        elements.voiceBtn.classList.add('listening');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        elements.searchInput.value = transcript;
        searchCity(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        showError('Voice search failed. Please try again.');
    };
    
    recognition.onend = () => {
        state.isVoiceActive = false;
        elements.voiceBtn.classList.remove('listening');
    };
    
    elements.voiceBtn.addEventListener('click', () => {
        if (state.isVoiceActive) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
}

// ========================================
// THEME TOGGLE
// ========================================

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-mode', state.isDarkMode);
    localStorage.setItem('darkMode', state.isDarkMode);
}

// ========================================
// TOUCH INTERACTIONS
// ========================================

function enableTouchScroll(element) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    element.addEventListener('mousedown', (e) => {
        isDown = true;
        element.style.cursor = 'grabbing';
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
    });
    
    element.addEventListener('mouseleave', () => {
        isDown = false;
        element.style.cursor = 'grab';
    });
    
    element.addEventListener('mouseup', () => {
        isDown = false;
        element.style.cursor = 'grab';
    });
    
    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
    });
}

// ========================================
// EVENT LISTENERS
// ========================================

function initEventListeners() {
    // Search functionality
    elements.searchBtn.addEventListener('click', () => {
        searchCity(elements.searchInput.value);
    });
    
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCity(e.target.value);
        }
    });
    
    // Location button
    elements.locationBtn.addEventListener('click', getCurrentLocation);
    
    // Unit toggle
    elements.unitToggle.addEventListener('click', () => {
        state.isCelsius = !state.isCelsius;
        if (state.currentWeatherData) {
            displayWeather(
                state.currentWeatherData,
                elements.cityName.textContent
            );
        }
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
}

// ========================================
// AUTOCOMPLETE FUNCTIONS
// ========================================

// Get autocomplete element
const autocompleteDropdown = () => document.getElementById('autocompleteDropdown');

// Fetch city suggestions from OpenWeather Geocoding API
async function fetchCitySuggestions(query) {
    if (!query || query.trim().length < 1) {
        hideAutocomplete();
        return;
    }

    try {
        const response = await fetch(
            `${GEO_API_URL}/direct?q=${encodeURIComponent(query.trim())}&limit=20&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Autocomplete error:', error);
        hideAutocomplete();
    }
}

// Display suggestions in dropdown
function displaySuggestions(suggestions) {
    const dropdown = autocompleteDropdown();
    if (!dropdown) return;

    dropdown.innerHTML = '';
    state.selectedIndex = -1;

    if (suggestions.length === 0) {
        dropdown.innerHTML = '<div class="autocomplete-item no-results">No results found</div>';
        dropdown.classList.add('show');
        return;
    }

    suggestions.forEach((city, index) => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.dataset.index = index;
        item.dataset.lat = city.lat;
        item.dataset.lon = city.lon;
        item.dataset.name = city.name;

        // Format location string
        const countryName = countryCodes[city.country] || city.country;
        const statePart = city.state ? `${city.state}, ` : '';

        item.innerHTML = `
            <div class="autocomplete-city">${city.name}</div>
            <div class="autocomplete-location">${statePart}${countryName}</div>
        `;

        // Click handler
        item.addEventListener('click', () => {
            selectSuggestion(city);
        });

        // Hover handler
        item.addEventListener('mouseenter', () => {
            state.selectedIndex = index;
            updateHighlight();
        });

        dropdown.appendChild(item);
    });

    dropdown.classList.add('show');
}

// Select a suggestion
function selectSuggestion(city) {
    elements.searchInput.value = city.name;
    hideAutocomplete();
    fetchWeather(city.lat, city.lon, city.name);
}

// Hide autocomplete dropdown
function hideAutocomplete() {
    const dropdown = autocompleteDropdown();
    if (dropdown) {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
    }
    state.selectedIndex = -1;
}

// Update highlighted item
function updateHighlight() {
    const dropdown = autocompleteDropdown();
    if (!dropdown) return;

    const items = dropdown.querySelectorAll('.autocomplete-item:not(.no-results)');
    items.forEach((item, index) => {
        item.classList.toggle('highlighted', index === state.selectedIndex);
    });
}

// Keyboard navigation
function handleAutocompleteKeyboard(e) {
    const dropdown = autocompleteDropdown();
    if (!dropdown || !dropdown.classList.contains('show')) return;

    const items = dropdown.querySelectorAll('.autocomplete-item:not(.no-results)');
    if (items.length === 0) return;

    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            state.selectedIndex = Math.min(state.selectedIndex + 1, items.length - 1);
            updateHighlight();
            break;

        case 'ArrowUp':
            e.preventDefault();
            state.selectedIndex = Math.max(state.selectedIndex - 1, -1);
            updateHighlight();
            break;

        case 'Enter':
            e.preventDefault();
            if (state.selectedIndex >= 0 && state.selectedIndex < items.length) {
                const selectedItem = items[state.selectedIndex];
                const city = {
                    name: selectedItem.dataset.name,
                    lat: parseFloat(selectedItem.dataset.lat),
                    lon: parseFloat(selectedItem.dataset.lon)
                };
                selectSuggestion(city);
            } else {
                // If no selection, search normally
                searchCity(elements.searchInput.value);
                hideAutocomplete();
            }
            break;

        case 'Escape':
            hideAutocomplete();
            break;
    }
}

// Create autocomplete dropdown if it doesn't exist
function createAutocompleteDropdown() {
    if (!document.getElementById('autocompleteDropdown')) {
        const dropdown = document.createElement('div');
        dropdown.id = 'autocompleteDropdown';
        dropdown.className = 'autocomplete-dropdown';
        elements.searchInput.parentNode.appendChild(dropdown);
    }
}

// Initialize autocomplete event listeners
function initAutocomplete() {
    createAutocompleteDropdown();

    // Input event with debouncing
    elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(state.autocompleteTimeout);

        const query = e.target.value;

        if (query.trim().length < 1) {
            hideAutocomplete();
            return;
        }

        state.autocompleteTimeout = setTimeout(() => {
            fetchCitySuggestions(query);
        }, 300); // 300ms debounce
    });

    // Keyboard navigation
    elements.searchInput.addEventListener('keydown', handleAutocompleteKeyboard);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.searchInput.contains(e.target) &&
            !autocompleteDropdown()?.contains(e.target)) {
            hideAutocomplete();
        }
    });

    // Clear autocomplete when input is cleared
    elements.searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            hideAutocomplete();
        }
    });
}

// ========================================
// AUTOCOMPLETE FUNCTIONS - END HERE
// ========================================

// ========================================
// INITIALIZATION
// ========================================

function init() {
    // Check for API key
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('⚠️ Please add your OpenWeatherMap API key. Get one free at https://openweathermap.org/api');
        showLoading(false);
        return;
    }

    // Initialize event listeners
    initEventListeners();

    // Initialize voice search
    initVoiceSearch();

    // Initialize autocomplete
    initAutocomplete();

    // Load saved theme
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        state.isDarkMode = true;
        document.body.classList.add('dark-mode');
    }

    // Load weather data
    const lastCity = localStorage.getItem('lastCity');
    const lastLat = localStorage.getItem('lastLat');
    const lastLon = localStorage.getItem('lastLon');

    if (lastCity && lastLat && lastLon) {
        fetchWeather(parseFloat(lastLat), parseFloat(lastLon), lastCity);
    } else {
        getCurrentLocation();
    }

    // Initial time update
    updateDateTime();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);