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

    // Arrow Journey Animation - Simple and accurate
    function initArrowJourney() {
        // Only run on desktop
        if (window.innerWidth <= 991) return;

        const featureItems = document.querySelectorAll('.feature-item');
        if (featureItems.length < 3) return;

        function runJourney() {
            const container = featureItems[0].parentElement;

            // 1. Course 1 - Arrow DOWN on LEFT border (visual right in RTL)
            const arrow1 = document.createElement('div');
            arrow1.style.cssText = 'position: absolute; left: 76px; top: 50px; width: 31px; height: 31px; opacity: 0; z-index: 1;';
            const img1 = document.createElement('img');
            img1.src = 'images/icons/progress-arrow-down.svg';
            img1.style.cssText = 'width: 100%; height: 100%;';
            arrow1.appendChild(img1);
            featureItems[0].appendChild(arrow1);

            let startTime = Date.now();
            let startY = 50;
            let endY = featureItems[0].offsetHeight - 100;

            function animate1() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / 5000, 1);

                arrow1.style.top = (startY + (endY - startY) * progress) + 'px';
                arrow1.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                if (progress < 1) requestAnimationFrame(animate1);
                else setTimeout(() => arrow1.remove(), 100);
            }
            setTimeout(() => { arrow1.style.opacity = '1'; animate1(); }, 0);

            // 2. Transition 1→2: Follow curved border from Course 1 bottom to Course 2 top
            setTimeout(() => {
                const transArrow1 = document.createElement('div');
                transArrow1.style.cssText = 'position: absolute; width: 31px; height: 24px; opacity: 0; z-index: 1;';
                const transImg1 = document.createElement('img');
                transImg1.src = 'images/icons/progress-arrow-right.svg';
                transImg1.style.cssText = 'width: 100%; height: 100%;';
                transArrow1.appendChild(transImg1);
                featureItems[0].appendChild(transArrow1);

                const item1Height = featureItems[0].offsetHeight;
                const item1Width = featureItems[0].offsetWidth;

                // Start exactly where the down arrow ended
                const startX = 90; // left border position
                const startY = item1Height - 100;
                const radius = 90;

                const transStart = Date.now();
                const duration = 5000; // Same speed as down animation

                function animateTrans1() {
                    const elapsed = Date.now() - transStart;
                    const progress = Math.min(elapsed / duration, 1);

                    let currentX, currentY;

                    if (progress < 0.25) {
                        // Phase 1: Follow the curve at bottom-left corner (0-25%)
                        const curveProgress = progress / 0.25;
                        const angle = curveProgress * (Math.PI / 2); // 0 to 90 degrees
                        // Start at (startX, startY) and curve to (startX + radius, startY + radius)
                        currentX = startX + radius * Math.sin(angle);
                        currentY = startY + radius * (1 - Math.cos(angle));
                        transImg1.src = 'images/icons/progress-arrow-right.svg';
                    } else if (progress < 0.85) {
                        // Phase 2: Go straight across horizontally (25-85%)
                        const straightProgress = (progress - 0.25) / 0.6;
                        const straightStartX = startX + radius;
                        const straightEndX = item1Width - 90 - radius;
                        currentX = straightStartX + (straightEndX - straightStartX) * straightProgress;
                        currentY = startY + radius;
                        transImg1.src = 'images/icons/progress-arrow-right.svg';
                    } else {
                        // Phase 3: Fade out (85-100%)
                        const fadeProgress = (progress - 0.85) / 0.15;
                        currentX = item1Width - 90 - radius;
                        currentY = startY + radius;
                        transArrow1.style.opacity = 1 - fadeProgress;
                    }

                    transArrow1.style.left = currentX + 'px';
                    transArrow1.style.top = currentY + 'px';

                    if (progress < 0.85) {
                        transArrow1.style.opacity = '1';
                    }

                    if (progress < 1) {
                        requestAnimationFrame(animateTrans1);
                    } else {
                        setTimeout(() => transArrow1.remove(), 100);
                    }
                }
                setTimeout(() => { transArrow1.style.opacity = '1'; animateTrans1(); }, 0);
            }, 5000);

            // 3. Course 2 - Arrow DOWN on RIGHT border (visual left in RTL)
            setTimeout(() => {
                const arrow2 = document.createElement('div');
                arrow2.style.cssText = 'position: absolute; right: 76px; top: 50px; width: 31px; height: 31px; opacity: 0; z-index: 1;';
                const img2 = document.createElement('img');
                img2.src = 'images/icons/progress-arrow-down.svg';
                img2.style.cssText = 'width: 100%; height: 100%;';
                arrow2.appendChild(img2);
                featureItems[1].appendChild(arrow2);

                let start2 = Date.now();
                let startY2 = 50;
                let endY2 = featureItems[1].offsetHeight - 100;

                function animate2() {
                    const elapsed = Date.now() - start2;
                    const progress = Math.min(elapsed / 5000, 1);

                    arrow2.style.top = (startY2 + (endY2 - startY2) * progress) + 'px';
                    arrow2.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                    if (progress < 1) requestAnimationFrame(animate2);
                    else setTimeout(() => arrow2.remove(), 100);
                }
                setTimeout(() => { arrow2.style.opacity = '1'; animate2(); }, 0);
            }, 10000);

            // 4. Transition 2→3: Follow curved border from Course 2 bottom to Course 3 top
            setTimeout(() => {
                const transArrow2 = document.createElement('div');
                transArrow2.style.cssText = 'position: absolute; width: 31px; height: 24px; opacity: 0; z-index: 1;';
                const transImg2 = document.createElement('img');
                transImg2.src = 'images/icons/progress-arrow-left.svg';
                transImg2.style.cssText = 'width: 100%; height: 100%;';
                transArrow2.appendChild(transImg2);
                featureItems[1].appendChild(transArrow2);

                const item2Height = featureItems[1].offsetHeight;
                const item2Width = featureItems[1].offsetWidth;

                // Start exactly where the down arrow ended
                const startX = item2Width - 90; // right border position
                const startY = item2Height - 100;
                const radius = 90;

                const transStart = Date.now();
                const duration = 5000; // Same speed as down animation

                function animateTrans2() {
                    const elapsed = Date.now() - transStart;
                    const progress = Math.min(elapsed / duration, 1);

                    let currentX, currentY;

                    if (progress < 0.25) {
                        // Phase 1: Follow the curve at bottom-right corner (0-25%)
                        const curveProgress = progress / 0.25;
                        const angle = curveProgress * (Math.PI / 2); // 0 to 90 degrees
                        // Start at (startX, startY) and curve to (startX - radius, startY + radius)
                        currentX = startX - radius * Math.sin(angle);
                        currentY = startY + radius * (1 - Math.cos(angle));
                        transImg2.src = 'images/icons/progress-arrow-left.svg';
                    } else if (progress < 0.85) {
                        // Phase 2: Go straight across horizontally (25-85%)
                        const straightProgress = (progress - 0.25) / 0.6;
                        const straightStartX = startX - radius;
                        const straightEndX = 90 + radius;
                        currentX = straightStartX + (straightEndX - straightStartX) * straightProgress;
                        currentY = startY + radius;
                        transImg2.src = 'images/icons/progress-arrow-left.svg';
                    } else {
                        // Phase 3: Fade out (85-100%)
                        const fadeProgress = (progress - 0.85) / 0.15;
                        currentX = 90 + radius;
                        currentY = startY + radius;
                        transArrow2.style.opacity = 1 - fadeProgress;
                    }

                    transArrow2.style.left = currentX + 'px';
                    transArrow2.style.top = currentY + 'px';

                    if (progress < 0.85) {
                        transArrow2.style.opacity = '1';
                    }

                    if (progress < 1) {
                        requestAnimationFrame(animateTrans2);
                    } else {
                        setTimeout(() => transArrow2.remove(), 100);
                    }
                }
                setTimeout(() => { transArrow2.style.opacity = '1'; animateTrans2(); }, 0);
            }, 15000);

            // 5. Course 3 - Arrow DOWN on LEFT border (visual right in RTL)
            setTimeout(() => {
                const arrow3 = document.createElement('div');
                arrow3.style.cssText = 'position: absolute; left: 76px; top: 50px; width: 31px; height: 31px; opacity: 0; z-index: 1;';
                const img3 = document.createElement('img');
                img3.src = 'images/icons/progress-arrow-down.svg';
                img3.style.cssText = 'width: 100%; height: 100%;';
                arrow3.appendChild(img3);
                featureItems[2].appendChild(arrow3);

                let start3 = Date.now();
                let startY3 = 50;
                let endY3 = featureItems[2].offsetHeight - 100;

                function animate3() {
                    const elapsed = Date.now() - start3;
                    const progress = Math.min(elapsed / 5000, 1);

                    arrow3.style.top = (startY3 + (endY3 - startY3) * progress) + 'px';
                    arrow3.style.opacity = progress < 0.95 ? '1' : (1 - (progress - 0.95) / 0.05);

                    if (progress < 1) requestAnimationFrame(animate3);
                    else setTimeout(() => arrow3.remove(), 100);
                }
                setTimeout(() => { arrow3.style.opacity = '1'; animate3(); }, 0);
            }, 20000);

            // Loop every 26 seconds (5s + 5s + 5s + 5s + 5s + 1s buffer)
            setTimeout(runJourney, 26000);
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
            document.querySelectorAll('.journey-arrow').forEach(el => el.remove());
            if (window.innerWidth > 991) {
                initArrowJourney();
            }
        }, 250);
    });

});