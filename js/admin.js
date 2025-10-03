import { 
    auth, 
    propertyService, 
    inquiryService, 
    testimonialService, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    uploadImage
} from './firebase-config.js';

// Property Management
let uploadedImages = [];

// Admin Mobile Toggle Implementation
function initializeAdminMobileToggle() {
    const adminHeader = document.querySelector('.admin-header');
    const adminNav = document.querySelector('.admin-nav');
    
    console.log('Initializing admin mobile toggle...');
    console.log('Admin header found:', !!adminHeader);
    console.log('Admin nav found:', !!adminNav);
    
    if (!adminHeader || !adminNav) {
        console.error('Admin header or nav not found!');
        return;
    }

    // Check if toggle already exists
    if (document.getElementById('adminMobileToggle')) {
        console.log('Toggle already exists, skipping creation');
        return;
    }

    // Create mobile toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'adminMobileToggle';
    toggleBtn.className = 'admin-mobile-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle admin navigation');
    toggleBtn.setAttribute('aria-expanded', 'false');

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'admin-mobile-backdrop';
    document.body.appendChild(backdrop);

    // Add toggle button to header
    adminHeader.appendChild(toggleBtn);
    
    console.log('Toggle button created and added to header');

    // Toggle functionality
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = adminNav.classList.toggle('active');
        console.log('Toggle clicked, menu active:', isExpanded);
        
        toggleBtn.innerHTML = isExpanded ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        toggleBtn.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', isExpanded);
        backdrop.classList.toggle('active');
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking backdrop
    backdrop.addEventListener('click', () => {
        console.log('Backdrop clicked, closing menu');
        adminNav.classList.remove('active');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (adminNav.classList.contains('active') && 
            !adminNav.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            console.log('Clicked outside, closing menu');
            adminNav.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminNav.classList.contains('active')) {
            console.log('Escape key pressed, closing menu');
            adminNav.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on window resize (if resizing to larger screen)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && adminNav.classList.contains('active')) {
            console.log('Window resized to larger screen, closing menu');
            adminNav.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    console.log('Admin mobile toggle initialized successfully');
}

// Add temporary navigation if none exists
function ensureNavigationExists() {
    const adminNav = document.querySelector('.admin-nav');
    if (!adminNav) return;
    
    // Only add navigation if it's empty
    if (adminNav.children.length === 0) {
        adminNav.innerHTML = `
            <a href="../index.html" class="nav-home">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="../properties.html" class="nav-properties">
                <i class="fas fa-building"></i>
                <span>Properties</span>
            </a>
            <a href="../testimonials.html" class="nav-testimonials">
                <i class="fas fa-star"></i>
                <span>Testimonials</span>
            </a>
            <a href="../contact.html" class="nav-contact">
                <i class="fas fa-envelope"></i>
                <span>Contact</span>
            </a>
            <button id="logoutBtn" class="admin-logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        `;
        console.log('Navigation links added to admin panel');
    }
}

// Admin authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        showAdminPanel();
        loadAdminData();
        clearLoginForm(); // Clear login form after successful login
        
        // Ensure navigation exists and initialize mobile toggle
        setTimeout(() => {
            ensureNavigationExists();
            initializeAdminMobileToggle();
        }, 100);
    } else {
        // User is signed out
        showLoginForm();
        clearAdminForms(); // Clear all admin forms when logging out
    }
});

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('#email').value;
        const password = loginForm.querySelector('#password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Success - redirected by auth state change
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Invalid email or password', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // Forms will be cleared by the auth state change listener
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// Clear login form
function clearLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.reset();
        
        // Clear any error states
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
        
        // Reset button state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Sign In';
        }
    }
}

// Clear all admin forms
function clearAdminForms() {
    // Clear add property form
    clearAddPropertyForm();
    
    // Clear any active filters or search terms
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.value = '';
    });
    
    // Clear any selected filters
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        if (select.id !== 'imageUpload') { // Don't reset file inputs
            select.selectedIndex = 0;
        }
    });
    
    console.log('All admin forms cleared');
}

// Clear add property form specifically
function clearAddPropertyForm() {
    const addPropertyForm = document.getElementById('addPropertyForm');
    if (addPropertyForm) {
        addPropertyForm.reset();
        
        // Clear uploaded images
        uploadedImages = [];
        updateUploadedImagesDisplay();
        
        // Reset all form fields to default states
        const featuredCheckbox = addPropertyForm.querySelector('input[name="featured"]');
        if (featuredCheckbox) {
            featuredCheckbox.checked = false;
        }
        
        // Clear any validation errors
        const errorElements = addPropertyForm.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.classList.remove('error');
        });
        
        const errorMessages = addPropertyForm.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.remove();
        });
        
        console.log('Add property form cleared');
    }
}

// Show/hide sections
function showLoginForm() {
    document.getElementById('loginSection')?.classList.remove('hidden');
    document.getElementById('adminSection')?.classList.add('hidden');
    clearAdminForms(); // Clear forms when showing login
}

function showAdminPanel() {
    document.getElementById('loginSection')?.classList.add('hidden');
    document.getElementById('adminSection')?.classList.remove('hidden');
    clearLoginForm(); // Clear login form when showing admin panel
}

// Tab functionality
const adminTabs = document.querySelectorAll('.admin-tab');
adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Update active tab
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });

    // Show active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // Load tab-specific data
    switch (tabName) {
        case 'properties':
            loadPropertiesForAdmin();
            break;
        case 'inquiries':
            loadInquiries();
            break;
        case 'testimonials':
            loadTestimonialsForAdmin();
            break;
    }
}

// Initialize image upload functionality
function initializeImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const imageUploadArea = document.getElementById('imageUploadArea');
    const browseFilesBtn = document.getElementById('browseFilesBtn');
    
    if (!imageUpload || !imageUploadArea || !browseFilesBtn) {
        console.log('Image upload elements not found');
        return;
    }

    // Browse button click handler
    browseFilesBtn.addEventListener('click', () => {
        console.log('Browse button clicked');
        imageUpload.click();
    });

    // File input change handler
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Drag and drop functionality
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('dragover');
    });
    
    imageUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragover');
    });
    
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        console.log('Files dropped:', files.length);
        handleImageFiles(files);
    });

    // Also allow click on the entire upload area
    imageUploadArea.addEventListener('click', () => {
        imageUpload.click();
    });

    console.log('Image upload initialized successfully');
}

// Handle image upload from file input
async function handleImageUpload(e) {
    const files = e.target.files;
    console.log('Files selected:', files.length);
    if (files.length > 0) {
        await handleImageFiles(files);
        // Reset the input to allow selecting the same files again
        e.target.value = '';
    }
}

// Handle image files with validation and progress
async function handleImageFiles(files) {
    const uploadedImagesContainer = document.getElementById('uploadedImages');
    
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            // Validate file
            try {
                validateImageFile(file);
            } catch (error) {
                showMessage(error.message, 'error');
                continue;
            }

            // Show uploading indicator
            const tempId = 'temp-' + Date.now();
            if (uploadedImagesContainer) {
                uploadedImagesContainer.innerHTML += `
                    <div class="uploaded-image uploading" id="${tempId}">
                        <div class="image-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Uploading ${file.name}...</span>
                        </div>
                    </div>
                `;
            }

            try {
                console.log('Uploading image:', file.name);
                const imageUrl = await uploadImage(file);
                uploadedImages.push(imageUrl);
                console.log('Image uploaded successfully:', imageUrl);
                
                // Replace uploading indicator with actual image
                const tempElement = document.getElementById(tempId);
                if (tempElement) {
                    tempElement.outerHTML = `
                        <div class="uploaded-image">
                            <img src="${imageUrl}" alt="Uploaded property image">
                            <button type="button" class="remove-image" onclick="removeImage(${uploadedImages.length - 1})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                }
                
                showMessage(`"${file.name}" uploaded successfully!`, 'success');
            } catch (error) {
                console.error('Error uploading image:', error);
                // Remove the uploading indicator
                const tempElement = document.getElementById(tempId);
                if (tempElement) {
                    tempElement.remove();
                }
                showMessage(`Error uploading "${file.name}". Please try again.`, 'error');
            }
        } else {
            showMessage(`"${file.name}" is not an image. Please select image files only.`, 'error');
        }
    }
}

// Validate individual image file
function validateImageFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error(`"${file.name}" is not a supported image format. Please use JPEG, PNG, or WebP.`);
    }
    if (file.size > maxSize) {
        throw new Error(`"${file.name}" is too large. Maximum size is 5MB.`);
    }
    
    return true;
}

// Update uploaded images display
function updateUploadedImagesDisplay() {
    const uploadedImagesContainer = document.getElementById('uploadedImages');
    if (!uploadedImagesContainer) return;

    if (uploadedImages.length === 0) {
        uploadedImagesContainer.innerHTML = '<p class="no-images">No images uploaded yet</p>';
        return;
    }

    uploadedImagesContainer.innerHTML = uploadedImages.map((url, index) => `
        <div class="uploaded-image">
            <img src="${url}" alt="Uploaded property image ${index + 1}">
            <button type="button" class="remove-image" onclick="removeImage(${index})" aria-label="Remove image">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Remove image from uploaded images
window.removeImage = function(index) {
    if (index >= 0 && index < uploadedImages.length) {
        const removedImage = uploadedImages.splice(index, 1);
        updateUploadedImagesDisplay();
        showMessage('Image removed', 'success');
        console.log('Removed image:', removedImage);
    }
};

// Add property form
const addPropertyForm = document.getElementById('addPropertyForm');
if (addPropertyForm) {
    addPropertyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(addPropertyForm);
        const propertyData = {
            title: formData.get('title'),
            location: formData.get('location'),
            size: formData.get('size'),
            type: formData.get('type'),
            price: formData.get('price'),
            description: formData.get('description'),
            features: formData.get('features') ? formData.get('features').split(',').map(f => f.trim()).filter(f => f) : [],
            status: formData.get('status'),
            featured: formData.get('featured') === 'on',
            images: uploadedImages
        };

        const submitBtn = addPropertyForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Property...';
        submitBtn.disabled = true;

        try {
            await propertyService.addProperty(propertyData);
            showMessage('Property added successfully!', 'success');
            clearAddPropertyForm(); // Clear form after successful submission
            loadPropertiesForAdmin();
        } catch (error) {
            console.error('Error adding property:', error);
            showMessage('Error adding property. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Load properties for admin
async function loadPropertiesForAdmin() {
    const propertiesContainer = document.getElementById('adminProperties');
    if (!propertiesContainer) return;

    try {
        const properties = await propertyService.getProperties();
        
        propertiesContainer.innerHTML = properties.map(property => `
            <div class="property-item ${property.status === 'sold' ? 'sold' : ''}">
                <div class="property-info">
                    <h4>${property.title}</h4>
                    <p>${property.location} - ${property.price} - ${property.size}</p>
                    <p class="property-meta">Type: ${property.type} | Status: ${property.status} | Featured: ${property.featured ? 'Yes' : 'No'}</p>
                </div>
                <div class="property-actions">
                    <button class="btn" onclick="editProperty('${property.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteProperty('${property.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ${property.status === 'available' ? `
                        <button class="btn" onclick="markAsSold('${property.id}')">
                            <i class="fas fa-tag"></i> Mark Sold
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading properties for admin:', error);
        propertiesContainer.innerHTML = '<p>Error loading properties</p>';
    }
}

// Property actions
window.editProperty = async function(propertyId) {
    // Implementation for editing property
    showMessage('Edit functionality coming soon!', 'success');
};

window.deleteProperty = async function(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        try {
            await propertyService.deleteProperty(propertyId);
            showMessage('Property deleted successfully!', 'success');
            loadPropertiesForAdmin();
        } catch (error) {
            console.error('Error deleting property:', error);
            showMessage('Error deleting property', 'error');
        }
    }
};

window.markAsSold = async function(propertyId) {
    try {
        await propertyService.updateProperty(propertyId, { status: 'sold' });
        showMessage('Property marked as sold!', 'success');
        loadPropertiesForAdmin();
    } catch (error) {
        console.error('Error updating property:', error);
        showMessage('Error updating property', 'error');
    }
};

// Load inquiries
async function loadInquiries() {
    const inquiriesContainer = document.getElementById('adminInquiries');
    if (!inquiriesContainer) return;

    try {
        const inquiries = await inquiryService.getInquiries();
        
        inquiriesContainer.innerHTML = inquiries.map(inquiry => `
            <div class="inquiry-item ${!inquiry.read ? 'unread' : ''}">
                <div class="inquiry-info">
                    <h4>${inquiry.name}</h4>
                    <p class="inquiry-meta">
                        ${inquiry.email} | ${inquiry.phone} | 
                        ${new Date(inquiry.createdAt.seconds * 1000).toLocaleDateString()}
                    </p>
                    <p><strong>Interest:</strong> ${inquiry.interest}</p>
                    ${inquiry.propertyInterested ? `<p><strong>Property:</strong> ${inquiry.propertyInterested}</p>` : ''}
                    <p>${inquiry.message}</p>
                </div>
                <div class="inquiry-actions">
                    <button class="mark-read ${inquiry.read ? 'read' : ''}" 
                            onclick="markInquiryAsRead('${inquiry.id}')"
                            ${inquiry.read ? 'disabled' : ''}>
                        ${inquiry.read ? 'Read' : 'Mark Read'}
                    </button>
                    <a href="mailto:${inquiry.email}" class="btn">
                        <i class="fas fa-reply"></i> Reply
                    </a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading inquiries:', error);
        inquiriesContainer.innerHTML = '<p>Error loading inquiries</p>';
    }
}

window.markInquiryAsRead = async function(inquiryId) {
    try {
        await inquiryService.markInquiryAsRead(inquiryId);
        showMessage('Inquiry marked as read!', 'success');
        loadInquiries();
    } catch (error) {
        console.error('Error marking inquiry as read:', error);
        showMessage('Error updating inquiry', 'error');
    }
};

// Load testimonials for admin
async function loadTestimonialsForAdmin() {
    const testimonialsContainer = document.getElementById('adminTestimonials');
    if (!testimonialsContainer) return;

    try {
        const testimonials = await testimonialService.getAllTestimonials();
        
        testimonialsContainer.innerHTML = testimonials.map(testimonial => `
            <div class="property-item ${testimonial.approved ? 'approved' : 'pending'}">
                <div class="property-info">
                    <h4>${testimonial.name} - ${testimonial.location}</h4>
                    <div class="rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
                    <p>${testimonial.testimonial}</p>
                    <p class="property-meta">
                        ${testimonial.email} | 
                        ${new Date(testimonial.createdAt.seconds * 1000).toLocaleDateString()} |
                        Status: ${testimonial.approved ? 'Approved' : 'Pending'}
                    </p>
                </div>
                <div class="property-actions">
                    ${!testimonial.approved ? `
                        <button class="btn" onclick="approveTestimonial('${testimonial.id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                    ` : ''}
                    <button class="btn btn-danger" onclick="deleteTestimonial('${testimonial.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading testimonials for admin:', error);
        testimonialsContainer.innerHTML = '<p>Error loading testimonials</p>';
    }
}

window.approveTestimonial = async function(testimonialId) {
    try {
        await testimonialService.approveTestimonial(testimonialId);
        showMessage('Testimonial approved!', 'success');
        loadTestimonialsForAdmin();
    } catch (error) {
        console.error('Error approving testimonial:', error);
        showMessage('Error approving testimonial', 'error');
    }
};

window.deleteTestimonial = async function(testimonialId) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        try {
            // You would need to add a deleteTestimonial function to testimonialService
            showMessage('Delete functionality coming soon!', 'success');
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            showMessage('Error deleting testimonial', 'error');
        }
    }
};

// Load admin data (statistics, etc.)
async function loadAdminData() {
    try {
        const properties = await propertyService.getProperties();
        const inquiries = await inquiryService.getInquiries();
        const testimonials = await testimonialService.getAllTestimonials();

        // Update statistics
        document.getElementById('totalProperties').textContent = properties.length;
        document.getElementById('availableProperties').textContent = 
            properties.filter(p => p.status === 'available').length;
        document.getElementById('newInquiries').textContent = 
            inquiries.filter(i => !i.read).length;
        document.getElementById('pendingTestimonials').textContent = 
            testimonials.filter(t => !t.approved).length;

    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

// Message display function
function showMessage(message, type) {
    // Remove any existing messages first
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        font-weight: bold;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#dc3545';
    } else {
        messageDiv.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Initialize admin on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    
    // Ensure navigation exists
    ensureNavigationExists();
    
    // Initialize image upload functionality
    initializeImageUpload();
    
    // Switch to properties tab by default if user is logged in
    if (auth.currentUser) {
        switchTab('properties');
    }
});