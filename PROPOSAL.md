# Weather Outfit Planner Proposal

## What I am building

I am building a weather outfit planner that checks real weather data and helps the user decide what to wear and what to bring.

## Who it is for

This tool is for students and other people who want a quick way to decide what to wear before going outside. Instead of checking the weather and deciding everything themselves, they can get a simple recommendation.

## The API

I will use the Open-Meteo API. It provides weather forecast data. I plan to use information such as temperature, apparent temperature, precipitation, weather code, and wind speed.

I tested the Open-Meteo API in the browser console and confirmed that it returns weather data successfully.

## What the user chooses

The user chooses a city and a date. The tool will use those choices to find the weather forecast for that location and date.

## What the page works out

The page uses the weather information to decide what the user should wear and what they should bring. For example, if it is cold, the tool may recommend a warm jacket. If rain is expected, it may recommend bringing an umbrella.

## Features

- Search for a city
- Choose a date
- Show the weather forecast
- Recommend what to wear based on the weather
- Recommend what to bring based on the weather

## What I do not know yet

I still need to figure out how to use JavaScript with fetch() and await to get the correct weather data for the user's city and date. I also need to figure out the best way to turn different weather conditions into clothing and item recommendations.