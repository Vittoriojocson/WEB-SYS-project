// ==================== WAIT FOR DOM TO LOAD ====================
// Ensures all HTML elements are loaded before JavaScript runs
document.addEventListener('DOMContentLoaded', function() {

// ==================== DOM ELEMENTS ====================
// Cache frequently used DOM elements for better performance
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const ctaButton = document.querySelector('.cta-button');
const eventButtons = document.querySelectorAll('.event-btn');
const newsletterBtn = document.querySelector('.newsletter-btn');

// ==================== HAMBURGER MENU TOGGLE ====================
/**
 * Toggles mobile hamburger menu visibility and animates the hamburger icon
 * - Adds/removes 'active' class to menu and hamburger
 * - Animates 3 spans into X shape when open, back to normal when closed
 * - Only runs if hamburger element exists on page
 */
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when a link is clicked
/**
 * Auto-closes mobile menu when user clicks a navigation link
 * - Removes 'active' class from menu and hamburger
 * - Resets hamburger animation back to normal state
 * - Improves mobile UX by hiding menu after navigation
 */
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
}

// ==================== SMOOTH SCROLL FOR NAVIGATION ====================
/**
 * Enables smooth scrolling when clicking anchor links (#home, #events, etc)
 * - Prevents default jump behavior
 * - Smoothly animates to target section
 * - Works on all links with href starting with #
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== CONTACT FORM HANDLING ====================
/**
 * Handles contact form submission with validation
 * - Validates all fields are filled (name, email, message)
 * - Validates email format using regex
 * - Shows error notifications for validation failures
 * - Disables button during submission to prevent double-submit
 * - Shows success message and resets form on successful submission
 * - Only runs if contact form exists on page
 */
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Extract form values
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Validate form inputs
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        // Simulate form submission with loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll be in touch soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ==================== EVENT BUTTON INTERACTIONS ====================
/**
 * Handles click events on event card buttons
 * - Finds parent event card and gets event title
 * - Creates ripple effect for visual feedback
 * - Shows notification with event name
 * - Only runs if event buttons exist on page
 */
if (eventButtons.length > 0) {
    eventButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('h3').textContent;
            
            // Create ripple effect animation
            createRipple(this, e);
            
            showNotification(`Great! You clicked on ${eventTitle}. Booking page coming soon!`, 'success');
        });
    });
}

// ==================== PACKAGE BUTTON INTERACTIONS ====================
/**
 * Handles click events on service package buttons
 * - Finds parent package card and gets package name
 * - Creates ripple effect for visual feedback
 * - Shows confirmation notification
 * - Redirects to booking form after 1 second delay
 */
const packageButtons = document.querySelectorAll('.package-btn');
if (packageButtons.length > 0) {
    packageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const packageCard = this.closest('.package-card');
            const packageName = packageCard.querySelector('h3').textContent;
            
            // Create ripple effect
            createRipple(this, e);
            
            showNotification(`You selected ${packageName}. Redirecting to booking...`, 'success');
            setTimeout(() => {
                // Redirect to contact form on main page
                window.location.href = 'index.html#contact';
            }, 1000);
        });
    });
}

// ==================== CTA BUTTON ====================
/**
 * Handles main call-to-action button click
 * - Creates ripple effect for visual feedback
 * - Smoothly scrolls to events section
 * - Only runs if CTA button exists on page
 */
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        createRipple(this, event);
        const eventsSection = document.querySelector('#events');
        if (eventsSection) eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ==================== NEWSLETTER SUBSCRIPTION ====================
/**
 * Handles newsletter email subscription
 * - Gets email from input field
 * - Validates email format
 * - Shows error if email is missing or invalid
 * - Changes button text to "Subscribing..." during submission
 * - Shows success message and clears input after 1 second
 * - Only runs if newsletter button exists on page
 */
if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const email = input.value;
        
        // Validate email exists
        if (!email) {
            showNotification('Please enter your email', 'error');
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        // Show loading state
        const originalText = this.textContent;
        this.textContent = 'Subscribing...';
        this.disabled = true;
        
        setTimeout(() => {
            showNotification('Subscribed successfully! Check your email.', 'success');
            input.value = '';
            this.textContent = originalText;
            this.disabled = false;
        }, 1000);
    });
}

// ==================== SCROLL ANIMATIONS ====================
/**
 * Implements scroll-triggered fade-in animations for cards using IntersectionObserver API
 * - Creates observer with 10% visibility threshold
 * - Root margin positions trigger zone 100px before card fully enters viewport
 * - When card becomes visible, adds 'fade-in' class and stops observing (one-time animation)
 * - Sets initial opacity to 0 for all cards so fade-in reveals them
 * - Observes all card types: events, artists, services, drinks, packages, add-ons
 * - IntersectionObserver is performant alternative to scroll event listeners
 * - Much better for large lists of cards that trigger on scroll
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        // Apply fade-in animation when element enters viewport
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Stop observing after animation to save resources
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Set initial opacity to 0 and observe all card elements
document.querySelectorAll('.event-card, .artist-card, .service-card, .drink-card, .package-card, .addon-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ==================== SCROLL EFFECTS ====================
/**
 * Tracks scroll position and updates UI based on scroll depth
 * - Calculates scroll progress percentage (how far down page user has scrolled)
 * - Window height is total scrollable height minus viewport height
 * - Adds shadow to navbar when user scrolls past 50px
 * - Brighter shadow when scrolling, dimmer shadow at top
 * - Uses rgba color to create smooth overlay effect
 * - Provides visual feedback that navbar is floating above content
 * - Updates progress bar width based on scroll percentage
 */
let scrollProgress = 0;
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = (window.scrollY / windowHeight) * 100;
    
    // Update progress bar width
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = scrollProgress + '%';
    }
    
    // Add navbar shadow effect based on scroll position
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 25px rgba(102, 126, 234, 0.3)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
    }
});

// ==================== PARALLAX EFFECT ====================
/**
 * Creates parallax scrolling effect on hero background
 * - Moves background slower than foreground as user scrolls
 * - Multiplier 0.5 means background moves at half scroll speed
 * - Creates depth illusion - hero section moves slower than page scroll
 * - Works by translating hero background Y position based on scroll amount
 * - Only activates if hero-background element exists on page
 */
window.addEventListener('scroll', () => {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    }
});

// ==================== ACTIVE NAV LINK HIGHLIGHTING ====================
/**
 * Highlight navigation links based on current scroll position
 * - Checks which section is currently visible on screen
 * - Updates nav link color to yellow (#ffeb3b) for active section
 * - Resets other nav links to white
 * - Uses section offset with 200px buffer for scroll position calculation
 * - Compares link href (without #) to current section id
 * - Provides visual feedback of which page section user is viewing
 */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#ffeb3b';
        } else {
            link.style.color = 'white';
        }
    });
});

// Add CSS for smooth progress bar animations
const progressBarStyle = document.createElement('style');
progressBarStyle.textContent = `
    #progressBar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        width: 0%;
        transform-origin: left center;
        will-change: transform;
        transition: none !important;
    }
`;
document.head.appendChild(progressBarStyle);

// ==================== KEYBOARD NAVIGATION ====================
/**
 * Handles keyboard interactions for accessibility
 * - Listens for Escape key press
 * - Closes mobile menu when Escape is pressed and menu is open
 * - Removes 'active' class from both navMenu and hamburger button
 * - Improves UX by allowing keyboard navigation without mouse
 * - Important for accessibility compliance
 */
document.addEventListener('keydown', (e) => {
    // Close menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==================== UTILITY FUNCTIONS ====================

/**
 * Show notification message to user
 * 
 * @param {string} message - Text to display in notification
 * @param {string} type - Notification type: 'success' (green), 'error' (red), 'info' (blue)
 * 
 * Creates a fixed-position notification that:
 * - Appears in top-right corner with smooth animation
 * - Has color-coded background based on type
 * - Shows white text with shadow for visibility
 * - Auto-dismisses after 4 seconds with fade-out animation
 * - Supports responsive max-width for mobile screens
 * 
 * Used for: form confirmations, validation errors, button feedback
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 90%;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Validate email address format
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid format, false otherwise
 * 
 * Uses regex pattern to check:
 * - No spaces before @ symbol
 * - @ symbol present
 * - No spaces after @ symbol
 * - At least one dot (.) in domain
 * 
 * Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 * - ^ = start of string
 * - [^\s@]+ = one or more non-space, non-@ characters
 * - @ = literal @ symbol
 * - [^\s@]+ = domain name
 * - \. = literal dot
 * - [^\s@]+ = TLD (top-level domain)
 * - $ = end of string
 * 
 * Used by: contact form, newsletter subscription
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Create ripple effect on button click
 * 
 * @param {HTMLElement} element - Button element that was clicked
 * @param {Event} event - Click event containing mouse coordinates
 * 
 * Creates animated ripple effect by:
 * - Getting button dimensions and click position
 * - Creating circular span element at click location
 * - Sizing ripple to cover entire button (uses max of width/height)
 * - Positioning ripple from center of click point
 * - Animating ripple with CSS animation
 * - Removing ripple element after animation completes (600ms)
 * 
 * Provides visual feedback for button interactions
 * Used on: CTA button, event buttons, package buttons, form submit button
 */
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Animate counter numbers from 0 to target value
 * 
 * @param {HTMLElement} element - Element containing the counter
 * @param {number} target - Final number to count to
 * @param {number} duration - Animation duration in milliseconds (default: 2000)
 * 
 * Counts up from 0 to target by:
 * - Calculating increment amount per frame (target / total frames)
 * - Using setInterval to update number every 16ms (60fps)
 * - Showing floor of current value to avoid decimals
 * - Clearing interval when target is reached
 * 
 * Provides animated number transitions
 * Used for: statistics, metrics, counters in sections
 */
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Check if element is currently visible in viewport
 * 
 * @param {HTMLElement} element - Element to check visibility for
 * @returns {boolean} - True if entire element is visible, false otherwise
 * 
 * Compares element's position relative to viewport:
 * - rect.top >= 0: Element top is below top of viewport
 * - rect.left >= 0: Element left is right of viewport left
 * - rect.bottom <= window.innerHeight: Element bottom is above viewport bottom
 * - rect.right <= window.innerWidth: Element right is left of viewport right
 * - All conditions must be true for element to be in viewport
 * 
 * Note: Returns false if ANY part of element extends outside viewport
 * For partially visible elements, use IntersectionObserver instead
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==================== ANIMATION KEYFRAMES ====================
/**
 * Define custom CSS animations dynamically
 * 
 * Creates <style> element with @keyframes definitions
 * Injects into document head for reusable animations
 * 
 * Animations included:
 * - slideIn: Slides element in from right (400px) with fade (used for notifications)
 * - slideOut: Slides element out to right with fade (used for notification dismiss)
 * - ripple: Creates expanding circle from click point with opacity fade (button feedback)
 * - fadeIn: Simple opacity fade from 0 to 1 (used for scroll-triggered card animations)
 * - fade-in class: Applies fadeIn animation with !important to override initial opacity
 * 
 * Benefit of dynamic injection: Animations are only loaded when script runs
 * Keeps CSS organized separately from JavaScript
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        from {
            opacity: 1;
            transform: scale(0);
        }
        to {
            opacity: 0;
            transform: scale(4);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .fade-in {
        animation: fadeIn 0.8s ease-out !important;
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

// ==================== MOUSE MOVE EFFECT ====================
/**
 * Create subtle parallax effect based on mouse movement
 * - Tracks mouse position within hero section viewport
 * - Only activates when hero is visible (scrollY < window height)
 * - Calculates mouse offset as percentage of window
 * - Updates hero background position for subtle shift
 * - Creates depth effect as user moves cursor
 * - Only applies while user is in hero section (not scrolled down)
 */
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (hero && window.scrollY < window.innerHeight) {
        const xPos = (e.clientX / window.innerWidth) * 10;
        const yPos = (e.clientY / window.innerHeight) * 10;
        hero.style.backgroundPosition = `${50 + xPos}% ${50 + yPos}%`;
    }
});

// ==================== PAGE LOAD ANIMATION ====================
/**
 * Handle page load animation
 * - Ensures page is fully visible after load
 * - Sets opacity to 1 and smooth transition for fade effect
 * - Runs after window 'load' event (all resources loaded)
 */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease-in';
});

// ==================== DARK MODE TOGGLE (OPTIONAL) ====================
/**
 * Toggle dark mode and persist preference in localStorage
 * - Reads current dark mode state from localStorage
 * - Toggles 'dark-mode' class on body element
 * - Saves preference so it persists across page visits
 * - Key used: 'darkMode' (stores 'true' or 'false')
 * - Initialization code below runs on page load to restore preference
 */
function toggleDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', !isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
}

// Initialize dark mode preference on page load
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ==================== PERFORMANCE OPTIMIZATION ====================
/**
 * Lazy load images for better performance
 * - Uses IntersectionObserver to detect when images enter viewport
 * - Only loads image src when it becomes visible to user
 * - Stores actual image URL in data-src attribute
 * - Replaces data-src with src attribute when image should load
 * - Significantly improves initial page load performance
 * - Reduces bandwidth for images user never scrolls to see
 * - Falls back gracefully in older browsers without IntersectionObserver
 */
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

// ==================== PAGE INITIALIZATION COMPLETE ====================
/**
 * Log successful page initialization
 * All event listeners, animations, and features are now active
 */
console.log('🎵 JiggerOnTheMix website loaded successfully!');

}); // End DOMContentLoaded