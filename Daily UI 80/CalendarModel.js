/**
 * Chronos Calendar Model
 * Handles all date math, leap years, and grid generation.
 * Pure JS, no libraries.
 */

class CalendarModel {
    constructor() {
        this.today = new Date();
    }

    /**
     * Returns true if year is a leap year.
     * Rule: Divisible by 4, unless divisible by 100 but not 400.
     */
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Returns number of days in a specific month (0-11).
     */
    getDaysInMonth(year, month) {
        // Tip: Date(year, month + 1, 0).getDate() returns last day of previous month effectively
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * Returns the day of the week (0-6) for the 1st of the month.
     */
    getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    /**
     * Generates a flat array of day objects for a given month grid.
     * Includes padding days from previous/next months for a full 7-column grid if needed,
     * OR just the days for infinite scroll depending on UI strategy.
     * For "Infinite Scroll" vertical view, we might just need the days of the month
     * plus an offset for the starting column.
     */
    generateMonthData(year, month) {
        const daysInMonth = this.getDaysInMonth(year, month);
        const firstDayIndex = this.getFirstDayOfMonth(year, month);
        const days = [];

        // Add empty slots for padding (or previous month's days if we wanted to show them)
        // For the vertical view, it's often cleaner to just have empty slots or offset
        for (let i = 0; i < firstDayIndex; i++) {
            days.push({ type: 'empty' });
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push({
                type: 'day',
                date: date,
                dayNumber: day,
                isToday: this.isSameDay(date, this.today),
                isWeekend: date.getDay() === 0 || date.getDay() === 6
                // simulated busy status could go here
            });
        }

        return days;
    }

    isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    addMonths(date, count) {
        const d = new Date(date);
        d.setMonth(d.getMonth() + count);
        return d;
    }
}
