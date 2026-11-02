# Weather Outfit Planner

A simple web tool that uses real weather data to help users decide what to wear and what to bring.

## What It Does

The user enters a city and selects a date. The website gets weather data for that location and shows:

- Weather conditions
- High and low temperature in °F and °C
- Feels-like temperature
- Rain chance
- Wind speed
- What to wear
- What to bring

The recommendations change depending on the weather. For example, cold weather may recommend a warm jacket, while rainy weather may recommend a rain jacket and umbrella.

## How to Use

1. Enter a city.
2. Choose a date within the available forecast range.
3. Click **Get Recommendation**.
4. View the weather information.
5. Check the **What to Wear** and **What to Bring** recommendations.

## Weather Data

This project uses the Open-Meteo API.

The Geocoding API converts the city entered by the user into a location with latitude and longitude.

The Forecast API then uses that location to get weather information for the selected date.

## Built With

- HTML
- CSS
- JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Forecast API

## Project Files

- `index.html` — page structure
- `style.css` — page design and responsive layout
- `script.js` — API calls, weather processing, recommendations, and interactions
- `PROPOSAL.md` — original project idea
- `PRD.md` — product requirements
- `DESIGN.md` — design direction
- `AGENTS.md` — instructions used while developing with AI

## AI Development Reflection

I used AI to help build and improve this project, but I tested the website throughout the development process.

One important part of the process was building the project step by step. The first version could identify a city but did not yet retrieve the full weather forecast or provide outfit recommendations. I then added the forecast API, tested the weather results, and added rules that turn the weather data into clothing and item recommendations.

I also tested different cities, weather conditions, invalid inputs, and screen sizes to make sure the website worked correctly.

## Live Site

