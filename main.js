document.addEventListener('DOMContentLoaded', function() {
    // Event tracking function
    function track(eventName, props = {}) {
        console.log('event:', eventName, props);
    }

    // Add event tracking to all elements with data-event
    document.querySelectorAll('[data-event]').forEach(el => {
        el.addEventListener('click', () => {
            track(el.dataset.event);
        });
    });

    // Reveal on scroll animation
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('reveal');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.problem, .capabilities, .how-it-works, .playbooks, .security, .install-footprint, .capability-card, .playbook-card').forEach(el => {
        el.classList.add('pre-reveal');
        io.observe(el);
    });

    // Nav scroll behavior - hide on scroll down, show on scroll up
    let lastScroll = 0;
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 0) {
            nav.classList.remove('is-scrolling');
            nav.style.transform = 'translateY(0)';
            return;
        }

        if (currentScroll > 0) {
            nav.classList.add('is-scrolling');
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    const form = document.getElementById('earlyAccessForm');
    const formContainer = document.querySelector('.access-form');
    const successMessage = document.getElementById('formSuccess');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email')?.trim();
        const role = formData.get('role');
        const pain = formData.get('top-pain')?.trim() || '';
        const wantsDesignPartner = formData.get('design-partner');

        // Validate required fields
        if (!email || !role) {
            alert('Email and role are required.');
            return;
        }

        // Validate pain field length if filled
        if (pain && pain.length < 10) {
            alert('Tell us your pain in ~10+ characters.');
            return;
        }

        const data = {
            email: email,
            role: role,
            companySize: formData.get('company-size'),
            clouds: formData.getAll('cloud'),
            topPain: pain,
            designPartner: wantsDesignPartner ? true : false,
            consent: formData.get('consent'),
            timestamp: new Date().toISOString()
        };

        console.log('Form submitted:', data);
        track('form_submit_success', { role: data.role });

        // If wants design partner pricing, open Calendly
        if (wantsDesignPartner) {
            window.open('https://calendly.com/deeplineanalytics/30min', '_blank', 'noopener');
        }

        formContainer.style.display = 'none';
        successMessage.style.display = 'block';

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
    });

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'Navigation',
                        event_label: href
                    });
                }
            }
        });
    });

});
