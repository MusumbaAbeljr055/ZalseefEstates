import { propertyService, inquiryService, testimonialService } from './firebase-config.js';

// Formspree Configuration
const FORMSPREE_CONFIG = {
    CONTACT_FORM_ID: 'xyznjaeq', // Your contact form ID
    TESTIMONIAL_FORM_ID: 'xgvnybkv' // Replace with your testimonial form ID
};

// Mobile Menu Toggle - Enhanced with better functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

function initializeMobileMenu() {
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = isExpanded ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Close menu on window resize (if resizing to larger screen)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    if (navMenu && mobileMenuBtn) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Update active link based on scroll position with throttling
function initializeScrollSpy() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }, 10);
    });
}

// Hero Slideshow with pause on hover
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        function showNextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function startSlideshow() {
            slideInterval = setInterval(showNextSlide, 5000);
        }

        function pauseSlideshow() {
            clearInterval(slideInterval);
        }

        // Start slideshow
        startSlideshow();

        // Pause on hover
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', pauseSlideshow);
            hero.addEventListener('mouseleave', startSlideshow);
            hero.addEventListener('touchstart', pauseSlideshow);
        }
    }
});

// Property Modal Functions with enhanced accessibility
function openModal(property) {
    const modal = document.getElementById('propertyModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <span class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</span>
        <h2>${property.title}</h2>
        <div class="modal-gallery">
            ${property.images ? property.images.map(img => 
                `<img src="${img}" alt="${property.title}" onerror="this.src='https://via.placeholder.com/200x150/1e90ff/ffffff?text=Property+Image'">`
            ).join('') : '<img src="https://via.placeholder.com/200x150/1e90ff/ffffff?text=Property+Image" alt="Property Image">'}
        </div>
        <div class="modal-details">
            <p class="price">UGX ${property.price}</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Size:</strong> ${property.size}</p>
            <p><strong>Type:</strong> ${property.type}</p>
            <p><strong>Status:</strong> <span class="status ${property.status === 'sold' ? 'sold' : 'available'}">${property.status === 'sold' ? 'Sold' : 'Available'}</span></p>
            ${property.features ? `<p><strong>Features:</strong> ${property.features.join(', ')}</p>` : ''}
            <p><strong>Description:</strong> ${property.description}</p>
            ${property.status !== 'sold' ? `
                <a href="contact.html?property=${encodeURIComponent(property.title)}" class="btn">Inquire Now</a>
            ` : ''}
        </div>
    `;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus trap for accessibility
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function closeModal() {
    const modal = document.getElementById('propertyModal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Enhanced modal close functionality
document.addEventListener('click', (e) => {
    const modal = document.getElementById('propertyModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Enhanced Contact Form Handler with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    console.log("✅ Contact form found, setting up Formspree handler");
    
    // Show property dropdown when buying land is selected
    const interestSelect = contactForm.querySelector('select[name="interest"]');
    const propertySelect = contactForm.querySelector('select[name="property_interested"]');
    
    if (interestSelect && propertySelect) {
        interestSelect.addEventListener('change', function() {
            if (this.value === 'buying' || this.value === 'site_visit') {
                propertySelect.style.display = 'block';
                propertySelect.setAttribute('required', 'true');
                loadPropertiesForDropdown();
            } else {
                propertySelect.style.display = 'none';
                propertySelect.removeAttribute('required');
            }
        });
    }
    
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(this);
        const inquiryData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            interest: formData.get('interest'),
            propertyInterested: formData.get('property_interested') || '',
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'yes'
        };

        try {
            console.log("📝 Submitting inquiry to Formspree:", inquiryData);
            
            // Save to Firebase (for your records)
            await inquiryService.submitInquiry(inquiryData);
            console.log("✅ Inquiry saved to Firebase");
            
            // Submit to Formspree using fetch
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage('Thank you for your message! We have received your inquiry and will contact you shortly.', 'success');
                this.reset();
                
                // Reset property dropdown if visible
                const propertySelect = document.getElementById('propertyInterested');
                if (propertySelect) {
                    propertySelect.style.display = 'none';
                    propertySelect.removeAttribute('required');
                }
                
                console.log("✅ Formspree submission successful");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
            
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            
            // Check if it's a Formspree error or network error
            if (error.name === 'TypeError') {
                showMessage('Network error. Please check your connection and try again.', 'error');
            } else {
                showMessage('There was a problem sending your message. Please try again later or contact us directly.', 'error');
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Enhanced Testimonial Form Handler with Formspree
const testimonialForm = document.getElementById('testimonialForm');
if (testimonialForm) {
    console.log("✅ Testimonial form found, setting up Formspree handler");
    
    // Update form action if testimonial form ID is set
    if (FORMSPREE_CONFIG.TESTIMONIAL_FORM_ID !== 'YOUR_TESTIMONIAL_FORM_ID') {
        testimonialForm.action = `https://formspree.io/f/${FORMSPREE_CONFIG.TESTIMONIAL_FORM_ID}`;
    }
    
    // Enhanced star rating functionality
    const stars = testimonialForm.querySelectorAll('.star');
    const ratingValue = testimonialForm.querySelector('#ratingValue');
    
    // Initialize stars
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingValue.value = rating;
            
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });

        // Keyboard accessibility for stars
        star.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    testimonialForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        if (!ratingValue.value) {
            showMessage('Please provide a rating by clicking the stars', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        const formData = new FormData(this);
        const testimonialData = {
            name: formData.get('name'),
            location: formData.get('location'),
            email: formData.get('email'),
            rating: parseInt(ratingValue.value),
            testimonial: formData.get('testimonial'),
            createdAt: new Date()
        };

        try {
            console.log("📝 Submitting testimonial to Formspree:", testimonialData);
            
            // Save to Firebase (for your records)
            await testimonialService.submitTestimonial(testimonialData);
            console.log("✅ Testimonial saved to Firebase");
            
            // Submit to Formspree using fetch
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage('Thank you for your testimonial! It has been submitted for review and we will notify you once it\'s approved.', 'success');
                this.reset();
                
                // Reset stars
                stars.forEach(star => {
                    star.style.color = '#ddd';
                });
                ratingValue.value = '';
                
                console.log("✅ Formspree testimonial submission successful");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
            
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            
            if (error.name === 'TypeError') {
                showMessage('Network error. Please check your connection and try again.', 'error');
            } else {
                showMessage('There was a problem submitting your testimonial. Please try again later.', 'error');
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Load properties for dropdown
async function loadPropertiesForDropdown() {
    const propertySelect = document.getElementById('propertyInterested');
    if (!propertySelect) return;

    try {
        const properties = await propertyService.getProperties({ status: 'available' });
        propertySelect.innerHTML = '<option value="" disabled selected>Select Property</option>';
        
        properties.forEach(property => {
            const option = document.createElement('option');
            option.value = property.title;
            option.textContent = `${property.title} - ${property.price}`;
            propertySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading properties for dropdown:', error);
    }
}

// Enhanced Show message function
function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `message ${type}`;
        formMessage.style.display = 'block';
        formMessage.setAttribute('aria-live', 'polite');
        
        // Scroll to message if it's not visible
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    } else {
        // Fallback alert
        alert(message);
    }
}

// Load featured properties on homepage
async function loadFeaturedProperties() {
    console.log("🚀 Loading featured properties...");
    
    const featuredContainer = document.getElementById('featuredProperties');
    if (!featuredContainer) {
        console.error("Featured properties container not found!");
        return;
    }

    try {
        // Show loading state
        featuredContainer.innerHTML = '<div class="spinner"></div>';
        
        const properties = await propertyService.getFeaturedProperties();
        console.log("Properties loaded:", properties);

        if (!properties || properties.length === 0) {
            console.log("No featured properties found, showing placeholder");
            featuredContainer.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; border: 2px dashed #dee2e6;">
                        <i class="fas fa-home" style="font-size: 3rem; color: #1e90ff; margin-bottom: 20px;"></i>
                        <h3 style="color: #064663; margin-bottom: 15px;">Premium Land Opportunities</h3>
                        <p style="color: #666; margin-bottom: 10px;">
                            Discover prime land plots in Mbarara with Zalseef Estates.
                        </p>
                        <p style="color: #666; margin-bottom: 20px;">
                            We're updating our featured listings. Contact us for current available properties.
                        </p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <a href="contact.html" class="btn">
                                <i class="fas fa-envelope"></i> Contact Us
                            </a>
                            <a href="properties.html" class="btn btn-outline">
                                <i class="fas fa-search"></i> Browse All Properties
                            </a>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Display properties
        featuredContainer.innerHTML = properties.map(property => {
            const imageUrl = property.images && property.images[0] 
                ? property.images[0] 
                : 'https://via.placeholder.com/300x200/1e90ff/ffffff?text=Zalseef+Estates';
            
            return `
                <div class="property-card ${property.status === 'sold' ? 'sold' : ''}">
                    <img src="${imageUrl}" 
                         alt="${property.title}"
                         onerror="this.src='https://via.placeholder.com/300x200/1e90ff/ffffff?text=Zalseef+Estates'">
                    <div class="info">
                        <h3>${property.title}</h3>
                        <p class="price">UGX ${property.price}</p>
                        <p>${property.size} | ${property.type} | ${property.location}</p>
                        <p class="status ${property.status}">${property.status === 'sold' ? 'Sold' : 'Available'}</p>
                        <button class="btn" onclick="openModal(${JSON.stringify(property).replace(/"/g, '&quot;')})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading featured properties:', error);
        
        // Show user-friendly error message
        featuredContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                <div style="background: #fff3cd; color: #856404; padding: 20px; border-radius: 10px; border: 1px solid #ffeaa7;">
                    <h3 style="color: #856404; margin-bottom: 15px;">
                        <i class="fas fa-info-circle"></i> Properties Loading
                    </h3>
                    <p style="margin-bottom: 10px;">We're currently updating our property listings.</p>
                    <p style="margin-bottom: 20px;">Please check back in a few moments or contact us directly.</p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <a href="properties.html" class="btn" style="background: #064663;">
                            <i class="fas fa-map-marked-alt"></i> View Properties
                        </a>
                        <a href="contact.html" class="btn btn-outline" style="border-color: #064663; color: #064663;">
                            <i class="fas fa-headset"></i> Get Assistance
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Load featured testimonials on homepage
async function loadFeaturedTestimonials() {
    const testimonialsContainer = document.getElementById('featuredTestimonials');
    if (!testimonialsContainer) return;

    try {
        const testimonials = await testimonialService.getTestimonials();
        const featuredTestimonials = testimonials.slice(0, 3);
        
        if (featuredTestimonials.length === 0) {
            testimonialsContainer.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1;">
                    <p>Be the first to share your experience with Zalseef Estates!</p>
                    <a href="testimonials.html" class="btn">Share Your Story</a>
                </div>
            `;
            return;
        }

        testimonialsContainer.innerHTML = featuredTestimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <i class="fas fa-quote-left quote-icon" aria-hidden="true"></i>
                    <p>${testimonial.testimonial}</p>
                </div>
                <div class="client-info">
                    <img src="https://via.placeholder.com/60x60/1e90ff/ffffff?text=👤" 
                         alt="${testimonial.name}" 
                         class="client-img">
                    <div>
                        <h4>${testimonial.name}</h4>
                        <p class="client-location">${testimonial.location}</p>
                        <div class="rating" aria-label="${testimonial.rating} star rating">
                            ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonialsContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1;">
                <p>What our clients say about their experience with Zalseef Estates.</p>
                <a href="testimonials.html" class="btn">Read Testimonials</a>
            </div>
        `;
    }
}

// Property search functionality
const propertySearchForm = document.getElementById('propertySearch');
if (propertySearchForm) {
    propertySearchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        filterProperties();
    });
}

// Filter properties based on search criteria
async function filterProperties() {
    const location = document.getElementById('searchLocation')?.value.toLowerCase() || '';
    const type = document.getElementById('searchType')?.value || '';
    const priceRange = document.getElementById('searchPrice')?.value || '';
    const status = document.getElementById('searchStatus')?.value || '';

    const filters = {};
    if (location) filters.location = location;
    if (type) filters.type = type;
    if (status) filters.status = status;

    try {
        const properties = await propertyService.getProperties(filters);
        displayProperties(properties, priceRange);
    } catch (error) {
        console.error('Error filtering properties:', error);
    }
}

// Display properties with optional price filtering
function displayProperties(properties, priceRange = '') {
    const propertiesContainer = document.getElementById('allProperties') || document.getElementById('featuredProperties');
    const noPropertiesMessage = document.getElementById('noPropertiesMessage');
    
    if (!propertiesContainer) return;

    // Filter by price range if specified
    let filteredProperties = properties;
    if (priceRange) {
        filteredProperties = properties.filter(property => {
            const price = extractPrice(property.price);
            if (priceRange === '10000000+') return price >= 10000000;
            
            const [min, max] = priceRange.split('-').map(Number);
            return price >= min && price <= max;
        });
    }

    if (filteredProperties.length === 0) {
        propertiesContainer.innerHTML = '';
        if (noPropertiesMessage) noPropertiesMessage.style.display = 'block';
        return;
    }

    if (noPropertiesMessage) noPropertiesMessage.style.display = 'none';

    propertiesContainer.innerHTML = filteredProperties.map(property => `
        <div class="property-card ${property.status === 'sold' ? 'sold' : ''}" 
             data-location="${property.location.toLowerCase()}" 
             data-type="${property.type}" 
             data-price="${extractPrice(property.price)}">
            <img src="${property.images ? property.images[0] : 'https://via.placeholder.com/300x200/1e90ff/ffffff?text=Zalseef+Estates'}" 
                 alt="${property.title}"
                 onerror="this.src='https://via.placeholder.com/300x200/1e90ff/ffffff?text=Zalseef+Estates'">
            <div class="info">
                <h3>${property.title}</h3>
                <p class="price">UGX ${property.price}</p>
                <p>${property.size} | ${property.type} | ${property.location}</p>
                <p class="status ${property.status}">${property.status === 'sold' ? 'Sold' : 'Available'}</p>
                <button class="btn" onclick="openModal(${JSON.stringify(property).replace(/"/g, '&quot;')})">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Helper function to extract price from string
function extractPrice(priceString) {
    if (!priceString) return 0;
    
    // Remove UGX and commas, then convert to number
    const numericString = priceString.toString()
        .replace(/UGX\s*/gi, '')
        .replace(/,/g, '')
        .replace(/\s/g, '')
        .trim();
    
    const price = parseFloat(numericString);
    return isNaN(price) ? 0 : price;
}

// Filter tags functionality
const filterTags = document.getElementById('filterTags');
if (filterTags) {
    filterTags.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
            // Update active tag
            filterTags.querySelectorAll('.filter-tag').forEach(tag => {
                tag.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Filter properties
            const filter = e.target.getAttribute('data-filter');
            applyFilter(filter);
        }
    });
}

async function applyFilter(filter) {
    const filters = {};
    
    if (filter === 'available') filters.status = 'available';
    else if (filter === 'sold') filters.status = 'sold';
    else if (filter === 'featured') filters.featured = true;
    
    try {
        const properties = await propertyService.getProperties(filters);
        displayProperties(properties);
    } catch (error) {
        console.error('Error applying filter:', error);
    }
}

// Load all properties for properties page
async function loadAllProperties() {
    const propertiesContainer = document.getElementById('allProperties');
    if (!propertiesContainer) return;

    try {
        const properties = await propertyService.getProperties();
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading all properties:', error);
        propertiesContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                <p>Error loading properties. Please try again later.</p>
                <a href="index.html" class="btn">Return Home</a>
            </div>
        `;
    }
}

// Load all testimonials for testimonials page
async function loadAllTestimonials() {
    const testimonialsContainer = document.getElementById('allTestimonials');
    if (!testimonialsContainer) return;

    try {
        const testimonials = await testimonialService.getTestimonials();
        
        if (testimonials.length === 0) {
            testimonialsContainer.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1;">
                    <h3>Share Your Experience</h3>
                    <p>Be the first to share your story about working with Zalseef Estates.</p>
                    <a href="#testimonialForm" class="btn">Add Your Testimonial</a>
                </div>
            `;
            return;
        }

        testimonialsContainer.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <i class="fas fa-quote-left quote-icon" aria-hidden="true"></i>
                    <p>${testimonial.testimonial}</p>
                </div>
                <div class="client-info">
                    <img src="https://via.placeholder.com/60x60/1e90ff/ffffff?text=👤" 
                         alt="${testimonial.name}" 
                         class="client-img"
                         onerror="this.src='https://via.placeholder.com/60x60/1e90ff/ffffff?text=👤'">
                    <div>
                        <h4>${testimonial.name}</h4>
                        <p class="client-location">${testimonial.location}</p>
                        <div class="rating" aria-label="${testimonial.rating} star rating">
                            ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonialsContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1;">
                <p>Error loading testimonials. Please try again later.</p>
            </div>
        `;
    }
}
// YouTube Video Controller Class
class YouTubeVideoController {
    constructor() {
        this.player = null;
        this.isMuted = true;
        this.isPlaying = false;
        this.volume = 0;
        this.isYouTubeAPIReady = false;
        this.init();
    }

    init() {
        this.createVideoElements();
        this.loadYouTubeAPI();
        this.bindEvents();
    }

    createVideoElements() {
        // Ensure the player container exists
        if (!document.getElementById('player')) {
            const videoWrapper = document.querySelector('.video-wrapper');
            if (videoWrapper) {
                const playerDiv = document.createElement('div');
                playerDiv.id = 'player';
                videoWrapper.insertBefore(playerDiv, videoWrapper.firstChild);
            }
        }
    }

    loadYouTubeAPI() {
        // Check if YouTube API is already loaded
        if (window.YT && window.YT.Player) {
            this.isYouTubeAPIReady = true;
            this.createPlayer();
            return;
        }

        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Global callback for YouTube API
        window.onYouTubeIframeAPIReady = () => {
            this.isYouTubeAPIReady = true;
            this.createPlayer();
        };

        // Fallback if API doesn't load
        setTimeout(() => {
            if (!this.isYouTubeAPIReady) {
                console.warn('YouTube API failed to load, using fallback');
                this.setupFallback();
            }
        }, 10000);
    }

    createPlayer() {
        try {
            this.player = new YT.Player('player', {
                height: '500',
                width: '100%',
                videoId: '_Q_JlHjsfyw',
                playerVars: {
                    'autoplay': 0,
                    'mute': 1,
                    'enablejsapi': 1,
                    'rel': 0,
                    'modestbranding': 1,
                    'playsinline': 1
                },
                events: {
                    'onReady': this.onPlayerReady.bind(this),
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onError': this.onPlayerError.bind(this)
                }
            });
        } catch (error) {
            console.error('Error creating YouTube player:', error);
            this.setupFallback();
        }
    }

    onPlayerReady(event) {
        console.log('YouTube player ready');
        this.hideLoading();
        this.updateUI();
        
        // Set initial volume to 0 (muted)
        this.player.setVolume(0);
        this.volume = 0;
        this.updateVolumeSlider();
    }

    onPlayerStateChange(event) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                break;
            case YT.PlayerState.PAUSED:
                this.isPlaying = false;
                break;
            case YT.PlayerState.ENDED:
                this.isPlaying = false;
                break;
        }
        this.updatePlayPauseIcon();
    }

    onPlayerError(event) {
        console.error('YouTube player error:', event.data);
        this.hideLoading();
        this.showError('Failed to load video. Please try again later.');
    }

    bindEvents() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', this.togglePlayPause.bind(this));
            playPauseBtn.addEventListener('touchstart', this.handleTouch.bind(this));
        }

        // Mute toggle button
        const muteToggle = document.getElementById('muteToggle');
        if (muteToggle) {
            muteToggle.addEventListener('click', this.toggleMute.bind(this));
            muteToggle.addEventListener('touchstart', this.handleTouch.bind(this));
        }

        // Volume slider
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', this.handleVolumeChange.bind(this));
            volumeSlider.addEventListener('change', this.handleVolumeChange.bind(this));
        }

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', this.toggleFullscreen.bind(this));
            fullscreenBtn.addEventListener('touchstart', this.handleTouch.bind(this));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Mobile touch events for controls visibility
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) {
            videoWrapper.addEventListener('touchstart', this.showControls.bind(this));
        }
    }

    togglePlayPause() {
        if (!this.player) return;

        try {
            if (this.isPlaying) {
                this.player.pauseVideo();
            } else {
                this.player.playVideo();
                // If muted and volume is 0, set to 50% when playing
                if (this.isMuted && this.volume === 0) {
                    this.setVolume(50);
                }
            }
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    }

    toggleMute() {
        if (!this.player) return;

        try {
            if (this.isMuted) {
                this.player.unMute();
                this.isMuted = false;
                // If volume was 0, set to 50%
                if (this.volume === 0) {
                    this.setVolume(50);
                }
            } else {
                this.player.mute();
                this.isMuted = true;
            }
            this.updateMuteIcon();
            this.updateVolumeSlider();
        } catch (error) {
            console.error('Error toggling mute:', error);
        }
    }

    handleVolumeChange(event) {
        const volume = parseInt(event.target.value);
        this.setVolume(volume);
    }

    setVolume(volume) {
        if (!this.player) return;

        try {
            this.volume = volume;
            this.player.setVolume(volume);
            
            // Update mute state based on volume
            if (volume === 0) {
                this.isMuted = true;
                this.player.mute();
            } else {
                this.isMuted = false;
                this.player.unMute();
            }
            
            this.updateMuteIcon();
            this.updateVolumeSlider();
        } catch (error) {
            console.error('Error setting volume:', error);
        }
    }

    toggleFullscreen() {
        const videoWrapper = document.querySelector('.video-wrapper');
        if (!videoWrapper) return;

        if (!document.fullscreenElement) {
            if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen();
            } else if (videoWrapper.webkitRequestFullscreen) {
                videoWrapper.webkitRequestFullscreen();
            } else if (videoWrapper.msRequestFullscreen) {
                videoWrapper.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    handleKeyboard(event) {
        // Only handle keyboard events when video is focused or playing
        if (!this.player) return;

        switch (event.key.toLowerCase()) {
            case ' ':
            case 'k':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'm':
                event.preventDefault();
                this.toggleMute();
                break;
            case 'f':
                event.preventDefault();
                this.toggleFullscreen();
                break;
            case 'arrowup':
                event.preventDefault();
                this.adjustVolume(10);
                break;
            case 'arrowdown':
                event.preventDefault();
                this.adjustVolume(-10);
                break;
        }
    }

    adjustVolume(change) {
        const newVolume = Math.max(0, Math.min(100, this.volume + change));
        this.setVolume(newVolume);
    }

    handleTouch(event) {
        // Prevent default and stop propagation for touch events
        event.preventDefault();
        event.stopPropagation();
    }

    showControls() {
        const controls = document.querySelector('.video-controls');
        if (controls) {
            controls.style.opacity = '1';
            controls.style.transform = 'translateX(-50%) translateY(0)';
            controls.style.pointerEvents = 'all';
            
            // Hide after 3 seconds
            clearTimeout(this.controlsTimeout);
            this.controlsTimeout = setTimeout(() => {
                if (!this.isPlaying) return; // Keep visible if not playing
                controls.style.opacity = '0';
                controls.style.transform = 'translateX(-50%) translateY(10px)';
                controls.style.pointerEvents = 'none';
            }, 3000);
        }
    }

    updateUI() {
        this.updatePlayPauseIcon();
        this.updateMuteIcon();
        this.updateVolumeSlider();
    }

    updatePlayPauseIcon() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const icon = playPauseBtn?.querySelector('i');
        
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        
        if (playPauseBtn) {
            playPauseBtn.setAttribute('aria-label', this.isPlaying ? 'Pause video' : 'Play video');
        }
    }

    updateMuteIcon() {
        const muteToggle = document.getElementById('muteToggle');
        const muteIcon = document.getElementById('muteIcon');
        
        if (muteIcon) {
            if (this.isMuted || this.volume === 0) {
                muteIcon.className = 'fas fa-volume-mute';
            } else if (this.volume < 50) {
                muteIcon.className = 'fas fa-volume-down';
            } else {
                muteIcon.className = 'fas fa-volume-up';
            }
        }
        
        if (muteToggle) {
            muteToggle.setAttribute('aria-label', this.isMuted ? 'Unmute video' : 'Mute video');
        }
    }

    updateVolumeSlider() {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('videoLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    showError(message) {
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'video-error';
            errorDiv.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 20px;
                z-index: 20;
            `;
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px; color: #ff6b6b;"></i>
                <h3 style="margin-bottom: 10px;">Video Unavailable</h3>
                <p style="margin-bottom: 20px;">${message}</p>
                <button onclick="location.reload()" class="btn" style="background: #1e90ff;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            `;
            videoWrapper.appendChild(errorDiv);
        }
    }

    setupFallback() {
        this.hideLoading();
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) {
            videoWrapper.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; background: #f8f9fa; border-radius: 15px;">
                    <i class="fas fa-video" style="font-size: 4rem; color: #1e90ff; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 15px; color: #064663;">Welcome Video</h3>
                    <p style="margin-bottom: 25px; color: #666;">
                        Watch our CEO's welcome message on YouTube
                    </p>
                    <a href="https://www.youtube.com/watch?v=_Q_JlHjsfyw" 
                       target="_blank" 
                       class="btn" 
                       style="background: #ff0000; display: inline-flex; align-items: center; gap: 10px;">
                        <i class="fab fa-youtube"></i>
                        Watch on YouTube
                    </a>
                </div>
            `;
        }
    }

    // Public methods
    play() {
        this.togglePlayPause();
    }

    pause() {
        if (this.player && this.isPlaying) {
            this.player.pauseVideo();
        }
    }

    setVolumeLevel(level) {
        this.setVolume(level);
    }

    destroy() {
        if (this.player) {
            this.player.destroy();
        }
        // Clean up event listeners
        const events = ['click', 'touchstart', 'input', 'change', 'keydown'];
        events.forEach(event => {
            document.removeEventListener(event, this.boundHandlers);
        });
    }
}

// Initialize YouTube Video Controller
function initializeVideoControls() {
    // Only initialize on pages with video section
    if (document.querySelector('.welcome-video')) {
        window.youtubeController = new YouTubeVideoController();
        console.log('🎬 YouTube video controller initialized');
    }
}

// Add to your existing initializeWebsite function
function initializeWebsite() {
    console.log("🏠 Zalseef Estates Website Initializing...");
    
    try {
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize scroll spy
        initializeScrollSpy();
        
        // Initialize video controls
        initializeVideoControls();
        
        // Load page-specific content
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            console.log("📄 Loading homepage content");
            loadFeaturedProperties();
            loadFeaturedTestimonials();
        }
        
        // ... rest of your existing initialization code
        
    } catch (error) {
        console.error("❌ Error during website initialization:", error);
    }
}

// Make controller available globally
window.YouTubeVideoController = YouTubeVideoController;
// Enhanced initialization with error handling
function initializeWebsite() {
    console.log("🏠 Zalseef Estates Website Initializing...");
    
    try {
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize scroll spy
        initializeScrollSpy();
        
        // Load page-specific content
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            console.log("📄 Loading homepage content");
            loadFeaturedProperties();
            loadFeaturedTestimonials();
        }
        
        // Load all properties on properties page
        if (window.location.pathname.endsWith('properties.html')) {
            console.log("📄 Loading properties page");
            loadAllProperties();
        }
        
        // Load all testimonials on testimonials page
        if (window.location.pathname.endsWith('testimonials.html')) {
            console.log("📄 Loading testimonials page");
            loadAllTestimonials();
        }
        
        console.log("✅ Website initialization complete");
    } catch (error) {
        console.error("❌ Error during website initialization:", error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Make functions available globally
window.openModal = openModal;
window.closeModal = closeModal;
window.filterProperties = filterProperties;
window.loadPropertiesForDropdown = loadPropertiesForDropdown;
window.closeMobileMenu = closeMobileMenu;