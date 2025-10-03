// Mobile Responsiveness Enhancements for Zalseef Estates

class MobileEnhancements {
    constructor() {
        this.isMobile = this.checkMobile();
        this.touchStartX = null;
        this.touchStartY = null;
        this.init();
    }

    init() {
        this.enhanceTouchInteractions();
        this.optimizeFormsForMobile();
        this.enhanceModalForMobile();
        this.improveNavigation();
        this.optimizeImages();
        this.addMobileSpecificEventListeners();
        this.preventZoomOnInput();
        this.enhanceSwipeGestures();
    }

    checkMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Enhanced touch interactions
    enhanceTouchInteractions() {
        // Improve button touch feedback
        const buttons = document.querySelectorAll('button, .btn, a.btn, .nav-menu a');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.97)';
                this.style.transition = 'transform 0.1s ease';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });

            // Prevent highlight on touch
            button.style.webkitTapHighlightColor = 'transparent';
        });

        // Enhanced property card interactions
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Optimize forms for mobile
    optimizeFormsForMobile() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add proper input types for mobile keyboards
            const telInputs = form.querySelectorAll('input[type="tel"]');
            telInputs.forEach(input => {
                input.setAttribute('inputmode', 'tel');
                input.setAttribute('pattern', '[0-9]*');
            });

            const emailInputs = form.querySelectorAll('input[type="email"]');
            emailInputs.forEach(input => {
                input.setAttribute('inputmode', 'email');
            });

            // Improve form spacing on mobile
            if (this.isMobile) {
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.style.minHeight = '44px';
                    input.style.padding = '12px 15px';
                });
            }
        });
    }

    // Enhanced modal for mobile
    enhanceModalForMobile() {
        const modal = document.getElementById('propertyModal');
        if (!modal) return;

        // Make modal more mobile-friendly
        if (this.isMobile) {
            modal.style.alignItems = 'flex-start';
            modal.style.paddingTop = '20px';
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.margin = '10px';
                modalContent.style.maxHeight = '90vh';
                modalContent.style.overflowY = 'auto';
                modalContent.style.webkitOverflowScrolling = 'touch';
            }
        }

        // Close modal on background tap
        modal.addEventListener('touchstart', (e) => {
            if (e.target === modal) {
                window.closeModal();
            }
        });
    }

    // Improved navigation for mobile
    improveNavigation() {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (!navMenu || !mobileMenuBtn) return;

        // Close menu when tapping outside
        document.addEventListener('touchstart', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                window.closeMobileMenu();
            }
        });

        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isMobile && navMenu.classList.contains('active')) {
                    window.closeMobileMenu();
                }
            });
        });
    }

    // Optimize images for mobile
    optimizeImages() {
        if (!this.isMobile) return;

        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Lazy loading for mobile
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Ensure images don't overflow
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });

        // Optimize hero images
        const heroSlides = document.querySelectorAll('.hero-slide');
        heroSlides.forEach(slide => {
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
        });
    }

    // Mobile-specific event listeners
    addMobileSpecificEventListeners() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 300);
        });

        // Handle viewport changes
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Prevent bounce scroll on iOS
        document.addEventListener('touchmove', (e) => {
            if (e.target.classList.contains('modal-content')) {
                e.stopPropagation();
            }
        }, { passive: false });
    }

    handleOrientationChange() {
        // Refresh any layout-dependent elements
        const modal = document.getElementById('propertyModal');
        if (modal && modal.style.display === 'block') {
            window.closeModal();
            setTimeout(() => {
                // Reopen modal if needed
            }, 100);
        }
    }

    handleResize() {
        const newIsMobile = this.checkMobile();
        if (this.isMobile !== newIsMobile) {
            this.isMobile = newIsMobile;
            // Re-apply mobile optimizations if needed
            this.optimizeImages();
        }
    }

    // Prevent zoom on input focus (iOS)
    preventZoomOnInput() {
        if (!this.isMobile) return;

        let lastTouchEnd = 0;
        
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Prevent double-tap zoom
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
    }

    // Enhanced swipe gestures for mobile
    enhanceSwipeGestures() {
        if (!this.isMobile) return;

        // Swipe to close modal
        const modal = document.getElementById('propertyModal');
        if (modal) {
            modal.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;
            });

            modal.addEventListener('touchmove', (e) => {
                if (!this.touchStartX || !this.touchStartY) return;

                const touchEndX = e.touches[0].clientX;
                const touchEndY = e.touches[0].clientY;
                
                const diffX = this.touchStartX - touchEndX;
                const diffY = this.touchStartY - touchEndY;

                // Only consider horizontal swipe with minimal vertical movement
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && Math.abs(diffY) < 30) {
                    if (diffX > 0) {
                        // Swipe left - close modal
                        window.closeModal();
                    }
                }
            });

            modal.addEventListener('touchend', () => {
                this.touchStartX = null;
                this.touchStartY = null;
            });
        }

        // Swipe for hero slideshow on mobile
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            });

            hero.addEventListener('touchend', (e) => {
                if (!this.touchStartX) return;

                const touchEndX = e.changedTouches[0].clientX;
                const diffX = this.touchStartX - touchEndX;

                if (Math.abs(diffX) > 50) {
                    // You could add swipe navigation for hero slides here
                    console.log('Hero swipe detected:', diffX > 0 ? 'left' : 'right');
                }

                this.touchStartX = null;
            });
        }
    }

    // Utility method to check if element is in viewport
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Load critical elements first
    prioritizeCriticalContent() {
        if (this.isMobile && 'connection' in navigator) {
            const connection = navigator.connection;
            if (connection.saveData || connection.effectiveType.includes('2g')) {
                // Data saver mode or slow connection
                this.enableDataSaverMode();
            }
        }
    }

    enableDataSaverMode() {
        // Defer non-critical images
        const nonCriticalImages = document.querySelectorAll('img:not(.hero-slide img)');
        nonCriticalImages.forEach(img => {
            if (!this.isElementInViewport(img)) {
                img.setAttribute('loading', 'lazy');
                img.setAttribute('decoding', 'async');
            }
        });
    }
}

// Enhanced Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.navMenu = document.getElementById('navMenu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.menuBtn || !this.navMenu) return;

        this.enhanceAccessibility();
        this.addTouchEvents();
    }

    enhanceAccessibility() {
        this.menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        this.menuBtn.setAttribute('aria-controls', 'navMenu');
    }

    addTouchEvents() {
        // Improved touch handling
        this.menuBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        this.menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Close menu when tapping on overlay
        this.navMenu.addEventListener('touchstart', (e) => {
            if (e.target === this.navMenu) {
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
        this.navMenu.classList.add('active');
        this.menuBtn.innerHTML = '<i class="fas fa-times"></i>';
        this.menuBtn.classList.add('active');
        this.menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;

        // Add backdrop
        this.addBackdrop();
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        this.menuBtn.classList.remove('active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        this.isOpen = false;

        // Remove backdrop
        this.removeBackdrop();
    }

    addBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 998;
            display: block;
        `;
        backdrop.addEventListener('click', () => this.closeMenu());
        document.body.appendChild(backdrop);
    }

    removeBackdrop() {
        const backdrop = document.querySelector('.mobile-menu-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
}

// Enhanced Form Handling for Mobile
class MobileFormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.enhanceFormInputs();
        this.addFormValidation();
        this.optimizeFormSubmission();
    }

    enhanceFormInputs() {
        this.forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Add proper attributes for mobile
                if (input.type === 'tel') {
                    input.setAttribute('inputmode', 'tel');
                    input.setAttribute('pattern', '[0-9]*');
                }
                
                if (input.type === 'email') {
                    input.setAttribute('inputmode', 'email');
                }
                
                if (input.type === 'number') {
                    input.setAttribute('inputmode', 'numeric');
                    input.setAttribute('pattern', '[0-9]*');
                }

                // Improve touch targets
                input.style.minHeight = '44px';
                input.style.padding = '12px 15px';

                // Add focus styles
                input.addEventListener('focus', () => {
                    input.style.borderColor = '#1e90ff';
                    input.style.boxShadow = '0 0 0 2px rgba(30, 144, 255, 0.2)';
                });

                input.addEventListener('blur', () => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });
            });
        });
    }

    addFormValidation() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.validateField(input);
                });

                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(input);

        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (input.type === 'tel' && value) {
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showFieldError(input, errorMessage);
        }

        return isValid;
    }

    showFieldError(input, message) {
        input.style.borderColor = '#dc3545';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 5px;
            display: block;
        `;
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.style.borderColor = '';
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showFormErrors(form) {
        const firstInvalid = form.querySelector('.field-error');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    optimizeFormSubmission() {
        this.forms.forEach(form => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.style.minHeight = '44px';
                submitBtn.style.minWidth = '44px';
            }
        });
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

// Initialize all mobile enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile enhancements
    const mobileEnhancements = new MobileEnhancements();
    
    // Initialize mobile menu
    const mobileMenu = new MobileMenu();
    
    // Initialize mobile form handler
    const mobileFormHandler = new MobileFormHandler();

    // Add mobile-specific CSS
    addMobileStyles();

    console.log('🚀 Mobile enhancements initialized');
});

// Add mobile-specific styles dynamically
function addMobileStyles() {
    const styles = `
        /* Mobile-specific enhancements */
        @media (max-width: 768px) {
            /* Improve touch targets */
            .btn, .nav-menu a, button {
                min-height: 44px;
                min-width: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            /* Prevent text size adjustment */
            input, select, textarea {
                font-size: 16px !important;
            }
            
            /* Smooth scrolling for mobile */
            html {
                scroll-behavior: smooth;
            }
            
            /* Improve modal for mobile */
            .modal-content {
                margin: 10px;
                max-height: 90vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            /* Enhanced property cards */
            .property-card {
                margin: 0 auto;
                max-width: 100%;
            }
            
            /* Better form spacing */
            .form-group {
                margin-bottom: 20px;
            }
            
            /* Improve navigation */
            .nav-menu.active {
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
        }
        
        /* Very small screens */
        @media (max-width: 480px) {
            .container {
                padding: 0 15px;
            }
            
            section {
                padding: 40px 15px;
            }
            
            .hero h1 {
                font-size: 1.8rem;
            }
            
            .btn {
                width: 100%;
                max-width: 280px;
                margin: 5px auto;
            }
        }
        
        /* Landscape orientation */
        @media (max-height: 500px) and (orientation: landscape) {
            .hero {
                height: auto;
                min-height: 100vh;
                padding: 100px 20px 50px;
            }
            
            .nav-menu {
                height: calc(100vh - 70px);
                padding-top: 20px;
            }
        }
        
        /* Loading state for mobile */
        .loading {
            position: relative;
            pointer-events: none;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        
        /* Safe area insets for notch devices */
        @supports(padding: max(0px)) {
            .container, section {
                padding-left: max(15px, env(safe-area-inset-left));
                padding-right: max(15px, env(safe-area-inset-right));
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileEnhancements, MobileMenu, MobileFormHandler };
}