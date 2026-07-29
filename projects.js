// Project Database
const projectsData = [
    {
        id: 'railway-study-point',
        title: 'Railway Study Point',
        category: 'web',
        categoryLabel: 'Web Application',
        summary: 'Comprehensive mock exam platform for railways candidates with complete exam history & Mock Exam Creator.',
        description: 'Railway Study Point is a full-featured mock exam application custom built for candidates preparing for competitive railway exams. The platform includes an interactive profile settings view, Premium Membership detail analytics, Categories/Folders structure, and a mock exam dashboard. It also features a fully functional mock exam creator console allowing admins to set scheduling, duration, scoring, and questions.',
        technologies: ['TypeScript', 'Next.js', 'React', 'Vercel', 'TailwindCSS'],
        link: 'https://railway-study-point.vercel.app/',
        screenshots: [
            'images/railway-study-point-2.png',
            'images/railway-study-point-1.png'
        ]
    },
    {
        id: 'reviews-world',
        title: 'Reviews World',
        category: 'web',
        categoryLabel: 'Digital Marketing & Growth',
        summary: 'The main promotional gateway and service catalog for Reviews World marketing services.',
        description: 'Reviews World is the flagship web portal for Yash Vishal\'s marketing and application scaling startup. Since 2021, the platform serves as the public agency front-end enabling app developers to book campaigns, purchase reviews, manage growth pipelines, and read SEO content.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Netlify', 'Responsive CSS'],
        link: 'https://reviewsworld01.netlify.app',
        screenshots: [
            'images/reviews-world-1.png',
            'images/reviews-world-2.png',
            'images/reviews-world-3.png',
            'images/reviews-world-4.png'
        ]
    },
    {
        id: 'reviews-world-wallet',
        title: 'Reviews World Wallet',
        category: 'web',
        categoryLabel: 'Web Application',
        summary: 'A secure client dashboard tracking review orders, campaign billing, and reward structures.',
        description: 'The Reviews World Wallet is a custom dashboard built for campaign clients. It enables real-time rewards logging, verification of ordered reviews, user-tier listings (e.g. Premium Member details), billing transactions ledger, and interactive settings toggle panels.',
        technologies: ['JavaScript', 'TailwindCSS', 'HTML', 'Vercel'],
        link: 'https://rw-wallet.vercel.app/',
        screenshots: [
            'images/rw-wallet-1.png',
            'images/rw-wallet-2.png',
            'images/rw-wallet-3.png',
            'images/rw-wallet-4.png',
            'images/rw-wallet-5.png'
        ]
    },
    {
        id: 'comment-generator',
        title: 'RW Comment Generator',
        category: 'tool',
        categoryLabel: 'Tools & Utilities',
        summary: 'A database portal where administrators upload and organize feedback comments, allowing users to quickly access and copy them.',
        description: 'RW Comment Generator is a web platform where administrators publish, organize, and manage predefined feedback comments for reviews. Users can access this portal to quickly copy and utilize these comments for app review and feedback cycles.',
        technologies: ['JavaScript', 'CSS', 'HTML', 'Netlify'],
        link: 'https://rw-comment-web.netlify.app/',
        screenshots: [
            'images/rw-comment-1.png',
            'images/rw-comment-2.png',
            'images/rw-comment-3.png',
            'images/rw-comment-4.png',
            'images/rw-comment-5.png'
        ]
    },
    {
        id: 'rw-playstore-live-checker',
        title: 'RW Playstore Live Checker',
        category: 'tool',
        categoryLabel: 'Tools & Utilities',
        summary: 'Python automation tool checking real-time Google Play Store app listing statuses.',
        description: 'A back-end automation script utilizing Google Play scraper modules. It checks a set of application package IDs recursively to monitor listing status (live, suspended, draft) and triggers instant webhook notifications to operational heads.',
        technologies: ['Python', 'Automation', 'Google Play API'],
        link: 'https://yash9525-rw-live-checker.hf.space/',
        screenshots: [
            'images/playstore-checker-1.png',
            'images/playstore-checker-2.png',
            'images/playstore-checker-3.jpg',
            'images/playstore-checker-4.jpg',
            'images/playstore-checker-5.png'
        ]
    },
    {
        id: 'web-to-app-generator',
        title: 'Web to App Generator',
        category: 'tool',
        categoryLabel: 'Tools & Utilities',
        summary: 'Native Java compiler packaging responsive web projects into Android APK files.',
        description: 'A native Java wrapper template built inside Android Studio. It automatically bundles responsive target web URLs into APK wrappers, including deep linking support, push notifications receiver, offline caches, and splash indicators.',
        technologies: ['Java', 'Android SDK', 'WebView API'],
        link: '',
        screenshots: [
            'https://placehold.co/800x450/0f172a/f59e0b?text=Web-to-App+APK+Generator'
        ]
    }
];

// Inject Projects Grid
function renderProjects(filter = 'all') {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category === filter);
        
    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'glass-card rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer group';
        card.onclick = () => openProjectDetails(project.id);
        
        // Tech tags markup
        const tagsMarkup = project.technologies.slice(0, 3).map(tech => 
            `<span class="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-semibold px-2.5 py-1 rounded-full">${tech}</span>`
        ).join(' ');
        
        card.innerHTML = `
            <div class="relative overflow-hidden aspect-video bg-slate-900 border-b border-slate-800/50">
                <img src="${project.screenshots[0]}" alt="${project.title}" loading="lazy" class="w-full h-full object-cover object-center transition duration-500 group-hover:scale-105 group-hover:opacity-90">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-4">
                    <span class="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full backdrop-blur-md">${project.categoryLabel}</span>
                </div>
            </div>
            <div class="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div class="space-y-2">
                    <h3 class="text-xl font-extrabold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                        <span>${project.title}</span>
                        <i class="fa-solid fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                    </h3>
                    <p class="text-slate-400 text-sm leading-relaxed">${project.summary}</p>
                </div>
                <div class="flex flex-wrap gap-2 pt-2">
                    ${tagsMarkup}
                    ${project.technologies.length > 3 ? `<span class="text-[10px] text-slate-500 self-center font-bold pl-1">+${project.technologies.length - 3} more</span>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Project Filters
function filterProjects(filter) {
    renderProjects(filter);
    
    // Toggle active classes on buttons
    document.querySelectorAll('.project-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('bg-indigo-600', 'text-white');
            btn.classList.remove('bg-slate-900', 'border-slate-800', 'text-slate-300');
        } else {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('bg-slate-900', 'border-slate-800', 'text-slate-300');
        }
    });
}

// Details Variables
let currentProject = null;
let currentSlideIndex = 0;
let previousScrollPosition = 0;
let autoSlideInterval = null;

function startAutoSlide() {
    stopAutoSlide();
    if (currentProject && currentProject.screenshots.length > 1) {
        autoSlideInterval = setInterval(() => {
            if (currentProject) {
                currentSlideIndex = (currentSlideIndex + 1) % currentProject.screenshots.length;
                updateSlidePosition();
            }
        }, 3000); // auto-slide every 3 seconds
    }
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function openProjectDetails(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    currentProject = project;
    currentSlideIndex = 0;
    previousScrollPosition = window.scrollY;
    
    // Set Titles/Text
    document.getElementById('details-title').innerText = project.title;
    document.getElementById('details-category').innerText = project.categoryLabel;
    document.getElementById('details-description').innerText = project.description;
    
    // Render Tech Tags
    const tagsContainer = document.getElementById('details-tags');
    tagsContainer.innerHTML = project.technologies.map(tech => 
        `<span class="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-semibold">${tech}</span>`
    ).join('');
    
    // Set Link
    const linkBtn = document.getElementById('details-link-btn');
    const linkPlaceholder = document.getElementById('details-link-placeholder');
    if (project.link && project.link !== '#') {
        linkBtn.href = project.link;
        linkBtn.classList.remove('hidden');
        linkPlaceholder.classList.add('hidden');
    } else {
        linkBtn.classList.add('hidden');
        linkPlaceholder.classList.remove('hidden');
    }
    
    // Setup Slides
    const wrapper = document.getElementById('details-slides-wrapper');
    const dotsContainer = document.getElementById('details-slides-dots');
    wrapper.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    project.screenshots.forEach((src, idx) => {
        // Slide image
        const slide = document.createElement('div');
        slide.className = 'w-full h-full flex-shrink-0 relative';
        slide.innerHTML = `<img src="${src}" alt="Screenshot ${idx + 1}" loading="lazy" class="w-full h-full object-contain">`;
        wrapper.appendChild(slide);
        
        // Slide dot indicator
        const dot = document.createElement('button');
        dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-indigo-500 w-5' : 'bg-slate-700'}`;
        dot.onclick = () => goToSlide(idx);
        dotsContainer.appendChild(dot);
    });
    
    // Hide buttons if only 1 image
    const prevBtn = document.getElementById('details-prev-slide-btn');
    const nextBtn = document.getElementById('details-next-slide-btn');
    if (project.screenshots.length <= 1) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }
    
    updateSlidePosition();
    
    // Show details panel with fade animation
    const listView = document.getElementById('projects-list-view');
    const detailsView = document.getElementById('project-details-view');
    
    listView.classList.add('hidden');
    detailsView.classList.remove('hidden');
    
    // Hide navigation header for exclusive details view
    const header = document.querySelector('header');
    if (header) header.classList.add('hidden');
    
    // Adjust top padding of main container for detail view
    const mainEl = document.querySelector('main');
    if (mainEl) {
        mainEl.classList.remove('pt-32');
        mainEl.classList.add('pt-12');
    }
    
    // Smooth scroll to top of details
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setTimeout(() => {
        detailsView.classList.remove('opacity-0');
        detailsView.classList.add('opacity-100');
    }, 50);

    // Start auto slideshow
    startAutoSlide();
}

function closeProjectDetails() {
    // Stop auto slideshow
    stopAutoSlide();

    const listView = document.getElementById('projects-list-view');
    const detailsView = document.getElementById('project-details-view');
    
    detailsView.classList.remove('opacity-100');
    detailsView.classList.add('opacity-0');
    
    // Restore navigation header
    const header = document.querySelector('header');
    if (header) header.classList.remove('hidden');
    
    // Restore top padding of main container
    const mainEl = document.querySelector('main');
    if (mainEl) {
        mainEl.classList.remove('pt-12');
        mainEl.classList.add('pt-32');
    }
    
    setTimeout(() => {
        detailsView.classList.add('hidden');
        listView.classList.remove('hidden');
        
        // Scroll back to where the user clicked the card
        window.scrollTo({ top: previousScrollPosition, behavior: 'instant' });
        currentProject = null;
    }, 250);
}

// Slider operations
function updateSlidePosition() {
    const wrapper = document.getElementById('details-slides-wrapper');
    if (!wrapper) return;
    wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Update dots
    const dotsContainer = document.getElementById('details-slides-dots');
    if (!dotsContainer) return;
    const dots = dotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
        if (i === currentSlideIndex) {
            dots[i].classList.remove('bg-slate-700');
            dots[i].classList.add('bg-indigo-500', 'w-5');
        } else {
            dots[i].classList.add('bg-slate-700');
            dots[i].classList.remove('bg-indigo-500', 'w-5');
        }
    }
}

function prevSlide() {
    if (!currentProject) return;
    currentSlideIndex = (currentSlideIndex - 1 + currentProject.screenshots.length) % currentProject.screenshots.length;
    updateSlidePosition();
    startAutoSlide(); // reset timer
}

function nextSlide() {
    if (!currentProject) return;
    currentSlideIndex = (currentSlideIndex + 1) % currentProject.screenshots.length;
    updateSlidePosition();
    startAutoSlide(); // reset timer
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateSlidePosition();
    startAutoSlide(); // reset timer
}

// Keyboard navigation for carousel & closing details
window.addEventListener('keydown', (e) => {
    const detailsView = document.getElementById('project-details-view');
    if (detailsView && !detailsView.classList.contains('hidden')) {
        if (e.key === 'Escape') closeProjectDetails();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    }
});

// Render projects on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});
