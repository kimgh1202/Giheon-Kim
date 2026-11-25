function initializeNavigation() {
    // Keep native anchor navigation and browser scroll restoration intact.
    const navigation = document.getElementById('navbar');
    const navigationContent = navigation?.querySelector('.nav-content');

    if (navigationContent) {
        navigation.setAttribute('aria-label', 'Primary navigation');
        let navigationLinks = navigation.querySelector('.nav-links');

        // Detail pages retain their Home link on desktop and gain a mobile menu.
        if (!navigationLinks) {
            navigationLinks = document.createElement('ul');
            navigationLinks.className = 'nav-links subpage-nav';
            navigationLinks.innerHTML = `
                <li><a href="index.html#home">Home</a></li>
                <li class="dropdown">
                    <a href="index.html#about">About</a>
                    <ul class="dropdown-menu">
                        <li><a href="about-detail.html">Biography &amp; education</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="index.html#research">Research Areas</a>
                    <ul class="dropdown-menu">
                        <li><a href="research-flexible-electronics.html">Flexible electronics</a></li>
                        <li><a href="research-neural-interfaces.html">Neural interfaces</a></li>
                        <li><a href="research-organoid-intelligence.html">Organoid intelligence</a></li>
                    </ul>
                </li>
                <li><a href="index.html#publications">Publications</a></li>
                <li><a href="https://sites.google.com/view/knunblab/" target="_blank" rel="noopener noreferrer">Advisor</a></li>`;
            navigationContent.append(navigationLinks);
        }

        navigationLinks.id = 'primary-navigation';
        const menuToggle = document.createElement('button');
        menuToggle.type = 'button';
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-controls', navigationLinks.id);
        menuToggle.innerHTML = '<span class="menu-label">Menu</span><span class="menu-icon" aria-hidden="true"><span></span><span></span></span>';
        navigationContent.insertBefore(menuToggle, navigationLinks);

        const mobileNavigation = window.matchMedia('(max-width: 768px)');
        const setMenuOpen = (open, restoreFocus = false) => {
            const expanded = open && mobileNavigation.matches;
            navigation.classList.toggle('nav-open', expanded);
            menuToggle.setAttribute('aria-expanded', String(expanded));
            menuToggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
            menuToggle.querySelector('.menu-label').textContent = expanded ? 'Close' : 'Menu';
            if (restoreFocus) menuToggle.focus();
        };
        setMenuOpen(false);

        menuToggle.addEventListener('click', () => {
            setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
        });

        navigation.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link || !mobileNavigation.matches) return;

            // Move keyboard focus to the section when its menu link disappears.
            const href = link.getAttribute('href');
            if (href?.startsWith('#')) {
                const section = document.getElementById(href.slice(1));
                if (section) {
                    section.setAttribute('tabindex', '-1');
                    section.focus({ preventScroll: true });
                }
            }
            setMenuOpen(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navigation.classList.contains('nav-open')) {
                setMenuOpen(false, true);
            }
        });
        document.addEventListener('click', (event) => {
            if (!navigation.contains(event.target)) setMenuOpen(false);
        });
        navigation.addEventListener('focusout', (event) => {
            if (!navigation.contains(event.relatedTarget)) setMenuOpen(false);
        });
        mobileNavigation.addEventListener('change', () => {
            // Do not leave focus inside a menu that becomes hidden on resize.
            const focusMovesToToggle = mobileNavigation.matches && navigationLinks.contains(document.activeElement);
            setMenuOpen(false, focusMovesToToggle);
        });
        window.addEventListener('pageshow', () => setMenuOpen(false));
    }

}

initializeNavigation();

// Scroll Reveal Animation Functionality
function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        // 요소가 화면의 약 1/3 ~ 가운데 부근에 도달했을 때 애니메이션 시작 (이전에는 100px)
        var elementVisible = windowHeight / 3.5; 

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        } else {
            // Remove active class when scrolled out of view, so it replays
            reveals[i].classList.remove('active');
        }
    }
}

// Smooth Scroll State for Mac Trackpads (Direct mapping with Hardware Acceleration)
let ticking = false;

function updateScrollAnim() {
    const scrollY = window.scrollY;
    
    // Zoom Logic
    const title = document.getElementById('zoom-title');
    if (title) {
        const isMobile = window.innerWidth <= 768;
        const scrollLimit = isMobile ? window.innerHeight * 1.2 : window.innerHeight * 1.5;
        const zoomDivisor = isMobile ? 300 : 500;
        const opacityDivisor = isMobile ? window.innerHeight * 0.6 : window.innerHeight * 0.8;

        if (scrollY < scrollLimit) { 
            // Balanced zooming and fade out based on device
            const zoomFactor = 1 + (scrollY / zoomDivisor); 
            const opacityFactor = 1 - (scrollY / opacityDivisor); 
            
            // translateZ(0) forces GPU hardware acceleration for buttery smoothness
            title.style.transform = `scale(${zoomFactor}) translateZ(0)`;
            title.style.opacity = Math.max(0, opacityFactor);
        }
    }
    
    ticking = false;
}

// Start the animation immediately on load
updateScrollAnim();

// Scroll Zoom Effect for Hero Title + Active Navigation State
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Use requestAnimationFrame correctly to sync with screen refresh rate natively
    if (!ticking) {
        window.requestAnimationFrame(updateScrollAnim);
        ticking = true;
    }

    // Dynamic Navbar Glass Effect
    const nav = document.getElementById('navbar');
    if(scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.85)';
        nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.05)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.72)';
        nav.style.boxShadow = 'none';
    }

    // ScrollSpy (Active Navigation)
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

window.addEventListener('scroll', reveal);
window.addEventListener('resize', reveal);
// Hash links may settle after initial script execution or history navigation.
window.addEventListener('load', () => {
    reveal();
    window.dispatchEvent(new Event('scroll'));
});
window.addEventListener('pageshow', () => {
    reveal();
    window.dispatchEvent(new Event('scroll'));
});
// Trigger initializations on load
reveal();
// Trigger a scroll event on load to set initial states correctly
window.dispatchEvent(new Event('scroll'));

