/**
 * ================================================================
 * PROFESSEUR CHEICK CHERIF - MARABOUT VOYANT MÉDIUM À PARIS
 * JavaScript Principal - Landing Page (VERSION CORRIGÉE)
 * ================================================================
 */

(function() {
    'use strict';

    // ================================================================
    // 1. DOM ELEMENTS
    // ================================================================
    
    const DOM = {
        // Header & Navigation
        header: document.querySelector('.header'),
        navToggle: document.querySelector('.nav-toggle'),
        navMobile: document.querySelector('.nav-mobile'),
        navLinks: document.querySelectorAll('.nav-link, .nav-mobile a'),
        
        // FAQ
        faqItems: document.querySelectorAll('.faq-item'),
        faqQuestions: document.querySelectorAll('.faq-question'),
        
        // Animations
        fadeElements: document.querySelectorAll('.fade-in'),
        
        // WhatsApp & Scroll
        whatsappFloat: document.querySelector('.whatsapp-float'),
        scrollToTopBtn: document.getElementById('scrollToTop'),
        
        // Year
        currentYearSpans: document.querySelectorAll('.current-year')
    };

    // ================================================================
    // 2. HEADER SCROLL EFFECT
    // ================================================================
    
    function initHeaderScroll() {
        if (!DOM.header) return;
        
        let lastScroll = 0;
        let ticking = false;
        
        function updateHeader() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 50) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ================================================================
    // 3. MOBILE NAVIGATION - CORRIGÉ
    // ================================================================
    
    function initMobileNav() {
        if (!DOM.navToggle) return;
        
        // Créer le menu mobile s'il n'existe pas
        let navMobile = DOM.navMobile;
        if (!navMobile) {
            navMobile = document.createElement('div');
            navMobile.className = 'nav-mobile';
            navMobile.innerHTML = `
                <a href="#accueil">Accueil</a>
                <a href="#lignee">La Lignée</a>
                <a href="#services">Services</a>
                <a href="#methode">Ma Méthode</a>
                <a href="#temoignages">Témoignages</a>
                <a href="#zones">Zones</a>
                <a href="#faq">FAQ</a>
                <a href="#contact">Contact</a>
            `;
            document.body.appendChild(navMobile);
        }
        
        // Toggle menu
        DOM.navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = this.classList.contains('active');
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        function openMenu() {
            DOM.navToggle.classList.add('active');
            navMobile.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMenu() {
            DOM.navToggle.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Fermer au clic sur un lien
        navMobile.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMobile.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Fermer au clic extérieur
        navMobile.addEventListener('click', function(e) {
            if (e.target === navMobile) {
                closeMenu();
            }
        });
    }

    // ================================================================
    // 4. SMOOTH SCROLL
    // ================================================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ================================================================
    // 5. FAQ ACCORDION - CORRIGÉ
    // ================================================================
    
    function initFaqAccordion() {
        if (!DOM.faqQuestions.length) return;
        
        DOM.faqQuestions.forEach(function(question) {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                const answer = faqItem.querySelector('.faq-answer');
                
                // Fermer tous les autres
                DOM.faqItems.forEach(function(item) {
                    if (item !== faqItem) {
                        item.classList.remove('active');
                        const itemQuestion = item.querySelector('.faq-question');
                        if (itemQuestion) {
                            itemQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle l'item actuel
                if (isActive) {
                    faqItem.classList.remove('active');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    faqItem.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
            
            // Support clavier
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // ================================================================
    // 6. FADE-IN ON SCROLL (Intersection Observer)
    // ================================================================
    
    function initFadeInObserver() {
        if (!DOM.fadeElements.length) return;
        
        // Vérifier le support
        if (!('IntersectionObserver' in window)) {
            // Fallback: tout afficher
            DOM.fadeElements.forEach(function(el) {
                el.classList.add('visible');
            });
            return;
        }
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        DOM.fadeElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ================================================================
    // 7. SCROLL TO TOP BUTTON - NOUVEAU
    // ================================================================
    
    function initScrollToTop() {
        const btn = DOM.scrollToTopBtn;
        if (!btn) return;
        
        let ticking = false;
        
        function updateButtonVisibility() {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
            
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateButtonVisibility);
                ticking = true;
            }
        }, { passive: true });
        
        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ================================================================
    // 8. WHATSAPP VISIBILITY
    // ================================================================
    
    function initWhatsappVisibility() {
        if (!DOM.whatsappFloat) return;
        
        let ticking = false;
        
        function updateVisibility() {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 300) {
                DOM.whatsappFloat.style.opacity = '1';
                DOM.whatsappFloat.style.visibility = 'visible';
            } else {
                DOM.whatsappFloat.style.opacity = '0.7';
            }
            
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateVisibility);
                ticking = true;
            }
        }, { passive: true });
    }

    // ================================================================
    // 9. LAZY LOADING IMAGES
    // ================================================================
    
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if (!lazyImages.length) return;
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ================================================================
    // 10. PHONE LINK TRACKING
    // ================================================================
    
    function initPhoneTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Analytics tracking (si disponible)
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        event_category: 'Contact',
                        event_label: 'Phone Call',
                        value: 1
                    });
                }
                
                console.log('[Tracking] Appel téléphonique initié');
            });
        });
    }

    // ================================================================
    // 11. WHATSAPP LINK TRACKING
    // ================================================================
    
    function initWhatsappTracking() {
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        
        whatsappLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Analytics tracking (si disponible)
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        event_category: 'Contact',
                        event_label: 'WhatsApp',
                        value: 1
                    });
                }
                
                console.log('[Tracking] WhatsApp contact initié');
            });
        });
    }

    // ================================================================
    // 12. CURRENT YEAR UPDATE
    // ================================================================
    
    function initCurrentYear() {
        if (!DOM.currentYearSpans.length) return;
        
        const year = new Date().getFullYear();
        
        DOM.currentYearSpans.forEach(function(span) {
            span.textContent = year;
        });
    }

    // ================================================================
    // 13. REDUCED MOTION CHECK
    // ================================================================
    
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
    }

    // ================================================================
    // 14. HERO PARTICLES (Optional decoration)
    // ================================================================
    
    function initHeroParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;
        
        // Vérifier reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        // Créer quelques particules décoratives
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
        
        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ================================================================
    // 15. CONSOLE BRANDING
    // ================================================================
    
    function initConsoleBranding() {
        console.log(
            '%c☽ Professeur Cheick Cherif %c Marabout Voyant Médium à Paris ',
            'background: #1a0a2e; color: #d4af37; padding: 10px 15px; font-size: 14px; font-weight: bold;',
            'background: #d4af37; color: #1a0a2e; padding: 10px 15px; font-size: 14px;'
        );
        console.log('%c📞 Contact: 06 02 79 68 03', 'color: #25D366; font-size: 12px;');
    }

    // ================================================================
    // 16. INITIALIZATION
    // ================================================================
    
    function init() {
        // Vérifier les préférences utilisateur
        checkReducedMotion();
        
        // Initialiser tous les modules
        initHeaderScroll();
        initMobileNav();
        initSmoothScroll();
        initFaqAccordion();
        initFadeInObserver();
        initScrollToTop();
        initWhatsappVisibility();
        initLazyLoading();
        initPhoneTracking();
        initWhatsappTracking();
        initCurrentYear();
        initHeroParticles();
        initConsoleBranding();
        
        console.log('[Cheick Cherif] Site initialisé avec succès');
    }

    // Lancer l'initialisation au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
