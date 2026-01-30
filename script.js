document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Handling
    const preloader = document.getElementById('preloader');

    // Simulate loading time for effect (looks premium)
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.8s ease';

        setTimeout(() => {
            preloader.style.display = 'none';
            // Trigger Hero animations after loader is gone
            triggerHeroAnimations();
        }, 800);
    }, 2000);

    // 2. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    /* 
     * IMPORTANT: The icon is from FontAwesome. 
     * We depend on the HTML implementation to have <i class="fas fa-bars"></i>
     */

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').classList.remove('fa-times');
                    mobileToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // 4. Scroll Animations (Fade Up)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to save performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // 5. Hero Animations Helper
    function triggerHeroAnimations() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroBtn = document.querySelector('.hero .btn');

        if (heroTitle) heroTitle.classList.add('visible');

        setTimeout(() => {
            if (heroSubtitle) heroSubtitle.classList.add('visible');
        }, 300);

        setTimeout(() => {
            if (heroBtn) heroBtn.classList.add('visible');
        }, 600);
    }

    // 6. Dynamic Copyright Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 7. WhatsApp Form Handling
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            const inputs = bookingForm.querySelectorAll('input, select');
            const name = inputs[0].value;
            const phone = inputs[1].value;
            const packageSelected = inputs[2].value;

            // Construct WhatsApp Message
            const message = `*New Booking Request*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Interested In:* ${packageSelected}%0A%0APlease provide more details.`;

            // WhatsApp API URL
            const whatsappUrl = `https://wa.me/919272174699?text=${message}`;

            // Open in new tab
            window.open(whatsappUrl, '_blank');
        });
    }
});
