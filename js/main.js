import { propertyService, inquiryService, testimonialService } from './firebase-config.js';

// Formspree Configuration
const FORMSPREE_CONFIG = {
    CONTACT_FORM_ID: 'xyznjaeq', // Your contact form ID
    TESTIMONIAL_FORM_ID: 'xgvnybkv' // Replace with your testimonial form ID
};

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = isExpanded ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Update active link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Hero Slideshow
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;

        function showNextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        setInterval(showNextSlide, 5000);
    }
});

// Property Modal Functions
function openModal(property) {
    const modal = document.getElementById('propertyModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
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
            <p><strong>Status:</strong> <span class="${property.status === 'sold' ? 'sold' : 'available'}">${property.status === 'sold' ? 'Sold' : 'Available'}</span></p>
            ${property.features ? `<p><strong>Features:</strong> ${property.features.join(', ')}</p>` : ''}
            <p><strong>Description:</strong> ${property.description}</p>
            ${property.status !== 'sold' ? `
                <a href="contact.html?property=${encodeURIComponent(property.title)}" class="btn">Inquire Now</a>
            ` : ''}
        </div>
    `;
    modal.style.display = 'block';
    modal.focus();
}

function closeModal() {
    const modal = document.getElementById('propertyModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('propertyModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Enhanced Contact Form Handler with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    console.log("✅ Contact form found, setting up Formspree handler");
    
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

    // Show property dropdown when buying land is selected
    const interestSelect = contactForm.querySelector('select[name="interest"]');
    const propertySelect = contactForm.querySelector('select[name="property_interested"]');
    
    if (interestSelect && propertySelect) {
        interestSelect.addEventListener('change', function() {
            if (this.value === 'buying' || this.value === 'site_visit') {
                propertySelect.style.display = 'block';
                loadPropertiesForDropdown();
            } else {
                propertySelect.style.display = 'none';
            }
        });
    }
}

// Enhanced Testimonial Form Handler with Formspree
const testimonialForm = document.getElementById('testimonialForm');
if (testimonialForm) {
    console.log("✅ Testimonial form found, setting up Formspree handler");
    
    // Update form action if testimonial form ID is set
    if (FORMSPREE_CONFIG.TESTIMONIAL_FORM_ID !== 'YOUR_TESTIMONIAL_FORM_ID') {
        testimonialForm.action = `https://formspree.io/f/${FORMSPREE_CONFIG.TESTIMONIAL_FORM_ID}`;
    }
    
    // Star rating functionality
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

// Show message function
function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `message ${type}`;
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    } else {
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏠 Zalseef Estates Website Initialized");
    
    // Load featured content on homepage
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
});

// Make functions available globally
window.openModal = openModal;
window.closeModal = closeModal;
window.filterProperties = filterProperties;
window.loadPropertiesForDropdown = loadPropertiesForDropdown;