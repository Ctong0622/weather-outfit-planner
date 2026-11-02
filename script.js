// Weather Outfit Planner - script.js
// This file currently handles: form submission, input validation,
// converting a city name into coordinates (Open-Meteo Geocoding API),
// and fetching the daily forecast for the selected date (Open-Meteo
// Forecast API). Clothing and "what to bring" recommendations will be
// added in a later step.

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";
const MAX_FORECAST_DAYS_AHEAD = 16; // Open-Meteo's supported forecast range

// Short plain-language descriptions for Open-Meteo's weather codes.
// https://open-meteo.com/en/docs (WMO weather codes)
const WEATHER_CODE_DESCRIPTIONS = {
  0: { text: "clear skies", icon: "☀️" },
  1: { text: "mostly clear skies", icon: "🌤️" },
  2: { text: "partly cloudy skies", icon: "⛅" },
  3: { text: "cloudy skies", icon: "☁️" },
  45: { text: "fog", icon: "🌫️" },
  48: { text: "freezing fog", icon: "🌫️" },
  51: { text: "light drizzle", icon: "🌦️" },
  53: { text: "drizzle", icon: "🌦️" },
  55: { text: "heavy drizzle", icon: "🌧️" },
  61: { text: "light rain", icon: "🌦️" },
  63: { text: "rain", icon: "🌧️" },
  65: { text: "heavy rain", icon: "🌧️" },
  71: { text: "light snow", icon: "🌨️" },
  73: { text: "snow", icon: "🌨️" },
  75: { text: "heavy snow", icon: "❄️" },
  80: { text: "rain showers", icon: "🌦️" },
  81: { text: "rain showers", icon: "🌧️" },
  82: { text: "heavy rain showers", icon: "🌧️" },
  95: { text: "thunderstorms", icon: "⛈️" },
  96: { text: "thunderstorms with hail", icon: "⛈️" },
  99: { text: "thunderstorms with heavy hail", icon: "⛈️" },
};

// Elements
const form = document.getElementById("outfit-form");
const cityInput = document.getElementById("city");
const dateInput = document.getElementById("date");
const submitButton = form.querySelector("button[type='submit']");
const stateArea = document.getElementById("state-area");

// ---- Setup ----

// Restrict the date picker to today through the supported forecast range.
function setDateInputRange() {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + MAX_FORECAST_DAYS_AHEAD);

  dateInput.min = toDateString(today);
  dateInput.max = toDateString(maxDate);
}

// Converts a Date object into a "YYYY-MM-DD" string using local time.
function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ---- Validation ----

// Checks the city and date inputs. Returns an error message string,
// or null if both inputs are valid.
function validateInputs(city, dateValue) {
  if (!city) {
    return "Please enter a city.";
  }

  if (!dateValue) {
    return "Please choose a date.";
  }

  if (dateValue < dateInput.min || dateValue > dateInput.max) {
    return `Please choose a date within the next ${MAX_FORECAST_DAYS_AHEAD} days.`;
  }

  return null;
}

// ---- API ----

// Looks up a city name and returns its location details, or null if
// no matching city was found. Throws an error if the request fails.
async function geocodeCity(city) {
  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Geocoding request failed.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const match = data.results[0];
  return {
    name: match.name,
    country: match.country,
    latitude: match.latitude,
    longitude: match.longitude,
  };
}

// Fetches the daily forecast for a location and returns the weather
// values for the exact selected date, or null if that date isn't in
// the response. Throws an error if the request fails.
async function getForecastForDate(latitude, longitude, dateValue) {
  const dailyFields = [
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "precipitation_sum",
    "precipitation_probability_max",
    "weathercode",
    "windspeed_10m_max",
  ].join(",");

  const url =
    `${FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&daily=${dailyFields}&timezone=auto` +
    `&start_date=${dateValue}&end_date=${dateValue}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Forecast request failed.");
  }

  const data = await response.json();
  const dayIndex = data.daily?.time?.indexOf(dateValue);

  if (dayIndex === undefined || dayIndex === -1) {
    return null;
  }

  return {
    date: data.daily.time[dayIndex],
    tempMax: data.daily.temperature_2m_max[dayIndex],
    tempMin: data.daily.temperature_2m_min[dayIndex],
    feelsLikeMax: data.daily.apparent_temperature_max[dayIndex],
    feelsLikeMin: data.daily.apparent_temperature_min[dayIndex],
    precipitationSum: data.daily.precipitation_sum[dayIndex],
    precipitationChance: data.daily.precipitation_probability_max[dayIndex],
    weatherCode: data.daily.weathercode[dayIndex],
    windSpeedMax: data.daily.windspeed_10m_max[dayIndex],
  };
}

// ---- Page updates ----

function showInvalid(message, invalidFields) {
  clearInvalidFields();
  invalidFields.forEach((field) => field.classList.add("invalid-field"));

  stateArea.innerHTML = `<p class="banner banner-invalid">❗ ${message}</p>`;
}

function showLoading() {
  clearInvalidFields();
  stateArea.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <span>Checking the weather…</span>
    </div>
  `;
}

function showError(message) {
  stateArea.innerHTML = `<p class="banner banner-error">⚠️ ${message}</p>`;
}

// Renders the Weather Result section for the matched location and
// the forecast values for the selected date.
function showWeatherResult(location, forecast) {
  const weather = getWeatherDescription(forecast.weatherCode);
  const displayDate = formatDisplayDate(forecast.date);

  stateArea.innerHTML = `
    <div class="weather-result">
      <p class="weather-header">
        <span class="weather-location">${location.name}, ${location.country}</span>
        <span class="weather-date"> — ${displayDate}</span>
      </p>
      <p class="weather-summary-text">${weather.icon} Expect ${weather.text} with a high of ${Math.round(forecast.tempMax)}°C.</p>
      <div class="stats-row">
        <div class="chip"><span class="chip-label">🌡️ High/Low:</span> ${Math.round(forecast.tempMax)}° / ${Math.round(forecast.tempMin)}°C</div>
        <div class="chip"><span class="chip-label">🤔 Feels like:</span> ${Math.round(forecast.feelsLikeMax)}°C</div>
        <div class="chip"><span class="chip-label">🌧️ Rain chance:</span> ${forecast.precipitationChance}%</div>
        <div class="chip"><span class="chip-label">💨 Wind:</span> ${Math.round(forecast.windSpeedMax)} km/h</div>
      </div>
    </div>
  `;
}

// Looks up the short plain-language text and icon for a weather code.
// Falls back to a generic description for any unlisted code.
function getWeatherDescription(code) {
  return WEATHER_CODE_DESCRIPTIONS[code] || { text: "mixed conditions", icon: "🌡️" };
}

// Formats a "YYYY-MM-DD" string as a short, friendly date (e.g. "Sat, Nov 7").
function formatDisplayDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function clearInvalidFields() {
  cityInput.classList.remove("invalid-field");
  dateInput.classList.remove("invalid-field");
}

function setFormBusy(isBusy) {
  submitButton.disabled = isBusy;
  cityInput.disabled = isBusy;
  dateInput.disabled = isBusy;
}

// ---- Form submission ----

async function handleSubmit(event) {
  event.preventDefault();

  const city = cityInput.value.trim();
  const dateValue = dateInput.value;

  const validationError = validateInputs(city, dateValue);

  if (validationError) {
    const invalidFields = [];
    if (!city) invalidFields.push(cityInput);
    if (!dateValue || dateValue < dateInput.min || dateValue > dateInput.max) {
      invalidFields.push(dateInput);
    }
    showInvalid(validationError, invalidFields);
    return;
  }

  clearInvalidFields();
  showLoading();
  setFormBusy(true);

  try {
    const location = await geocodeCity(city);

    if (!location) {
      showError("We couldn't find that city. Please check the spelling and try again.");
      return;
    }

    const forecast = await getForecastForDate(location.latitude, location.longitude, dateValue);

    if (!forecast) {
      showError("We couldn't get weather data for that date. Please try a different date.");
      return;
    }

    showWeatherResult(location, forecast);
  } catch (error) {
    showError("Something went wrong while checking the weather. Please try again.");
  } finally {
    setFormBusy(false);
  }
}

setDateInputRange();
form.addEventListener("submit", handleSubmit);
