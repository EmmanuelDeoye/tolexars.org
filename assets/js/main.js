/*===== PREVENT DROPDOWNS DURING SCROLL =====*/
let isScrolling;
let scrollTimeout;

function handleScrollStart() {
    // Add scrolling class to body
    document.body.classList.add('scrolling');
    
    // Close all dropdowns on desktop when scrolling
    if (window.innerWidth > 767) {
        document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Clear existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Remove scrolling class after scrolling stops
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
    }, 100);
}

/*===== ENHANCED MENU SHOW/HIDE WITH DROPDOWNS =====*/
const enhancedShowMenu = (toggleId, navId, overlayId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId),
          overlay = document.getElementById(overlayId);

    if (toggle && nav && overlay) {
        toggle.addEventListener('click', () => {
            const isOpening = !nav.classList.contains('show');
            nav.classList.toggle('show');
            overlay.classList.toggle('show');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpening ? 'hidden' : '';
            
            // Close all dropdowns when opening mobile menu
            if (isOpening && window.innerWidth <= 767) {
                document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }
}

/*===== DROPDOWN MENU FUNCTIONALITY =====*/
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    
    if (dropdownToggles.length > 0) {
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 767) {
                    // Mobile behavior: toggle dropdown
                    e.preventDefault();
                    const parent = this.parentElement;
                    const isActive = parent.classList.contains('active');
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
                        if (item !== parent) {
                            item.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    parent.classList.toggle('active', !isActive);
                } else {
                    // Desktop: Prevent dropdown opening on click during scroll
                    if (document.body.classList.contains('scrolling')) {
                        e.preventDefault();
                        return false;
                    }
                }
            });
        });
    }
    
    /*===== CLOSE MOBILE MENU FUNCTIONS =====*/
    function closeMobileMenu() {
        if (window.innerWidth <= 767) {
            navMenu.classList.remove('show');
            if (navOverlay) navOverlay.classList.remove('show');
            document.body.style.overflow = '';
            
            // Close all dropdowns
            document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    /*===== CLICK OUTSIDE TO CLOSE MOBILE MENU =====*/
    document.addEventListener('click', function(e) {
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');
        
        if (window.innerWidth <= 767 && navMenu.classList.contains('show')) {
            // Check if click is outside menu
            if (!navMenu.contains(e.target) && 
                !navToggle.contains(e.target) && 
                !navClose.contains(e.target) &&
                !navOverlay.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Close menu when clicking on overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }
    
    /*===== NAV CLOSE BUTTON =====*/
    const navClose = document.getElementById('nav-close');
    if (navClose) {
        navClose.addEventListener('click', closeMobileMenu);
    }
    
    /*===== CLOSE DROPDOWNS WHEN CLICKING LINKS =====*/
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 767) {
                closeMobileMenu();
            }
        });
    });
    
    /*===== DESKTOP HOVER BEHAVIOR WITH SCROLL PREVENTION =====*/
    if (window.innerWidth > 767) {
        const dropdowns = document.querySelectorAll('.nav__item--dropdown');
        
        dropdowns.forEach(dropdown => {
            // Only show dropdown on hover if not scrolling
            dropdown.addEventListener('mouseenter', function() {
                if (!document.body.classList.contains('scrolling')) {
                    this.classList.add('active');
                }
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
        });
        
        // Prevent dropdowns from staying open during scroll
        document.addEventListener('scroll', function() {
            document.querySelectorAll('.nav__item--dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    }
}

/*===== CLOSE MENU WHEN RESIZING TO DESKTOP =====*/
function handleResize() {
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    
    if (window.innerWidth > 767) {
        if (navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            if (navOverlay) navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
        
        // Close all dropdowns
        document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // Reinitialize desktop hover behavior
        const dropdowns = document.querySelectorAll('.nav__item--dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function() {
                if (!document.body.classList.contains('scrolling')) {
                    this.classList.add('active');
                }
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
        });
    }
}

/*===== ENHANCED SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]');

const enhancedScrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id');

        // Update all navigation links (including dropdown items)
        const allNavLinks = document.querySelectorAll('.nav__link:not(.dropdown-toggle), .dropdown-item');
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href === `#${sectionId}`) {
                const parentItem = link.closest('.nav__item');
                
                if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                    // Remove active from all links first
                    document.querySelectorAll('.nav__link.active-link, .dropdown-item.active-link').forEach(l => {
                        l.classList.remove('active-link');
                    });
                    // Add active to current link
                    link.classList.add('active-link');
                    
                    // If this is a dropdown item, also highlight parent dropdown
                    if (parentItem && parentItem.classList.contains('nav__item--dropdown')) {
                        // Only add active class on desktop for hover
                        if (window.innerWidth <= 767) {
                            parentItem.classList.add('active');
                        }
                    }
                } else {
                    link.classList.remove('active-link');
                }
            }
        });
    });
}

/*===== REMOVE MENU MOBILE (UPDATED) =====*/
function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    
    // When we click on each nav__link, we remove the show-menu class
    if (navMenu && window.innerWidth <= 767) {
        navMenu.classList.remove('show');
        if (navOverlay) navOverlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
            item.classList.remove('active');
        });
    }
}

// Add click event to all nav links
const navLink = document.querySelectorAll('.nav__link:not(.dropdown-toggle), .dropdown-item');
navLink.forEach(n => n.addEventListener('click', linkAction));

/*===== SCROLL REVEAL ANIMATION =====*/
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2000,
        delay: 200,
    });

    const revealSelectors = [
        '.home__data', '.about__img', '.skills__subtitle', '.skills__text',
        '.home__img', '.about__subtitle', '.about__text', '.skills__img',
        '.skills__data', '.work__img', '.contact__input',
        '.testimonials__container', '.marketplace__container',
        '.program__card', '.mission-vision__card', '.impact__data'
    ];

    revealSelectors.forEach(selector => {
        if (document.querySelector(selector)) {
            if (selector === '.testimonials__container' || selector === '.marketplace__container') {
                sr.reveal(selector, { origin: 'bottom' });
            } else if (selector === '.marketplace__container') {
                sr.reveal(selector, { delay: 300, origin: 'bottom' });
            } else if (selector === '.program__card' || selector === '.mission-vision__card') {
                sr.reveal(selector, { interval: 200, origin: 'bottom' });
            } else if (selector === '.impact__data') {
                sr.reveal(selector, { interval: 150, origin: 'bottom' });
            } else if (selector === '.home__img' || selector === '.about__subtitle' || selector === '.about__text' || selector === '.skills__img') {
                sr.reveal(selector, { delay: 400 });
            } else if (selector === '.home__social-icon') {
                sr.reveal(selector, { interval: 200 });
            } else if (selector === '.skills__data' || selector === '.work__img' || selector === '.contact__input') {
                sr.reveal(selector, { interval: 200 });
            } else {
                sr.reveal(selector, {});
            }
        }
    });
    
    // Additional reveals
    sr.reveal('.join-network__content', { delay: 300, origin: 'bottom' });
    sr.reveal('.services__track', { delay: 200 });
    sr.reveal('.services__stats', { delay: 400, origin: 'bottom' });
}

/*===== STICKY CONTACT BUTTON =====*/
const stickyContactThreshold = 10;
const stickyButton = document.getElementById('sticky-contact');
let stickyButtonIsCloned = false;

function showContactOptions(event) {
    event.preventDefault();

    const dialog = document.createElement('div');
    dialog.id = 'contact-options-dialog';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dialog.style.zIndex = '1001';
    dialog.style.display = 'flex';
    dialog.style.flexDirection = 'column';
    dialog.style.gap = '10px';
    dialog.style.alignItems = 'center';

    const title = document.createElement('h3');
    title.textContent = 'Contact Us Via:';
    dialog.appendChild(title);

    const callOption = document.createElement('a');
    callOption.href = 'tel:+2349065038786';
    callOption.innerHTML = '<i class="bx bx-phone-call" style="font-size: 1.5rem; margin-right: 5px;"></i> Call';
    callOption.style.display = 'flex';
    callOption.style.alignItems = 'center';
    callOption.style.padding = '10px 15px';
    callOption.style.backgroundColor = '#007bff';
    callOption.style.color = '#fff';
    callOption.style.borderRadius = '5px';
    callOption.style.textDecoration = 'none';
    dialog.appendChild(callOption);

    const whatsappOption = document.createElement('a');
    whatsappOption.href = 'https://wa.me/2349065038786';
    whatsappOption.innerHTML = '<i class="bx bxl-whatsapp" style="font-size: 1.5rem; margin-right: 5px;"></i> WhatsApp';
    whatsappOption.style.display = 'flex';
    whatsappOption.style.alignItems = 'center';
    whatsappOption.style.padding = '10px 15px';
    whatsappOption.style.backgroundColor = '#25D366';
    whatsappOption.style.color = '#fff';
    whatsappOption.style.borderRadius = '5px';
    whatsappOption.style.textDecoration = 'none';
    dialog.appendChild(whatsappOption);

    const gmailOption = document.createElement('a');
    gmailOption.href = 'mailto:tolexars@gmail.com';
    gmailOption.innerHTML = '<i class="bx bxl-gmail" style="font-size: 1.5rem; margin-right: 5px;"></i> Gmail';
    gmailOption.style.display = 'flex';
    gmailOption.style.alignItems = 'center';
    gmailOption.style.padding = '10px 15px';
    gmailOption.style.backgroundColor = '#db4437';
    gmailOption.style.color = '#fff';
    gmailOption.style.borderRadius = '5px';
    gmailOption.style.textDecoration = 'none';
    dialog.appendChild(gmailOption);

    const smsOption = document.createElement('a');
    smsOption.href = 'sms:+2349065038786';
    smsOption.innerHTML = '<i class="bx bx-message-square-dots" style="font-size: 1.5rem; margin-right: 5px;"></i> SMS';
    smsOption.style.display = 'flex';
    smsOption.style.alignItems = 'center';
    smsOption.style.padding = '10px 15px';
    smsOption.style.backgroundColor = '#6c757d';
    smsOption.style.color = '#fff';
    smsOption.style.borderRadius = '5px';
    smsOption.style.textDecoration = 'none';
    dialog.appendChild(smsOption);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '15px';
    closeButton.style.padding = '8px 12px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#f0f0f0';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        if (document.body.contains(dialog)) {
            document.body.removeChild(dialog);
        }
    });
    dialog.appendChild(closeButton);

    document.body.appendChild(dialog);
}

if (stickyButton) {
    stickyButton.addEventListener('click', showContactOptions);

    document.addEventListener("scroll", function() {
        let rect = stickyButton.getBoundingClientRect();
        if (rect.top <= stickyContactThreshold) {
            if (!stickyButtonIsCloned) {
                const clonedStickyButton = stickyButton.cloneNode(true);
                clonedStickyButton.id = 'sticky-contact-clone';
                clonedStickyButton.removeEventListener('click', showContactOptions);
                clonedStickyButton.addEventListener('click', showContactOptions);
                stickyButtonIsCloned = true;
                stickyButton.classList.add('issticky');
                clonedStickyButton.style.position = 'fixed';
                clonedStickyButton.style.top = stickyContactThreshold + 'px';
                clonedStickyButton.style.left = rect.left + 'px';
                clonedStickyButton.style.width = rect.width + 'px';
                clonedStickyButton.style.height = rect.height + 'px';
                clonedStickyButton.style.zIndex = '999';
                
                let activeClone = document.body.appendChild(clonedStickyButton);
                
                setTimeout(() => {
                    clonedStickyButton.style.left = 'auto';
                    clonedStickyButton.style.right = '20px';
                    clonedStickyButton.style.bottom = '20px';
                    clonedStickyButton.style.top = 'auto';
                    clonedStickyButton.style.transform = 'none';
                }, 0);
            }
        } else {
            if (stickyButtonIsCloned) {
                let clonedStickyButton = document.getElementById('sticky-contact-clone');
                if (clonedStickyButton && document.body.contains(clonedStickyButton)) {
                    document.body.removeChild(clonedStickyButton);
                }
                stickyButtonIsCloned = false;
                stickyButton.classList.remove('issticky');
            }
        }
    });
}

/*===== HOME IMAGE SLIDESHOW =====*/
const homeImage = document.getElementById('home-image-slide');
if (homeImage) {
    const images = [
        'assets/img/first.jpg',
        'assets/img/assess.jpg',
        'assets/img/openview.jpg',
        'assets/img/oifn.jpg',
        'assets/img/reach.jpg',
        'assets/img/hello.jpg',
        'assets/img/blue.jpg'
    ];
    
    const validImages = images.filter(img => img);
    
    if (validImages.length > 0) {
        let currentImageIndex = 0;

        function changeHomeImage() {
            currentImageIndex = (currentImageIndex + 1) % validImages.length;
            homeImage.src = validImages[currentImageIndex];
        }

        setInterval(changeHomeImage, 3000);
    }
}

/*===== IMPACT COUNTER ANIMATION =====*/
function animateCounter() {
    const counters = document.querySelectorAll('.impact__counter');
    const speed = 300;
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 1);
            } else {
                counter.textContent = target;
                if (counter.getAttribute('data-plus') === 'true') {
                    counter.textContent = target + '+';
                }
            }
        };
        
        updateCounter();
    });
}

function initImpactCounter() {
    const impactSection = document.querySelector('.impact');
    if (!impactSection) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(impactSection);
}

/*===== PROGRAMS MODAL LOGIC =====*/
const programCards = document.querySelectorAll('.program__card');
const programModal = document.getElementById('programModal');

const programData = {
    'community': {
        title: 'Community Outreach',
        description: 'Our Community Outreach program is dedicated to breaking barriers by bringing essential therapy services directly to underserved populations. We organize regular workshops, health fairs, and awareness campaigns in partnership with local organizations to ensure that no one is left behind due to geographical or financial constraints.',
        features: [
            'Monthly community workshops and seminars',
            'Partnerships with local NGOs and community centers',
            'Mobile therapy units for remote areas',
            'Free screening and assessment camps',
            'Training sessions for caregivers and families'
        ],
        impact: [
            'Increased accessibility to therapy services',
            'Early detection and intervention',
            'Empowered communities through education',
            'Reduced healthcare disparities',
            'Sustainable community support systems'
        ],
        image: 'assets/img/first.jpg'
    },
    'subsidized': {
        title: 'Subsidized Therapy',
        description: 'We believe quality therapy should be accessible to everyone, regardless of financial situation. Our Subsidized Therapy program provides reduced-cost or completely free sessions to individuals and families facing economic challenges, ensuring they receive the professional care they deserve without financial burden.',
        features: [
            'Income-based sliding scale fees',
            'Completely free sessions for extreme cases',
            'Flexible payment plans',
            'Insurance coordination assistance',
            'Scholarship programs for long-term therapy'
        ],
        impact: [
            'Financial relief for families in need',
            'Consistent therapy without interruptions',
            'Improved quality of life for recipients',
            'Reduced long-term healthcare costs',
            'Increased treatment adherence'
        ],
        image: 'assets/img/therapy.jpg'
    },
    'assessment': {
        title: 'Mass Assessment',
        description: 'Our Mass Assessment initiatives involve large-scale screenings and comprehensive evaluations to identify developmental or physical challenges at their earliest stages. Through systematic assessments, we facilitate timely interventions and create personalized therapy plans for optimal outcomes.',
        features: [
            'Comprehensive developmental screenings',
            'Multi-disciplinary assessment teams',
            'Standardized evaluation tools',
            'Individualized assessment reports',
            'Follow-up consultation services'
        ],
        impact: [
            'Early detection of developmental issues',
            'Data-driven intervention strategies',
            'Reduced severity of conditions',
            'Informed decision-making for families',
            'Improved academic and social outcomes'
        ],
        image: 'assets/img/assess.jpg'
    },
    'interstate': {
        title: 'Inter-state Outreach',
        description: 'Extending our reach beyond geographical boundaries, our Inter-state Outreach program aims to address regional disparities in access to specialized therapy services. We collaborate with institutions across states to provide training, support, and direct services to communities in need.',
        features: [
            'State-wide therapy camps',
            'Professional training for local therapists',
            'Tele-therapy consultations',
            'Resource sharing and equipment lending',
            'Cross-state partnership networks'
        ],
        impact: [
            'Bridging urban-rural healthcare gaps',
            'Capacity building in underserved regions',
            'Knowledge exchange between professionals',
            'Standardized care across regions',
            'Sustainable regional support networks'
        ],
        image: 'assets/img/inter.jpg'
    }
};

function openProgramModal(programKey) {
    const program = programData[programKey];
    if (!program || !programModal) return;
    
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalIcon = document.getElementById('modal-icon');
    const modalImage = document.getElementById('modal-image');
    const modalFeatures = document.getElementById('modal-features');
    const modalImpact = document.getElementById('modal-impact');
    
    if (modalTitle) modalTitle.textContent = program.title;
    if (modalDescription) modalDescription.textContent = program.description;
    
    if (modalIcon) modalIcon.innerHTML = `<i class="${program.icon}"></i>`;
    
    if (modalImage) {
        modalImage.src = program.image;
        modalImage.alt = `${program.title} Program`;
    }
    
    if (modalFeatures) {
        modalFeatures.innerHTML = '';
        program.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });
    }
    
    if (modalImpact) {
        modalImpact.innerHTML = '';
        program.impact.forEach(impact => {
            const li = document.createElement('li');
            li.textContent = impact;
            modalImpact.appendChild(li);
        });
    }
    
    programModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProgramModal() {
    if (programModal) {
        programModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

if (programCards.length > 0) {
    programCards.forEach(card => {
        card.addEventListener('click', () => {
            const programKey = card.getAttribute('data-program');
            openProgramModal(programKey);
        });
    });
}

const closeButtons = document.querySelectorAll('.program-modal__close, .program-modal__close-btn, .program-modal__overlay');
if (closeButtons.length > 0) {
    closeButtons.forEach(button => {
        button.addEventListener('click', closeProgramModal);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && programModal && programModal.style.display === 'block') {
        closeProgramModal();
    }
});

const modalContent = document.querySelector('.program-modal__content');
if (modalContent) {
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/*===== SMOOTH SCROLL =====*/
document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu system
    enhancedShowMenu('nav-toggle', 'nav-menu', 'nav-overlay');
    initDropdowns();
    initImpactCounter();
    
    // Handle scroll events to prevent dropdowns during scroll
    window.addEventListener('scroll', function() {
        handleScrollStart();
    });
    
    // Handle resize events
    window.addEventListener('resize', handleResize);
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    const navOverlay = document.getElementById('nav-overlay');
                    if (navMenu && navMenu.classList.contains('show')) {
                        navMenu.classList.remove('show');
                        if (navOverlay) navOverlay.classList.remove('show');
                        document.body.style.overflow = '';
                    }
                    
                    // Close all dropdowns
                    document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
                        item.classList.remove('active');
                    });
                }
            }
        });
    });
    
    // Initialize scroll active after DOM is loaded
    if (sections.length > 0) {
        window.addEventListener('scroll', enhancedScrollActive);
        enhancedScrollActive(); // Run once on load
    }
    
    // Close dropdowns when clicking outside on desktop
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 767) {
            const dropdowns = document.querySelectorAll('.nav__item--dropdown.active');
            const clickedInsideDropdown = e.target.closest('.nav__item--dropdown');
            
            dropdowns.forEach(dropdown => {
                if (dropdown !== clickedInsideDropdown) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });
});