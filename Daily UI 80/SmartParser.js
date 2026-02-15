/**
 * Senior Logic: Natural Language Date Parser
 * Converts phrases like 'Next Monday' into a Date object.
 */
const parseSmartDate = (input) => {
    if (!input) return null;

    const now = new Date();
    // Reset hours to avoid time conflicts
    now.setHours(0, 0, 0, 0);

    const text = input.toLowerCase().trim();

    // Basic Keywords
    if (text === 'today') return now;
    if (text === 'tomorrow' || text === 'tmrw') {
        const d = new Date(now);
        d.setDate(d.getDate() + 1);
        return d;
    }

    // "In X days" or "X days from now"
    const daysFromNowMatch = text.match(/(\d+)\s+days?\s+(from\s+now|ago)?/); // simple match
    if (daysFromNowMatch) {
        const days = parseInt(daysFromNowMatch[1]);
        const isAgo = text.includes('ago');
        const d = new Date(now);
        d.setDate(d.getDate() + (isAgo ? -days : days));
        return d;
    }

    // "Next [Day]" Logic (e.g., "Next Friday")
    if (text.startsWith('next ')) {
        const dayName = text.split(' ')[1];
        if (dayName) {
            const dayIndex = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
                .indexOf(dayName.slice(0, 3));

            if (dayIndex !== -1) {
                // Determine distance. 
                // If today is Monday(1) and we want Next Friday(5):
                // distance = 5 - 1 = 4. 
                // But usually "Next Friday" implies the one *after* this coming one? 
                // Usage varies. The prompt code uses `(dayIndex + 7 - now.getDay()) % 7 || 7`.
                // If today is Friday, next Friday is 7 days away. Correct.

                const currentDay = now.getDay();
                const distance = (dayIndex + 7 - currentDay) % 7 || 7;

                const d = new Date(now);
                d.setDate(d.getDate() + distance);
                return d;
            }
        }
    }

    // Specific Date formats (e.g. "Dec 25", "12/25") could be added here
    // but sticking to the NLP requirement first.

    return null; // Fallback or invalid
};
