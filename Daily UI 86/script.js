/**
 * Senior Logic: Wave Event Emitter
 * Tracks progress and triggers visual/audio events when a flag is reached.
 */
class ZombieWaveTracker {
    constructor(totalZombies, milestones) {
        this.total = totalZombies;
        this.milestones = milestones.sort((a, b) => a - b); // e.g., [0.5, 1.0]
        this.currentDefeated = 0;
        this.flagsTriggered = new Set();
        this.init();
    }

    init() {
        this.renderFlags();
        this.setupEventListeners();
    }

    renderFlags() {
        const container = document.getElementById('flags-container');
        if (!container) return;

        this.milestones.forEach((target, index) => {
            const flag = document.createElement('div');
            flag.className = 'flag-pole';
            flag.id = `flag-${index}`;
            flag.style.left = `${target * 100}%`;

            const cloth = document.createElement('div');
            cloth.className = 'flag-cloth';

            flag.appendChild(cloth);
            container.appendChild(flag);
        });
    }

    setupEventListeners() {
        document.addEventListener('pvz:hugewave', (e) => {
            this.handleHugeWaveUI(e.detail.flagIndex);
            this.playWaveSound();
        });
    }

    updateProgress(defeatedCount) {
        // Enforce max count
        this.currentDefeated = Math.min(defeatedCount, this.total);
        const progressPercentage = this.currentDefeated / this.total;

        // Update UI visuals
        this.updateUI(progressPercentage * 100);

        // Check for milestones
        this.checkMilestones(progressPercentage);
    }

    updateUI(percentage) {
        const fill = document.getElementById('progress-fill');
        const head = document.getElementById('zombie-head');

        if (fill) fill.style.width = `${percentage}%`;
        if (head) head.style.left = `${percentage}%`;

        // Update CSS variable for any other listeners
        document.documentElement.style.setProperty('--pvz-progress', `${percentage}%`);
    }

    checkMilestones(percentage) {
        this.milestones.forEach((target, index) => {
            // Add a small buffer to trigger slightly before the head covers the flag for better visual impact
            if (percentage >= target && !this.flagsTriggered.has(index)) {
                this.flagsTriggered.add(index);
                this.triggerHugeWaveEvent(index);
            }
        });
    }

    triggerHugeWaveEvent(flagIndex) {
        const waveEvent = new CustomEvent('pvz:hugewave', { detail: { flagIndex } });
        document.dispatchEvent(waveEvent);
    }

    handleHugeWaveUI(index) {
        const flag = document.getElementById(`flag-${index}`);
        if (flag) flag.classList.add('raised');

        const overlay = document.getElementById('wave-overlay');
        const body = document.getElementById('game-body');

        if (overlay) {
            overlay.classList.add('opacity-100', 'scale-100');
            overlay.classList.remove('opacity-0', 'scale-150');

            body.classList.add('wave-approaching');

            setTimeout(() => {
                overlay.classList.remove('opacity-100', 'scale-100');
                overlay.classList.add('opacity-0', 'scale-150');
                body.classList.remove('wave-approaching');
            }, 3000);
        }
    }

    playWaveSound() {
        // Senior Logic: Web Audio API for precise timing
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.5);

        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.5);

        // Secondary "Warning" sound
        setTimeout(() => {
            const osc2 = this.audioContext.createOscillator();
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(100, this.audioContext.currentTime);
            osc2.connect(gain);
            osc2.start();
            osc2.stop(this.audioContext.currentTime + 0.2);
        }, 100);

        this.vibrate();
    }

    vibrate() {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([100, 50, 100]);
        }
    }
}

// Initialize Level Progress
const totalZombies = 20;
const milestones = [0.35, 0.75, 1.0]; // Typical PvZ milestones
const tracker = new ZombieWaveTracker(totalZombies, milestones);

let defeatedCount = 0;

// Connect UI Button
const addBtn = document.getElementById('add-zombie-btn');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        if (defeatedCount < totalZombies) {
            defeatedCount++;
            tracker.updateProgress(defeatedCount);

            // Randomly update sun for visual flavor
            if (Math.random() > 0.5) {
                const currentSun = parseInt(document.getElementById('sun-count').innerText.split('/')[0]);
                if (currentSun < 10) {
                    document.getElementById('sun-count').innerText = `${currentSun + 1} / 10`;
                }
            }
        }
    });
}

// Initial state
tracker.updateProgress(0);
