// Admin Mobile Menu Class
class AdminMobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileToggle();
        this.enhanceAdminNavigation();
        this.addEventListeners();
    }

    createMobileToggle() {
        // Check if toggle already exists
        if (document.getElementById('adminMobileToggle')) return;

        const adminHeader = document.querySelector('.admin-header');
        if (!adminHeader) return;

        // Create mobile toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'adminMobileToggle';
        toggleBtn.className = 'admin-mobile-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle admin navigation');
        toggleBtn.setAttribute('aria-expanded', 'false');

        // Add toggle button to header
        const headerContainer = document.createElement('div');
        headerContainer.className = 'admin-header-container';
        
        // Move existing header content into container
        const existingContent = adminHeader.innerHTML;
        adminHeader.innerHTML = '';
        headerContainer.innerHTML = existingContent;
        
        // Add toggle button and container to header
        adminHeader.appendChild(headerContainer);
        headerContainer.appendChild(toggleBtn);

        // Create mobile backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'admin-mobile-backdrop';
        document.body.appendChild(backdrop);
    }

    enhanceAdminNavigation() {
        const adminNav = document.querySelector('.admin-nav');
        if (!adminNav) return;

        // Add mobile-specific classes and attributes
        adminNav.classList.add('admin-nav-mobile');
        
        // Enhance navigation links for mobile
        const navLinks = adminNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.setAttribute('role', 'menuitem');
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }

    addEventListeners() {
        const toggleBtn = document.getElementById('adminMobileToggle');
        const backdrop = document.querySelector('.admin-mobile-backdrop');
        const adminNav = document.querySelector('.admin-nav');

        if (!toggleBtn || !adminNav) return;

        // Toggle button click
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Backdrop click
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !adminNav.contains(e.target) && !toggleBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const adminNav = document.querySelector('.admin-nav');
        const toggleBtn = document.getElementById('adminMobileToggle');
        const backdrop = document.querySelector('.admin-mobile-backdrop');

        if (adminNav && toggleBtn) {
            adminNav.classList.add('active');
            toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            
            if (backdrop) {
                backdrop.classList.add('active');
            }

            document.body.style.overflow = 'hidden';
            this.isOpen = true;
        }
    }

    closeMenu() {
        const adminNav = document.querySelector('.admin-nav');
        const toggleBtn = document.getElementById('adminMobileToggle');
        const backdrop = document.querySelector('.admin-mobile-backdrop');

        if (adminNav && toggleBtn) {
            adminNav.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            
            if (backdrop) {
                backdrop.classList.remove('active');
            }

            document.body.style.overflow = '';
            this.isOpen = false;
        }
    }
}

// Enhanced AdminMobileEnhancements with Mobile Menu
class AdminMobileEnhancements {
    constructor() {
        this.isMobile = this.checkMobile();
        this.mobileMenu = new AdminMobileMenu();
        this.init();
    }

    init() {
        this.enhanceAdminNavigation();
        this.optimizeAdminForms();
        this.improveDataTables();
        this.enhanceImageUpload();
        this.addAdminSpecificListeners();
        
        // Initialize mobile menu
        this.mobileMenu.init();
    }

    checkMobile() {
        return window.innerWidth <= 768;
    }

    // Enhanced admin navigation for mobile
    enhanceAdminNavigation() {
        const adminTabs = document.querySelectorAll('.admin-tab');
        const adminNav = document.querySelector('.admin-nav');
        
        if (this.isMobile) {
            // Make tabs more touch-friendly
            adminTabs.forEach(tab => {
                tab.style.minHeight = '44px';
                tab.style.padding = '12px 15px';
                tab.style.display = 'flex';
                tab.style.alignItems = 'center';
            });

            // Improve admin nav links
            if (adminNav) {
                const navLinks = adminNav.querySelectorAll('a');
                navLinks.forEach(link => {
                    link.style.minHeight = '44px';
                    link.style.padding = '12px 15px';
                    link.style.display = 'flex';
                    link.style.alignItems = 'center';
                    link.style.justifyContent = 'center';
                });
            }
        }

        // Add swipe functionality for tabs on mobile
        this.addSwipeToTabs();
    }

    addSwipeToTabs() {
        if (!this.isMobile) return;

        const tabContent = document.querySelector('.tab-content.active');
        if (!tabContent) return;

        let touchStartX = null;

        tabContent.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        tabContent.addEventListener('touchend', (e) => {
            if (!touchStartX) return;

            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;

            if (Math.abs(diffX) > 50) {
                this.switchTabOnSwipe(diffX > 0);
            }

            touchStartX = null;
        });
    }

    switchTabOnSwipe(swipeLeft) {
        const tabs = Array.from(document.querySelectorAll('.admin-tab'));
        const activeTab = document.querySelector('.admin-tab.active');
        const currentIndex = tabs.indexOf(activeTab);

        let newIndex;
        if (swipeLeft) {
            // Swipe left - next tab
            newIndex = (currentIndex + 1) % tabs.length;
        } else {
            // Swipe right - previous tab
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }

        const newTab = tabs[newIndex];
        if (newTab) {
            newTab.click();
        }
    }

    // Optimize admin forms for mobile
    optimizeAdminForms() {
        const adminForms = document.querySelectorAll('#addPropertyForm, .admin-form');
        
        adminForms.forEach(form => {
            if (this.isMobile) {
                // Improve form layout for mobile
                const formGroups = form.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.style.marginBottom = '20px';
                });

                // Enhance form controls
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.style.minHeight = '44px';
                    input.style.padding = '12px 15px';
                    input.style.fontSize = '16px'; // Prevent zoom on iOS
                });

                // Improve file upload area
                const fileUpload = form.querySelector('.file-upload');
                if (fileUpload) {
                    fileUpload.style.minHeight = '120px';
                    fileUpload.style.padding = '20px 15px';
                }
            }
        });
    }

    // Improve data tables for mobile
    improveDataTables() {
        const dataTables = document.querySelectorAll('.data-table');
        
        dataTables.forEach(table => {
            if (this.isMobile) {
                // Make table scrollable
                const wrapper = table.closest('.data-table-wrapper') || table.parentElement;
                wrapper.style.overflowX = 'auto';
                wrapper.style.webkitOverflowScrolling = 'touch';
                
                // Improve table cell spacing
                const cells = table.querySelectorAll('th, td');
                cells.forEach(cell => {
                    cell.style.padding = '12px 8px';
                    cell.style.minWidth = '100px';
                });

                // Enhance action buttons
                const actionCells = table.querySelectorAll('.actions');
                actionCells.forEach(cell => {
                    const buttons = cell.querySelectorAll('.btn');
                    buttons.forEach(button => {
                        button.style.minHeight = '36px';
                        button.style.padding = '8px 12px';
                        button.style.margin = '2px';
                    });
                });
            }
        });
    }

    // Enhanced image upload for mobile
    enhanceImageUpload() {
        const imageUploadArea = document.getElementById('imageUploadArea');
        if (!imageUploadArea) return;

        if (this.isMobile) {
            // Improve touch area
            imageUploadArea.style.minHeight = '120px';
            imageUploadArea.style.padding = '25px 15px';
            
            // Add visual feedback for touch
            imageUploadArea.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.borderColor = '#1e90ff';
            });
            
            imageUploadArea.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 200);
            });
        }

        // Handle image previews for mobile
        this.optimizeImagePreviews();
    }

    optimizeImagePreviews() {
        const uploadedImagesContainer = document.getElementById('uploadedImages');
        if (!uploadedImagesContainer) return;

        if (this.isMobile) {
            // Adjust grid for mobile
            uploadedImagesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
            uploadedImagesContainer.style.gap = '8px';
            
            // Improve remove buttons
            const removeButtons = uploadedImagesContainer.querySelectorAll('.remove-image');
            removeButtons.forEach(button => {
                button.style.width = '28px';
                button.style.height = '28px';
                button.style.minWidth = '28px';
                button.style.minHeight = '28px';
            });
        }
    }

    // Admin-specific event listeners
    addAdminSpecificListeners() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleAdminOrientationChange();
            }, 300);
        });

        // Refresh admin layout on resize
        window.addEventListener('resize', () => {
            this.handleAdminResize();
        });

        // Improve admin statistics cards for mobile
        this.enhanceStatCards();
    }

    handleAdminOrientationChange() {
        // Re-initialize mobile enhancements
        const newIsMobile = this.checkMobile();
        if (this.isMobile !== newIsMobile) {
            this.isMobile = newIsMobile;
            this.init();
        }
    }

    handleAdminResize() {
        const newIsMobile = this.checkMobile();
        if (this.isMobile !== newIsMobile) {
            this.isMobile = newIsMobile;
            this.init();
        }
    }

    // Enhance statistics cards for mobile
    enhanceStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        
        if (this.isMobile) {
            statCards.forEach(card => {
                card.style.padding = '20px 15px';
                card.style.textAlign = 'center';
                
                const statNumber = card.querySelector('.stat-number');
                if (statNumber) {
                    statNumber.style.fontSize = '1.8rem';
                    statNumber.style.marginBottom = '8px';
                }
                
                const statLabel = card.querySelector('.stat-label');
                if (statLabel) {
                    statLabel.style.fontSize = '0.8rem';
                }
            });
        }
    }

    // Utility method to show mobile-optimized messages
    showMobileMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} mobile-message`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            font-weight: bold;
            max-width: 90%;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 0.9rem;
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
        }, 4000);
    }
}

// Enhanced mobile login for admin
class AdminMobileLogin {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.init();
    }

    init() {
        if (!this.loginForm) return;

        this.enhanceLoginForm();
        this.addLoginTouchEvents();
    }

    enhanceLoginForm() {
        // Improve form layout for mobile
        const inputs = this.loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.minHeight = '50px';
            input.style.padding = '15px';
            input.style.fontSize = '16px';
            input.style.marginBottom = '15px';
        });

        const submitBtn = this.loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.style.minHeight = '50px';
            submitBtn.style.padding = '15px';
            submitBtn.style.fontSize = '1rem';
            submitBtn.style.fontWeight = '600';
        }
    }

    addLoginTouchEvents() {
        const inputs = this.loginForm.querySelectorAll('input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#1e90ff';
                input.style.boxShadow = '0 0 0 2px rgba(30, 144, 255, 0.2)';
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            });
        });
    }
}

// Initialize admin mobile enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin mobile enhancements
    const adminMobile = new AdminMobileEnhancements();
    
    // Initialize admin mobile login
    const adminLogin = new AdminMobileLogin();

    // Add admin mobile styles
    addAdminMobileStyles();

    console.log('🛠️ Admin mobile enhancements initialized');
});

// Add admin mobile-specific styles
function addAdminMobileStyles() {
    const styles = `
        /* Admin mobile-specific enhancements */
        @media (max-width: 768px) {
            /* Admin header and mobile toggle */
            .admin-header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 15px;
            }
            
            .admin-mobile-toggle {
                display: flex !important;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 10px;
                transition: all 0.3s ease;
                z-index: 1001;
                -webkit-tap-highlight-color: transparent;
                min-height: 44px;
                min-width: 44px;
                align-items: center;
                justify-content: center;
            }
            
            .admin-mobile-toggle:hover {
                color: #1e90ff;
            }
            
            .admin-mobile-toggle.active {
                color: #1e90ff;
                transform: rotate(90deg);
            }
            
            /* Admin navigation */
            .admin-nav {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: #2c3e50;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                padding-top: 40px;
                transition: left 0.4s ease-in-out;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                z-index: 999;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                margin-top: 0;
            }
            
            .admin-nav.active {
                left: 0;
            }
            
            .admin-nav a {
                font-size: 1.1rem;
                padding: 16px 25px;
                width: 80%;
                text-align: center;
                border-radius: 30px;
                display: block;
                transition: all 0.3s ease;
                min-height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 8px 0;
            }
            
            .admin-nav a:hover,
            .admin-nav a:focus,
            .admin-nav a.active {
                background: #1e90ff;
                color: white;
                transform: scale(1.05);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            }
            
            /* Admin tabs */
            .admin-tabs {
                flex-direction: column;
                border-radius: 10px;
                overflow: hidden;
            }
            
            .admin-tab {
                padding: 15px;
                border-left: 4px solid transparent;
                border-bottom: none;
            }
            
            .admin-tab.active {
                border-left-color: #1e90ff;
                border-bottom-color: transparent;
            }
            
            /* Statistics grid */
            .admin-stats {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .stat-card {
                padding: 20px 15px;
            }
            
            /* Data tables */
            .data-table-wrapper {
                margin: 0 10px;
                border-radius: 8px;
            }
            
            .data-table {
                min-width: 600px; /* Allow horizontal scroll */
            }
            
            .data-table th,
            .data-table td {
                padding: 10px 8px;
                font-size: 0.8rem;
            }
            
            /* Forms */
            .admin-form {
                padding: 20px 15px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            /* Image upload */
            .file-upload {
                margin: 0 10px;
                padding: 20px 15px;
            }
            
            .uploaded-images {
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 10px;
                padding: 0 10px;
            }
            
            /* Inquiry items */
            .inquiry-item {
                padding: 15px 12px;
                flex-direction: column;
                gap: 12px;
            }
            
            .inquiry-actions {
                flex-direction: column;
                width: 100%;
            }
            
            /* Property items */
            .property-item {
                flex-direction: column;
                gap: 15px;
            }
            
            .property-actions {
                width: 100%;
                flex-direction: column;
                gap: 10px;
            }
            
            .property-actions .btn {
                width: 100%;
                text-align: center;
            }
        }
        
        /* Very small admin screens */
        @media (max-width: 480px) {
            .admin-header {
                padding: 12px 0;
            }
            
            .login-container {
                margin: 30px 15px;
                padding: 25px 20px;
            }
            
            .admin-panel {
                padding: 20px 15px;
                margin: 20px 0;
            }
            
            .admin-nav a {
                font-size: 1rem;
                padding: 14px 20px;
            }
        }
        
        /* Admin mobile message styles */
        .mobile-message {
            animation: slideInDown 0.3s ease;
        }
        
        @keyframes slideInDown {
            from {
                transform: translate(-50%, -100%);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
        
        /* Admin mobile backdrop */
        .admin-mobile-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 998;
            display: none;
        }
        
        .admin-mobile-backdrop.active {
            display: block;
        }
        
        /* Safe area insets for admin */
        @supports(padding: max(0px)) {
            .admin-header,
            .admin-nav,
            .admin-stats,
            .admin-tabs,
            .tab-content {
                padding-left: max(15px, env(safe-area-inset-left));
                padding-right: max(15px, env(safe-area-inset-right));
            }
            
            .login-container {
                margin-left: max(15px, env(safe-area-inset-left));
                margin-right: max(15px, env(safe-area-inset-right));
            }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
            .admin-nav a:hover,
            .admin-mobile-toggle:hover {
                transform: none;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}