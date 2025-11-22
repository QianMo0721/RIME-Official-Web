const navToggle = document.querySelector('[data-nav-toggle]');
const navWrapper = document.querySelector('[data-nav]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const header = document.querySelector('.site-header');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const applyTheme = (mode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
};

const setTheme = (mode, persist = true) => {
    applyTheme(mode);
    if (!persist) return;
    localStorage.setItem('rime-theme', mode);
};

const initTheme = () => {
    const stored = localStorage.getItem('rime-theme');
    if (stored) {
        applyTheme(stored);
    } else if (prefersDark.matches) {
        setTheme('dark', false);
    } else {
        setTheme('light', false);
    }
};

initTheme();

prefersDark.addEventListener('change', (event) => {
    const stored = localStorage.getItem('rime-theme');
    if (!stored) {
        applyTheme(event.matches ? 'dark' : 'light');
    }
});

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        setTheme(isDark ? 'dark' : 'light');
    });
}

if (navToggle && navWrapper) {
    navToggle.addEventListener('click', () => {
        const currentState = navWrapper.getAttribute('data-open') === 'true';
        navWrapper.setAttribute('data-open', (!currentState).toString());
        navToggle.setAttribute('aria-expanded', (!currentState).toString());
        document.body.classList.toggle('nav-open', !currentState);
    });

    document.addEventListener('click', (event) => {
        const isToggle = navToggle.contains(event.target);
        if ((!navWrapper.contains(event.target) || event.target === navWrapper) && !isToggle) {
            navWrapper.setAttribute('data-open', 'false');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        }
    });
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element);
});

const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-condensed', window.scrollY > 40);
};

window.addEventListener('scroll', updateHeaderState);
updateHeaderState();

const navLinks = document.querySelectorAll('a[href^=#]');
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navWrapper?.setAttribute('data-open', 'false');
        navToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    });
});
