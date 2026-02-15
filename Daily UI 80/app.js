/**
 * Chronos — The Semantic Time Engine
 * Main Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Chronos initialized.');

    // Core Elements
    const calendarWrapper = document.getElementById('calendar-wrapper');
    const input = document.getElementById('smart-date-input');
    const selectionDisplay = document.getElementById('selection-display');

    // Model Initialization
    const model = new CalendarModel();

    // State
    const state = {
        currentDate: new Date(), // Visual cursor (scrolling position)
        selectionStart: null,
        selectionEnd: null,
        hoverDate: null,
        isDragging: false,
        renderedMonths: [] // Track which YYYY-MM are rendered
    };

    /**
     * Renders a month into the calendar wrapper.
     */
    const renderMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${month}`;

        if (state.renderedMonths.includes(monthKey)) return; // Avoid duplicates

        const monthData = model.generateMonthData(year, month);

        // Month Container
        const section = document.createElement('section');
        section.className = 'month-section';
        section.dataset.monthKey = monthKey;

        // Header
        const header = document.createElement('h3');
        header.className = 'month-header';
        header.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        section.appendChild(header);

        // Days Grid
        const grid = document.createElement('div');
        grid.className = 'days-grid';

        // Weekday Headers (Sticky or just at top of month? 
        // Design usually puts them once at top or repeated. 
        // User asked for "Vertical infinite scroll", often headers repeat or sticking top bar.
        // For now, let's keep it simple: grid days.)

        // Need to render days
        const fragment = document.createDocumentFragment();

        monthData.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'day-cell';

            if (day.type === 'empty') {
                cell.classList.add('empty');
            } else {
                cell.textContent = day.dayNumber;
                cell.dataset.date = day.date.toISOString(); // For logic

                // Attributes for A11y / interactions
                cell.setAttribute('role', 'button');
                cell.setAttribute('tabindex', '-1'); // Manage focus manually
                cell.setAttribute('aria-label', day.date.toDateString());

                // State checks (Is Today?)
                if (day.isToday) {
                    cell.style.fontWeight = 'bold';
                    cell.style.color = '#371df1'; // Highlight today text
                }

                // Micro-stats (Randomly assign for demo)
                const hasStat = Math.random() > 0.7; // 30% chance
                if (hasStat) {
                    const dots = document.createElement('div');
                    dots.className = 'micro-dots';
                    const dot = document.createElement('span');
                    dot.className = 'dot';
                    // Random status
                    const statuses = ['free', 'busy', 'moderate'];
                    dot.classList.add(statuses[Math.floor(Math.random() * statuses.length)]);
                    dots.appendChild(dot);
                    cell.appendChild(dots);
                }
            }
            fragment.appendChild(cell);
        });

        grid.appendChild(fragment);
        section.appendChild(grid);
        calendarWrapper.appendChild(section);

        state.renderedMonths.push(monthKey);
    };

    /**
     * Initial Render: Current Month + Next 2 Months
     */
    renderMonth(state.currentDate);
    renderMonth(model.addMonths(state.currentDate, 1));
    renderMonth(model.addMonths(state.currentDate, 2));


    // Infinite Scroll Logic
    calendarWrapper.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = calendarWrapper;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            // Near bottom, load next month
            const lastMonthKey = state.renderedMonths[state.renderedMonths.length - 1];
            const [year, month] = lastMonthKey.split('-').map(Number);
            const nextMonthDate = new Date(year, month + 1, 1);

            renderMonth(nextMonthDate);
        }
    });


    // --- Interaction Handlers ---

    // 1. Smart Input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const result = parseSmartDate(input.value);
            if (result) {
                console.log('Parsed Date:', result);
                if (navigator.vibrate) navigator.vibrate(20);

                // Select it
                state.selectionStart = result;
                state.selectionEnd = null;
                state.currentDate = result; // Focus updates to this date
                updateSelectionUI();

                // Scroll to view logic if rendered
                scrollToDate(result);
            } else {
                input.style.borderColor = 'red';
                setTimeout(() => input.style.borderColor = '', 300);
            }
        }
    });

    function scrollToDate(date) {
        // Simple check if already rendered
        const iso = date.toISOString();
        const el = document.querySelector(`.day-cell[data-date="${iso}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Provide feedback that it's outside rendered range (or render it)
            console.log('Date not in currently rendered view');
            // In a real infinite scroll, we'd jump to it. 
            // For this demo, we can clear and render around that date?
            // Let's just render the target month if not present
            renderMonth(date);
            setTimeout(() => {
                const newEl = document.querySelector(`.day-cell[data-date="${iso}"]`);
                if (newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        }
    }

    // 2. Paint / Drag Selection
    calendarWrapper.addEventListener('mousedown', (e) => {
        const cell = e.target.closest('.day-cell');
        if (!cell || cell.classList.contains('empty')) return;

        state.isDragging = true;
        const clickedDate = new Date(cell.dataset.date);

        state.selectionStart = clickedDate;
        state.selectionEnd = null; // Reset
        state.hoverDate = null;

        updateSelectionUI();
        if (navigator.vibrate) navigator.vibrate(5);
    });

    calendarWrapper.addEventListener('mouseover', (e) => {
        if (!state.isDragging) return;

        const cell = e.target.closest('.day-cell');
        if (!cell || cell.classList.contains('empty')) return;

        const date = new Date(cell.dataset.date);
        state.hoverDate = date;

        // Update visual selection instantly
        updateSelectionUI();
    });

    document.addEventListener('mouseup', () => {
        if (state.isDragging) {
            state.isDragging = false;
            // Finalize range
            if (state.hoverDate) {
                state.selectionEnd = state.hoverDate;
            }
            updateSelectionUI();
        }
    });

    // 3. Keyboard Navigation
    calendarWrapper.addEventListener('keydown', (e) => {
        // Arrow keys to move focus
        // We need a concept of "Focused Date" independent of selection?
        // Let's use state.currentDate as the "Focused/Cursor" date for keyboard.

        const step = (days) => {
            e.preventDefault();
            const newDate = new Date(state.currentDate);
            newDate.setDate(newDate.getDate() + days);
            state.currentDate = newDate;

            // Check if we need to render next/prev month
            renderMonth(state.currentDate);

            // Focus visual style? 
            // For now, we reuse scrollToDate logic and maybe add a 'focused' class
            updateSelectionUI(); // We'll add a 'focused' check in UI update
            scrollToDate(state.currentDate);
        };

        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowDown') step(7);
        if (e.key === 'ArrowUp') step(-7);

        if (e.key === 'Enter') {
            e.preventDefault();
            // Select current focused date
            state.selectionStart = state.currentDate;
            state.selectionEnd = null;
            updateSelectionUI();
            if (navigator.vibrate) navigator.vibrate(20);
        }
    });

    /**
     * Updates visual classes based on state
     */
    function updateSelectionUI() {
        const cells = document.querySelectorAll('.day-cell:not(.empty)');

        // Determine effective range including hover while dragging
        let effectiveStart = state.selectionStart;
        let effectiveEnd = state.selectionEnd;

        if (state.isDragging && state.hoverDate) {
            effectiveEnd = state.hoverDate;
        }

        // Normalize
        let start = effectiveStart;
        let end = effectiveEnd;
        if (start && end && start > end) {
            [start, end] = [end, start];
        }

        cells.forEach(cell => {
            const cellDate = new Date(cell.dataset.date);
            cell.classList.remove('selected', 'range-start', 'range-end', 'in-range', 'focused');

            // Keyboard Focus
            if (model.isSameDay(cellDate, state.currentDate)) {
                cell.classList.add('focused');
                cell.setAttribute('tabindex', '0');
                cell.focus();
            } else {
                cell.setAttribute('tabindex', '-1');
            }

            if (!start) return;

            // Single / Start
            if (model.isSameDay(cellDate, start)) {
                cell.classList.add('selected', 'range-start');
                if (!end) cell.classList.add('range-end');
            }

            // End
            if (end && model.isSameDay(cellDate, end)) {
                cell.classList.add('selected', 'range-end');
            }

            // Range
            if (end && cellDate > start && cellDate < end) {
                cell.classList.add('in-range');
            }
        });

        // Update Text
        if (start) {
            let text = start.toLocaleDateString();
            if (end) text += ' - ' + end.toLocaleDateString();
            selectionDisplay.textContent = text;
        }
    }

    // Export for debugging
    window.chronosState = state;
});
