// Mobile Hamburger Menu
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".nav-links li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
}));

// Highlight Active Nav Link on Scroll
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links li a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(li => {
        li.classList.remove("active");
        if (li.getAttribute("href") === `#${current}`) {
            li.classList.add("active");
        }
    });
});

// Hide Header on Scroll Down, Show on Scroll Up
let lastScroll = 0;
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    // Hide/Show logic
    if (currentScroll <= 0) {
        header.classList.remove("scroll-up");
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains("scroll-down")) {
        // Scroll Down
        header.classList.remove("scroll-up");
        header.classList.add("scroll-down");
    } else if (currentScroll < lastScroll && header.classList.contains("scroll-down")) {
        // Scroll Up
        header.classList.remove("scroll-down");
        header.classList.add("scroll-up");
    }
    lastScroll = currentScroll;
});

// Smooth Scroll for Hash Links (in case browser doesn't support scroll-behavior: smooth css)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* PHASE 2 - Intersection Observer Animations */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add base classes for initial hidden state before observing
document.querySelectorAll('.section-title').forEach(el => {
    el.classList.add('reveal-fade-left');
    observer.observe(el);
});

// staggered experience cards
document.querySelectorAll('.timeline-item').forEach((el, index) => {
    el.classList.add('reveal-fade-up');
    el.style.transitionDelay = `${index * 100}ms`;
    observer.observe(el);
});

// staggered project cards
document.querySelectorAll('.project-card').forEach((el, index) => {
    el.classList.add('reveal-fade-up');
    el.style.transitionDelay = `${index * 100}ms`;
    observer.observe(el);
});

// skill badges pop
document.querySelectorAll('.skill-tag').forEach((el, index) => {
    el.classList.add('reveal-scale-pop');
    el.style.transitionDelay = `${(index % 5) * 100}ms`; 
    // mod 5 so delay doesn't get ridiculously long for 20 tags
    observer.observe(el);
});

// cert cards
document.querySelectorAll('.cert-list li').forEach((el, index) => {
    el.classList.add('reveal-fade-right');
    el.style.transitionDelay = `${index * 100}ms`;
    observer.observe(el);
});

// Hero content
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    heroContent.classList.add('reveal-fade-up');
    setTimeout(() => {
        heroContent.classList.add('reveal-visible');
    }, 200);
}

/* PHASE 3 - Typewriter Animation */
const typewriterText = document.querySelector('.typewriter-text');
if (typewriterText) {
    const phrases = ["Final Year B.Tech CS Student", "Aspiring Software Developer", "AI & ML Enthusiast"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 1500; // Pause at the end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect after a small delay
    setTimeout(typeEffect, 1000);
}

/* PHASE 3 - Back to Top Button */
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* PHASE 3 - Formspree Fetch Submission */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = "Thanks for reaching out! I'll get back to you soon.";
                contactForm.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = "Oops! Something went wrong. Please try again or email me directly.";
                }
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = "Oops! Something went wrong. Please try again or email me directly.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

/* POLISH - Floating Particles */
const particlesContainer = document.getElementById('particles-container');
if (particlesContainer) {
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size 3px-6px
        const size = Math.random() * 3 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity 0.15 to 0.4
        const opacity = Math.random() * 0.25 + 0.15;
        particle.style.backgroundColor = `rgba(212,175,55,${opacity})`;
        
        // Random horizontal start position
        particle.style.left = `${Math.random() * 100}%`;
        
        // Random animation duration 6s-14s
        const animDuration = Math.random() * 8 + 6;
        particle.style.animationDuration = `${animDuration}s`;
        
        // Random animation delay
        const animDelay = Math.random() * 10;
        particle.style.animationDelay = `-${animDelay}s`;
        
        particlesContainer.appendChild(particle);
    }
}
