const grid = document.getElementById('countries-grid');
const search = document.getElementById('search');
const regionFilter = document.getElementById('region-filter');
const statusMessage = document.getElementById('status');

let allCountries = [];

// FETCH DATA
async function loadCountries() {
    statusMessage.textContent = 'Loading countries…';
    try {
        const { countries, live } = await getAllCountries();
        allCountries = countries;
        statusMessage.textContent = live ? '' : 'The live API is unavailable right now, so this is saved data.';
        filterCountries();
    } catch (error) {
        statusMessage.textContent = 'Failed to load countries. Please try again.';
        console.error(error);
    }
}

// one card per country, built with DOM methods so names are never treated as HTML
function createCard(country, index) {
    const card = document.createElement('a');
    card.href = `./detail.html?code=${encodeURIComponent(country.code)}`;
    card.classList.add('country-card');

    const img = document.createElement('img');
    img.src = country.flag;
    img.alt = country.flagAlt || `Flag of ${country.name}`;
    img.width = 320;
    img.height = 160;
    // only the first row of flags loads straight away; the rest load as you scroll
    img.loading = index < 8 ? 'eager' : 'lazy';
    img.decoding = 'async';

    const info = document.createElement('div');
    info.classList.add('card-info');
    const title = document.createElement('h2');
    title.textContent = country.name;
    info.append(
        title,
        detailLine('Population', country.population.toLocaleString()),
        detailLine('Region', country.region || 'N/A'),
        detailLine('Capital', country.capital || 'N/A'),
    );

    card.append(img, info);
    return card;
}

function detailLine(label, value) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    const span = document.createElement('span');
    span.textContent = value;
    p.append(strong, span);
    return p;
}

// DISPLAY CARDS
function displayCountries(countries) {
    grid.replaceChildren(...countries.map(createCard));
    if (countries.length === 0 && allCountries.length > 0) {
        statusMessage.textContent = 'No countries match your search.';
    } else if (statusMessage.textContent === 'No countries match your search.') {
        statusMessage.textContent = '';
    }
}

// SEARCH AND FILTER
search.addEventListener('input', filterCountries);
regionFilter.addEventListener('change', filterCountries);

function filterCountries() {
    const query = search.value.trim().toLowerCase();
    const region = regionFilter.value;
    const filtered = allCountries.filter(c => {
        const matchName = c.name.toLowerCase().includes(query);
        const matchRegion = region === '' || c.region === region;
        return matchName && matchRegion;
    });
    displayCountries(filtered);
}

loadCountries();
