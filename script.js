document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
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

        // Close mobile menu on click
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger number animation if it's the mission section
                if (entry.target.classList.contains('mission-content')) {
                    animateNumbers();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .fade-in-left').forEach(el => {
        observer.observe(el);
    });

    // Number Counter Animation
    let animated = false;
    function animateNumbers() {
        if (animated) return;
        animated = true;
        
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // lower is slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
    
    // Form submission prevent default with UX
    const form = document.querySelector('.contact-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            
            // Send request to Formspree
            fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    btn.innerText = 'Mensaje Enviado ✓';
                    btn.style.backgroundColor = 'var(--color-turquoise)';
                    form.reset();
                } else {
                    btn.innerText = 'Error al enviar';
                    btn.style.backgroundColor = '#FF6B35';
                }
            }).catch(error => {
                btn.innerText = 'Error de red';
                btn.style.backgroundColor = '#FF6B35';
            }).finally(() => {
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                }, 3000);
            });
        });
    }

    // Image Rotation Animation
    const floatingImages = Array.from(document.querySelectorAll('.floating-img'));
    if (floatingImages.length > 0) {
        setInterval(() => {
            const currentClasses = floatingImages.map(img => {
                if (img.classList.contains('img-front')) return 'img-front';
                if (img.classList.contains('img-back-left')) return 'img-back-left';
                if (img.classList.contains('img-back-right')) return 'img-back-right';
                return '';
            });
            
            floatingImages.forEach((img, index) => {
                const currentClass = currentClasses[index];
                if (!currentClass) return;
                
                img.classList.remove('img-front', 'img-back-left', 'img-back-right');
                
                if (currentClass === 'img-front') {
                    img.classList.add('img-back-left');
                } else if (currentClass === 'img-back-left') {
                    img.classList.add('img-back-right');
                } else if (currentClass === 'img-back-right') {
                    img.classList.add('img-front');
                }
            });
        }, 5000);
    }
});
