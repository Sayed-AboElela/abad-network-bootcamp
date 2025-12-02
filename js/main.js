jQuery(document).ready(function ($) {
    console.log('ready');
    const modal = document.getElementById("successModal");
    let redirectUrlOnSuccess = '';
    const closeBtn = document.querySelector(".closeBtn");
    const backBtn = document.querySelector(".modal-btn");
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.getElementById("openModalBtn");

    const openModal = () => {
        modal.classList.add("active");
    };
    console.log('redirectUrlOnSuccess', redirectUrlOnSuccess);
    const closeModal = () => {
        modal.classList.remove("active");
        if (redirectUrlOnSuccess) {
            window.location.href = redirectUrlOnSuccess;
        }
    };
    closeBtn.onclick = closeModal;
    backBtn.onclick = closeModal;
    overlay.onclick = closeModal;
    jQuery('form#contact-form').on('submit', function (e) {
        console.log('submit');
        e.preventDefault();
        if ($(this).valid()) {
            openModalBtn.onclick = openModal;
            // var contact = jQuery(this).serialize();
            // redirectUrlOnSuccess = response.redirect_url;
            let formData = Object.fromEntries(new FormData(this));
            // let formData = {
            //     name: $("input[name=name]").val(),
            //     email: $("input[name=email]").val(),
            //     education: $("select[name=education]").val(),
            //     phoneNumber: $("input[name=phoneNumber]").val(),
            //     appointment: $("select[name=appointment]").val(),
            //     typeCourse: $("select[name=typeCourse]").val()
            // };
            console.log(formData);
            $.ajax({
                url: "https://bootcamp.abadnet.com/api/Camps/register-Network-camp",
                type: "POST",
                data: JSON.stringify(formData),
                contentType: "application/json",
                success: function (response) {
                    console.log("API Response:", response);

                    if (response.redirectUrl) {
                        redirectUrlOnSuccess = response.redirectUrl;
                        // window.location.href = response.redirectUrl;
                    } else {
                        alert("تم التسجيل بنجاح!");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", status, error, xhr.responseText);
                    alert("حدث خطأ أثناء إرسال البيانات.");
                }
            });
        } else {
            console.log('!not valid');
        }
    });
    const sections = document.querySelectorAll(".reveal");

    sections.forEach((el) => {
        const d = el.getAttribute("data-delay");
        if (d) el.style.setProperty("--delay", d);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    sections.forEach((sec) => observer.observe(sec));

    // Arrow Journey Animation - Simple and accurate
    let journeyTimeouts = [];

    function initArrowJourney() {
        // Clear existing journey
        journeyTimeouts.forEach(clearTimeout);
        journeyTimeouts = [];
        document.querySelectorAll('.journey-arrow').forEach(el => el.remove());

        const featureItems = document.querySelectorAll('.feature-item');
        if (featureItems.length < 3) return;

        function runJourney() {
            const container = featureItems[0].parentElement;
            const width = window.innerWidth;
            const isMobile = width <= 767;
            const isSmallMobile = width <= 480;

            const itemWidth = featureItems[0].offsetWidth;
            const arrowHalfWidth = 15.5; // 31px / 2
            const arrowHalfHeight = 12; // 24px / 2 for horizontal arrow
            const verticalArrowHalfHeight = 15.5; // 31px / 2 for vertical arrow

            // Calculate Edges (0.0 to 1.0) based on CSS rules
            // Small Mobile (<480px):
            //   Odd: left: 45%, width: 90% -> Center 45%, Extent +/- 45% -> [0%, 90%]
            //   Even: left: 54%, width: 90% -> Center 54%, Extent +/- 45% -> [9%, 99%]
            // Mobile (<767px):
            //   Odd: left: 50%, width: 90% -> Center 50%, Extent +/- 45% -> [5%, 95%]
            //   Even: left: 54%, width: 90% -> Center 54%, Extent +/- 45% -> [9%, 99%]

            let oddLeftEdge, oddRightEdge;
            let evenLeftEdge, evenRightEdge;

            if (isMobile) {
                if (isSmallMobile) {
                    // Odd Items: left 45%
                    oddLeftEdge = 0.00;   // 45% - 45% = 0%
                    oddRightEdge = 0.90;  // 45% + 45% = 90%
                    // Even Items: left 54% (from 767px media query, still applies)
                    evenLeftEdge = 0.09;  // 54% - 45% = 9%
                    evenRightEdge = 0.99; // 54% + 45% = 99%
                } else {
                    // Odd Items: left 50%
                    oddLeftEdge = 0.05;   // 50% - 45% = 5%
                    oddRightEdge = 0.95;  // 50% + 45% = 95%
                    // Even Items: left 54%
                    evenLeftEdge = 0.09;  // 54% - 45% = 9%
                    evenRightEdge = 0.99; // 54% + 45% = 99%
                }
            } else {
                // Desktop - Fixed pixels
                // We'll handle desktop separately in the logic below
            }

            // Helper to get X for a specific item and edge
            const getX = (isEven, isRightEdge) => {
                if (!isMobile) {
                    // Desktop Fixed Logic
                    if (isEven) return isRightEdge ? (itemWidth - 76 - 31) : 76; // Even: Right is "start", Left is "end"
                    return isRightEdge ? (itemWidth - 76 - 31) : 76; // Odd: Left is "start", Right is "end"
                }

                // Mobile Logic
                if (isSmallMobile) {
                    return (isRightEdge ? oddRightEdge : oddLeftEdge) * itemWidth - arrowHalfWidth;
                }

                if (isEven) {
                    return (isRightEdge ? evenRightEdge : evenLeftEdge) * itemWidth - arrowHalfWidth;
                } else {
                    return (isRightEdge ? oddRightEdge : oddLeftEdge) * itemWidth - arrowHalfWidth;
                }
            };

            // 1. Course 1 (Odd) - Arrow DOWN on LEFT border
            const arrow1 = document.createElement('div');
            arrow1.classList.add('journey-arrow');

            // Odd Item, Left Edge
            const arrow1X = isMobile ? getX(false, false) : 76;
            const arrow1Left = `${arrow1X}px`;

            arrow1.style.cssText = `position: absolute; left: ${arrow1Left}; top: 50px; width: 31px; height: 31px; opacity: 0; z-index: 1;`;
            const img1 = document.createElement('img');
            img1.src = 'images/icons/progress-arrow-down.svg';
            img1.style.cssText = 'width: 100%; height: 100%;';
            arrow1.appendChild(img1);
            featureItems[0].appendChild(arrow1);

            let startTime = Date.now();
            let startY = 50;
            // Mobile border radius is 40px, Desktop is 90px (usually). 
            // We stop at offsetHeight - radius to start the curve.
            let radius = isMobile ? 40 : 90;
            // Subtract verticalArrowHalfHeight so the arrow center aligns with the start of the curve
            let endY = featureItems[0].offsetHeight - radius - verticalArrowHalfHeight;

            function animate1() {
                const elapsed = Date.now() - startTime;
                const duration = isMobile ? 5000 : 7000; // Slower for desktop
                const progress = Math.min(elapsed / duration, 1);

                arrow1.style.top = (startY + (endY - startY) * progress) + 'px';
                arrow1.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                if (progress < 1) requestAnimationFrame(animate1);
                else setTimeout(() => arrow1.remove(), 100);
            }
            setTimeout(() => { arrow1.style.opacity = '1'; animate1(); }, 0);

            // 2. Transition 1→2 (Odd -> Even)
            const transitionDelay1 = isMobile ? 5000 : 7000;
            const t1 = setTimeout(() => {
                const transArrow1 = document.createElement('div');
                transArrow1.classList.add('journey-arrow');
                transArrow1.style.cssText = 'position: absolute; width: 31px; height: 24px; opacity: 0; z-index: 1;';
                const transImg1 = document.createElement('img');
                transImg1.src = 'images/icons/progress-arrow-right.svg';
                transImg1.style.cssText = 'width: 100%; height: 100%;';
                transArrow1.appendChild(transImg1);
                featureItems[0].appendChild(transArrow1);

                const item1Height = featureItems[0].offsetHeight;

                // Calculate straight-line horizontal movement (no curves)
                let startX, endX, startY;

                if (isMobile) {
                    // Start after left curve, end before right curve
                    startX = getX(false, false) + arrowHalfWidth + radius;
                    endX = getX(false, true) + arrowHalfWidth - radius;
                    startY = item1Height; // Center arrow on bottom border line
                } else {
                    // Desktop
                    startX = 90 + radius;
                    endX = itemWidth - 90 - radius;
                    startY = item1Height; // Center arrow on bottom border line
                }

                const transStart = Date.now();
                const duration = isMobile ? 5000 : 7000;

                function animateTrans1() {
                    const elapsed = Date.now() - transStart;
                    const progress = Math.min(elapsed / duration, 1);

                    // Simple straight line - no curve following
                    const currentX = startX + (endX - startX) * progress;
                    const currentY = startY;

                    transArrow1.style.left = (currentX - arrowHalfWidth) + 'px';
                    transArrow1.style.top = (currentY - arrowHalfHeight) + 'px';

                    // Fade out in final 5%
                    transArrow1.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                    if (progress < 1) requestAnimationFrame(animateTrans1);
                    else setTimeout(() => transArrow1.remove(), 100);
                }
                setTimeout(() => { transArrow1.style.opacity = '1'; animateTrans1(); }, 0);
            }, transitionDelay1);
            journeyTimeouts.push(t1);

            // 3. Course 2 (Even) - Arrow DOWN on RIGHT border
            const arrow2Delay = isMobile ? 10000 : 14000;
            const t2 = setTimeout(() => {
                const arrow2 = document.createElement('div');
                arrow2.classList.add('journey-arrow');

                // Even Item, Right Edge
                let arrow2X;
                if (isMobile) {
                    // Calculate the right edge position and add slight adjustment for even items
                    arrow2X = getX(true, true);
                    // Add offset to align perfectly with the border (compensate for 54% center position)
                    arrow2X += itemWidth * 0.08;
                } else {
                    // Desktop: Right side
                    // logic was: right: 76px
                }

                if (isMobile) {
                    arrow2.style.cssText = `position: absolute; left: ${arrow2X}px; top: 50px; width: 31px; height: 31px; opacity: 0; z-index: 1;`;
                } else {
                    arrow2.style.cssText = `position: absolute; right: 76px; top: 50px; width: 31px; height: 31px; opacity: 0; z-index: 1;`;
                }

                const img2 = document.createElement('img');
                img2.src = 'images/icons/progress-arrow-down.svg';
                img2.style.cssText = 'width: 100%; height: 100%;';
                arrow2.appendChild(img2);
                featureItems[1].appendChild(arrow2);

                let start2 = Date.now();
                let startY2 = 50;
                let endY2 = featureItems[1].offsetHeight - radius - verticalArrowHalfHeight;
                if (!isMobile) endY2 = featureItems[1].offsetHeight - 100; // Desktop legacy

                function animate2() {
                    const elapsed = Date.now() - start2;
                    const duration = isMobile ? 5000 : 7000; // Slower for desktop
                    const progress = Math.min(elapsed / duration, 1);

                    arrow2.style.top = (startY2 + (endY2 - startY2) * progress) + 'px';
                    arrow2.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                    if (progress < 1) requestAnimationFrame(animate2);
                    else setTimeout(() => arrow2.remove(), 100);
                }
                setTimeout(() => { arrow2.style.opacity = '1'; animate2(); }, 0);
            }, arrow2Delay);
            journeyTimeouts.push(t2);

            // 4. Transition 2→3 (Even -> Odd)
            const transitionDelay2 = isMobile ? 15000 : 21000;
            const t3 = setTimeout(() => {
                const transArrow2 = document.createElement('div');
                transArrow2.classList.add('journey-arrow');
                transArrow2.style.cssText = 'position: absolute; width: 31px; height: 24px; opacity: 0; z-index: 1;';
                const transImg2 = document.createElement('img');
                transImg2.src = 'images/icons/progress-arrow-left.svg';
                transImg2.style.cssText = 'width: 100%; height: 100%;';
                transArrow2.appendChild(transImg2);
                featureItems[1].appendChild(transArrow2);

                const item2Height = featureItems[1].offsetHeight;

                // Calculate straight-line horizontal movement (no curves)
                let startX, endX, startY;

                if (isMobile) {
                    // Right to Left - include even item offset
                    startX = getX(true, true) + arrowHalfWidth + (itemWidth * 0.08) - radius;
                    endX = getX(true, false) + arrowHalfWidth + (itemWidth * 0.08) + radius;
                    startY = item2Height; // Center arrow on bottom border line
                } else {
                    // Desktop: Right to Left
                    startX = itemWidth - 90 - radius;
                    endX = 90 + radius;
                    startY = item2Height; // Center arrow on bottom border line
                }

                const transStart = Date.now();
                const duration = isMobile ? 5000 : 7000;

                function animateTrans2() {
                    const elapsed = Date.now() - transStart;
                    const progress = Math.min(elapsed / duration, 1);

                    // Simple straight line - no curve following
                    const currentX = startX + (endX - startX) * progress;
                    const currentY = startY;

                    transArrow2.style.left = (currentX - arrowHalfWidth) + 'px';
                    transArrow2.style.top = (currentY - arrowHalfHeight) + 'px';

                    // Fade out in final 5%
                    transArrow2.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                    if (progress < 1) requestAnimationFrame(animateTrans2);
                    else setTimeout(() => transArrow2.remove(), 100);
                }
                setTimeout(() => { transArrow2.style.opacity = '1'; animateTrans2(); }, 0);
            }, transitionDelay2);
            journeyTimeouts.push(t3);

            // 5. Course 3 (Odd) - Arrow DOWN on LEFT border
            const arrow3Delay = isMobile ? 20000 : 28000;
            const t4 = setTimeout(() => {
                const arrow3 = document.createElement('div');
                arrow3.classList.add('journey-arrow');

                // Odd Item, Left Edge
                const arrow3X = isMobile ? getX(false, false) : 76;
                const arrow3Left = `${arrow3X}px`;

                arrow3.style.cssText = `position: absolute; left: ${arrow3Left}; top: 50px; width: 31px; height: 31px; opacity: 0; z-index: 1;`;
                const img3 = document.createElement('img');
                img3.src = 'images/icons/progress-arrow-down.svg';
                img3.style.cssText = 'width: 100%; height: 100%;';
                arrow3.appendChild(img3);
                featureItems[2].appendChild(arrow3);

                let start3 = Date.now();
                let startY3 = 50;
                let endY3 = featureItems[2].offsetHeight - radius - verticalArrowHalfHeight;
                if (!isMobile) endY3 = featureItems[2].offsetHeight - 100;

                function animate3() {
                    const elapsed = Date.now() - start3;
                    const duration = isMobile ? 5000 : 7000; // Slower for desktop
                    const progress = Math.min(elapsed / duration, 1);

                    arrow3.style.top = (startY3 + (endY3 - startY3) * progress) + 'px';
                    arrow3.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                    if (progress < 1) requestAnimationFrame(animate3);
                    else setTimeout(() => arrow3.remove(), 100);
                }
                setTimeout(() => { arrow3.style.opacity = '1'; animate3(); }, 0);
            }, arrow3Delay);
            journeyTimeouts.push(t4);

            const loopDelay = isMobile ? 26000 : 36000;
            const tLoop = setTimeout(runJourney, loopDelay);
            journeyTimeouts.push(tLoop);
        }

        runJourney();
    }

    // Initialize arrow journey after page load
    setTimeout(initArrowJourney, 1500);

    // Reinitialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initArrowJourney();
        }, 250);
    });

    // ===== PROFESSIONAL PAGE ANIMATIONS =====

    // 1. Parallax scrolling effect - disabled to preserve hero animations
    function initParallax() {
        // Parallax disabled as it interferes with hero image animations
        // and other positioned elements
    }

    // 2. Floating animation for benefit icons
    function initFloatingIcons() {
        const benefitIcons = document.querySelectorAll('.benefit-icon img');

        benefitIcons.forEach((icon, index) => {
            icon.style.animation = `gentleFloat ${3 + (index % 3)}s ease-in-out ${index * 0.3}s infinite`;
        });

        // Add CSS keyframe
        if (!document.querySelector('#floatingStyles')) {
            const style = document.createElement('style');
            style.id = 'floatingStyles';
            style.textContent = `
                @keyframes gentleFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 3. Glow effect on scroll for feature items
    function initGlowEffects() {
        const featureItems = document.querySelectorAll('.feature-item');

        const glowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.filter = 'drop-shadow(0 0 20px rgba(154, 32, 170, 0.3))';

                    setTimeout(() => {
                        entry.target.style.filter = 'none';
                    }, 1500);
                }
            });
        }, { threshold: 0.5 });

        featureItems.forEach(item => glowObserver.observe(item));
    }

    // 4. Timeline dots pulse animation
    function initTimelinePulse() {
        const timelineDots = document.querySelectorAll('.timeline-dot');

        timelineDots.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.animation = `pulse 2s ease-in-out ${index * 0.2}s infinite`;
            }, index * 200);
        });

        if (!document.querySelector('#pulseStyles')) {
            const style = document.createElement('style');
            style.id = 'pulseStyles';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% {
                        // box-shadow: 0 0 15px rgba(154, 32, 170, 0.8);
                        transform: scale(1);
                    }
                    50% {
                        // box-shadow: 0 0 25px rgba(154, 32, 170, 1), 0 0 40px rgba(154, 32, 170, 0.6);
                        transform: scale(1.2);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 5. Smooth reveal animations on scroll
    function initSmoothReveals() {
        const revealElements = document.querySelectorAll('.benefit-item, .timeline-item, .details-item');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.2 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            revealObserver.observe(el);
        });
    }

    // 6. Interactive hover effects for course icons
    function initInteractiveIcons() {
        const courseIcons = document.querySelectorAll('.item-img');

        courseIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.1) rotate(5deg)';
                // this.style.boxShadow = '0 0 30px rgba(223, 90, 255, 1)';
            });

            icon.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1) rotate(0deg)';
                // this.style.boxShadow = '';
            });
        });
    }

    // 7. Animated gradient for section titles
    function initAnimatedTitles() {
        const sectionTitles = document.querySelectorAll('.section-title');

        if (!document.querySelector('#titleGradientStyles')) {
            const style = document.createElement('style');
            style.id = 'titleGradientStyles';
            style.textContent = `
                .section-title {
                    background: linear-gradient(90deg, #9a20aa, #df5aff, #9a20aa);
                    background-size: 200% auto;
                    animation: shimmer 3s linear infinite;
                }

                @keyframes shimmer {
                    to {
                        background-position: 200% center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 8. Number counter animation for visible numbers
    function initCounterAnimation() {
        const numberElements = document.querySelectorAll('.item-number');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const finalNumber = entry.target.textContent;
                    let current = 0;
                    const increment = 1;
                    const duration = 1000;
                    const steps = duration / 50;
                    const stepValue = parseInt(finalNumber) / steps;

                    const counter = setInterval(() => {
                        current += stepValue;
                        if (current >= parseInt(finalNumber)) {
                            entry.target.textContent = finalNumber;
                            clearInterval(counter);
                        } else {
                            entry.target.textContent = Math.floor(current);
                        }
                    }, 50);
                }
            });
        }, { threshold: 0.5 });

        numberElements.forEach(el => counterObserver.observe(el));
    }

    // Initialize all animations
    setTimeout(() => {
        initParallax();
        initFloatingIcons();
        initGlowEffects();
        initTimelinePulse();
        initSmoothReveals();
        initInteractiveIcons();
        initAnimatedTitles();
        initCounterAnimation();
    }, 500);

});