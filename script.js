document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Header Sticky Effect & Blur on Scroll
    // -------------------------------------------------------------
    const header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 25) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // -------------------------------------------------------------
    // 2. Mobile Menu Toggle & Navigation
    // -------------------------------------------------------------
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('navMenu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            mobileBtn.classList.toggle('active', isActive);
            mobileBtn.setAttribute('aria-expanded', isActive);
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // -------------------------------------------------------------
    // 3. Scroll Spy: Active Link Highlighting
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPosition = window.pageYOffset + 140;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // -------------------------------------------------------------
    // 4. HERO 3D SWIPE STACK CAROUSEL (img1, img2, img3)
    // -------------------------------------------------------------
    const swipeStage = document.getElementById('heroSwipeStage');
    const cards = Array.from(document.querySelectorAll('.swipe-card'));
    const indicatorPills = Array.from(document.querySelectorAll('.indicator-pill'));
    const prevBtn = document.getElementById('swipePrevBtn');
    const nextBtn = document.getElementById('swipeNextBtn');

    if (cards.length === 3) {
        let currentIndex = 0;
        let isAnimating = false;
        let autoPlayTimer = null;

        function updateStack(direction = 'next') {
            if (isAnimating) return;
            isAnimating = true;

            const outgoingIndex = (direction === 'next') 
                ? (currentIndex - 1 + cards.length) % cards.length 
                : (currentIndex + 1) % cards.length;

            const outgoingCard = cards[outgoingIndex];
            if (outgoingCard) {
                outgoingCard.classList.add(direction === 'next' ? 'swiping-left' : 'swiping-right');
                setTimeout(() => {
                    outgoingCard.classList.remove('swiping-left', 'swiping-right');
                }, 400);
            }

            const nextIndex = (currentIndex + 1) % cards.length;
            const prevIndex = (currentIndex + 2) % cards.length;

            cards.forEach((card, idx) => {
                card.classList.remove('active', 'next', 'prev');
                if (idx === currentIndex) {
                    card.classList.add('active');
                } else if (idx === nextIndex) {
                    card.classList.add('next');
                } else if (idx === prevIndex) {
                    card.classList.add('prev');
                }
            });

            // Update Indicator Pills
            indicatorPills.forEach((pill, idx) => {
                pill.classList.toggle('active', idx === currentIndex);
            });

            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateStack('next');
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateStack('prev');
        }

        function goToSlide(targetIdx) {
            if (targetIdx === currentIndex || isAnimating) return;
            const direction = targetIdx > currentIndex ? 'next' : 'prev';
            currentIndex = targetIdx;
            updateStack(direction);
        }

        // Controls
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        // Indicator Pill Clicks
        indicatorPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const targetIdx = parseInt(pill.getAttribute('data-slide'), 10);
                goToSlide(targetIdx);
                resetTimer();
            });
        });

        // Click on preview cards to bring them forward
        cards.forEach((card, idx) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('next')) {
                    nextSlide();
                    resetTimer();
                } else if (card.classList.contains('prev')) {
                    prevSlide();
                    resetTimer();
                }
            });
        });

        // Touch & Drag Swipe Gestures
        let touchStartX = 0;
        let touchEndX = 0;

        if (swipeStage) {
            swipeStage.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(autoPlayTimer);
            }, { passive: true });

            swipeStage.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleGesture();
                startTimer();
            }, { passive: true });

            swipeStage.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            swipeStage.addEventListener('mouseleave', () => startTimer());
        }

        function handleGesture() {
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 45) {
                if (diff < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        function startTimer() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, 3800);
        }

        function resetTimer() {
            startTimer();
        }

        // Initialize state & start auto cycle
        updateStack('next');
        startTimer();
    }

    // -------------------------------------------------------------
    // 5. Scroll Reveal Animations (IntersectionObserver)
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // -------------------------------------------------------------
    // 6. Number Counter Animation for Mission Stats
    // -------------------------------------------------------------
    let countersAnimated = false;
    const missionSection = document.querySelector('.mission-section');

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        const counters = document.querySelectorAll('.stat-number');
        const duration = 1400; // ms

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
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

    if (missionSection && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        counterObserver.observe(missionSection);
    } else if (missionSection) {
        animateCounters();
    }

    // -------------------------------------------------------------
    // 7. Interactive 3D Tilt on Bento Cards (Desktop)
    // -------------------------------------------------------------
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const interactiveCards = document.querySelectorAll('.bento-card, .spotlight-glass-panel, .modern-metric-card');

        interactiveCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // -------------------------------------------------------------
    // 8. Contact Form Handling (Asynchronous Formspree)
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedbackBox = document.getElementById('form-feedback');

    if (contactForm && submitBtn && feedbackBox) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando mensaje...</span> <i class="fas fa-spinner fa-spin"></i>';
            feedbackBox.style.display = 'none';
            feedbackBox.className = 'form-feedback-card';

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
                    feedbackBox.className = 'form-feedback-card success';
                    feedbackBox.innerHTML = '<i class="fas fa-circle-check"></i> <strong>¡Mensaje enviado con éxito!</strong> Nos comunicaremos contigo en menos de 2 horas.';
                    feedbackBox.style.display = 'block';
                } else {
                    const data = await response.json();
                    feedbackBox.className = 'form-feedback-card error';
                    feedbackBox.innerHTML = '<i class="fas fa-circle-exclamation"></i> ' + 
                        (data.errors ? data.errors.map(err => err.message).join(", ") : 'Ocurrió un error al procesar la solicitud. Por favor intenta de nuevo.');
                    feedbackBox.style.display = 'block';
                }
            } catch (err) {
                feedbackBox.className = 'form-feedback-card error';
                feedbackBox.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Error de conexión. Verifica tu conexión a internet o contáctanos directamente por WhatsApp.';
                feedbackBox.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
});
