/* =====================================================
   DIRECT MESSAGING INTERFACE - JAVASCRIPT
   ===================================================== */

// =====================================================
// THREE.JS BACKGROUND ANIMATION
// =====================================================

function initThreeJsBackground() {
    const container = document.getElementById('three-canvas-container');
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);
    
    camera.position.z = 5;
    
    // Create animated geometry
    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        wireframe: true,
        emissive: 0x667eea,
        emissiveIntensity: 0.2,
        shininess: 100
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Add lighting
    const light1 = new THREE.PointLight(0x667eea, 1);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0x64748b, 0.5);
    light2.position.set(-10, -10, 10);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        mesh.rotation.x += 0.0002;
        mesh.rotation.y += 0.0003;
        mesh.rotation.z += 0.0001;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

// =====================================================
// SAMPLE DATA
// =====================================================

const sampleConversations = [
    {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/120?img=1',
        lastMessage: 'That sounds great! Let me know when...',
        timestamp: '2m',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'Mike Chen',
        avatar: 'https://i.pravatar.cc/120?img=12',
        lastMessage: 'See you at the meeting tomorrow',
        timestamp: '15m',
        unread: 0,
        online: true
    },
    {
        id: 3,
        name: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/120?img=5',
        lastMessage: 'Thanks for the update!',
        timestamp: '1h',
        unread: 0,
        online: false
    },
    {
        id: 4,
        name: 'Alex Turner',
        avatar: 'https://i.pravatar.cc/120?img=18',
        lastMessage: 'Perfect! Looking forward to it',
        timestamp: '3h',
        unread: 1,
        online: false
    }
];

const sampleMessages = [
    { id: 1, senderId: 2, text: 'Hey! How are you doing?', timestamp: '09:15 AM', own: false, status: 'delivered' },
    { id: 2, senderId: 1, text: 'I\'m doing great, thanks for asking!', timestamp: '09:16 AM', own: true, status: 'delivered' },
    { id: 3, senderId: 2, text: 'Did you get a chance to review the project?', timestamp: '09:18 AM', own: false, status: 'delivered' },
    { id: 4, senderId: 1, text: 'Yes, I did! It looks amazing. I have a few suggestions though.', timestamp: '09:20 AM', own: true, status: 'delivered' },
    { id: 5, senderId: 2, text: 'Great! I\'d love to hear them', timestamp: '09:21 AM', own: false, status: 'delivered' },
    { id: 6, senderId: 1, text: 'Let\'s schedule a call for tomorrow?', timestamp: '09:23 AM', own: true, status: 'sent' }
];

const emojiList = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '✨', '🙏', '😍', '🤔', '😎', '👀', '💪', '🚀', '📱'];

// =====================================================
// DOM ELEMENTS
// =====================================================

const conversationsList = document.getElementById('conversationsList');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const searchInput = document.getElementById('searchInput');
const emojiBtn = document.getElementById('emojiBtn');
const emojiModal = document.getElementById('emojiModal');
const emojiGrid = document.getElementById('emojiGrid');
const attachBtn = document.getElementById('attachBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const newChatBtn = document.getElementById('newChatBtn');
const infoBtn = document.querySelector('[title="Info"]');
const infoPanel = document.getElementById('infoPanel');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const toastNotification = document.getElementById('toastNotification');
const typingIndicator = document.getElementById('typingIndicator');

let currentConversation = sampleConversations[0];

// =====================================================
// INITIALIZE APP
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initThreeJsBackground();
    renderConversations();
    renderMessages();
    setupEventListeners();
    populateEmojiPicker();
});

// =====================================================
// RENDER CONVERSATIONS
// =====================================================

function renderConversations() {
    conversationsList.innerHTML = '';
    
    sampleConversations.forEach(conversation => {
        const div = document.createElement('div');
        div.className = `conversation-item ${conversation.id === currentConversation.id ? 'active' : ''}`;
        div.innerHTML = `
            <div class="conversation-avatar">
                <img src="${conversation.avatar}" alt="${conversation.name}">
                ${conversation.online ? '<span class="conversation-status"></span>' : ''}
            </div>
            <div class="conversation-content">
                <div class="conversation-name">${conversation.name}</div>
                <div class="conversation-preview">${conversation.lastMessage}</div>
            </div>
            <div style="text-align: right;">
                <div class="conversation-time">${conversation.timestamp}</div>
                ${conversation.unread > 0 ? `<div class="unread-badge">${conversation.unread}</div>` : ''}
            </div>
        `;
        
        div.addEventListener('click', () => {
            currentConversation = conversation;
            renderConversations();
            renderMessages();
            updateChatHeader();
        });
        
        conversationsList.appendChild(div);
    });
}

// =====================================================
// RENDER MESSAGES
// =====================================================

function renderMessages() {
    messagesContainer.innerHTML = '';
    
    sampleMessages.forEach(message => {
        const div = document.createElement('div');
        div.className = `message-group ${message.own ? 'own' : ''}`;
        
        const avatar = message.own ? currentConversation.avatar : sampleConversations[0].avatar;
        
        div.innerHTML = `
            <div class="message-avatar">
                <img src="${avatar}" alt="Avatar">
            </div>
            <div class="message-content">
                <div class="message-bubble animate__animated animate__fadeInUp">
                    <p class="message-text">${escapeHtml(message.text)}</p>
                    <div class="message-time">${message.timestamp}${message.own ? ` <span class="message-status">${message.status === 'sent' ? '✓' : '✓✓'}</span>` : ''}</div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(div);
    });
    
    // Scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// =====================================================
// UPDATE CHAT HEADER
// =====================================================

function updateChatHeader() {
    document.getElementById('chatUsername').textContent = currentConversation.name;
    document.getElementById('chatUserAvatar').src = currentConversation.avatar;
    document.getElementById('chatStatus').textContent = currentConversation.online ? 'Online • Active now' : 'Offline • Last seen 2m ago';
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function setupEventListeners() {
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
    });
    
    // Emoji picker
    emojiBtn.addEventListener('click', () => {
        emojiModal.style.display = emojiModal.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Settings
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = settingsModal.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Info panel
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            infoPanel.style.display = infoPanel.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            infoPanel.style.display = 'none';
        });
    }
    
    // Search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.conversation-item');
        
        items.forEach(item => {
            const name = item.querySelector('.conversation-name').textContent.toLowerCase();
            item.style.display = name.includes(query) ? 'flex' : 'none';
        });
    });
    
    // New chat
    newChatBtn.addEventListener('click', () => {
        showToast('New chat feature coming soon!');
    });
    
    // Attach file
    attachBtn.addEventListener('click', () => {
        showToast('File attachment coming soon!');
    });
    
    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.emoji-picker') && !e.target.closest('#emojiBtn')) {
            emojiModal.style.display = 'none';
        }
        if (!e.target.closest('.settings-modal') && !e.target.closest('#settingsBtn')) {
            settingsModal.style.display = 'none';
        }
    });
}

// =====================================================
// SEND MESSAGE
// =====================================================

function sendMessage() {
    const text = messageInput.value.trim();
    
    if (!text) return;
    
    // Add message
    const newMessage = {
        id: sampleMessages.length + 1,
        senderId: 1,
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        own: true,
        status: 'sent'
    };
    
    sampleMessages.push(newMessage);
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Re-render
    renderMessages();
    
    // Simulate typing indicator
    setTimeout(() => {
        typingIndicator.style.display = 'flex';
        showToast('Message delivered!');
    }, 300);
    
    // Simulate reply
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        
        const reply = {
            id: sampleMessages.length + 1,
            senderId: 2,
            text: 'That\'s a great point! 😊',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            own: false,
            status: 'delivered'
        };
        
        sampleMessages.push(reply);
        renderMessages();
    }, 2000);
}

// =====================================================
// EMOJI PICKER
// =====================================================

function populateEmojiPicker() {
    emojiList.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.addEventListener('click', () => {
            messageInput.value += emoji;
            emojiModal.style.display = 'none';
            messageInput.focus();
        });
        emojiGrid.appendChild(btn);
    });
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.classList.add('show', 'animate__animated', 'animate__slideInUp');
    
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// =====================================================
// RESPONSIVE BEHAVIOR
// =====================================================

window.addEventListener('resize', () => {
    // Handle responsive adjustments
    if (window.innerWidth < 768) {
        infoPanel.style.display = 'none';
    }
});