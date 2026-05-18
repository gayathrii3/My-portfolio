// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 0. Update Date
    const dateElement = document.getElementById('home-date');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString(undefined, options);
    }

    // 1. Initial State Setup
    gsap.set("#portal-hero", {
        scale: 1,
        y: "25vh", // Grounded perfectly on the hole ledge
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
            x: "41vw", // Pushed a little further right
            y: "0vh", // Adjusted lower so the figure's head doesn't get cut off
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

    // Reveal for the Cliff Rock
    gsap.from("#target-rock", {
        x: 100,
        opacity: 0,
        duration: 1.5,
        scrollTrigger: {
            trigger: "#about-section",
            start: "top 70%",
            toggleActions: "play none none none" // Prevent it from sliding away when scrolling back up
        }
    });

    // Make the fixed hero scroll away natively with the about section and disappear
    gsap.fromTo("#portal-hero", 
        { y: "25vh", scale: 1, opacity: 1 }, 
        {
            y: () => {
                // Move up exactly by the height of the about section so it stays glued to the rock
                return -document.querySelector("#about-section").offsetHeight;
            },
            opacity: 0, // Fade out as it leaves the screen
            ease: "none",
            scrollTrigger: {
                trigger: "#about-section",
                start: "top top", // When about section is at top of screen
                end: "bottom top", // When about section scrolls completely out
                scrub: true,
                invalidateOnRefresh: true // Recalculate on resize
            }
        }
    );

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
        .to("#hand-left", { x: "20vw", xPercent: -50, opacity: 1, duration: 4 }, 0)
        .to("#hand-right", { x: "-20vw", xPercent: 50, opacity: 1, duration: 4 }, 0);
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

                // Account for GSAP pin-spacer
                let targetTop = target.offsetTop;
                if (target.parentElement && target.parentElement.classList.contains('pin-spacer')) {
                    targetTop = target.parentElement.offsetTop;
                }

                // Scroll to section
                window.scrollTo({
                    top: targetTop,
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
            if (el) {
                let elTop = el.offsetTop;
                let elHeight = el.offsetHeight;

                if (el.parentElement && el.parentElement.classList.contains('pin-spacer')) {
                    elTop = el.parentElement.offsetTop;
                    elHeight = el.parentElement.offsetHeight;
                }

                if (scrollPos >= elTop && scrollPos < elTop + elHeight) {
                    navItems.forEach(item => {
                        item.classList.toggle('active', item.getAttribute('data-section') === id);
                    });
                }
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

    /* --- Shield Wheel Logic --- */
    const projectsSection = document.getElementById('projects-section');
    const wheel = document.getElementById('projects-wheel');
    const nodes = document.querySelectorAll('.wheel-node');
    const pdTitle = document.getElementById('pd-title');
    const pdGithubLink = document.getElementById('pd-github-link');
    const pdTechStack = document.getElementById('pd-tech-stack');
    const pdBullets = document.getElementById('pd-bullets');
    const pdDivider = document.querySelector('.pd-divider');
    const pdImages = document.getElementById('pd-images');

    const projectData = {
        vendor: {
            title: "Venue Booking App",
            liveStatus: "",
            desc: "Venue Booking App lets users browse, view, and book venues for events easily. I worked on user-side development focusing on API integration and functionality. Implemented features for venue browsing, booking, and smooth navigation. Handled API responses and displayed data effectively in the UI. Used Swagger for API testing and Figma for basic wireframe design. Built using Flutter, REST APIs, and Android UI with Git for version control.",
            techStack: ["Flutter", "Dart", "SQL", "Swagger", "Figma"],
            bullets: [
                "Designed and developed a cross-platform venue booking application using Flutter and Dart.",
                "Implemented user authentication (login/signup), profile management, booking calendar, and booking history features.",
                "Managed backend data using SQL for user records and booking management.",
                "Designed intuitive UI/UX wireframes and prototypes using Figma."
            ],
            images: [],
            link: "#"
        },
        furrr: {
            title: "FURRR - AI petcare app",
            liveStatus: "LIVE PROJECT",
            desc: "Furrr is a Flutter-based pet care app offering real-time AI insights for pet health and behavior. It includes features like a smart symptom checker, behavior analyzer, and interactive bark/play system. The app provides text-to-speech support for accessible AI results. It features premium UI with animations, mascots, and a soft themed design. Users can find nearby vets, access Indian pet food safety guides, and view a YouTube-based pet feed. Built with Flutter, Gemini AI, Google APIs, and advanced animation tools for a seamless experience.",
            techStack: ["Flutter (Dart)", "Python", "FastAPI", "Gemini AI"],
            bullets: [
                "Built a cross-platform mobile app for Indian dog owners with AI-powered health tools, breed-specific risk analysis for 9 breeds, and hyperlocal community features.",
                "Integrated Google Gemini 2.0 Flash API for real-time wound analysis and symptom checking from uploaded photos.",
                "Designed a Breed Health Risk Engine covering 9 breeds including Indian Indie dogs with age-filtered genetic risk predictions and prevention guidance.",
                "Implemented vernacular language support in 4 languages (English, Hindi, Telugu, Tamil).",
                "Designed interactive UI with animations, TTS (Text-to-Speech), and engaging pet activity features."
            ],
            images: [],
            link: "https://github.com/gayathrii3/furrr_petcare_app.git"
        },
        safeorbit: {
            title: "SafeOrbit – Women's Safety",
            liveStatus: "PROTOTYPE",
            desc: "SafeOrbit is a Women's Night Safety System using real-time location-based safety heatmaps. It utilizes NLP to analyze public reviews and identify risk indicators.",
            techStack: ["Python", "Flask", "SQLite", "NLP", "Heatmaps"],
            bullets: [
                "Built a real-time location-based safety heatmap system using public reviews + AI to classify safe vs unsafe zones.",
                "Developed an NLP sentiment classifier (Python) to analyze textual reviews and detect risk indicators such as harassment, poorly lit areas, or crowd levels.",
                "Designed color-coded safety heatmaps to help users navigate risky routes at night, integrating SOS alert routing and GPS tracking.",
                "Analyzed 30+ public reviews, classified safety zones with NLP, improving risk identification accuracy and generating data-driven insights."
            ],
            images: [],
            link: "#"
        }
    };

    if (wheel && nodes.length > 0) {
        // We wait a tick so offsetWidth is accurate
        setTimeout(() => {
            const radius = wheel.offsetWidth / 2;
            const totalNodes = nodes.length;
            const angleStep = 360 / totalNodes;

            // Position nodes
            nodes.forEach((node, i) => {
                const angleDeg = i * angleStep;
                const angleRad = angleDeg * (Math.PI / 180);

                // Start from the left side (-x direction)
                const x = Math.cos(angleRad + Math.PI) * radius;
                const y = Math.sin(angleRad + Math.PI) * radius;

                gsap.set(node, { x: x, y: y });
            });

            // ScrollTrigger for the wheel pinning and rotating
            gsap.to(wheel, {
                rotation: 360,
                ease: "none",
                scrollTrigger: {
                    trigger: projectsSection,
                    start: "top top",
                    end: "+=2000", // Pin for 2000px of scrolling
                    scrub: 1,
                    pin: true,
                    onUpdate: (self) => {
                        const currentRotation = self.progress * 360;
                        // Counter-rotate the icons so they stay upright
                        gsap.set(".node-icon i", {
                            rotation: -currentRotation
                        });
                    }
                }
            });

            // Node click handlers
            nodes.forEach(node => {
                node.addEventListener('click', () => {
                    nodes.forEach(n => n.classList.remove('active'));
                    node.classList.add('active');

                    const key = node.getAttribute('data-project');
                    if (key && projectData[key]) {
                        const data = projectData[key];
                        pdTitle.textContent = data.title;
                        
                        pdGithubLink.href = data.link || '#';
                        pdGithubLink.style.display = 'inline-flex';

                        if (pdDivider) pdDivider.style.display = 'block';

                        pdTechStack.innerHTML = '';
                        data.techStack.forEach(tech => {
                            const span = document.createElement('span');
                            span.className = 'tech-pill';
                            span.textContent = tech;
                            pdTechStack.appendChild(span);
                        });

                        pdBullets.innerHTML = '';
                        data.bullets.forEach(bullet => {
                            const li = document.createElement('li');
                            li.textContent = bullet;
                            pdBullets.appendChild(li);
                        });

                        pdImages.innerHTML = '';
                        data.images.forEach(imgSrc => {
                            const img = document.createElement('img');
                            img.src = imgSrc;
                            pdImages.appendChild(img);
                        });

                        gsap.fromTo("#project-details-panel > *",
                            { opacity: 0, x: -20 },
                            { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 }
                        );
                    }
                });
            });

            // Trigger the first one
            const firstActive = document.querySelector('.wheel-node.active') || nodes[0];
            if (firstActive) firstActive.click();
        }, 100);
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
    // Note: The scrolling soldiers and slider have been removed to give a more professional look.
});
