# AGENTS.md

## Project

Weather Outfit Planner

## Read First

Before making any changes or writing code, read these files:

1. PROPOSAL.md
2. PRD.md
3. DESIGN.md

Follow the requirements and design described in these files.

## Development Rules

- Use only plain HTML, CSS, and JavaScript.
- Do not use React, Tailwind, frameworks, external libraries, or CDNs.
- Use the simplest code that works.
- Add nothing I did not ask for.
- Keep HTML, CSS, and JavaScript in separate files.
- The website must work on desktop and mobile.
- Keep the interface simple and easy to understand.

## API Rules

- Use the Open-Meteo API described in PRD.md.
- Use fetch() with async/await.
- Put each fetch request inside try/catch.
- Check response.ok before reading the response.
- Do not use an API key.
- Do not add a backend or server.
- Do not add other APIs unless I ask for them.

## Required States

The website must support all five states described in PRD.md and DESIGN.md:

1. Empty
2. Loading
3. Error
4. Invalid input
5. In use

## Scope

Build only the features described in PROPOSAL.md, PRD.md, and DESIGN.md.

Do not add:
- accounts
- login
- saved searches
- favorites
- databases
- multi-day weather views
- frameworks
- unnecessary animations

## Code Quality

- Keep the JavaScript simple enough for me to explain.
- Use clear variable and function names.
- Separate API fetching, recommendation logic, validation, and page updates when practical.
- Do not make the code more complicated than necessary.