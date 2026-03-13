/*===== ABOUT PAGE JAVASCRIPT =====*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all about page functionality
    initAboutPage();
});

function initAboutPage() {
    // Hero stats counter animation
    initHeroStats();
    
    // Simple video functionality
    initSimpleVideo();
    
    // Timeline animation
    initTimelineAnimation();
    
    // Scroll reveal animations
    initScrollReveal();
    
    // Value cards hover effect
    initValueCards();
    
    // Team member hover effects
    initTeamCards();
}

/*===== HERO STATS COUNTER =====*/
function initHeroStats() {
    const statNumbers = document.querySelectorAll('.hero-stat__number[data-count]');
    
    if (statNumbers.length === 0) return;
    
    // Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-count'));
                animateCounter(statNumber, target);
                observer.unobserve(statNumber);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 1500; // ms
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/*===== TIMELINE ANIMATION =====*/
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

/*===== SCROLL REVEAL ANIMATIONS =====*/
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-item');
    
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add reveal-item class to elements that should animate
    const elementsToReveal = [
        '.mv-card',
        '.value-card',
        '.team-member',
        '.achievement-card',
        '.about-cta__content'
    ];
    
    elementsToReveal.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.add('reveal-item');
        });
    });
}

/*===== VALUE CARDS HOVER EFFECTS =====*/
function initValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/*===== TEAM CARDS HOVER EFFECTS =====*/
function initTeamCards() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            const image = this.querySelector('.member-image img');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            const image = this.querySelector('.member-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

/*===== SMOOTH SCROLL FOR ANCHOR LINKS =====*/
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Initialize smooth scroll
initSmoothScroll();

/*===== LOAD IMAGES WITH FADE IN =====*/
function loadImagesWithFade() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

// Add fade-in class to images
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        img[loading="lazy"] {
            opacity: 0;
            transition: opacity 0.6s ease;
        }
        
        img[loading="lazy"].loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    loadImagesWithFade();
});

/*===== PARALLAX EFFECT FOR HERO =====*/
function initParallaxEffect() {
    const hero = document.querySelector('.about-hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
}

// Initialize parallax on desktop only
if (window.innerWidth > 768) {
    initParallaxEffect();
}


/*===== SIMPLE VIDEO FUNCTIONALITY =====*/
function initSimpleVideo() {
    const videoPreview = document.getElementById('simpleVideoPreview');
    const videoPlayer = document.getElementById('simpleVideoPlayer');
    const videoElement = document.getElementById('simpleAboutVideo');
    const playButton = document.getElementById('simplePlayButton');
    const closeButton = document.getElementById('simpleCloseVideo');
    
    if (!videoPreview || !videoElement) return;
    
    // Play video when clicking preview or play button
    function playVideo() {
        videoPreview.style.display = 'none';
        videoPlayer.classList.add('active');
        
        // Play video
        videoElement.play().catch(error => {
            console.log('Video play failed:', error);
            // If autoplay fails, show controls
            videoElement.controls = true;
        });
    }
    
    // Close video player
    function closeVideo() {
        videoElement.pause();
        videoPlayer.classList.remove('active');
        videoPreview.style.display = 'block';
        videoElement.currentTime = 0;
    }
    
    // Event listeners
    videoPreview.addEventListener('click', playVideo);
    playButton.addEventListener('click', function(e) {
        e.stopPropagation();
        playVideo();
    });
    
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        closeVideo();
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoPlayer.classList.contains('active')) {
            closeVideo();
        }
    });
    
    // Close video if user clicks the video itself when it's playing
    videoElement.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!videoElement.paused) {
            videoElement.pause();
        }
    });
}

