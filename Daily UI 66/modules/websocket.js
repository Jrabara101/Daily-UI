/**
 * WebSocket Simulation with Hook-like Pattern
 * Simulates real-time data streaming for dashboard updates
 */

import { generateEfficiencyData, generateCompletedTasks } from './data.js';

/**
 * WebSocket Manager Class
 * Manages WebSocket-like connection and subscriber pattern
 */
export class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.subscribers = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.intervalId = null;
        this.currentData = null;
        this.isConnected = false;
    }

    /**
     * Subscribe to data updates
     * @param {Function} callback - Callback function to receive updates
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        
        // If already connected, send current data immediately
        if (this.isConnected && this.currentData) {
            requestAnimationFrame(() => callback(this.currentData));
        }
    }

    /**
     * Unsubscribe from data updates
     * @param {Function} callback - Callback function to remove
     */
    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    /**
     * Notify all subscribers of new data
     * @param {Object} data - Data to broadcast
     */
    notify(data) {
        this.currentData = data;
        // Use requestAnimationFrame for smooth 60fps updates
        requestAnimationFrame(() => {
            this.subscribers.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Subscriber callback error:', error);
                }
            });
        });
    }

    /**
     * Simulate WebSocket connection
     */
    connect() {
        if (this.isConnected) return;
        
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Simulate initial connection
        this.simulateDataUpdate();
        
        // Simulate data stream every 2-3 seconds
        this.intervalId = setInterval(() => {
            this.simulateDataUpdate();
        }, 2000 + Math.random() * 1000);
    }

    /**
     * Simulate data update
     */
    simulateDataUpdate() {
        // Generate fresh efficiency and task data
        const efficiencyData = generateEfficiencyData();
        const tasksData = generateCompletedTasks();
        
        const updateData = {
            type: 'dashboard_update',
            timestamp: new Date().toISOString(),
            efficiency: efficiencyData,
            tasks: tasksData
        };
        
        this.notify(updateData);
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        this.isConnected = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.subscribers.clear();
    }

    /**
     * Reconnect with exponential backoff
     */
    reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        setTimeout(() => {
            console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
            this.connect();
        }, delay);
    }
}

/**
 * Hook-like function for WebSocket usage
 * Similar to React's useWebSocket hook pattern
 * @param {string} url - WebSocket URL (simulated)
 * @returns {Object} WebSocket interface
 */
export const useWebSocket = (url = 'ws://localhost:8080') => {
    // Create singleton instance per URL
    if (!useWebSocket.instances) {
        useWebSocket.instances = new Map();
    }
    
    if (!useWebSocket.instances.has(url)) {
        const manager = new WebSocketManager(url);
        useWebSocket.instances.set(url, manager);
        manager.connect();
    }
    
    const manager = useWebSocket.instances.get(url);
    
    return {
        data: manager.currentData,
        subscribe: (callback) => manager.subscribe(callback),
        unsubscribe: (callback) => manager.unsubscribe(callback),
        connect: () => manager.connect(),
        disconnect: () => manager.disconnect(),
        isConnected: manager.isConnected
    };
};

/**
 * Cleanup function to disconnect all WebSocket instances
 */
export const cleanupWebSockets = () => {
    if (useWebSocket.instances) {
        useWebSocket.instances.forEach(manager => manager.disconnect());
        useWebSocket.instances.clear();
    }
};

