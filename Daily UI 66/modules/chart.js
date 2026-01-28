/**
 * Multi-Line Chart Module
 * D3.js implementation with Canvas fallback for performance
 */

import * as d3 from 'd3';
import { gsap } from 'gsap';
import { formatChartLabel } from './data.js';

export class MultiLineChart {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            width: options.width || 800,
            height: options.height || 320,
            margin: options.margin || { top: 20, right: 30, bottom: 40, left: 50 },
            useCanvas: options.useCanvas || false,
            ...options
        };
        
        this.data = [];
        this.previousData = [];
        this.currentPeriod = 'monthly';
        this.selectedDate = null;
        this.onDataPointClick = null;
        
        this.init();
    }

    init() {
        // Clear container
        d3.select(this.container).selectAll('*').remove();
        
        // Calculate dimensions
        this.width = this.options.width - this.options.margin.left - this.options.margin.right;
        this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // Create SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .attr('class', 'chart-container')
            .attr('role', 'img')
            .attr('aria-label', 'Orders line chart');
        
        // Create main group
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
        
        // Create canvas for high-performance rendering if needed
        if (this.options.useCanvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = `${this.options.margin.left}px`;
            this.canvas.style.top = `${this.options.margin.top}px`;
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }
        
        // Create scales
        this.xScale = d3.scaleTime().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);
        
        // Create axes
        this.xAxis = d3.axisBottom(this.xScale)
            .tickFormat(d => formatChartLabel(d.toISOString(), this.currentPeriod));
        
        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(5);
        
        // Add axes
        this.g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(this.xAxis);
        
        this.g.append('g')
            .attr('class', 'y-axis')
            .call(this.yAxis);
        
        // Add grid lines
        this.g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScale)
                .tickSize(-this.height)
                .tickFormat(''))
            .selectAll('line')
            .attr('stroke', '#e5e7eb')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2');
        
        this.g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(this.yScale)
                .tickSize(-this.width)
                .tickFormat(''))
            .selectAll('line')
            .attr('stroke', '#e5e7eb')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2');
        
        // Create line generators
        this.lineNewOrders = d3.line()
            .x(d => this.xScale(new Date(d.date)))
            .y(d => this.yScale(d.newOrders))
            .curve(d3.curveMonotoneX);
        
        this.lineReportOrders = d3.line()
            .x(d => this.xScale(new Date(d.date)))
            .y(d => this.yScale(d.reportOrders))
            .curve(d3.curveMonotoneX);
        
        this.lineLowerLimit = d3.line()
            .x(d => this.xScale(new Date(d.date)))
            .y(d => this.yScale(d.lowerLimit))
            .curve(d3.curveMonotoneX);
        
        this.lineGhost = d3.line()
            .x(d => this.xScale(new Date(d.date)))
            .y(d => this.yScale(d.newOrders))
            .curve(d3.curveMonotoneX);
        
        // Create line paths
        this.pathNewOrders = this.g.append('path')
            .attr('class', 'chart-line chart-line-new-orders')
            .attr('stroke', '#ec4899')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('stroke-dasharray', 'none')
            .attr('aria-label', 'New orders line');
        
        this.pathReportOrders = this.g.append('path')
            .attr('class', 'chart-line chart-line-report-orders')
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('stroke-dasharray', 'none')
            .attr('aria-label', 'Report orders line');
        
        this.pathLowerLimit = this.g.append('path')
            .attr('class', 'chart-line chart-line-lower-limit')
            .attr('stroke', '#eab308')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('stroke-dasharray', '5,5')
            .attr('aria-label', 'Lower limit line');
        
        this.pathGhost = this.g.append('path')
            .attr('class', 'chart-ghost-line')
            .attr('stroke', 'rgba(0, 0, 0, 0.15)')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('stroke-dasharray', '8,4')
            .attr('opacity', 0.3);
        
        // Create data points group
        this.pointsGroup = this.g.append('g')
            .attr('class', 'data-points');
        
        // Add legend
        this.createLegend();
    }

    createLegend() {
        const legend = this.g.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.width - 200}, 20)`);
        
        const items = [
            { label: 'New orders', color: '#ec4899', pattern: 'solid' },
            { label: 'Report orders', color: '#3b82f6', pattern: 'solid' },
            { label: 'Lower limit', color: '#eab308', pattern: 'dashed' }
        ];
        
        items.forEach((item, i) => {
            const itemGroup = legend.append('g')
                .attr('transform', `translate(0, ${i * 20})`);
            
            itemGroup.append('line')
                .attr('x1', 0)
                .attr('x2', 20)
                .attr('y1', 0)
                .attr('y2', 0)
                .attr('stroke', item.color)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', item.pattern === 'dashed' ? '5,5' : 'none');
            
            itemGroup.append('text')
                .attr('x', 25)
                .attr('y', 4)
                .attr('fill', '#6b7280')
                .attr('font-size', '12px')
                .text(item.label);
        });
    }

    update(data, previousData = [], period = 'monthly') {
        if (!data || data.length === 0) return;
        
        this.data = data;
        this.previousData = previousData;
        this.currentPeriod = period;
        
        // Check if we should use canvas (more than 5000 points)
        const totalPoints = data.length * 3; // 3 series
        if (totalPoints > 5000 && !this.options.useCanvas) {
            // Switch to canvas mode
            this.options.useCanvas = true;
            this.init(); // Reinitialize with canvas
            return this.update(data, previousData, period);
        }
        
        // Update scales
        const allValues = [
            ...data.map(d => d.newOrders),
            ...data.map(d => d.reportOrders),
            ...data.map(d => d.lowerLimit),
            ...previousData.map(d => d.newOrders)
        ];
        
        const xExtent = d3.extent(data, d => new Date(d.date));
        const yExtent = [0, d3.max(allValues) * 1.1];
        
        this.xScale.domain(xExtent);
        this.yScale.domain(yExtent);
        
        // Update axes with adaptive ticks
        this.updateAxes(period);
        
        // Animate update with GSAP
        this.animateUpdate();
    }

    updateAxes(period) {
        // Adaptive tick density based on period
        let tickCount;
        switch (period) {
            case 'today':
                tickCount = 12;
                break;
            case 'weekly':
                tickCount = 7;
                break;
            case 'monthly':
                tickCount = 12;
                break;
            case 'yearly':
                tickCount = 12;
                break;
            default:
                tickCount = 12;
        }
        
        this.xAxis.ticks(tickCount);
        this.yAxis.ticks(5);
        
        // Update axes
        this.g.select('.x-axis')
            .transition()
            .duration(600)
            .call(this.xAxis);
        
        this.g.select('.y-axis')
            .transition()
            .duration(600)
            .call(this.yAxis);
        
        // Update grid
        this.g.selectAll('.grid').remove();
        
        this.g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScale)
                .ticks(tickCount)
                .tickSize(-this.height)
                .tickFormat(''))
            .selectAll('line')
            .attr('stroke', '#e5e7eb')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2');
        
        this.g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(this.yScale)
                .ticks(5)
                .tickSize(-this.width)
                .tickFormat(''))
            .selectAll('line')
            .attr('stroke', '#e5e7eb')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2');
    }

    animateUpdate() {
        if (this.options.useCanvas) {
            this.renderCanvas();
        } else {
            // Animate paths with GSAP
            const paths = [
                { path: this.pathNewOrders, line: this.lineNewOrders, data: this.data },
                { path: this.pathReportOrders, line: this.lineReportOrders, data: this.data },
                { path: this.pathLowerLimit, line: this.lineLowerLimit, data: this.data }
            ];
            
            paths.forEach(({ path, line, data }) => {
                const pathString = line(data);
                const currentPath = path.attr('d') || '';
                
                // Set initial path
                path.attr('d', currentPath);
                
                // Animate to new path
                gsap.to(path.node(), {
                    duration: 0.8,
                    ease: 'power2.inOut',
                    attr: { d: pathString }
                });
            });
            
            // Update ghost line
            if (this.previousData.length > 0) {
                const ghostPath = this.lineGhost(this.previousData);
                this.pathGhost
                    .attr('d', ghostPath)
                    .attr('opacity', 0.3);
            }
            
            // Update data points
            this.updateDataPoints();
        }
    }

    renderCanvas() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw ghost line
        if (this.previousData.length > 0) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([8, 4]);
            this.ctx.globalAlpha = 0.3;
            
            this.lineGhost.context(this.ctx)(this.previousData);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
        }
        
        // Draw lines
        const lines = [
            { data: this.data, color: '#ec4899', getY: d => d.newOrders },
            { data: this.data, color: '#3b82f6', getY: d => d.reportOrders },
            { data: this.data, color: '#eab308', getY: d => d.lowerLimit, dash: [5, 5] }
        ];
        
        lines.forEach(({ data, color, getY, dash }) => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            if (dash) this.ctx.setLineDash(dash);
            
            this.ctx.moveTo(
                this.xScale(new Date(data[0].date)),
                this.yScale(getY(data[0]))
            );
            
            for (let i = 1; i < data.length; i++) {
                this.ctx.lineTo(
                    this.xScale(new Date(data[i].date)),
                    this.yScale(getY(data[i]))
                );
            }
            
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }

    updateDataPoints() {
        // Remove existing points
        this.pointsGroup.selectAll('.chart-point').remove();
        
        // Create points for each series
        const series = [
            { data: this.data, color: '#ec4899', getY: d => d.newOrders, name: 'New orders' },
            { data: this.data, color: '#3b82f6', getY: d => d.reportOrders, name: 'Report orders' }
        ];
        
        series.forEach(({ data, color, getY, name }) => {
            const points = this.pointsGroup.selectAll(`.point-${name.replace(/\s/g, '-')}`)
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'chart-point')
                .attr('cx', d => this.xScale(new Date(d.date)))
                .attr('cy', d => this.yScale(getY(d)))
                .attr('r', 4)
                .attr('fill', color)
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .attr('cursor', 'pointer')
                .attr('tabindex', 0)
                .attr('role', 'button')
                .attr('aria-label', d => `${name}: ${getY(d)} on ${new Date(d.date).toLocaleDateString()}`)
                .on('mouseenter', (event, d) => {
                    if (this.onPointHover) {
                        this.onPointHover(event, { series: name, value: getY(d), date: d.date });
                    }
                })
                .on('mouseleave', () => {
                    if (this.onPointLeave) {
                        this.onPointLeave();
                    }
                })
                .on('click', (event, d) => this.handlePointClick(event, d))
                .on('keydown', (event, d) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this.handlePointClick(event, d);
                    }
                });
        });
    }

    handlePointClick(event, data) {
        this.selectedDate = data.date;
        
        // Visual feedback
        d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 6)
            .transition()
            .duration(200)
            .attr('r', 4);
        
        // Trigger callback
        if (this.onDataPointClick) {
            this.onDataPointClick(data.date);
        }
    }

    setOnPointHover(callback) {
        this.onPointHover = callback;
    }

    setOnPointLeave(callback) {
        this.onPointLeave = callback;
    }

    setOnDataPointClick(callback) {
        this.onDataPointClick = callback;
    }

    resize(width, height) {
        this.options.width = width;
        this.options.height = height;
        this.width = width - this.options.margin.left - this.options.margin.right;
        this.height = height - this.options.margin.top - this.options.margin.bottom;
        
        this.svg.attr('width', width).attr('height', height);
        
        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        
        this.xScale.range([0, this.width]);
        this.yScale.range([this.height, 0]);
        
        this.update(this.data, this.previousData, this.currentPeriod);
    }
}

