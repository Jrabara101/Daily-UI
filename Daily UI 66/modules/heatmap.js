/**
 * Activity Heatmap Module
 * Grid-based heatmap visualization
 */

import * as d3 from 'd3';

export class ActivityHeatmap {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            cellSize: options.cellSize || 40,
            cellPadding: options.cellPadding || 4,
            ...options
        };
        
        this.data = null;
        this.filteredData = null;
        this.threshold = null;
        
        this.init();
    }

    init() {
        // Clear container
        d3.select(this.container).selectAll('*').remove();
        
        // Create SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 600 300')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('class', 'heatmap-svg')
            .attr('role', 'img')
            .attr('aria-label', 'Activity heatmap');
        
        // Create main group
        this.g = this.svg.append('g')
            .attr('transform', 'translate(60, 40)');
        
        // Create scales
        this.xScale = d3.scaleBand()
            .paddingInner(0.1);
        
        this.yScale = d3.scaleBand()
            .paddingInner(0.1);
        
        // Color scale
        this.colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, 300]);
    }

    update(data, threshold = null) {
        if (!data || !data.data) return;
        
        this.data = data;
        this.threshold = threshold;
        this.filteredData = this.filterData(data, threshold);
        
        // Update scales
        this.xScale.domain(data.days);
        this.yScale.domain(data.times);
        
        const cellSize = this.options.cellSize;
        const cellPadding = this.options.cellPadding;
        
        this.xScale.range([0, data.days.length * (cellSize + cellPadding)]);
        this.yScale.range([0, data.times.length * (cellSize + cellPadding)]);
        
        // Update viewBox
        const width = data.days.length * (cellSize + cellPadding) + 60;
        const height = data.times.length * (cellSize + cellPadding) + 80;
        this.svg.attr('viewBox', `0 0 ${width} ${height}`);
        
        // Render heatmap
        this.render();
    }

    filterData(data, threshold) {
        if (!threshold) return data;
        
        const filtered = { ...data, data: {} };
        
        Object.keys(data.data).forEach(key => {
            const value = data.data[key].value;
            if (value >= threshold) {
                filtered.data[key] = data.data[key];
            }
        });
        
        return filtered;
    }

    render() {
        if (!this.filteredData) return;
        
        // Remove existing cells
        this.g.selectAll('.heatmap-cell').remove();
        
        // Get max value for color scaling
        const maxValue = d3.max(Object.values(this.filteredData.data), d => d.value) || 1;
        this.colorScale.domain([0, maxValue]);
        
        // Create cells
        const cells = this.g.selectAll('.heatmap-cell')
            .data(Object.values(this.filteredData.data))
            .enter()
            .append('rect')
            .attr('class', 'heatmap-cell')
            .attr('x', d => this.xScale(d.day))
            .attr('y', d => this.yScale(d.time))
            .attr('width', this.xScale.bandwidth())
            .attr('height', this.yScale.bandwidth())
            .attr('fill', d => this.colorScale(d.value))
            .attr('rx', 4)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .attr('cursor', 'pointer')
            .attr('tabindex', 0)
            .attr('role', 'button')
            .attr('aria-label', d => `Activity: ${d.value} on ${d.day} at ${d.time}`)
            .on('mouseenter', (event, d) => this.handleCellHover(event, d))
            .on('mouseleave', () => this.handleCellLeave())
            .on('click', (event, d) => this.handleCellClick(event, d))
            .on('keydown', (event, d) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.handleCellClick(event, d);
                }
            });
        
        // Add labels
        this.renderLabels();
    }

    renderLabels() {
        // Remove existing labels
        this.g.selectAll('.axis-label').remove();
        
        // X-axis labels (days)
        this.g.selectAll('.day-label')
            .data(this.filteredData.days)
            .enter()
            .append('text')
            .attr('class', 'axis-label day-label')
            .attr('x', d => this.xScale(d) + this.xScale.bandwidth() / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#6b7280')
            .attr('font-size', '12px')
            .text(d => d);
        
        // Y-axis labels (times)
        this.g.selectAll('.time-label')
            .data(this.filteredData.times)
            .enter()
            .append('text')
            .attr('class', 'axis-label time-label')
            .attr('x', -10)
            .attr('y', d => this.yScale(d) + this.yScale.bandwidth() / 2)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#6b7280')
            .attr('font-size', '12px')
            .text(d => d);
    }

    handleCellHover(event, data) {
        // Highlight cell
        d3.select(event.currentTarget)
            .attr('opacity', 0.8)
            .attr('transform', 'scale(1.05)')
            .attr('transform-origin', 'center');
        
        // Show tooltip (will be handled by tooltip module)
        if (this.onCellHover) {
            this.onCellHover(event, data);
        }
    }

    handleCellLeave() {
        // Reset cell
        this.g.selectAll('.heatmap-cell')
            .attr('opacity', 1)
            .attr('transform', 'scale(1)');
        
        // Hide tooltip
        if (this.onCellLeave) {
            this.onCellLeave();
        }
    }

    handleCellClick(event, data) {
        // Visual feedback
        d3.select(event.currentTarget)
            .transition()
            .duration(150)
            .attr('opacity', 0.6)
            .transition()
            .duration(150)
            .attr('opacity', 1);
        
        // Trigger callback
        if (this.onCellClick) {
            this.onCellClick(data);
        }
    }

    setOnCellHover(callback) {
        this.onCellHover = callback;
    }

    setOnCellLeave(callback) {
        this.onCellLeave = callback;
    }

    setOnCellClick(callback) {
        this.onCellClick = callback;
    }

    setThreshold(threshold) {
        this.update(this.data, threshold);
    }
}

