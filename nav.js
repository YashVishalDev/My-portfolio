/**
 * Yash Vishal Portfolio - Instant Navigation & Performance Engine
 * Features:
 * - Instant SPA-like page transitions (0ms perceptible delay)
 * - Intelligent background pre-caching of all internal pages
 * - Hover & touch predictive prefetching
 * - Non-blocking instant reveal animations
 * - Full browser back/forward history support
 */

const INTERNAL_PAGES = ['index.html', 'about.html', 'services.html', 'projects.html', 'contact.html'];
const pageCache = new Map();
let revealObserver = null;

// Get clean filename from path
function getPageName(path) {
    if (!path) return 'index.html';
    const clean = path.split('?')[0].split('#')[0].split('/').pop();
    return clean === '' ? 'index.html' : clean;
}

// Prefetch a page into memory
async function prefetchPage(pageUrl) {
    if (window.location.protocol === 'file:') return;
    const pageName = getPageName(pageUrl);
    if (pageCache.has(pageName) || !INTERNAL_PAGES.includes(pageName)) return;

    try {
        const response = await fetch(pageName, { cache: 'force-cache' });
        if (response.ok) {
            const html = await response.text();
            pageCache.set(pageName, html);
        }
    } catch (e) {
        // Silently ignore prefetch errors
    }
}

// Pre-cache all internal pages in the background
function prefetchAllWindows() {
    if (window.location.protocol === 'file:') return;
    
    // Save current page state
    const currentPage = getPageName(window.location.pathname);
    if (!pageCache.has(currentPage)) {
        pageCache.set(currentPage, document.documentElement.outerHTML);
    }

    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 150));
    idleCallback(() => {
        INTERNAL_PAGES.forEach(page => {
            if (page !== currentPage) {
                prefetchPage(page);
            }
        });
    });
}

// Highlight active nav item
function updateActiveNav(pageName) {
    const current = getPageName(pageName);
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        const href = getPageName(link.getAttribute('href'));
        if (href === current) {
            link.classList.add('text-indigo-400', 'font-semibold', 'border-b', 'border-indigo-500/50');
            link.classList.remove('text-slate-300');
        } else {
            link.classList.remove('text-indigo-400', 'font-semibold', 'border-b', 'border-indigo-500/50');
            link.classList.add('text-slate-300');
        }
    });
}

// Close mobile menu if open
function closeMobileMenu() {
    const menu = document.getElementById('nav-menu');
    const menuBtn = document.getElementById('menu-btn');
    if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        const icon = menuBtn ? menuBtn.firstElementChild : null;
        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }
}

// Reveal animation observer (instant for visible items)
function initRevealAnimations() {
    if (revealObserver) {
        revealObserver.disconnect();
    }

    const revealElements = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // If element is already in or near viewport, show immediately!
        if (rect.top <= windowHeight + 60 && rect.bottom >= -60) {
            el.classList.add('active');
        }
    });

    revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

    revealElements.forEach(el => {
        if (!el.classList.contains('active')) {
            revealObserver.observe(el);
        }
    });
}

// Swap page content instantly
async function navigateTo(targetUrl, pushState = true) {
    const targetPage = getPageName(targetUrl);
    const currentPage = getPageName(window.location.pathname);

    // If clicking same page, just scroll to top
    if (targetPage === currentPage) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
        return;
    }

    // Local file:// protocol fallback to native navigation
    if (window.location.protocol === 'file:') {
        window.location.href = targetUrl;
        return;
    }

    closeMobileMenu();

    // Get cached or fetched HTML
    let html = pageCache.get(targetPage);
    if (!html) {
        try {
            const response = await fetch(targetPage, { cache: 'force-cache' });
            if (!response.ok) throw new Error('Network error');
            html = await response.text();
            pageCache.set(targetPage, html);
        } catch (err) {
            window.location.href = targetUrl;
            return;
        }
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newMain = doc.querySelector('main');
    const currentMain = document.querySelector('main');

    if (!newMain || !currentMain) {
        window.location.href = targetUrl;
        return;
    }

    // Update document title
    if (doc.title) {
        document.title = doc.title;
    }

    // Replace main content seamlessly
    currentMain.replaceWith(newMain);

    // Instant scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update URL history
    if (pushState) {
        window.history.pushState({ page: targetPage }, '', targetPage);
    }

    // Update active nav styling
    updateActiveNav(targetPage);

    // Lifecycle triggers for page-specific features
    if (targetPage === 'projects.html' || document.getElementById('projects-grid')) {
        if (typeof window.renderProjects === 'function') {
            window.renderProjects();
        }
    }

    if (targetPage === 'index.html' && document.getElementById('particles-js')) {
        if (typeof window.initParticles === 'function') {
            window.initParticles();
        }
    } else {
        if (typeof window.stopParticles === 'function') {
            window.stopParticles();
        }
    }

    // Trigger snappy reveal animations for newly swapped elements
    initRevealAnimations();
}

// Bind click and hover listeners on links
function bindNavigationListeners() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Skip modified clicks (new tab, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Check if internal HTML link
        const cleanHref = href.split('#')[0].split('?')[0];
        if (cleanHref.endsWith('.html') || INTERNAL_PAGES.includes(cleanHref)) {
            // Internal page link
            e.preventDefault();
            navigateTo(cleanHref);
        }
    });

    // Hover / touch predictive preloading
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (href && (href.endsWith('.html') || INTERNAL_PAGES.includes(href))) {
            prefetchPage(href);
        }
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (href && (href.endsWith('.html') || INTERNAL_PAGES.includes(href))) {
            prefetchPage(href);
        }
    }, { passive: true });
}

// Setup popstate (Back / Forward buttons)
window.addEventListener('popstate', () => {
    const page = getPageName(window.location.pathname);
    navigateTo(page, false);
});

// Setup on initial DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('nav-menu');
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            const icon = menuBtn.firstElementChild;
            menu.classList.toggle('hidden');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    // Set initial active nav
    updateActiveNav(window.location.pathname);

    // Initial reveal elements
    initRevealAnimations();

    // Bind link clicks and hovers for instant SPA routing
    bindNavigationListeners();

    // Warm up page cache in the background
    prefetchAllWindows();
});
