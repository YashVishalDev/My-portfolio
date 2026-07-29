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

    // Highlight active nav item depending on current page pathname
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            link.classList.add('text-indigo-400', 'font-semibold', 'border-b', 'border-indigo-500/50');
            link.classList.remove('text-slate-300');
        } else {
            link.classList.remove('text-indigo-400', 'font-semibold', 'border-b', 'border-indigo-500/50');
            link.classList.add('text-slate-300');
        }
    });

    // Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    revealElements.forEach(el => revealObserver.observe(el));
});
