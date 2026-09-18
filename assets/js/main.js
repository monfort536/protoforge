// main.js

document.addEventListener('DOMContentLoaded', () => {
    


    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.progress-bar-loading');
    
    if (loadingScreen && progressBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            progressBar.style.width = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        initGSAP();
                    }, 500);
                }, 300);
            }
        }, 200);
    } else {
        initGSAP();
    }

    // --- GSAP Animations ---
    function initGSAP() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            gsap.config({ nullTargetWarn: false });

            // Hero Animations
            gsap.fromTo('.hero-content > *', 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
            );

            gsap.fromTo('.hero-visual', 
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, delay: 0.4, ease: 'power3.out' }
            );

            // Card Staggers on scroll
            gsap.utils.toArray('.stagger-cards').forEach(section => {
                const cards = section.querySelectorAll('.clay-card');
                if (cards.length > 0) {
                    gsap.fromTo(cards, 
                        { y: 50, opacity: 0 },
                        {
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 85%',
                            },
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: 'back.out(1.2)'
                        }
                    );
                }
            });

            // Fade up elements
            gsap.utils.toArray('.fade-up').forEach(elem => {
                gsap.fromTo(elem, 
                    { y: 30, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: elem,
                            start: 'top 90%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out'
                    }
                );
            });

            // Force recalculation after layout settles
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        }
    }
});


// --- Global FormSubmit AJAX Interceptor ---
// Automatically intercepts any newsletter or generic form pointing to FormSubmit
// and converts it to a seamless background AJAX request with an inline success message.
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[action^="https://formsubmit.co"]');
    
    forms.forEach(form => {
        // Skip the main contact form if it already has its own specific handler
        if (form.id === 'contactForm') return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page redirect
            
            const submitBtn = form.querySelector('button[type="submit"]');
            let originalBtnText = 'Submit';
            if (submitBtn) {
                originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                submitBtn.disabled = true;
            }

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    form.reset();
                    // Create and show success message dynamically
                    let successMsg = form.parentNode.querySelector('.pf-ajax-success');
                    if (!successMsg) {
                        successMsg = document.createElement('div');
                        successMsg.className = 'alert alert-success mt-3 mb-0 p-2 rounded-3 border-0 bg-success bg-opacity-10 text-success pf-ajax-success small text-center';
                        successMsg.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Subscribed successfully!';
                        form.parentNode.appendChild(successMsg);
                    }
                    successMsg.classList.remove('d-none');
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        if(successMsg) successMsg.classList.add('d-none');
                    }, 5000);
                } else {
                    alert('Oops! There was a problem submitting your request.');
                }
            })
            .catch(error => {
                alert('Oops! There was a problem submitting your request.');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        });
    });
});
