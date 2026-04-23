// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State Setup
    gsap.set("#portal-hero", { 
        scale: 1, 
        y: "25vh", // Grounded on the floor of the cave
        opacity: 1,
        left: "50%"
    }); 
    gsap.set("#hand-left", { xPercent: -100, yPercent: -50, opacity: 0 }); 
    gsap.set("#hand-right", { xPercent: 100, yPercent: -50, opacity: 0 }); 
    gsap.set("#title-container", { opacity: 0, y: -20 }); 
    gsap.set("#portal-world", { 
        scale: 1.2, // Increased scale to prevent edges showing during parallax
        y: "-5vh",  // Moved up slightly as requested
        opacity: 1 
    }); 
    gsap.set("#portal-frame", { scale: 1.1, opacity: 1 });

    // --- PORTAL ENTRANCE ANIMATION (Removed Zoom and Fade) ---
    const portalTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#portal-section",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // No animation here, keeping it stable

    // --- HERO FLOW TRANSITION (Portal -> Rock) ---
    const heroFlowTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#about-section",
            start: "top 110%", // Start slightly before it enters
            end: "top 0%",     // Finish landing exactly when About section is full
            scrub: 1.5,
        }
    });

    heroFlowTimeline
        .to("#portal-hero", { 
            zIndex: 500, // Leap out to the foreground
            duration: 0.1
        })
        .to("#portal-hero", { 
            x: "41vw", 
            y: "-5vh", // Original "standing" coordinates
            scale: 0.85, 
            duration: 2,
            ease: "power2.inOut"
        });

    // Special handler for nav click to ensure hero flow is smooth
    const aboutNavItem = document.querySelector('[data-section="about-section"]');
    if (aboutNavItem) {
        aboutNavItem.addEventListener('click', () => {
            // When clicking, we scroll to the section. GSAP ScrollTrigger will handle the scrub.
            // But we can also add a manual play if needed, though scroll is better.
        });
    }

    // --- THE STICKING & FADE OUT ---
    // Hero stays on the rock as it moves up, then fades away
    const heroStickTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#about-section",
            start: "top 0%",
            end: "bottom 0%",
            scrub: true
        }
    });

    heroStickTimeline
        .to("#portal-hero", { 
            y: "-105vh", // Move up precisely from the -5vh base to stay relative to rock
            ease: "none"
        }, 0)
        .to("#portal-hero", { 
            opacity: 0, // Fade out as it leaves
            duration: 0.5
        }, 0.5); // Start fading halfway through leaving

    // Reveal for the Cliff Rock
    gsap.from("#target-rock", {
        x: 100,
        opacity: 0,
        duration: 1.5,
        scrollTrigger: {
            trigger: "#about-section",
            start: "top 60%",
        }
    });

    // --- THE FINAL LANDING ---
    // The hero stays on the rock as the ultimate monument of your journey.
    // No more movement after this.

    // --- PORTAL FADE REMOVED ---

    // 4. Contact Section: Slow-Mo Hands Union
    const contactTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#contact-section",
            start: "top 80%", 
            end: "bottom center",
            scrub: 2 
        }
    });
    
    contactTimeline
        .to("#hand-left", { x: "50vw", opacity: 1, duration: 4 }, 0) 
        .to("#hand-right", { x: "-50vw", opacity: 1, duration: 4 }, 0); 
    // 5. Kingdom Section: Title Reveal
    const kingdomTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#kingdom-section",
            start: "top 80%", 
            end: "bottom center",
            scrub: 1 
        }
    });
    
    kingdomTimeline.to("#title-container", { opacity: 1, y: 0, duration: 2 });

    // Subtle Mouse Parallax for the 'Hole' (World and Frame)
    document.addEventListener('mousemove', (e) => {
        if (window.scrollY < window.innerHeight * 1.5) { 
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5);
            const yPos = (clientY / window.innerHeight - 0.5);
 
            // Move the world slightly opposite to create depth
            gsap.to("#portal-world", { 
                x: xPos * -40, 
                y: yPos * -30, 
                duration: 1.5,
                ease: "power2.out"
            });

            // Move the frame even more subtly
            gsap.to("#portal-frame", { 
                x: xPos * 20, 
                y: yPos * 15, 
                duration: 2,
                ease: "power2.out"
            });
        }
    });
    // #portal-hero remains stationary relative to the screen to avoid 'floating'

    // --- NEW PORTFOLIO LOGIC ---
    // --- NEW PORTFOLIO LOGIC ---

    // 1. Sidebar Section Switching
    const navItems = document.querySelectorAll('.nav-icons li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            const target = document.getElementById(sectionId);
            
            if (target) {
                // Remove active class from all
                navItems.forEach(i => i.classList.remove('active'));
                // Add to clicked
                item.classList.add('active');
                
                // Scroll to section
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Active Sidebar State on Scroll
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        const sections = ['portal-section', 'about-section', 'skills-section', 'projects-section', 'contact-section', 'kingdom-section'];
        
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('data-section') === id);
                });
            }
        });
    });

    // 3. Scroll Reveals for Portfolio Sections
    const portfolioSections = document.querySelectorAll('.scroll-reveal-section');
    portfolioSections.forEach(section => {
        gsap.from(section.querySelector('.section-content'), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });

        // Parallax effect for section backgrounds
        gsap.to(section.querySelector('.section-bg img'), {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 4. Easter Egg: Press 'R' to Reincarnate (Go to Top)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'r') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Optional: trigger some special animation
            gsap.to("body", { backgroundColor: "#fff", duration: 0.1, yoyo: true, repeat: 1 });
        }
    });

    // 5. Sword Slash Logic
    const slashableElements = document.querySelectorAll('.sidebar-crest, .warrior-figure-container');
    slashableElements.forEach(el => {
        el.addEventListener('click', () => {
            el.classList.add('slashed');
            setTimeout(() => {
                el.classList.remove('slashed');
            }, 400);
        });
    });

    // 6. Skill Warrior Stagger Reveal
    gsap.from(".warrior-skill-item", {
        scrollTrigger: {
            trigger: ".skills-wrapper",
            start: "top 90%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power4.out"
    });

    // 6. Hero Text Reveal (Initial)
    gsap.from("#hero-text-overlay-new > *", {
        y: 30,
        opacity: 0,
        stagger: 0.3,
        duration: 1.5,
        delay: 1,
    });

    /* --- Horse Mouse Follow Logic --- */
    const horse = document.querySelector('.horse-traveler');
    const projectSection = document.getElementById('projects-section');

    if (horse && projectSection) {
        projectSection.addEventListener('mousemove', (e) => {
            const rect = projectSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Constrain horse to map area
            gsap.to(horse, {
                left: x,
                top: y,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        // Reset horse position when mouse leaves the section
        projectSection.addEventListener('mouseleave', () => {
            gsap.to(horse, {
                left: "22%", // Reset to original 'forward' position
                top: "25%",
                duration: 1.5,
                ease: "power3.inOut"
            });
        });
    }
    /* ---------------------------------- */

    // 7. Parallax Effect for Cliff Rock
    gsap.to(".cliff-rock", {
        y: -50,
        scrollTrigger: {
            trigger: "#about-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // 8. Skills Slider: Auto-Scroll + Manual Controls
    const slider = document.getElementById('skills-slider');
    const prevBtn = document.getElementById('skill-prev');
    const nextBtn = document.getElementById('skill-next');
    let currentX = 0;
    const step = 400;

    if (slider && prevBtn && nextBtn) {
        // Create an infinite auto-scrolling timeline
        let autoScroll = gsap.to(slider, {
            x: () => -(slider.scrollWidth - slider.parentElement.offsetWidth + 100),
            duration: 25,
            repeat: -1,
            yoyo: true,
            ease: "none",
            paused: false
        });

        // Function to handle manual navigation
        const moveManual = (direction) => {
            autoScroll.kill(); // Stop auto-scroll permanently when user interacts manually
            
            const containerWidth = slider.parentElement.offsetWidth;
            const contentWidth = slider.scrollWidth;
            const maxScroll = contentWidth - containerWidth + 100;

            if (direction === 'next') {
                currentX -= step;
            } else {
                currentX += step;
            }

            if (currentX < -maxScroll) currentX = -maxScroll;
            if (currentX > 0) currentX = 0;

            gsap.to(slider, {
                x: currentX,
                duration: 0.8,
                ease: "power2.out"
            });
        };

        nextBtn.addEventListener('click', () => moveManual('next'));
        prevBtn.addEventListener('click', () => moveManual('prev'));

        // Pause on hover
        slider.parentElement.addEventListener('mouseenter', () => {
            if (autoScroll && autoScroll.isActive()) autoScroll.pause();
        });
        slider.parentElement.addEventListener('mouseleave', () => {
            if (autoScroll && !autoScroll.isActive() && autoScroll.vars) autoScroll.resume();
        });
    }
});
