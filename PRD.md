# Product Requirements Document (PRD)

## Project

Weather Outfit Planner

## 1. Purpose

The Weather Outfit Planner is a simple web tool that checks the weather forecast for a city and date chosen by the user, and then tells the user what to wear and what to bring. The goal is to save the user from having to look at raw weather numbers (temperature, rain chance, wind, etc.) and work out clothing decisions themselves. The tool does that translation for them in plain language.

This is a student mini project built with plain HTML, CSS, and JavaScript, using the free Open-Meteo API for weather data. It is intentionally kept small in scope: one page, one main flow, no accounts, no backend, no database.

## 2. Target User

- Students and everyday people who want a fast answer to "what should I wear today/this week?"
- Someone who does not want to interpret raw weather data themselves and prefers a direct recommendation.
- Casual users on a desktop or mobile browser; no technical knowledge required.

## 3. User Inputs

The user provides two inputs before getting a recommendation:

1. **City** — entered as free text (e.g., "Toronto", "Singapore"). This is converted to a location (latitude/longitude) using Open-Meteo's Geocoding API.
2. **Date** — chosen from a date picker. Limited to dates within the forecast range Open-Meteo supports (today plus up to ~16 days ahead), since the tool only plans for upcoming weather, not historical weather.

Both inputs are required before a forecast can be requested.

## 4. Open-Meteo API Data Used

The tool uses two Open-Meteo endpoints:

### 4.1 Geocoding API
Used to turn the city name the user typed into coordinates.

- Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
- Input: city name (`name` query parameter)
- Data used from the response:
  - `latitude`
  - `longitude`
  - `name` / `country` (to confirm the matched location to the user, e.g. "Toronto, Canada")

### 4.2 Forecast API
Used to get the weather forecast for the matched location on the chosen date.

- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Input: `latitude`, `longitude` from the geocoding step, plus requested daily fields
- Daily fields used:
  - `temperature_2m_max` and `temperature_2m_min` — expected high/low temperature
  - `apparent_temperature_max` and `apparent_temperature_min` — "feels like" temperature
  - `precipitation_sum` — total expected rain/snow
  - `precipitation_probability_max` — chance of precipitation
  - `weathercode` — general weather condition (clear, cloudy, rain, snow, thunderstorm, etc.)
  - `windspeed_10m_max` — maximum expected wind speed

The tool reads the single day's values that match the date the user picked and uses those values to build the recommendation.

## 5. Main User Flow

1. User opens the page. The page starts empty, with a city input, a date picker, and a "Get Recommendation" (or similar) button.
2. User types a city name and selects a date.
3. User clicks the button (or submits the form).
4. The page shows a loading state while it:
   a. Calls the Geocoding API to resolve the city to coordinates.
   b. Calls the Forecast API with those coordinates to get the daily forecast.
   c. Picks out the forecast values for the selected date.
5. The page displays:
   - The matched location name and the date.
   - A short summary of the weather (temperature range, feels-like, rain chance, wind).
   - A clothing recommendation (e.g., "Wear a warm jacket and layers").
   - An items-to-bring recommendation (e.g., "Bring an umbrella and sunglasses").
6. The user can change the city or date and submit again, which restarts the flow from step 3.

## 6. How Recommendations Are Derived from Weather Data

The tool uses simple rule-based logic (if/else thresholds), not machine learning, since this is a mini project. Rules are applied in order, and multiple rules can add multiple items to the recommendation list.

### 6.1 Clothing rules (based on temperature / feels-like temperature)

| Condition (approx. °C, using feels-like when available) | Clothing Recommendation |
|---|---|
| Below 0°C | Heavy winter coat, gloves, hat, scarf |
| 0°C to 10°C | Warm jacket or coat, long pants |
| 10°C to 18°C | Light jacket or sweater |
| 18°C to 25°C | T-shirt or light top, comfortable pants |
| Above 25°C | Light, breathable clothing, shorts |

### 6.2 Item rules (based on precipitation, wind, and weather code)

| Condition | Item Recommendation |
|---|---|
| Precipitation probability above a threshold (e.g., ≥ 40%) or precipitation sum > 0 | Bring an umbrella / raincoat |
| Weather code indicates snow | Wear waterproof boots |
| Wind speed above a threshold (e.g., ≥ 30 km/h) | Bring a windbreaker, secure loose items |
| Weather code indicates clear/sunny and daytime high is warm | Bring sunglasses and sunscreen |
| Weather code indicates thunderstorm | Add a warning to stay indoors if possible |

The final output combines one clothing recommendation plus zero or more item recommendations, displayed as a short list of plain-language suggestions rather than raw numbers alone (raw numbers are still shown for reference).

## 7. Required States

The page must clearly handle the following states:

1. **Empty state** — Initial page load before the user has submitted anything. Shows the input form only; no forecast or recommendation is displayed.
2. **Loading state** — Shown after submission while the Geocoding and Forecast API calls are in progress. Indicates to the user that the tool is working (e.g., a loading message or spinner) and disables the submit button to prevent duplicate requests.
3. **Error state** — Shown when something goes wrong after a valid submission, such as:
   - The city cannot be found (no geocoding match).
   - The Open-Meteo API request fails (network error, API error, no data for the date).
   Displays a clear, friendly error message and lets the user try again.
4. **Invalid input state** — Shown when the user tries to submit without a valid city and/or date (e.g., empty city field, no date selected, or a date outside the supported forecast range). Prevents the API call from being made and shows a message telling the user what to fix.
5. **In-use state** — Shown after a successful forecast lookup. Displays the location, date, weather summary, and clothing/item recommendations. The form remains available so the user can submit a new city/date.

## 8. Main Features and Requirements

### 8.1 Features
- City search input with free-text entry.
- Date picker restricted to the supported forecast range.
- Submit action that triggers the lookup flow.
- Display of matched location and forecast summary (temperature, feels-like, precipitation chance, wind).
- Clothing recommendation based on temperature/feels-like.
- Item recommendation(s) based on precipitation, wind, and weather code.
- Visible empty, loading, error, invalid input, and in-use states.

### 8.2 Requirements
- Built with plain HTML, CSS, and JavaScript only — no frameworks, no build tools, no backend/server code.
- Uses `fetch()` with `async`/`await` to call the Open-Meteo Geocoding API and Forecast API directly from the browser.
- All logic (API calls, date matching, recommendation rules, state handling) runs client-side in a single page.
- No user accounts, no data persistence/storage, and no history of past searches is required.
- Works on both desktop and mobile browser widths.
- Reasonable error handling for network failures and unexpected/missing API data so the page never shows a blank or broken screen.

## 9. Out of Scope

- Multi-day or weekly forecast views (only a single selected date is shown).
- Saved preferences, favorites, or accounts.
- Hourly breakdowns.
- Non-Open-Meteo data sources.
- Advanced styling frameworks or animation libraries.
