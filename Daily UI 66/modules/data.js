/**
 * Data Layer - Mock data generation and normalization
 */

/**
 * Calculate efficiency using weighted scoring
 * @param {Object} completed - { highPriority: number, standard: number }
 * @param {Object} total - { highPriority: number, standard: number }
 * @returns {number} Efficiency percentage (0-100)
 */
export const calculateEfficiency = (completed, total) => {
    if (total.highPriority === 0 && total.standard === 0) return 0;
    
    // Apply weighted logic: complex tasks count for more
    const weightedScore = (completed.highPriority * 1.5) + completed.standard;
    const maxPossible = (total.highPriority * 1.5) + total.standard;
    
    return Math.min(Math.round((weightedScore / maxPossible) * 100), 100);
};

/**
 * Generate mock order data for a given period
 * @param {string} period - 'today', 'weekly', 'monthly', 'yearly'
 * @returns {Array} Array of data points
 */
export const generateOrderData = (period = 'monthly') => {
    const now = new Date();
    const data = [];
    
    let points, startDate, interval;
    
    switch (period) {
        case 'today':
            points = 24;
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            interval = 60 * 60 * 1000; // 1 hour
            break;
        case 'weekly':
            points = 7;
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
            interval = 24 * 60 * 60 * 1000; // 1 day
            break;
        case 'monthly':
            points = 12;
            startDate = new Date(now.getFullYear(), 0, 1);
            interval = (30.44 * 24 * 60 * 60 * 1000); // ~1 month
            break;
        case 'yearly':
            points = 12;
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            interval = (30.44 * 24 * 60 * 60 * 1000); // ~1 month
            break;
        default:
            points = 12;
            startDate = new Date(now.getFullYear(), 0, 1);
            interval = (30.44 * 24 * 60 * 60 * 1000);
    }
    
    for (let i = 0; i < points; i++) {
        const date = new Date(startDate.getTime() + (i * interval));
        const baseValue = 200 + Math.sin(i * 0.5) * 100;
        
        data.push({
            date: date.toISOString(),
            newOrders: Math.round(baseValue + Math.random() * 200),
            reportOrders: Math.round(baseValue * 0.8 + Math.random() * 150),
            lowerLimit: Math.round(baseValue * 0.5),
            timestamp: date.getTime()
        });
    }
    
    return data;
};

/**
 * Generate previous period data for ghost line
 * @param {string} period - Current period
 * @returns {Array} Previous period data
 */
export const generatePreviousPeriodData = (period = 'monthly') => {
    const now = new Date();
    const data = [];
    
    let points, startDate, interval;
    
    switch (period) {
        case 'today':
            points = 24;
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            interval = 60 * 60 * 1000;
            break;
        case 'weekly':
            points = 7;
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 13);
            interval = 24 * 60 * 60 * 1000;
            break;
        case 'monthly':
            points = 12;
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            interval = (30.44 * 24 * 60 * 60 * 1000);
            break;
        case 'yearly':
            points = 12;
            startDate = new Date(now.getFullYear() - 2, 0, 1);
            interval = (30.44 * 24 * 60 * 60 * 1000);
            break;
        default:
            points = 12;
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            interval = (30.44 * 24 * 60 * 60 * 1000);
    }
    
    for (let i = 0; i < points; i++) {
        const date = new Date(startDate.getTime() + (i * interval));
        const baseValue = 180 + Math.sin(i * 0.5) * 90;
        
        data.push({
            date: date.toISOString(),
            newOrders: Math.round(baseValue + Math.random() * 180),
            timestamp: date.getTime()
        });
    }
    
    return data;
};

/**
 * Generate efficiency data for a specific date
 * @param {string} dateISO - ISO date string (optional)
 * @returns {Object} Efficiency data
 */
export const generateEfficiencyData = (dateISO = null) => {
    const date = dateISO ? new Date(dateISO) : new Date();
    
    // Simulate varying efficiency
    const baseEfficiency = 65 + Math.sin(date.getTime() / 10000000) * 20;
    
    const highPriorityTotal = 20 + Math.floor(Math.random() * 10);
    const standardTotal = 50 + Math.floor(Math.random() * 20);
    
    const highPriorityCompleted = Math.round(highPriorityTotal * (baseEfficiency / 100) * 0.9);
    const standardCompleted = Math.round(standardTotal * (baseEfficiency / 100));
    
    return {
        date: date.toISOString(),
        efficiency: calculateEfficiency(
            { highPriority: highPriorityCompleted, standard: standardCompleted },
            { highPriority: highPriorityTotal, standard: standardTotal }
        ),
        completed: {
            highPriority: highPriorityCompleted,
            standard: standardCompleted
        },
        total: {
            highPriority: highPriorityTotal,
            standard: standardTotal
        }
    };
};

/**
 * Generate completed tasks data
 * @param {string} dateISO - ISO date string (optional)
 * @returns {Array} Array of task objects
 */
export const generateCompletedTasks = (dateISO = null) => {
    const tasks = [
        { id: 1, name: 'Data Processing', category: 'high' },
        { id: 2, name: 'Report Generation', category: 'high' },
        { id: 3, name: 'System Maintenance', category: 'standard' },
        { id: 4, name: 'Code Review', category: 'standard' },
        { id: 5, name: 'Documentation', category: 'standard' },
    ];
    
    const date = dateISO ? new Date(dateISO) : new Date();
    const baseValue = 70 + Math.sin(date.getTime() / 10000000) * 25;
    
    return tasks.map(task => {
        const completion = Math.round(baseValue + (Math.random() - 0.5) * 20);
        return {
            ...task,
            completed: Math.max(0, Math.min(100, completion)),
            total: 100
        };
    });
};

/**
 * Generate activity heatmap data
 * @param {string} period - 'daily', 'weekly', 'monthly'
 * @returns {Object} Heatmap data structure
 */
export const generateHeatmapData = (period = 'daily') => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const times = ['10am', '12am', '2pm', '4pm'];
    
    const data = {};
    
    days.forEach(day => {
        times.forEach(time => {
            const key = `${day}-${time}`;
            // Generate activity values (0-300)
            const value = Math.floor(Math.random() * 300);
            data[key] = {
                day,
                time,
                value,
                date: new Date().toISOString() // Simplified for demo
            };
        });
    });
    
    return { days, times, data };
};

/**
 * Filter data by date
 * @param {Array} data - Data array
 * @param {string} dateISO - ISO date string
 * @returns {Array} Filtered data
 */
export const filterByDate = (data, dateISO) => {
    if (!dateISO) return data;
    
    const targetDate = new Date(dateISO);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    return data.filter(item => {
        const itemDate = new Date(item.date || item.timestamp);
        return itemDate >= startOfDay && itemDate <= endOfDay;
    });
};

/**
 * Get total orders count
 * @param {Array} orderData - Order data array
 * @returns {number} Total orders
 */
export const getTotalOrders = (orderData) => {
    return orderData.reduce((sum, point) => sum + point.newOrders, 0);
};

/**
 * Format date for display
 * @param {string} dateISO - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateISO) => {
    const date = new Date(dateISO);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Format date for chart labels
 * @param {string} dateISO - ISO date string
 * @param {string} period - Time period
 * @returns {string} Formatted label
 */
export const formatChartLabel = (dateISO, period) => {
    const date = new Date(dateISO);
    
    switch (period) {
        case 'today':
            return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        case 'weekly':
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        case 'monthly':
            return date.toLocaleDateString('en-US', { month: 'short' });
        case 'yearly':
            return date.toLocaleDateString('en-US', { month: 'short' });
        default:
            return date.toLocaleDateString('en-US', { month: 'short' });
    }
};

