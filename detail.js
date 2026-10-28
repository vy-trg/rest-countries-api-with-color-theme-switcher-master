const statusMessage = document.getElementById('status');
const content = document.querySelector('.detail-content');

function setText(id, value) {
    document.getElementById(id).textContent = value || 'N/A';
}

async function loadCountry() {
    const code = new URLSearchParams(location.search).get('code');
    if (!code) {
        statusMessage.textContent = 'No country selected.';
        return;
    }

    statusMessage.textContent = 'Loading…';
    const { country, live } = await getCountry(code);
    if (!country) {
        statusMessage.textContent = `No country found for code "${code}".`;
        return;
    }
    statusMessage.textContent = live ? '' : 'The live API is unavailable right now, so this is saved data.';

    document.title = `${country.name} | Where in the world?`;
    const flag = document.getElementById('detail-flag');
    flag.src = country.flag;
    flag.alt = country.flagAlt || `Flag of ${country.name}`;
    setText('detail-name', country.name);
    setText('detail-native', country.nativeName);
    setText('detail-population', country.population.toLocaleString());
    setText('detail-region', country.region);
    setText('detail-subregion', country.subregion);
    setText('detail-capital', country.capital);
    setText('detail-domain', country.tld.join(', '));
    setText('detail-currencies', country.currencies.join(', '));
    setText('detail-languages', country.languages.join(', '));
    content.hidden = false;

    // BORDER COUNTRIES: links to each neighbour, labelled with its full name
    const borderLinks = document.getElementById('border-buttons');
    if (country.borders.length === 0) {
        borderLinks.textContent = 'None';
        return;
    }
    const names = await getCountryNames(country.borders);
    borderLinks.replaceChildren(...country.borders.map(borderCode => {
        const link = document.createElement('a');
        link.classList.add('border-btn');
        link.href = `./detail.html?code=${encodeURIComponent(borderCode)}`;
        link.textContent = names.get(borderCode) || borderCode;
        return link;
    }));
}

loadCountry().catch(error => {
    statusMessage.textContent = 'Failed to load this country. Please try again.';
    console.error(error);
});
