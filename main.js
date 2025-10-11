document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('earlyAccessForm');
    const formContainer = document.querySelector('.access-form');
    const successMessage = document.getElementById('formSuccess');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            role: formData.get('role'),
            companySize: formData.get('company-size'),
            clouds: formData.getAll('cloud'),
            topPain: formData.get('top-pain'),
            consent: formData.get('consent'),
            timestamp: new Date().toISOString()
        };

        console.log('Form submitted:', data);

        if (typeof gtag !== 'undefined') {
            gtag('event', 'submit_early_access', {
                role: data.role,
                company_size: data.companySize
            });
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

    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                const location = this.closest('.hero') ? 'hero' : 'other';
                gtag('event', 'click_cta_' + location + '_primary');
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.problem-item, .capability-card, .step, .playbook-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    let lastScroll = 0;
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            nav.style.transform = 'translateY(0)';
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
});
