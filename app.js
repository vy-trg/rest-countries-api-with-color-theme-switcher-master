const grid = document.getElementById('countries-grid');
const search = document.getElementById('search');
const regionFilter = document.getElementById('region-filter');
const themeToggle = document.getElementById('theme-toggle');

let allCountries = [];

// FETCH DATA
async function loadCountries() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Failed to load data');
        allCountries = await response.json();
        localStorage.setItem('allCountries', JSON.stringify(allCountries));
        displayCountries(allCountries);
    } catch (error) {
        grid.innerHTML = '<p style="padding: 48px 80px;">Failed to load countries. Please try again.</p>';
        console.error(error);
    }
}

// DISPLAY CARDS
function displayCountries(countries) {
    grid.innerHTML = '';
    countries.forEach((country, index) => {
        // a real link, so keyboard users can Tab to each card and open it with Enter
        const card = document.createElement('a');
        card.href = './detail.html';
        card.classList.add('country-card');
        // only the first row of flags loads straight away; the rest load as you scroll
        const loading = index < 8 ? 'eager' : 'lazy';
        card.innerHTML = `
      <img src="${country.flag}" alt="Flag of ${country.name}" width="320" height="160" loading="${loading}" decoding="async" />
      <div class="card-info">
        <h2>${country.name}</h2>
        <p><strong>Population:</strong> <span>${country.population.toLocaleString()}</span></p>
        <p><strong>Region:</strong> <span>${country.region}</span></p>
        <p><strong>Capital:</strong> <span>${country.capital || 'N/A'}</span></p>
      </div>
    `;
        card.addEventListener('click', () => {
            localStorage.setItem('selectedCountry', JSON.stringify(country));
        });
        grid.appendChild(card);
    });
}

// SEARCH
search.addEventListener('input', filterCountries);
regionFilter.addEventListener('change', filterCountries);

function filterCountries() {
    const query = search.value.toLowerCase();
    const region = regionFilter.value;
    const filtered = allCountries.filter(c => {
        const matchName = c.name.toLowerCase().includes(query);
        const matchRegion = region === '' || c.region === region;
        return matchName && matchRegion;
    });
    displayCountries(filtered);
}

loadCountries();