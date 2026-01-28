/**
 * OmniSight Analytics Dashboard - Main Integration
 * Connects all modules and manages application state
 */

import { MultiLineChart } from './modules/chart.js';
import { createMultipleGauges, updateGauge } from './modules/gauge.js';
import { ActivityHeatmap } from './modules/heatmap.js';
import { FloatingTooltip } from './modules/tooltip.js';
import { useWebSocket } from './modules/websocket.js';
import { showExportMenu, exportAsPNG } from './modules/export.js';
import {
    generateOrderData,
    generatePreviousPeriodData,
    generateEfficiencyData,
    generateCompletedTasks,
    generateHeatmapData,
    getTotalOrders,
    formatDate
} from './modules/data.js';
import { gsap } from 'gsap';

class OmniSightDashboard {
    constructor() {
        this.currentPeriod = 'monthly';
        this.selectedDate = null;
        this.chart = null;
        this.heatmap = null;
        this.tooltip = null;
        this.gauges = [];
        this.ws = null;
        
        this.init();
    }

    init() {
        // Initialize components
        this.initChart();
        this.initGauges();
        this.initHeatmap();
        this.initTooltip();
        this.initWebSocket();
        this.initEventListeners();
        
        // Load initial data
        this.loadDashboardData();
        
        // Hide skeleton loaders after a short delay
        setTimeout(() => {
            this.hideSkeletons();
        }, 500);
    }

    initChart() {
        const chartContainer = document.getElementById('orders-chart');
        if (!chartContainer) return;
        
        // Get container dimensions
        const rect = chartContainer.getBoundingClientRect();
        
        this.chart = new MultiLineChart(chartContainer, {
            width: rect.width || 800,
            height: 320,
            margin: { top: 20, right: 30, bottom: 40, left: 50 }
        });
        
        // Set up drill-down handler
        this.chart.setOnDataPointClick((date) => {
            this.handleChartClick(date);
        });
        
        // Set up tooltip handlers
        this.chart.setOnPointHover((event, data) => {
            if (this.tooltip) {
                this.tooltip.showChartTooltip(event.currentTarget, data);
            }
        });
        
        this.chart.setOnPointLeave(() => {
            if (this.tooltip) {
                this.tooltip.hide();
            }
        });
    }

    initGauges() {
        const gaugesContainer = document.getElementById('efficiency-gauges');
        if (!gaugesContainer) return;
        
        // Create initial gauges
        const initialData = generateEfficiencyData();
        this.gauges = createMultipleGauges(gaugesContainer, [
            { value: initialData.efficiency, label: 'Overall Efficiency' },
            { value: Math.round(initialData.efficiency * 0.85), label: 'Task Completion' }
        ]);
    }

    initHeatmap() {
        const heatmapContainer = document.getElementById('activity-heatmap');
        if (!heatmapContainer) return;
        
        this.heatmap = new ActivityHeatmap(heatmapContainer, {
            cellSize: 40,
            cellPadding: 4
        });
        
        // Set up hover handlers
        this.heatmap.setOnCellHover((event, data) => {
            if (this.tooltip) {
                this.tooltip.showHeatmapTooltip(event.currentTarget, data);
            }
        });
        
        this.heatmap.setOnCellLeave(() => {
            if (this.tooltip) {
                this.tooltip.hide();
            }
        });
    }

    initTooltip() {
        const portal = document.getElementById('tooltip-portal');
        this.tooltip = new FloatingTooltip(portal);
    }

    initWebSocket() {
        // Connect to WebSocket simulation
        this.ws = useWebSocket('ws://localhost:8080');
        
        // Subscribe to real-time updates
        this.ws.subscribe((data) => {
            if (data && data.type === 'dashboard_update') {
                this.handleWebSocketUpdate(data);
            }
        });
    }

    initEventListeners() {
        // Time period filters
        document.querySelectorAll('.time-filter').forEach(button => {
            button.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.handlePeriodChange(period);
            });
        });
        
        // Threshold filters
        document.querySelectorAll('.threshold-filter').forEach(button => {
            button.addEventListener('click', (e) => {
                const threshold = parseInt(e.target.dataset.threshold);
                this.handleThresholdChange(threshold, e.target);
            });
        });
        
        // Heatmap period selector
        const heatmapPeriod = document.getElementById('heatmap-period');
        if (heatmapPeriod) {
            heatmapPeriod.addEventListener('change', (e) => {
                // Update heatmap data for selected period
                const heatmapData = generateHeatmapData(e.target.value);
                this.heatmap.update(heatmapData, this.heatmap.threshold);
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                const dashboard = document.querySelector('.dashboard-container');
                showExportMenu(e.target, dashboard);
            });
        }
        
        // Chart hover for tooltip
        if (this.chart && this.chart.pointsGroup) {
            // Tooltip will be handled by chart point interactions
            // We'll add event listeners in updateChart method
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.selectedDate = null;
                this.loadDashboardData();
            }
        });
    }

    loadDashboardData() {
        // Generate order data
        const orderData = generateOrderData(this.currentPeriod);
        const previousData = generatePreviousPeriodData(this.currentPeriod);
        
        // Update chart
        if (this.chart) {
            this.chart.update(orderData, previousData, this.currentPeriod);
        }
        
        // Update orders count
        const totalOrders = getTotalOrders(orderData);
        const ordersCountEl = document.getElementById('orders-count');
        if (ordersCountEl) {
            gsap.to({ value: parseInt(ordersCountEl.textContent.replace(/,/g, '')) || 0 }, {
                value: totalOrders,
                duration: 0.8,
                ease: 'power2.out',
                onUpdate: function() {
                    ordersCountEl.textContent = `${Math.round(this.targets()[0].value).toLocaleString()} orders`;
                }
            });
        }
        
        // Update efficiency data
        const efficiencyData = generateEfficiencyData(this.selectedDate);
        if (this.gauges.length > 0) {
            updateGauge(this.gauges[0], efficiencyData.efficiency);
            if (this.gauges.length > 1) {
                updateGauge(this.gauges[1], Math.round(efficiencyData.efficiency * 0.85));
            }
        }
        
        // Update completed tasks
        this.updateCompletedTasks(this.selectedDate);
        
        // Update heatmap
        const heatmapData = generateHeatmapData('daily');
        if (this.heatmap) {
            this.heatmap.update(heatmapData, this.heatmap.threshold);
        }
    }

    updateCompletedTasks(dateISO = null) {
        const tasksContainer = document.getElementById('completed-tasks');
        if (!tasksContainer) return;
        
        const tasks = generateCompletedTasks(dateISO);
        
        // Clear existing tasks
        tasksContainer.innerHTML = '';
        
        // Create task bars
        tasks.forEach(task => {
            const taskBar = document.createElement('div');
            taskBar.className = 'task-bar-container';
            taskBar.innerHTML = `
                <div class="task-bar-label">${task.name}</div>
                <div class="task-bar">
                    <div class="task-bar-fill" style="width: 0%"></div>
                    <div class="task-bar-value">${task.completed}%</div>
                </div>
            `;
            
            tasksContainer.appendChild(taskBar);
            
            // Animate bar fill
            const fillBar = taskBar.querySelector('.task-bar-fill');
            gsap.to(fillBar, {
                width: `${task.completed}%`,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.1
            });
        });
    }

    handlePeriodChange(period) {
        if (period === this.currentPeriod) return;
        
        this.currentPeriod = period;
        
        // Update active button
        document.querySelectorAll('.time-filter').forEach(btn => {
            if (btn.dataset.period === period) {
                btn.classList.add('active', 'bg-blue-600', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-600');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active', 'bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-600');
                btn.setAttribute('aria-selected', 'false');
            }
        });
        
        // Reload data with new period
        this.loadDashboardData();
        
        // Announce to screen readers
        this.announceToScreenReader(`Chart period changed to ${period}`);
    }

    handleThresholdChange(threshold, button) {
        // Update active button
        document.querySelectorAll('.threshold-filter').forEach(btn => {
            if (btn === button) {
                btn.classList.add('active', 'bg-blue-600', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-600');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active', 'bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-600');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
        
        // Update heatmap
        if (this.heatmap) {
            this.heatmap.setThreshold(threshold);
        }
    }

    handleChartClick(date) {
        this.selectedDate = date;
        
        // Filter sidebar data to selected date
        const efficiencyData = generateEfficiencyData(date);
        
        // Animate gauge updates
        if (this.gauges.length > 0) {
            updateGauge(this.gauges[0], efficiencyData.efficiency);
            if (this.gauges.length > 1) {
                updateGauge(this.gauges[1], Math.round(efficiencyData.efficiency * 0.85));
            }
        }
        
        // Update completed tasks
        this.updateCompletedTasks(date);
        
        // Announce to screen readers
        const formattedDate = formatDate(date);
        this.announceToScreenReader(`Dashboard filtered to ${formattedDate}`);
    }

    handleWebSocketUpdate(data) {
        // Update efficiency gauges without full re-render
        if (data.efficiency && this.gauges.length > 0) {
            updateGauge(this.gauges[0], data.efficiency.efficiency);
            if (this.gauges.length > 1) {
                updateGauge(this.gauges[1], Math.round(data.efficiency.efficiency * 0.85));
            }
        }
        
        // Update completed tasks
        if (data.tasks) {
            // Update task bars smoothly
            const tasksContainer = document.getElementById('completed-tasks');
            if (tasksContainer) {
                data.tasks.forEach((task, index) => {
                    const taskBar = tasksContainer.children[index];
                    if (taskBar) {
                        const fillBar = taskBar.querySelector('.task-bar-fill');
                        const valueText = taskBar.querySelector('.task-bar-value');
                        if (fillBar && valueText) {
                            gsap.to(fillBar, {
                                width: `${task.completed}%`,
                                duration: 0.6,
                                ease: 'power2.out'
                            });
                            
                            gsap.to({ value: parseInt(valueText.textContent) || 0 }, {
                                value: task.completed,
                                duration: 0.6,
                                ease: 'power2.out',
                                onUpdate: function() {
                                    valueText.textContent = `${Math.round(this.targets()[0].value)}%`;
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    hideSkeletons() {
        // Remove skeleton classes
        document.querySelectorAll('.skeleton').forEach(el => {
            el.style.display = 'none';
        });
        
        // Add content-loaded class
        document.body.classList.add('content-loaded');
    }

    announceToScreenReader(message) {
        // Create temporary aria-live region
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.omnisight = new OmniSightDashboard();
    });
} else {
    window.omnisight = new OmniSightDashboard();
}

