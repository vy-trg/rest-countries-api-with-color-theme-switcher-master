function applyTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) document.body.classList.add('dark');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

applyTheme();
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);