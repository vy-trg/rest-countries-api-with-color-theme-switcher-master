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
    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
      <img src="${country.flag}" alt="Flag of ${country.name}" />
      <div class="card-info">
        <h2>${country.name}</h2>
        <p><strong>Population:</strong> <span>${country.population.toLocaleString()}</span></p>
        <p><strong>Region:</strong> <span>${country.region}</span></p>
        <p><strong>Capital:</strong> <span>${country.capital || 'N/A'}</span></p>
      </div>
    `;
        card.addEventListener('click', () => {
            localStorage.setItem('selectedCountry', JSON.stringify(country));
            window.location.href = './detail.html';
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