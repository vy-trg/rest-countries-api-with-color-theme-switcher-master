const grid = document.getElementById('countries-grid');
const search = document.getElementById('search');
const regionFilter = document.getElementById('region-filter');
const themeToggle = document.getElementById('theme-toggle');

let allCountries = [];

// FETCH DATA
async function loadCountries() {
  const response = await fetch('./data.json');
  allCountries = await response.json();
  displayCountries(allCountries);
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

// DARK MODE
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

loadCountries();