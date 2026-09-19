document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Mobile Menu Toggle
    // -------------------------------------------------------------
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on navigation click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // -------------------------------------------------------------
    // Scroll Spy: Active Link Highlighting
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // -------------------------------------------------------------
    // Number Counter Animation for Mission Stats
    // -------------------------------------------------------------
    let countersAnimated = false;
    const statSection = document.querySelector('.mission-section');

    function animateNumbers() {
        if (countersAnimated) return;
        countersAnimated = true;

        const counters = document.querySelectorAll('.stat-number');
        const duration = 1200; // ms

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const currentVal = Math.floor(easeProgress * target);

                counter.textContent = currentVal;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    if (statSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(statSection);
    }

    // -------------------------------------------------------------
    // Contact Form Submission (Asynchronous Formspree Handling)
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedbackBox = document.getElementById('form-feedback');

    if (contactForm && submitBtn && feedbackBox) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>PROCESANDO...</span> <i class="fas fa-spinner fa-spin"></i>';
            feedbackBox.style.display = 'none';
            feedbackBox.className = 'form-feedback';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    feedbackBox.className = 'form-feedback success';
                    feedbackBox.innerHTML = '⚡ ¡MENSAJE ENVIADO CON ÉXITO! Nos pondremos en contacto contigo a la brevedad.';
                    feedbackBox.style.display = 'block';
                } else {
                    const data = await response.json();
                    feedbackBox.className = 'form-feedback error';
                    feedbackBox.innerHTML = data.errors ? data.errors.map(err => err.message).join(", ") : 'Ocurrió un error al enviar el formulario. Intenta de nuevo.';
                    feedbackBox.style.display = 'block';
                }
            } catch (err) {
                feedbackBox.className = 'form-feedback error';
                feedbackBox.innerHTML = '⚠️ Error de conexión. Por favor verifica tu red e intenta nuevamente.';
                feedbackBox.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }
});
