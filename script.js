const ready = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

ready(() => {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];
    const scrollButton = document.querySelector('.hero__scroll');
    const yearNode = document.querySelector('[data-year]');
    const animateTargets = document.querySelectorAll('[data-animate]');
    const form = document.querySelector('.form');

    const isStaticNav = nav?.hasAttribute('data-nav-static');

    const closeMenu = () => {
        if (!navMenu) return;
        navMenu.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
    };

    navToggle?.addEventListener('click', () => {
        const isOpen = navMenu?.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    const handleNavState = () => {
        if (!nav || isStaticNav) return;
        if (window.scrollY > 40) {
            nav.classList.add('nav--solid');
        } else {
            nav.classList.remove('nav--solid');
        }
    };

    handleNavState();
    window.addEventListener('scroll', handleNavState, { passive: true });

    if (scrollButton) {
        scrollButton.addEventListener('click', () => {
            const target = document.querySelector('#solutions');
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }

    if ('IntersectionObserver' in window && animateTargets.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 },
        );

        animateTargets.forEach((el) => observer.observe(el));
    } else {
        animateTargets.forEach((el) => el.classList.add('is-visible'));
    }

    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const statusNode = form.querySelector('[data-form-status]');
        const originalText = submitBtn?.textContent ?? 'Submit';
        const endpoint = form.dataset.endpoint || '/api/demo-request';

        const setStatus = (message, variant = 'neutral') => {
            if (!statusNode) return;
            statusNode.textContent = message;
            statusNode.dataset.variant = variant;
        };

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!submitBtn) return;

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            payload.message = payload.message?.trim();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            setStatus('Sending your request…');

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || data.error) {
                    throw new Error(data.error || 'Unable to submit form');
                }

                submitBtn.textContent = 'Sent ✈️';
                setStatus('Thanks! Our team will reach out shortly.', 'success');
                form.reset();
            } catch (error) {
                console.error('Form submission failed', error);
                submitBtn.textContent = 'Try again';
                setStatus('We couldn\'t send your request. Please retry or email hello@aerotrofix.com.', 'error');
            } finally {
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2600);
            }
        });
    }
});
