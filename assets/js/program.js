/*===== MOBILE-FIRST PROGRAMS PAGE JAVASCRIPT =====*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all programs page functionality
    initProgramsPage();
});

function initProgramsPage() {
    // Initialize program navigation
    initProgramNavigation();
    
    // Initialize animated counters
    initCounters();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize card animations
    initCardAnimations();
    
    // Initialize program interest auto-fill
    initProgramInterestAutoFill();
}

/*===== PROGRAM NAVIGATION =====*/
function initProgramNavigation() {
    const navLinks = document.querySelectorAll('.program-nav__link');
    const sections = document.querySelectorAll('.program-detail');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    // Highlight active section on scroll
    function highlightActiveSection() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkId = link.getAttribute('href').substring(1);
            if (linkId === current) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Initial call
}

/*===== ANIMATED COUNTERS =====*/
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-count'));
                const originalText = element.textContent;
                let suffix = '';
                
                // Determine suffix from original text
                if (originalText.includes('%')) {
                    suffix = '%';
                } else if (originalText.includes('+')) {
                    suffix = '+';
                }
                
                // Animate counter
                animateCounter(element, target, suffix);
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(counter => {
        // Store original display text
        const originalText = counter.textContent.trim();
        
        // Set initial value to 0
        if (originalText.includes('%')) {
            counter.textContent = '0%';
        } else if (originalText.includes('+')) {
            counter.textContent = '0+';
        } else {
            counter.textContent = '0';
        }
        
        // Add counter class for styling
        counter.classList.add('counter-animated');
        
        observer.observe(counter);
    });
}

function animateCounter(element, target, suffix = '') {
    let current = 0;
    const duration = 1500; // 1.5 seconds total
    const increment = target / 100; // 100 steps for smoothness
    const stepTime = duration / 100; // 15ms per step
    
    // Clear any existing animation
    if (element._counterTimer) {
        clearInterval(element._counterTimer);
    }
    
    element._counterTimer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            // Final value
            element.textContent = target + suffix;
            clearInterval(element._counterTimer);
            
            // Add completion animation
            element.classList.add('counter-complete');
            
            // Add bounce effect
            element.style.transform = 'scale(1.1)';
            element.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
            
        } else {
            // Update current value
            const displayValue = Math.floor(current);
            element.textContent = displayValue + suffix;
        }
    }, stepTime);
}

/*===== FORM HANDLING =====*/
function initContactForm() {
    const contactForm = document.getElementById('programContactForm');
    
    if (!contactForm) return;
    
    // Add input validation styling
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        let isValid = true;
        const requiredFields = ['fullName', 'email', 'phone', 'programInterest', 'message'];
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                highlightError(field);
            } else {
                removeError(field);
            }
        });
        
        // Email validation
        if (data.email && !validateEmail(data.email)) {
            isValid = false;
            highlightError('email', 'Please enter a valid email address');
        }
        
        if (!isValid) {
            showFormMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Success simulation
            showFormMessage('Thank you! Your inquiry has been sent. We\'ll contact you within 24 hours.', 'success');
            contactForm.reset();
            
            // Remove filled classes
            inputs.forEach(input => input.classList.remove('filled'));
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Scroll to show success message
            const formTop = contactForm.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: formTop - 100,
                behavior: 'smooth'
            });
        }, 1500);
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function highlightError(fieldId, message = 'This field is required') {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            
            // Create error message
            let errorMsg = field.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                field.parentElement.appendChild(errorMsg);
            }
        }
    }
    
    function removeError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('error');
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    }
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type} animate-fade-in-up`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="close-message">&times;</button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#form-message-styles')) {
            const style = document.createElement('style');
            style.id = 'form-message-styles';
            style.textContent = `
                .form-message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 500;
                    z-index: 1000;
                    max-width: 400px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    animation: slideInRight 0.3s ease;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .form-message.success {
                    background: #10b981;
                    color: white;
                    border-left: 4px solid #059669;
                }
                
                .form-message.error {
                    background: #ef4444;
                    color: white;
                    border-left: 4px solid #dc2626;
                }
                
                .form-message i {
                    font-size: 1.2rem;
                }
                
                .form-message .close-message {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }
                
                .form-message .close-message:hover {
                    opacity: 1;
                }
                
                .error {
                    border-color: #ef4444 !important;
                }
                
                .error-message {
                    color: #ef4444;
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close button functionality
        messageDiv.querySelector('.close-message').addEventListener('click', () => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        });
        
        // Add slideOutRight animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        // Add to document
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

/*===== SCROLL ANIMATIONS =====*/
function initScrollAnimations() {
    const animateOnScroll = (elements, animationClass) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Animate program cards
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach((card, index) => {
        card.classList.add('animate-fade-in-up');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Animate comparison cards
    const comparisonCards = document.querySelectorAll('.comparison-card');
    comparisonCards.forEach((card, index) => {
        card.classList.add('animate-fade-in-up');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Animate program detail sections
    const programSections = document.querySelectorAll('.program-detail');
    programSections.forEach(section => {
        section.classList.add('animate-fade-in-up');
    });
    
    // Initialize all animations
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
    });
    
    // Add intersection observer for all animated elements
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationClass = Array.from(element.classList).find(cls => 
                    cls.startsWith('animate-fade-in-')
                );
                
                if (animationClass) {
                    element.style.animation = `${animationClass.replace('animate-', '')} 0.8s ease forwards`;
                }
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

/*===== CARD ANIMATIONS =====*/
function initCardAnimations() {
    const programCards = document.querySelectorAll('.program-card, .comparison-card');
    
    programCards.forEach(card => {
        // Hover effect with delay
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s';
        });
        
        // Click ripple effect
        card.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            
            // Position ripple
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 188, 212, 0.3);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .program-card,
            .comparison-card {
                position: relative;
                overflow: hidden;
            }
            
            .counter-animated {
                display: inline-block;
                transition: all 0.3s ease;
            }
            
            .counter-complete {
                animation: counterBounce 0.5s ease;
            }
            
            @keyframes counterBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

/*===== PROGRAM INTEREST AUTO-FILL =====*/
function initProgramInterestAutoFill() {
    const programInterest = document.getElementById('programInterest');
    const navLinks = document.querySelectorAll('.program-nav__link');
    const programCards = document.querySelectorAll('.program-card');
    
    if (!programInterest) return;
    
    // Function to set program interest
    function setProgramInterest(programValue) {
        if (programValue) {
            programInterest.value = programValue;
            
            // Highlight the selected option
            const options = programInterest.querySelectorAll('option');
            options.forEach(option => {
                option.selected = option.value === programValue;
            });
            
            // Smooth scroll to form
            const formSection = document.getElementById('contact-form');
            if (formSection) {
                setTimeout(() => {
                    window.scrollTo({
                        top: formSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Add highlight animation to form
                    formSection.style.animation = 'highlightForm 2s ease';
                    setTimeout(() => {
                        formSection.style.animation = '';
                    }, 2000);
                }, 500);
            }
        }
    }
    
    // Add highlight animation
    if (!document.querySelector('#form-highlight-animation')) {
        const style = document.createElement('style');
        style.id = 'form-highlight-animation';
        style.textContent = `
            @keyframes highlightForm {
                0% { box-shadow: 0 0 0 0 rgba(0, 188, 212, 0); }
                50% { box-shadow: 0 0 0 20px rgba(0, 188, 212, 0.3); }
                100% { box-shadow: 0 0 0 0 rgba(0, 188, 212, 0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const program = this.getAttribute('data-program');
            const programMap = {
                'community': 'community-outreach',
                'subsidized': 'subsidized-therapy',
                'assessment': 'mass-assessment',
                'interstate': 'interstate-outreach'
            };
            
            setProgramInterest(programMap[program]);
        });
    });
    
    // Program cards
    programCards.forEach(card => {
        const learnMoreLink = card.querySelector('.card-link');
        if (learnMoreLink) {
            learnMoreLink.addEventListener('click', function(e) {
                e.preventDefault();
                const program = card.getAttribute('data-program');
                const programMap = {
                    'community': 'community-outreach',
                    'subsidized': 'subsidized-therapy',
                    'assessment': 'mass-assessment',
                    'interstate': 'interstate-outreach'
                };
                
                setProgramInterest(programMap[program]);
            });
        }
    });
}

/*===== SMOOTH SCROLL FOR ALL INTERNAL LINKS =====*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#contact-form') return;
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

/*===== DEBUG FUNCTION FOR COUNTERS (Optional) =====*/
function debugCounters() {
    console.log('=== DEBUG COUNTERS ===');
    
    const counters = document.querySelectorAll('[data-count]');
    console.log(`Found ${counters.length} counters with data-count attribute`);
    
    counters.forEach((counter, index) => {
        const value = counter.getAttribute('data-count');
        const text = counter.textContent;
        const rect = counter.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        console.log(`Counter ${index + 1}:`);
        console.log(`  Element:`, counter);
        console.log(`  data-count: "${value}" (parsed: ${parseInt(value)})`);
        console.log(`  Current text: "${text}"`);
        console.log(`  Visible in viewport: ${isVisible}`);
        console.log(`  Top position: ${rect.top}`);
        console.log(`  Window height: ${window.innerHeight}`);
        console.log('---');
    });
}

/*===== MANUAL COUNTER TRIGGER (For Testing) =====*/
function triggerAllCounters() {
    console.log('Manually triggering all counters...');
    
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const originalText = counter.textContent;
        let suffix = '';
        
        if (originalText.includes('%')) {
            suffix = '%';
        } else if (originalText.includes('+')) {
            suffix = '+';
        }
        
        // Reset to 0
        counter.textContent = '0' + suffix;
        
        // Animate
        animateCounter(counter, target, suffix);
    });
}

// Uncomment to debug on page load
// document.addEventListener('DOMContentLoaded', debugCounters);

// Uncomment to add manual trigger (for testing)
// window.triggerCounters = triggerAllCounters;
// console.log('Test: Call triggerCounters() in console to manually trigger counters');