// Prevent browser from restoring scroll position on reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

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
        const scrollLimit = isMobile ? window.innerHeight * 1.2 : window.innerHeight * 2.7;
        const zoomDivisor = isMobile ? 300 : 500;
        const opacityDivisor = isMobile ? window.innerHeight * 0.6 : window.innerHeight * 1.2;

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
// Trigger initializations on load
reveal();
// Trigger a scroll event on load to set initial states correctly
window.dispatchEvent(new Event('scroll'));

