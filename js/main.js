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
                data: JSON.stringify(formData),   // نبعت كـ JSON
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

    // Arrow Journey Animation
    function initArrowJourney() {
        // Only run on desktop
        if (window.innerWidth <= 991) return;

        const featureItems = document.querySelectorAll('.feature-item');
        if (featureItems.length < 3) return;

        // Create arrow element that will be positioned within each item
        function createArrow(type) {
            const arrow = document.createElement('div');
            arrow.className = 'journey-arrow';
            arrow.style.cssText = 'position: absolute; width: 31px; height: 31px; opacity: 0; z-index: 1; pointer-events: none;';

            const img = document.createElement('img');
            img.src = `images/icons/progress-arrow-${type}.svg`;
            img.style.cssText = 'width: 100%; height: 100%;';
            arrow.appendChild(img);

            return arrow;
        }

        // Animation timeline (in milliseconds)
        const timeline = {
            course1Down: { start: 0, duration: 3000 },
            transition1to2: { start: 3000, duration: 1000 },
            course2Down: { start: 4000, duration: 3000 },
            transition2to3: { start: 7000, duration: 1000 },
            course3Down: { start: 8000, duration: 3000 },
            totalDuration: 12000
        };

        // Animate arrow moving down along the curved border
        function animateArrowDown(item, arrow, isRight) {
            // Position relative to the item, not viewport
            const itemHeight = item.offsetHeight;
            const startY = 50;
            const endY = itemHeight - 80;
            const xPos = isRight ? 'calc(60% + 90px - 76px)' : '76px'; // Position on the curved border

            arrow.style[isRight ? 'right' : 'left'] = isRight ? '76px' : '76px';
            arrow.style[isRight ? 'left' : 'right'] = 'auto';
            arrow.style.top = startY + 'px';
            arrow.style.opacity = '0';

            setTimeout(() => { arrow.style.opacity = '1'; }, 100);

            const distance = endY - startY;
            const duration = 3000;
            const startTime = Date.now();

            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentY = startY + (distance * progress);
                arrow.style.top = currentY + 'px';

                if (progress < 0.9) {
                    arrow.style.opacity = '1';
                } else {
                    arrow.style.opacity = 1 - ((progress - 0.9) / 0.1);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    arrow.style.opacity = '0';
                }
            }

            animate();
        }

        // Animate arrow transitioning horizontally between courses
        function animateArrowTransition(fromItem, toItem, arrow) {
            // Create transition arrow in a container that spans both items
            const container = fromItem.parentElement;
            const transitionArrow = document.createElement('div');
            transitionArrow.className = 'journey-arrow-transition';
            transitionArrow.style.cssText = 'position: absolute; width: 31px; height: 24px; opacity: 0; z-index: 1; pointer-events: none;';

            const img = document.createElement('img');
            img.src = 'images/icons/progress-arrow-right.svg';
            img.style.cssText = 'width: 100%; height: 100%;';
            transitionArrow.appendChild(img);

            // Get positions relative to container
            const fromRect = fromItem.getBoundingClientRect();
            const toRect = toItem.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const fromItemIsEven = Array.from(featureItems).indexOf(fromItem) % 2 === 1;
            const toItemIsEven = Array.from(featureItems).indexOf(toItem) % 2 === 1;

            // Start position (bottom of from item, on its border side)
            const startX = fromItemIsEven ?
                fromRect.left - containerRect.left + 76 :
                fromRect.right - containerRect.left - 76;
            const startY = fromRect.bottom - containerRect.top - 60;

            // End position (top of to item, on its border side)
            const endX = toItemIsEven ?
                toRect.left - containerRect.left + 76 :
                toRect.right - containerRect.left - 76;

            container.appendChild(transitionArrow);
            transitionArrow.style.left = startX + 'px';
            transitionArrow.style.top = startY + 'px';

            setTimeout(() => { transitionArrow.style.opacity = '1'; }, 100);

            const distance = endX - startX;
            const duration = 1000;
            const startTime = Date.now();

            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (distance * progress);
                transitionArrow.style.left = currentX + 'px';

                if (progress < 0.8) {
                    transitionArrow.style.opacity = '1';
                } else {
                    transitionArrow.style.opacity = 1 - ((progress - 0.8) / 0.2);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    transitionArrow.remove();
                }
            }

            animate();
        }

        function runJourney() {
            // Course 1: DOWN on RIGHT side
            setTimeout(() => {
                const arrow1 = createArrow('down');
                featureItems[0].appendChild(arrow1);
                animateArrowDown(featureItems[0], arrow1, true);
                setTimeout(() => arrow1.remove(), 3100);
            }, timeline.course1Down.start);

            // Transition 1→2: HORIZONTAL
            setTimeout(() => {
                animateArrowTransition(featureItems[0], featureItems[1]);
            }, timeline.transition1to2.start);

            // Course 2: DOWN on LEFT side
            setTimeout(() => {
                const arrow2 = createArrow('down');
                featureItems[1].appendChild(arrow2);
                animateArrowDown(featureItems[1], arrow2, false);
                setTimeout(() => arrow2.remove(), 3100);
            }, timeline.course2Down.start);

            // Transition 2→3: HORIZONTAL
            setTimeout(() => {
                animateArrowTransition(featureItems[1], featureItems[2]);
            }, timeline.transition2to3.start);

            // Course 3: DOWN on RIGHT side
            setTimeout(() => {
                const arrow3 = createArrow('down');
                featureItems[2].appendChild(arrow3);
                animateArrowDown(featureItems[2], arrow3, true);
                setTimeout(() => arrow3.remove(), 3100);
            }, timeline.course3Down.start);

            // Loop the animation
            setTimeout(runJourney, timeline.totalDuration);
        }

        // Start the journey
        runJourney();
    }

    // Initialize arrow journey after page load
    setTimeout(initArrowJourney, 1000);

    // Reinitialize on window resize (if switching from mobile to desktop)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Clean up any existing arrows
            document.querySelectorAll('.journey-arrow, .journey-arrow-transition').forEach(el => el.remove());
            if (window.innerWidth > 991) {
                initArrowJourney();
            }
        }, 250);
    });

});