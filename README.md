# REST Countries API with Color Theme Switcher

Live demo: https://vy-trg.github.io/rest-countries-api-with-color-theme-switcher-master/

Browse every country's flag, population, region and capital, then open a country to see its details and neighbouring countries.

Built with HTML, CSS and vanilla JavaScript.

## Features

- Fetches live data from the [REST Countries API](https://restcountries.com) (v3.1), using three endpoints: all countries, one country by code, and several countries by code (for border country names)
- Requests only the fields each page needs, with an 8-second timeout
- Falls back to a bundled copy of the data (`data.json`) if the API is down, and tells the user
- Search by name and filter by region
- Country detail pages with shareable URLs (`detail.html?code=DEU`) and links to border countries
- Light and dark theme, saved between visits
- Keyboard accessible: every country card and border country is a real link with a visible focus outline

## How it's organised

- `api.js` – all API calls, the fallback, and converting both data formats into one shape
- `app.js` – home page: country cards, search and region filter
- `detail.js` – country detail page
- `theme.js` – light/dark theme toggle
