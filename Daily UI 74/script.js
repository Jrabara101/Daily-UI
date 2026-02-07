document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const downloadBtn = document.getElementById('download-btn');
    const platformHint = document.getElementById('platform-hint');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const btnText = document.querySelector('.btn-text');

    const drawer = document.getElementById('release-notes');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const notesTrigger = document.getElementById('notes-trigger');
    const closeDrawer = document.getElementById('close-drawer');

    const videoElement = document.getElementById('feature-video');
    const videoPlaceholder = document.getElementById('video-placeholder');

    // --- State ---
    let isDownloading = false;
    let downloadProgress = 0;
    let downloadInterval;
    const APP_ID = 'project-forge-v1';

    // --- 1. Platform Detection ---
    const detectPlatform = () => {
        const ua = navigator.userAgent;
        let platformName = "Unknown";
        let btnLabel = "Download";

        if (/android/i.test(ua)) {
            platformName = "Android";
            btnLabel = "Download for Android";
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
            platformName = "iOS";
            btnLabel = "Download on App Store";
        } else if (/Win/i.test(ua)) {
            platformName = "Windows";
            btnLabel = "Download for Windows";
        } else if (/Mac/i.test(ua)) {
            platformName = "macOS";
            btnLabel = "Download for Mac";
        } else {
            platformName = "Desktop";
            btnLabel = "Download for Desktop";
        }

        // Check if already downloaded
        if (localStorage.getItem(APP_ID) === 'installed') {
            btnLabel = "Open App";
            downloadBtn.classList.add('completed');
            btnText.innerHTML = "Open App"; // Override
        } else {
            btnText.innerHTML = btnLabel;
        }

        platformHint.textContent = `Detected System: ${platformName}`;
    };

    detectPlatform();

    // --- 3. Particles Effect ---
    const createParticles = (element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            document.body.appendChild(particle);

            // Random styles
            const size = Math.random() * 4 + 2;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 50 + 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = 'var(--accent)';
            particle.style.position = 'fixed';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

            // Animate
            requestAnimationFrame(() => {
                particle.style.transform = `translate(${tx}px, ${ty}px)`;
                particle.style.opacity = '0';
            });

            // Cleanup
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    };

    // --- 2. Download Logic ---
    const startDownload = () => {
        if (isDownloading) return;
        if (downloadBtn.classList.contains('completed')) {
            // "Open App" action
            alert("Opening Project Forge...");
            return;
        }

        isDownloading = true;
        downloadBtn.setAttribute('aria-busy', 'true');

        // Haptic Feedback (Start)
        if (navigator.vibrate) navigator.vibrate(50);

        // Simulation
        downloadInterval = setInterval(() => {
            downloadProgress += Math.random() * 5; // Random increment
            if (downloadProgress > 100) downloadProgress = 100;

            progressBar.style.width = `${downloadProgress}%`;
            progressText.textContent = `${Math.floor(downloadProgress)}%`;

            if (downloadProgress >= 100) {
                completeDownload();
            }
        }, 100);
    };

    const completeDownload = () => {
        clearInterval(downloadInterval);
        isDownloading = false;

        // Haptic Feedback (Success)
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);

        // Transform UI
        setTimeout(() => {
            downloadBtn.setAttribute('aria-busy', 'false');
            downloadBtn.classList.add('completed');
            btnText.innerHTML = "Open App";
            localStorage.setItem(APP_ID, 'installed');

            // Sparkle Effect
            createParticles(downloadBtn);
        }, 500);
    };

    downloadBtn.addEventListener('click', startDownload);

    // --- 4. Release Notes Drawer ---
    const toggleDrawer = (show) => {
        if (show) {
            drawer.classList.add('open');
            // drawerBackdrop.classList.add('active'); // CSS class approach
            drawerBackdrop.style.opacity = '1';
            drawerBackdrop.style.pointerEvents = 'auto';
        } else {
            drawer.classList.remove('open');
            // drawerBackdrop.classList.remove('active');
            drawerBackdrop.style.opacity = '0';
            drawerBackdrop.style.pointerEvents = 'none';
        }
    };

    notesTrigger.addEventListener('click', () => toggleDrawer(true));
    closeDrawer.addEventListener('click', () => toggleDrawer(false));
    drawerBackdrop.addEventListener('click', () => toggleDrawer(false));

    // --- 5. Intersection Observer for Video ---
    // Note: Since we are using a placeholder, this logic applies if we had a real video.
    // We will simulate the "active" state or just log it.

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // videoElement.play(); 
                    // console.log("Video in view - Playing");
                } else {
                    // videoElement.pause();
                    // console.log("Video out of view - Pausing");
                }
            });
        }, { threshold: 0.5 });

        observer.observe(videoPlaceholder);
    }
});
