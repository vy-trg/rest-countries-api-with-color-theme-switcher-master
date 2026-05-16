// LOAD COUNTRY DATA
const raw = localStorage.getItem('selectedCountry');
const country = raw ? JSON.parse(raw) : null;

if (country) {
  document.getElementById('detail-flag').src = country.flag;
  document.getElementById('detail-flag').alt = `Flag of ${country.name}`;
  document.getElementById('detail-name').textContent = country.name;
  document.getElementById('detail-native').textContent = country.nativeName || 'N/A';
  document.getElementById('detail-population').textContent = country.population.toLocaleString();
  document.getElementById('detail-region').textContent = country.region || 'N/A';
  document.getElementById('detail-subregion').textContent = country.subregion || 'N/A';
  document.getElementById('detail-capital').textContent = country.capital || 'N/A';
  document.getElementById('detail-domain').textContent = country.topLevelDomain?.join(', ') || 'N/A';
  document.getElementById('detail-currencies').textContent = country.currencies?.map(c => c.name).join(', ') || 'N/A';
  document.getElementById('detail-languages').textContent = country.languages?.map(l => l.name).join(', ') || 'N/A';

  // BORDER COUNTRIES
  const borderButtons = document.getElementById('border-buttons');
  if (country.borders && country.borders.length > 0) {
    country.borders.forEach(code => {
      const btn = document.createElement('button');
      btn.classList.add('border-btn');
      btn.textContent = code;
      btn.addEventListener('click', async () => {
        const response = await fetch('./data.json');
        const allCountries = await response.json();
        const bordered = allCountries.find(c => c.alpha3Code === code);
        if (bordered) {
          localStorage.setItem('selectedCountry', JSON.stringify(bordered));
          window.location.reload();
        }
      });
      borderButtons.appendChild(btn);
    });
  } else {
    borderButtons.textContent = 'None';
  }
}