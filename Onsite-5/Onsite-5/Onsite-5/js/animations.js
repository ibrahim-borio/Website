// animations.js - SUPER POWERFUL ANIMATIONS
(function () {
    'use strict';

    const navbar = document.querySelector('.custom-navbar');
    const hero = document.querySelector('.hero');
    const animatedElements = document.querySelectorAll('.product-item, .feature, .service');
    const buttons = document.querySelectorAll('.btn');
    const testimonialSlider = document.querySelector('.testimonial-slider');

    // ===== 1. NAVBAR SCROLL EFFECT =====
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.padding = '10px 0';
                navbar.style.background = 'rgba(59, 93, 80, 0.95)';
                navbar.classList.add('scrolled');
            } else {
                navbar.style.padding = '20px 0';
                navbar.style.background = '#3b5d50';
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ===== 2. INTERSECTION OBSERVER (لظهور العناصر مع تأثيرات) =====
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';

                    // تأثير إضافي عند الظهور
                    entry.target.style.animation = 'pulseGlow 1s ease';
                    setTimeout(() => {
                        entry.target.style.animation = '';
                    }, 1000);

                    observer.unobserve(entry.target); // مرة واحدة فقط
                }
            });
        }, { threshold: 0.2, rootMargin: '0px' });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.97)';
            el.style.transition = 'opacity 1s cubic-bezier(0.165, 0.84, 0.44, 1), transform 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
            observer.observe(el);
        });
    }

    // ===== 3. MAGNETIC BUTTON EFFECT =====
    const magneticElements = document.querySelectorAll('.btn, .product-item, .feature');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.03)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // ===== 4. RIPPLE EFFECT ON CLICK =====
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) * 2 + 'px';
            ripple.style.left = e.clientX - rect.left - ripple.offsetWidth / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - ripple.offsetHeight / 2 + 'px';
            ripple.style.background = 'rgba(255,255,255,0.7)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.8s, opacity 0.8s';
            ripple.style.zIndex = '10';
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.style.transform = 'scale(3)';
                ripple.style.opacity = '0';
            }, 10);
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });

    // ===== 5. 3D TILT EFFECT ON CARDS =====
    const cards = document.querySelectorAll('.product-item, .feature, .service');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 15;
            const angleY = (centerX - x) / 15;
            card.style.transform = `perspective(1500px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px) scale(1.03)`;
            card.style.transition = 'transform 0.1s';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s';
        });
    });

    // ===== 6. PARALLAX FOR HERO =====
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = `-${scrolled * 0.25}px`;
                const heroImg = document.querySelector('.hero-img-wrap img');
                if (heroImg) {
                    heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
                }
            }
        }, { passive: true });
    }

    // ===== 7. SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== 8. RESIZE DEBOUNCE =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });

    // ===== 9. AOS INIT =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            once: false,
            mirror: true,
            easing: 'cubic-bezier(0.25, 0.1, 0.15, 1.2)',
            offset: 150
        });
    }

    // ===== 10. SOCIAL ICONS HOVER =====
    const socialIcons = document.querySelectorAll('.custom-social a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.3)';
        });
        icon.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ===== 11. IMAGE ZOOM ON HOVER =====
    const zoomImages = document.querySelectorAll('.product-item img, .img-wrap img');
    zoomImages.forEach(img => {
        img.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.15)';
            this.style.transition = 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
        });
        img.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ===== 12. BLOG SECTION CINEMATIC REVEAL =====
    const blogCards = document.querySelectorAll('.blog-section .post-entry');
    if (blogCards.length > 0) {
        blogCards.forEach((card, index) => {
            card.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 90}ms`);

            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 992) return;
                const rect = card.getBoundingClientRect();
                const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
                const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                card.style.transform = `perspective(1500px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-14px) scale(1.015)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        if ('IntersectionObserver' in window) {
            const blogObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('blog-entry-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

            blogCards.forEach(card => blogObserver.observe(card));
        } else {
            blogCards.forEach(card => card.classList.add('blog-entry-visible'));
        }
    }

    // ===== 13. MOBILE MENU CLOSE =====
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }

    // ===== 14. COUNT UP ANIMATION =====
    const counters = document.querySelectorAll('.product-price, .price');
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.innerText.replace('$', '').replace(',', ''));
                    if (isNaN(target)) return;

                    let start = 0;
                    const step = target / 60;
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= target) {
                            counter.innerText = '$' + target.toFixed(2);
                            clearInterval(timer);
                            counter.style.transform = 'scale(1.2)';
                            setTimeout(() => counter.style.transform = '', 200);
                        } else {
                            counter.innerText = '$' + start.toFixed(2);
                        }
                    }, 15);

                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

})();
