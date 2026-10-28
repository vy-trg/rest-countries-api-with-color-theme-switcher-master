// Data layer: talks to the REST Countries API (https://restcountries.com).
// If the API is down or slow, it falls back to a bundled copy in data.json,
// so the app keeps working. Both sources are converted to the same shape.

const API_BASE = 'https://restcountries.com/v3.1';
const REQUEST_TIMEOUT_MS = 8000;

async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}

// API (v3.1) record -> app shape
function fromApi(c) {
    const native = c.name?.nativeName ? Object.values(c.name.nativeName)[0]?.common : '';
    return {
        code: c.cca3,
        name: c.name?.common ?? '',
        nativeName: native || '',
        flag: c.flags?.svg || c.flags?.png || '',
        flagAlt: c.flags?.alt || '',
        population: c.population ?? 0,
        region: c.region || '',
        subregion: c.subregion || '',
        capital: (c.capital || []).join(', '),
        tld: c.tld || [],
        currencies: Object.values(c.currencies || {}).map(cur => cur.name),
        languages: Object.values(c.languages || {}),
        borders: c.borders || [],
    };
}

// bundled data.json record (v2 format) -> app shape
function fromLocal(c) {
    return {
        code: c.alpha3Code,
        name: c.name,
        nativeName: c.nativeName || '',
        flag: c.flag,
        flagAlt: '',
        population: c.population ?? 0,
        region: c.region || '',
        subregion: c.subregion || '',
        capital: c.capital || '',
        tld: c.topLevelDomain || [],
        currencies: (c.currencies || []).map(cur => cur.name),
        languages: (c.languages || []).map(l => l.name),
        borders: c.borders || [],
    };
}

let localCache = null;
async function loadLocal() {
    if (!localCache) localCache = (await fetchJson('./data.json')).map(fromLocal);
    return localCache;
}

const byName = (a, b) => a.name.localeCompare(b.name);

// All countries for the home page. Returns { countries, live }.
async function getAllCountries() {
    try {
        const data = await fetchJson(`${API_BASE}/all?fields=name,flags,population,region,capital,cca3`);
        return { countries: data.map(fromApi).sort(byName), live: true };
    } catch (error) {
        console.warn('REST Countries API unavailable, using bundled data.', error);
        return { countries: (await loadLocal()).sort(byName), live: false };
    }
}

// One country with full details. Returns { country, live } (country is null if not found).
async function getCountry(code) {
    const fields = 'name,flags,population,region,subregion,capital,tld,currencies,languages,borders';
    try {
        const data = await fetchJson(`${API_BASE}/alpha/${encodeURIComponent(code)}?fields=${fields}`);
        const record = Array.isArray(data) ? data[0] : data;
        return { country: { ...fromApi(record), code: code.toUpperCase() }, live: true };
    } catch (error) {
        console.warn('REST Countries API unavailable, using bundled data.', error);
        const local = await loadLocal();
        return { country: local.find(c => c.code === code.toUpperCase()) || null, live: false };
    }
}

// Names for a list of country codes, e.g. border countries. Returns a Map code -> name.
async function getCountryNames(codes) {
    if (codes.length === 0) return new Map();
    try {
        const data = await fetchJson(`${API_BASE}/alpha?codes=${codes.map(encodeURIComponent).join(',')}&fields=name,cca3`);
        return new Map(data.map(c => [c.cca3, c.name.common]));
    } catch (error) {
        const local = await loadLocal();
        return new Map(local.filter(c => codes.includes(c.code)).map(c => [c.code, c.name]));
    }
}
