/**
 * Senior Logic: Device Intelligence & Asynchronous States
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const downloadBtn = document.getElementById('downloadBtn');
    const btnText = downloadBtn.querySelector('.btn-text');
    const statusMessage = document.getElementById('statusMessage');
    const progressCircle = document.querySelector('.progress-ring__circle');
    const notesToggle = document.getElementById('notesToggle');
    const releaseNotes = document.querySelector('.release-notes');

    // --- Configuration ---
    const CIRCUMFERENCE = 150; // Based on r=24 in SVG formula 2*pi*r approx
    const STATES = {
        IDLE: 'idle',
        DOWNLOADING: 'downloading',
        VERIFYING: 'verifying',
        INSTALLING: 'installing',
        COMPLETED: 'completed'
    };

    // --- 1. Platform Sniffer ---
    const detectPlatform = () => {
        const ua = navigator.userAgent;
        let platformName = "Desktop";

        // Basic check using User Agent String
        if (/android/i.test(ua)) {
            platformName = "Android";
            downloadBtn.dataset.platform = "android";
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
            platformName = "iOS";
            downloadBtn.dataset.platform = "ios";
        } else {
            downloadBtn.dataset.platform = "desktop";
        }

        // Check for existing installation
        if (localStorage.getItem('forge_installed') === 'true') {
            btnText.textContent = "Open App";
            statusMessage.textContent = `Installed on ${platformName}`;
            downloadBtn.classList.add('completed');
            // Change functionality to "Open" instead of download
            downloadBtn.onclick = handleOpenApp;
            return;
        }

        btnText.textContent = `Download for ${platformName}`;
    };

    detectPlatform();

    // --- 2. Button Interaction & Logic ---
    downloadBtn.addEventListener('click', (e) => {
        // If already completed/installed, specific handler takes over
        if (downloadBtn.classList.contains('completed')) return;

        startDownloadProcess(e);
    });

    const startDownloadProcess = (e) => {
        // Prevent double triggers
        if (downloadBtn.getAttribute('aria-busy') === 'true') return;

        // Visual Spark Effect
        createClickSpark(e.clientX, e.clientY);

        // State: Morph to Progress
        downloadBtn.setAttribute('aria-busy', 'true');
        downloadBtn.classList.add('loading');
        btnText.style.opacity = '0';
        statusMessage.textContent = "Connecting to server...";

        // Simulate Download Progress
        simulateProgress();
    };

    const simulateProgress = () => {
        let progress = 0;
        const totalDuration = 3000; // 3 seconds fake download
        const intervalTime = 30;
        const increment = 100 / (totalDuration / intervalTime);

        // Reset SVG
        progressCircle.style.strokeDashoffset = CIRCUMFERENCE;

        const interval = setInterval(() => {
            progress += increment;

            // Random hiccups to feel "real"
            if (Math.random() > 0.9) progress -= 1;

            // Cap at 100
            if (progress >= 100) progress = 100;

            // Update SVG Ring
            const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
            progressCircle.style.strokeDashoffset = offset;

            // Status Updates based on %
            updateStatusText(progress);

            if (progress >= 100) {
                clearInterval(interval);
                completeDownload();
            }
        }, intervalTime);
    };

    const updateStatusText = (progress) => {
        if (progress < 30) statusMessage.textContent = "Downloading packages...";
        else if (progress < 70) statusMessage.textContent = "Verifying signature...";
        else if (progress < 99) statusMessage.textContent = "Installing...";
    };

    const completeDownload = () => {
        // Haptic Feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate([10, 30, 10]);
        }

        // State: Completed
        downloadBtn.classList.remove('loading');
        downloadBtn.classList.add('completed');
        downloadBtn.setAttribute('aria-busy', 'false');

        // Visual Transition
        setTimeout(() => {
            btnText.textContent = "Open App";
            btnText.style.opacity = '1';
            statusMessage.textContent = "Installation Complete";
            statusMessage.style.color = "var(--success)";

            // Persist State
            localStorage.setItem('forge_installed', 'true');

            // Bind new click action
            downloadBtn.onclick = handleOpenApp;
        }, 300); // Wait for morph check
    };

    const handleOpenApp = () => {
        statusMessage.textContent = "Launching Project Forge...";
        // In a real app, this would be a deep link. Here, we simulate.
        setTimeout(() => {
            alert("Application Launched!");
            statusMessage.textContent = "Running...";
        }, 1000);
    };

    // --- 3. Micro-Interaction: ID Click Spark ---
    const createClickSpark = (x, y) => {
        const spark = document.createElement('div');
        spark.classList.add('click-effect');
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        document.body.appendChild(spark);

        spark.addEventListener('animationend', () => {
            spark.remove();
        });
    };

    // --- 4. Glassmorphic Drawer Logic ---
    notesToggle.addEventListener('click', () => {
        releaseNotes.classList.toggle('expanded');
    });

    // --- 5. Observer for Efficiency (If allowed) ---
    // If we had a video, we would disconnect it here.
    // For now, let's just log visibility for the download section.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Download area visible - optimizing priority');
            } else {
                console.log('Download area hidden - saving resources');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.download-area'));
});
