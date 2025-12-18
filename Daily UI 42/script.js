// Todo App State
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const filterTabs = document.querySelectorAll('.filter-tab');
const clearCompletedBtn = document.getElementById('clear-completed');
const totalCountEl = document.getElementById('total-count');
const activeCountEl = document.getElementById('active-count');
const completedCountEl = document.getElementById('completed-count');

// Initialize App
function init() {
    loadTodos();
    renderTodos();
    updateStats();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add todo form
    todoForm.addEventListener('submit', handleAddTodo);
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => handleFilterChange(tab.dataset.filter));
    });
    
    // Clear completed button
    clearCompletedBtn.addEventListener('click', handleClearCompleted);
    
    // Enter key on input
    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTodo(e);
        }
    });
}

// Handle Add Todo
function handleAddTodo(e) {
    e.preventDefault();
    
    const text = todoInput.value.trim();
    if (!text) return;
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
    updateStats();
    
    // Focus back on input
    todoInput.focus();
}

// Handle Toggle Complete
function handleToggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Handle Delete Todo
function handleDeleteTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    if (todoItem) {
        todoItem.classList.add('removing');
        setTimeout(() => {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            renderTodos();
            updateStats();
        }, 300);
    }
}

// Handle Edit Todo
function handleEditTodo(id, newText) {
    const todo = todos.find(t => t.id === id);
    if (todo && newText.trim()) {
        todo.text = newText.trim();
        saveTodos();
        updateStats();
    } else if (todo && !newText.trim()) {
        // If empty, delete the todo
        handleDeleteTodo(id);
    }
}

// Handle Filter Change
function handleFilterChange(filter) {
    currentFilter = filter;
    
    // Update active tab
    filterTabs.forEach(tab => {
        if (tab.dataset.filter === filter) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    renderTodos();
}

// Handle Clear Completed
function handleClearCompleted() {
    const completedTodos = todos.filter(t => t.completed);
    if (completedTodos.length === 0) return;
    
    // Animate removal
    completedTodos.forEach(todo => {
        const todoItem = document.querySelector(`[data-id="${todo.id}"]`);
        if (todoItem) {
            todoItem.classList.add('removing');
        }
    });
    
    setTimeout(() => {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
        updateStats();
    }, 300);
}

// Get Filtered Todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Render Todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        todoList.innerHTML = '';
    } else {
        emptyState.classList.add('hidden');
        todoList.innerHTML = filteredTodos.map(todo => createTodoItem(todo)).join('');
        
        // Attach event listeners to new elements
        attachTodoEventListeners();
    }
}

// Create Todo Item HTML
function createTodoItem(todo) {
    return `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-action="toggle"></div>
            <div class="todo-text" contenteditable="true" data-action="edit">${escapeHtml(todo.text)}</div>
            <div class="todo-actions">
                <button class="todo-button delete" data-action="delete" title="Delete">
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7H15M8 7V5C8 4.44772 8.44772 4 9 4H11C11.5523 4 12 4.44772 12 5V7M15 7V15C15 15.5523 14.5523 16 14 16H6C5.44772 16 5 15.5523 5 15V7H15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </li>
    `;
}

// Attach Event Listeners to Todo Items
function attachTodoEventListeners() {
    // Toggle complete
    document.querySelectorAll('[data-action="toggle"]').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const todoId = parseInt(checkbox.closest('.todo-item').dataset.id);
            handleToggleComplete(todoId);
        });
    });
    
    // Delete
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const todoId = parseInt(button.closest('.todo-item').dataset.id);
            handleDeleteTodo(todoId);
        });
    });
    
    // Edit
    document.querySelectorAll('[data-action="edit"]').forEach(editField => {
        editField.addEventListener('blur', (e) => {
            const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
            const newText = e.target.textContent;
            handleEditTodo(todoId, newText);
        });
        
        editField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        });
    });
}

// Update Stats
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    
    totalCountEl.textContent = total;
    activeCountEl.textContent = active;
    completedCountEl.textContent = completed;
    
    // Show/hide clear completed button
    if (completed > 0) {
        clearCompletedBtn.style.display = 'block';
    } else {
        clearCompletedBtn.style.display = 'none';
    }
}

// Save Todos to LocalStorage
function saveTodos() {
    localStorage.setItem('macos-todos', JSON.stringify(todos));
}

// Load Todos from LocalStorage
function loadTodos() {
    const saved = localStorage.getItem('macos-todos');
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading todos:', e);
            todos = [];
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

