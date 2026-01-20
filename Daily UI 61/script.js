/**
 * Ares — The High-Fidelity WOD Engine
 * Samsung Galaxy S9+ Card Stack Workout App
 */

// ============================================================================
// HAPTIC FEEDBACK UTILITY
// ============================================================================

class HapticFeedback {
    static vibrate(duration = 10) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }

    static success() {
        this.vibrate(10);
    }

    static error() {
        this.vibrate([10, 20, 10]);
    }
}

// ============================================================================
// WORKOUT MANAGER
// ============================================================================

class WorkoutManager {
    constructor() {
        this.workouts = {};
        this.currentDay = null;
        this.currentWorkout = null;
        this.loadWorkouts();
    }

    async loadWorkouts() {
        try {
            const response = await fetch('workouts.json');
            if (response.ok) {
                this.workouts = await response.json();
            } else {
                throw new Error('Failed to load workouts.json');
            }
        } catch (error) {
            console.error('Error loading workouts:', error);
            // Fallback to inline workouts
            this.workouts = this.getDefaultWorkouts();
        }
        this.setCurrentDay();
    }

    getDefaultWorkouts() {
        return {
            "1": {
                "focus": "Push / Chest",
                "exercises": [
                    { "name": "Bench Press", "image": "workout pictures/1.jpg", "sets": 3, "reps": "8-10" },
                    { "name": "Overhead Press", "image": "workout pictures/2.jpg", "sets": 3, "reps": "8-10" }
                ]
            },
            "3": {
                "focus": "Pull / Back",
                "exercises": [
                    { "name": "Deadlift", "image": "workout pictures/6.jpg", "sets": 4, "reps": "5-6" },
                    { "name": "Pull-ups", "image": "workout pictures/7.jpg", "sets": 3, "reps": "8-12" }
                ]
            },
            "5": {
                "focus": "Legs / Core",
                "exercises": [
                    { "name": "Squats", "image": "workout pictures/11.jpg", "sets": 4, "reps": "8-10" },
                    { "name": "Plank", "image": "workout pictures/15.jpg", "sets": 3, "reps": "60s" }
                ]
            }
        };
    }

    setCurrentDay() {
        const today = new Date().getDay();
        this.currentDay = today.toString();
        
        // Default to Monday if no workout for today
        if (!this.workouts[this.currentDay]) {
            this.currentDay = "1"; // Monday
        }
        
        this.currentWorkout = this.workouts[this.currentDay];
        this.updateUI();
    }

    setWorkoutForDay(day, workout) {
        this.workouts[day] = workout;
        if (day === this.currentDay) {
            this.currentWorkout = workout;
        }
    }

    updateUI() {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayNameEl = document.getElementById('dayName');
        const dayFocusEl = document.getElementById('dayFocus');
        
        if (dayNameEl) dayNameEl.textContent = dayNames[parseInt(this.currentDay)];
        if (dayFocusEl && this.currentWorkout) dayFocusEl.textContent = this.currentWorkout.focus;
    }

    getCurrentWorkout() {
        return this.currentWorkout;
    }

    getWorkoutForDay(day) {
        return this.workouts[day] || null;
    }
}

// ============================================================================
// CARD SWIPER - GESTURE DETECTION
// ============================================================================

class CardSwiper {
    constructor(element, onSwipe) {
        this.el = element;
        this.onSwipe = onSwipe;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.startTime = 0;
        this.isDragging = false;
        this.swipeThreshold = 50; // Minimum distance in pixels
        this.velocityThreshold = 0.3; // Minimum velocity in px/ms
        this.maxRotation = 15; // Maximum rotation in degrees
        
        this.init();
    }

    init() {
        // Touch events
        this.el.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.el.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.el.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Mouse events for desktop testing
        this.el.addEventListener('mousedown', this.handleMouseStart.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseEnd.bind(this));
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.currentX = this.startX;
        this.currentY = this.startY;
        this.startTime = Date.now();
        this.isDragging = true;
        this.el.classList.add('dragging');
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        this.updateTransform();
    }

    handleTouchEnd(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        this.handleRelease();
    }

    handleMouseStart(e) {
        if (e.button !== 0) return; // Only left mouse button
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.currentX = this.startX;
        this.currentY = this.startY;
        this.startTime = Date.now();
        this.isDragging = true;
        this.el.classList.add('dragging');
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
        this.currentY = e.clientY;
        this.updateTransform();
        e.preventDefault();
    }

    handleMouseEnd(e) {
        if (!this.isDragging) return;
        this.handleRelease();
        e.preventDefault();
    }

    updateTransform() {
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const rotation = Math.min(deltaX / 10, this.maxRotation);
        
        // Apply transform
        this.el.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        
        // Update opacity based on distance
        const opacity = Math.max(0.3, 1 - distance / 400);
        this.el.style.opacity = opacity;
    }

    handleRelease() {
        if (!this.isDragging) return;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = Date.now() - this.startTime;
        const velocity = distance / duration;
        
        // Determine swipe direction
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        // Check if swipe meets threshold
        if (distance > this.swipeThreshold || velocity > this.velocityThreshold) {
            let direction = null;
            
            if (absX > absY) {
                // Horizontal swipe
                direction = deltaX > 0 ? 'right' : 'left';
            } else {
                // Vertical swipe
                direction = deltaY > 0 ? 'down' : 'up';
            }
            
            if (direction && this.onSwipe) {
                HapticFeedback.success();
                this.onSwipe(direction);
                return;
            }
        }
        
        // Snap back if swipe didn't meet threshold
        this.snapBack();
        this.isDragging = false;
        this.el.classList.remove('dragging');
    }

    snapBack() {
        this.el.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s';
        this.el.style.transform = '';
        this.el.style.opacity = '';
        
        setTimeout(() => {
            this.el.style.transition = '';
        }, 300);
    }

    destroy() {
        // Remove event listeners if needed
        this.el.classList.remove('dragging');
        this.el.style.transform = '';
        this.el.style.opacity = '';
    }
}

// ============================================================================
// CARD STACK MANAGER
// ============================================================================

class CardStackManager {
    constructor(container, workoutManager) {
        this.container = container;
        this.workoutManager = workoutManager;
        this.cards = [];
        this.currentExerciseIndex = 0;
        this.currentSetIndex = 0;
        this.cardSwipers = [];
        
        this.init();
    }

    init() {
        this.loadWorkout();
    }

    loadWorkout() {
        const workout = this.workoutManager.getCurrentWorkout();
        if (!workout || !workout.exercises) {
            console.error('No workout data available');
            return;
        }

        this.exercises = workout.exercises;
        this.currentExerciseIndex = 0;
        this.currentSetIndex = 0;
        
        // Generate cards for current exercise
        this.generateCards();
    }

    generateCards() {
        // Clear existing cards
        this.clearCards();
        
        if (!this.exercises || this.exercises.length === 0) return;
        
        const currentExercise = this.exercises[this.currentExerciseIndex];
        if (!currentExercise) return;
        
        const sets = currentExercise.sets || 1;
        
        // Create cards for each set of current exercise
        for (let i = 0; i < sets; i++) {
            const card = this.createCard(currentExercise, i + 1, sets);
            this.cards.push(card);
            this.container.appendChild(card);
            
            // Set depth for card stack effect
            this.updateCardDepths();
            
            // Initialize swiper for top card only
            if (i === 0) {
                const swiper = new CardSwiper(card, (direction) => this.handleSwipe(direction, card));
                this.cardSwipers.push(swiper);
            }
        }
    }

    createCard(exercise, setNumber, totalSets) {
        const card = document.createElement('div');
        card.className = 'workout-card';
        card.setAttribute('data-depth', '0');
        
        const image = document.createElement('img');
        image.className = 'card-image';
        image.src = exercise.image;
        image.alt = exercise.name;
        image.loading = 'lazy';
        
        // Handle image load
        image.onload = () => {
            card.classList.add('image-loaded');
        };
        
        image.onerror = () => {
            // Fallback to a default image or gradient
            image.style.display = 'none';
            card.querySelector('.card-image').style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        };
        
        const content = document.createElement('div');
        content.className = 'card-content';
        
        const exerciseName = document.createElement('h2');
        exerciseName.className = 'card-exercise-name';
        exerciseName.textContent = exercise.name;
        
        const exerciseDetails = document.createElement('p');
        exerciseDetails.className = 'card-exercise-details';
        exerciseDetails.textContent = totalSets > 1 ? `Set ${setNumber} of ${totalSets}` : 'Single Set';
        
        const statsContainer = document.createElement('div');
        statsContainer.className = 'card-sets-reps';
        
        const setsStat = document.createElement('div');
        setsStat.className = 'card-stat';
        setsStat.innerHTML = `
            <div class="card-stat-label">Sets</div>
            <div class="card-stat-value">${setNumber}/${totalSets}</div>
        `;
        
        const repsStat = document.createElement('div');
        repsStat.className = 'card-stat';
        repsStat.innerHTML = `
            <div class="card-stat-label">Reps</div>
            <div class="card-stat-value">${exercise.reps || 'N/A'}</div>
        `;
        
        statsContainer.appendChild(setsStat);
        statsContainer.appendChild(repsStat);
        
        content.appendChild(exerciseName);
        content.appendChild(exerciseDetails);
        content.appendChild(statsContainer);
        
        card.appendChild(image);
        card.appendChild(content);
        
        return card;
    }

    updateCardDepths() {
        this.cards.forEach((card, index) => {
            card.setAttribute('data-depth', Math.min(index, 4));
        });
    }

    handleSwipe(direction, card) {
        const absDelta = Math.abs(card.style.transform.match(/-?\d+\.?\d*/g)?.[0] || 0);
        
        // Determine navigation based on direction
        if (direction === 'left' || direction === 'right') {
            // Navigate between exercises
            this.navigateExercise(direction === 'right' ? 1 : -1);
        } else if (direction === 'up' || direction === 'down') {
            // Navigate between sets/rounds
            this.navigateSet(direction === 'down' ? 1 : -1);
        }
    }

    navigateExercise(direction) {
        // Remove current top card
        if (this.cards.length > 0) {
            const card = this.cards.shift();
            const swiper = this.cardSwipers.shift();
            if (swiper) swiper.destroy();
            
            // Animate card out
            const exitClass = direction > 0 ? 'swiping-out-right' : 'swiping-out-left';
            card.classList.add(exitClass);
            
            setTimeout(() => {
                card.remove();
            }, 400);
        }
        
        // Update exercise index
        this.currentExerciseIndex += direction;
        
        // Wrap around
        if (this.currentExerciseIndex >= this.exercises.length) {
            this.currentExerciseIndex = 0;
        } else if (this.currentExerciseIndex < 0) {
            this.currentExerciseIndex = this.exercises.length - 1;
        }
        
        // Reset set index
        this.currentSetIndex = 0;
        
        // Generate new cards for new exercise
        this.generateCards();
        
        // Update depths
        this.updateCardDepths();
        
        // Re-initialize swiper for new top card
        if (this.cards.length > 0) {
            const topCard = this.cards[0];
            const swiper = new CardSwiper(topCard, (direction) => this.handleSwipe(direction, topCard));
            this.cardSwipers.push(swiper);
        }
    }

    navigateSet(direction) {
        // Remove top card (current set)
        if (this.cards.length > 0) {
            const card = this.cards.shift();
            const swiper = this.cardSwipers.shift();
            if (swiper) swiper.destroy();
            
            // Animate card out
            const exitClass = direction > 0 ? 'swiping-out-down' : 'swiping-out-up';
            card.classList.add(exitClass);
            
            setTimeout(() => {
                card.remove();
            }, 400);
        }
        
        // Update set index
        const currentExercise = this.exercises[this.currentExerciseIndex];
        const totalSets = currentExercise.sets || 1;
        this.currentSetIndex += direction;
        
        // Check if we need to move to next exercise
        if (this.currentSetIndex >= totalSets) {
            this.currentSetIndex = 0;
            this.navigateExercise(1);
            return;
        } else if (this.currentSetIndex < 0) {
            // Move to previous exercise's last set
            this.navigateExercise(-1);
            return;
        }
        
        // Update depths for remaining cards
        this.updateCardDepths();
        
        // Re-initialize swiper for new top card
        if (this.cards.length > 0) {
            const topCard = this.cards[0];
            const swiper = new CardSwiper(topCard, (direction) => this.handleSwipe(direction, topCard));
            this.cardSwipers.push(swiper);
        }
    }

    clearCards() {
        // Destroy all swipers
        this.cardSwipers.forEach(swiper => swiper.destroy());
        this.cardSwipers = [];
        
        // Remove all cards
        this.cards.forEach(card => card.remove());
        this.cards = [];
    }

    refresh() {
        this.loadWorkout();
    }
}

// ============================================================================
// ADMIN DRAWER
// ============================================================================

class AdminDrawer {
    constructor(workoutManager, cardStackManager) {
        this.drawer = document.getElementById('adminDrawer');
        this.toggleBtn = document.getElementById('adminToggle');
        this.closeBtn = document.getElementById('adminClose');
        this.saveBtn = document.getElementById('adminSave');
        this.resetBtn = document.getElementById('adminReset');
        this.workoutManager = workoutManager;
        this.cardStackManager = cardStackManager;
        
        this.init();
    }

    init() {
        // Long press on header to open admin
        const header = document.querySelector('.app-header');
        let longPressTimer = null;
        
        header.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                this.open();
                HapticFeedback.vibrate(20);
            }, 1000);
        }, { passive: true });
        
        header.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });
        
        header.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        });
        
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Save button
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveWorkout());
        }
        
        // Reset button
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetWorkout());
        }
        
        // Close on outside click
        if (this.drawer) {
            this.drawer.addEventListener('click', (e) => {
                if (e.target === this.drawer) {
                    this.close();
                }
            });
        }
    }

    open() {
        if (!this.drawer) return;
        this.drawer.classList.add('open');
        
        // Load current workout data
        this.loadCurrentWorkout();
    }

    close() {
        if (!this.drawer) return;
        this.drawer.classList.remove('open');
    }

    loadCurrentWorkout() {
        const currentDay = this.workoutManager.currentDay;
        const workout = this.workoutManager.getWorkoutForDay(currentDay);
        
        const daySelect = document.getElementById('currentDay');
        const focusInput = document.getElementById('workoutFocus');
        const exercisesTextarea = document.getElementById('workoutExercises');
        
        if (daySelect) daySelect.value = currentDay;
        if (focusInput && workout) focusInput.value = workout.focus || '';
        if (exercisesTextarea && workout) {
            exercisesTextarea.value = JSON.stringify(workout.exercises || [], null, 2);
        }
    }

    saveWorkout() {
        const daySelect = document.getElementById('currentDay');
        const focusInput = document.getElementById('workoutFocus');
        const exercisesTextarea = document.getElementById('workoutExercises');
        
        if (!daySelect || !focusInput || !exercisesTextarea) return;
        
        try {
            const day = daySelect.value;
            const focus = focusInput.value.trim();
            const exercises = JSON.parse(exercisesTextarea.value);
            
            const workout = {
                focus: focus,
                exercises: exercises
            };
            
            this.workoutManager.setWorkoutForDay(day, workout);
            
            // If this is the current day, refresh the card stack
            if (day === this.workoutManager.currentDay) {
                this.workoutManager.setCurrentDay();
                this.cardStackManager.refresh();
            }
            
            HapticFeedback.success();
            this.close();
        } catch (error) {
            console.error('Error saving workout:', error);
            HapticFeedback.error();
            alert('Error saving workout. Please check the JSON format.');
        }
    }

    resetWorkout() {
        this.workoutManager.loadWorkouts();
        this.cardStackManager.refresh();
        this.loadCurrentWorkout();
        HapticFeedback.success();
    }
}

// ============================================================================
// APP INITIALIZATION
// ============================================================================

class AresApp {
    constructor() {
        this.workoutManager = null;
        this.cardStackManager = null;
        this.adminDrawer = null;
        this.init();
    }

    async init() {
        // Initialize workout manager
        this.workoutManager = new WorkoutManager();
        
        // Wait for workouts to load
        await this.workoutManager.loadWorkouts();
        
        // Small delay to ensure workouts are ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize card stack
        const container = document.getElementById('cardStackContainer');
        if (container) {
            this.cardStackManager = new CardStackManager(container, this.workoutManager);
        }
        
        // Initialize admin drawer
        this.adminDrawer = new AdminDrawer(this.workoutManager, this.cardStackManager);
        
        // Prevent default touch behaviors
        this.preventDefaultBehaviors();
        
        // Hide loading overlay
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }, 300);
    }

    preventDefaultBehaviors() {
        // Prevent pull-to-refresh and overscroll
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            // Allow touch moves within card container for swiping
            if (e.target.closest('.workout-card') || e.target.closest('.card-stack-container')) {
                return;
            }
            
            // Prevent overscroll at top
            const touchY = e.touches[0].clientY;
            if (window.scrollY === 0 && touchY > touchStartY) {
                e.preventDefault();
            }
            
            // Prevent overscroll at bottom
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;
            if (scrollHeight - scrollTop <= clientHeight && touchY < touchStartY) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent text selection
        document.addEventListener('selectstart', (e) => {
            if (!e.target.closest('.admin-input') && !e.target.closest('.admin-textarea')) {
                e.preventDefault();
            }
        });
        
        // Prevent context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AresApp();
    });
} else {
    new AresApp();
}

