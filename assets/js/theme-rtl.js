// assets/js/theme-rtl.js

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("protoforge_theme", theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggles = document.querySelectorAll('#themeToggle, #themeToggleDash, #desk_themeToggle, #mob_themeToggle');
    themeToggles.forEach(toggle => {
        if (theme === 'dark') {
            toggle.innerHTML = '<i class="bi bi-moon-stars theme-icon" style="transform: rotate(180deg); transition: 0.4s ease;"></i>';
        } else {
            toggle.innerHTML = '<i class="bi bi-sun theme-icon" style="transform: rotate(0deg); transition: 0.4s ease;"></i>';
        }
    });
}

function setDirection(direction) {
    document.documentElement.setAttribute("dir", direction);
    localStorage.setItem("protoforge_direction", direction);
    updateDirectionIcon(direction);
    updateCharts(direction);
}

function toggleDirection() {
    const currentDirection = document.documentElement.getAttribute("dir");
    const newDirection = currentDirection === "rtl" ? "ltr" : "rtl";
    setDirection(newDirection);
}

function updateDirectionIcon(direction) {
    const rtlToggles = document.querySelectorAll('#rtlToggle, #rtlToggleDash, #desk_rtlToggle, #mob_rtlToggle');
    rtlToggles.forEach(toggle => {
        if (direction === 'rtl') {
            toggle.innerHTML = '<span class="rtl-text fw-bold">LTR</span>';
        } else {
            toggle.innerHTML = '<span class="ltr-text fw-bold">RTL</span>';
        }
    });
}

function updateCharts(direction) {
    if (typeof Chart !== 'undefined') {
        Chart.instances.forEach(chart => {
            chart.options.rtl = direction === 'rtl';
            chart.update();
        });
    }
}

// Global function to bind click handlers to all theme/RTL toggle buttons.
// Called on DOMContentLoaded for static buttons, and re-called by auth.js
// after it dynamically injects the desktop/mobile toggle buttons.
function bindThemeRtlToggles() {
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    const dir = document.documentElement.getAttribute("dir") || "ltr";

    updateThemeIcon(theme);
    updateDirectionIcon(dir);

    // Bind theme toggles
    const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleDash, #desk_themeToggle, #mob_themeToggle');
    themeBtns.forEach(btn => {
        // Clone-replace to remove any stale listeners, then attach fresh ones
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', toggleTheme);
    });

    // Bind RTL toggles
    const rtlBtns = document.querySelectorAll('#rtlToggle, #rtlToggleDash, #desk_rtlToggle, #mob_rtlToggle');
    rtlBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', toggleDirection);
    });
}

// Initial bind for any static buttons already in the DOM
document.addEventListener('DOMContentLoaded', () => {
    bindThemeRtlToggles();
});
