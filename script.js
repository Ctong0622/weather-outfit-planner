// Weather Outfit Planner - script.js
// This file currently handles: form submission, input validation,
// and converting a city name into coordinates using the Open-Meteo
// Geocoding API. The forecast lookup and outfit recommendations will
// be added in a later step.

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const MAX_FORECAST_DAYS_AHEAD = 16; // Open-Meteo's supported forecast range

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

// Temporary confirmation while the forecast lookup is not built yet.
function showLocationFound(location) {
  stateArea.innerHTML = `<p class="empty-state">📍 Found ${location.name}, ${location.country}. Weather lookup coming soon.</p>`;
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

    showLocationFound(location);
  } catch (error) {
    showError("Something went wrong while checking the weather. Please try again.");
  } finally {
    setFormBusy(false);
  }
}

setDateInputRange();
form.addEventListener("submit", handleSubmit);
