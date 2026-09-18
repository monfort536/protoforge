// auth.js

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            
            // Custom match validation
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity("Passwords do not match");
            } else {
                confirmPassword.setCustomValidity("");
            }

            if (!registerForm.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                registerForm.classList.add('was-validated');
                return;
            }
            e.preventDefault(); // Valid form, prevent native submit to handle auth locally

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            const users = JSON.parse(localStorage.getItem('protoforge_users')) || [];
            if (users.find(u => u.email === email)) {
                const emailInput = document.getElementById('email');
                emailInput.setCustomValidity("Email already registered!");
                registerForm.classList.add('was-validated');
                
                // Reset custom validity immediately so they can re-type
                emailInput.addEventListener('input', function() {
                    emailInput.setCustomValidity("");
                }, {once: true});
                
                alert('Email already registered!');
                return;
            }

            const newUser = { name, email, password: password.value, id: Date.now(), role: 'client' };
            users.push(newUser);
            localStorage.setItem('protoforge_users', JSON.stringify(users));
            
            alert('Registration successful! Please log in with your new credentials.');
            window.location.href = '/login.html';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            if (!loginForm.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                loginForm.classList.add('was-validated');
                return;
            }
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('protoforge_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                if (user.email === 'admin@protoforge.com') user.role = 'admin';
                else if (!user.role) user.role = 'client';
                
                localStorage.setItem('protoforge_current_user', JSON.stringify(user));
                window.location.href = '/dashboard/client-dashboard.html';
            } else {
                const passInput = document.getElementById('password');
                passInput.setCustomValidity("Invalid email or password");
                loginForm.classList.add('was-validated');
                
                passInput.addEventListener('input', function() {
                    passInput.setCustomValidity("");
                }, {once: true});
                
                alert('Invalid email or password.');
            }
        });
    }
});

function logout() {
    localStorage.removeItem('protoforge_current_user');
    window.location.href = '/index.html';
}

function updateAuthUI() {
    const containers = document.querySelectorAll('.auth-buttons-container');
    const currentUser = JSON.parse(localStorage.getItem('protoforge_current_user'));

    containers.forEach(container => {
        let authLinks = '';
                if (currentUser) {
            if (currentUser.email === 'admin@protoforge.com') currentUser.role = 'admin';
            
            let dashboardLink = '';
            if (currentUser.email === 'admin@protoforge.com') {
                dashboardLink = `<li><a class="dropdown-item py-2 d-flex align-items-center" href="/dashboard/client-dashboard.html"><i class="bi bi-speedometer2 me-2"></i> Admin Panel</a></li>`;
            }

            authLinks = `
                <div class="dropdown pf-dropdown">
                  <button class="btn pf-btn-primary dropdown-toggle d-flex align-items-center gap-2 pf-hover-lift" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding: 0.4rem 1.2rem;">
                    <i class="bi bi-person-circle"></i> Profile
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end clay-dropdown shadow-lg border-0 mt-2">
                    <li class="px-3 py-2 border-bottom border-secondary-subtle mb-1">
                        <span class="d-block fw-bold text-primary" style="font-size: 0.9rem;">${currentUser.name || 'User'}</span>
                        <span class="d-block text-muted" style="font-size: 0.75rem;">${currentUser.email}</span>
                    </li>
                    ${dashboardLink}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item py-2 text-danger d-flex align-items-center" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                  </ul>
                </div>
            `;
        } else {
            authLinks = `
                <a href="/login.html" class="btn pf-btn-secondary text-nowrap flex-shrink-0 me-2 pf-hover-lift" style="padding: 0.4rem 1.2rem;">Login</a>
                <a href="/register.html" class="btn pf-btn-primary text-nowrap flex-shrink-0 pf-hover-lift" style="padding: 0.4rem 1.2rem;">Sign Up</a>
            `;
        }
        
        const togglesInner = `
            <button id="THEME_ID" class="clay-icon-btn pf-hover-lift m-0" aria-label="Toggle Theme">
                <i class="bi bi-moon-fill"></i>
            </button>
            <button id="RTL_ID" class="clay-pill-btn pf-hover-lift m-0" aria-label="Toggle RTL">
                RTL
            </button>
        `;
        
        const desktopToggles = `
            <div class="d-none d-xl-flex align-items-center gap-2 me-2 border-end pe-2 border-secondary-subtle">
                ${togglesInner.replace('THEME_ID', 'desk_themeToggle').replace('RTL_ID', 'desk_rtlToggle')}
            </div>
        `;
        
        // Wrap authLinks in a centered container for mobile
        container.innerHTML = desktopToggles + `<div class="d-flex justify-content-center w-100 w-xl-auto">${authLinks}</div>`;

        
        const pfNavbar = container.closest('.navbar');
        if (pfNavbar) {
            const navList = pfNavbar.querySelector('.navbar-nav');
            if (navList) {
                let existingDash = navList.querySelector('#dynamicDashboardLink');
                // Always show the Dashboard link, even if logged out (it redirects to login automatically)
                if (!existingDash) {
                    const dashLi = document.createElement('li');
                    dashLi.className = 'nav-item';
                    dashLi.id = 'dynamicDashboardLink';
                    const linkUrl = '/dashboard/client-dashboard.html';
                    dashLi.innerHTML = `<a class="nav-link fw-bold text-primary-pf" href="${linkUrl}">Dashboard</a>`;
                    navList.appendChild(dashLi);
                }
            }
        }

        const navbar = container.closest('.navbar');
        if (navbar && !navbar.querySelector('.mobile-toggles')) {
            const toggler = navbar.querySelector('.navbar-toggler');
            if (toggler) {
                const mobileToggles = document.createElement('div');
                mobileToggles.className = 'd-flex align-items-center gap-2 ms-auto me-3 d-xl-none mobile-toggles';
                mobileToggles.innerHTML = togglesInner.replace('THEME_ID', 'mob_themeToggle').replace('RTL_ID', 'mob_rtlToggle');
                toggler.parentNode.insertBefore(mobileToggles, toggler);
            }
        }
    });

    // Re-bind theme/RTL toggle click handlers now that buttons exist in the DOM
    if (typeof bindThemeRtlToggles === 'function') {
        bindThemeRtlToggles();
    }

    // Protect dashboard routes
    if (window.location.pathname.includes('/dashboard/') && !currentUser) {
        window.location.href = '/login.html';
    }
}
