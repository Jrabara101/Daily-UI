import { SoundEngine } from './modules/SoundEngine.js';
import { Trie } from './modules/Trie.js';
import { ContextEngine, USER_PERSONAS } from './modules/ContextEngine.js';
import { BlockRegistry } from './modules/BlockRegistry.js';
import { AICoPilot } from './modules/AICoPilot.js';
import { ReactionEngine } from './modules/ReactionEngine.js';
import { StorageEngine } from './modules/StorageEngine.js';
import { StandupExporter } from './modules/StandupExporter.js';
import { MediaEngine } from './modules/MediaEngine.js';
import { CommandSystem } from './modules/CommandSystem.js';
import { MentionSystem } from './modules/MentionSystem.js';
import { TextEngine } from './modules/TextEngine.js';
import { FeedEngine } from './modules/FeedEngine.js';
import { LiveStreamSimulator } from './modules/LiveStreamSimulator.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 PulseStream Context Engine v3.0 initializing...');

    // 1. Instantiate Core Infrastructure Engines
    const soundEngine = new SoundEngine();
    const storageEngine = new StorageEngine();
    const contextEngine = new ContextEngine(soundEngine);
    const blockRegistry = new BlockRegistry(soundEngine);
    const aiCoPilot = new AICoPilot(soundEngine);
    const reactionEngine = new ReactionEngine(soundEngine);
    const standupExporter = new StandupExporter(soundEngine);
    const mediaEngine = new MediaEngine(soundEngine);

    // Global hook for lightbox
    window.__pulseStream_openLightbox = (src) => mediaEngine.openLightbox(src);

    // 2. Initialize Trie with Rich Team Metadata & Tags
    const userTrie = new Trie();
    [
        { name: 'Alex Rivera', handle: 'alex', role: 'Staff Systems Architect', department: 'Platform Eng', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        { name: 'Sarah Chen', handle: 'sarah', role: 'Lead Product Designer', department: 'Design Systems', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
        { name: 'Marcus Vance', handle: 'marcus', role: 'Principal SRE', department: 'Infrastructure', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
        { name: 'Elena Rostova', handle: 'elena', role: 'Senior ML Engineer', department: 'Context AI', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
        { name: 'David Kim', handle: 'david', role: 'Full Stack Engineer', department: 'Frontend Core', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
        { name: 'Amanda Torres', handle: 'amanda', role: 'Product Manager', department: 'Core Growth', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }
    ].forEach(u => {
        userTrie.insert(u.name, u);
        userTrie.insert(u.handle, u);
    });

    // Seed Hashtags
    ['architecture', 'release', 'designsystem', 'performance', 'standup', 'incident', 'deepwork', 'progress'].forEach(tag => {
        userTrie.insert(tag, { name: tag, role: 'Stream Tag', department: '#hashtag' });
    });

    // 3. Setup UI & Menus
    const editor = document.getElementById('editor');
    const commandMenu = document.getElementById('commandMenu');
    const mentionMenu = document.getElementById('mentionMenu');

    const commandSystem = new CommandSystem(commandMenu, editor, soundEngine);
    const mentionSystem = new MentionSystem(mentionMenu, editor, userTrie, soundEngine);
    const textEngine = new TextEngine(editor, commandSystem, mentionSystem, userTrie, blockRegistry, aiCoPilot, soundEngine);
    const feedEngine = new FeedEngine(soundEngine, blockRegistry, reactionEngine, storageEngine);
    const liveStreamSimulator = new LiveStreamSimulator(feedEngine, soundEngine);

    // 4. Seed initial realistic posts or restore saved state
    const savedPosts = storageEngine.getPosts();
    const initialPosts = savedPosts || [
        {
            id: 'post_init_1',
            user: USER_PERSONAS.sarah,
            mood: { icon: '💡', label: 'Brainstorming Architecture', dotColor: '#f43f5e' },
            content: `Kicking off the <strong>Design Tokens v3.0 RFC</strong>! We have mapped out fluid typography scales, CSS variables, and high-contrast dark/cyber tokens. Check out the decision poll below 👇 #designsystem #figma`,
            timestamp: '12m ago',
            imageUrls: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'],
            reactions: { '❤️': 5, '🚀': 8, '🔥': 3, '💡': 6, '👏': 4 },
            replies: [
                {
                    user: USER_PERSONAS.alex,
                    text: 'Looks super clean Sarah! Verified the zero-CLS render performance.',
                    timestamp: '8m ago'
                }
            ]
        },
        {
            id: 'post_init_2',
            user: USER_PERSONAS.alex,
            mood: { icon: '🧠', label: 'Deep Work', dotColor: '#a855f7' },
            content: `Benchmarked the client-side WebP image pipeline and procedural Web Audio synthesizers. Memory footprint is under <strong>4MB</strong> with zero audio file transfers. #engineering #performance`,
            timestamp: '45m ago',
            imageUrls: [],
            reactions: { '🚀': 12, '🔥': 7, '👏': 9 },
            replies: []
        }
    ];

    feedEngine.init(initialPosts);
    contextEngine.init();
    liveStreamSimulator.setSpeed('normal');

    // 5. Restore Theme
    const savedTheme = storageEngine.getTheme();
    document.body.className = savedTheme;
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = savedTheme;

    // 6. Restore Draft
    const savedDraft = storageEngine.getDraft();
    if (savedDraft && editor) {
        editor.innerHTML = savedDraft;
    }

    // Debounced Draft Auto-Saver
    let draftSaveTimeout = null;
    editor.addEventListener('input', () => {
        clearTimeout(draftSaveTimeout);
        draftSaveTimeout = setTimeout(() => {
            storageEngine.saveDraft(editor.innerHTML);
            const badge = document.getElementById('draftStatusBadge');
            if (badge) {
                badge.style.color = 'var(--success-color)';
                setTimeout(() => { badge.style.color = 'var(--text-muted)'; }, 1000);
            }
        }, 800);
    });

    // 7. Toast Helper
    function showToast(message, icon = '✨') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-item';
        toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        container.appendChild(toast);

        soundEngine.menuPop();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 8. Publish Post Logic
    function handlePublish() {
        const content = editor.innerHTML;
        const hasText = content.replace(/<[^>]*>/g, '').trim().length > 0;
        const previews = mediaEngine.getPreviews();
        const hasMedia = previews.length > 0;

        if (hasText || hasMedia) {
            const currentUser = contextEngine.getCurrentUser();
            const currentMood = contextEngine.getCurrentMood();

            feedEngine.post(content, previews, currentUser, currentMood);

            // Clear composer & storage
            editor.innerHTML = '';
            mediaEngine.clear();
            storageEngine.clearDraft();
            showToast('Status broadcasted to team pulse stream!', '🚀');
        }
    }

    document.getElementById('postBtn').addEventListener('click', handlePublish);

    // 9. Quick Block Insertions from Toolbar
    document.getElementById('addMediaBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
        mediaEngine.handleFiles(e.target.files);
    });

    document.getElementById('addPollBtn').addEventListener('click', () => {
        editor.focus();
        textEngine.executeCommand('poll');
    });

    document.getElementById('addTaskBtn').addEventListener('click', () => {
        editor.focus();
        textEngine.executeCommand('task');
    });

    document.getElementById('addCodeBtn').addEventListener('click', () => {
        editor.focus();
        textEngine.executeCommand('code');
    });

    document.getElementById('addVoiceBtn').addEventListener('click', () => {
        editor.focus();
        textEngine.executeCommand('voice');
    });

    document.getElementById('mentionBtn').addEventListener('click', () => {
        editor.focus();
        const rect = editor.getBoundingClientRect();
        mentionSystem.show(rect.left, rect.bottom + window.scrollY, '', '@');
    });

    // 10. AI Co-Pilot Toolbar Buttons
    document.getElementById('aiPolishBtn').addEventListener('click', async () => {
        const current = editor.innerHTML;
        const polished = await aiCoPilot.polishTone(current);
        editor.innerHTML = polished;
        showToast('Tone elevated to executive summary style!', '✨');
    });

    document.getElementById('aiStandupBtn').addEventListener('click', async () => {
        const current = editor.innerHTML;
        const standup = await aiCoPilot.formatStandup(current);
        editor.innerHTML = standup;
        showToast('Formatted as structured daily standup protocol!', '📋');
    });

    document.getElementById('aiTldrBtn').addEventListener('click', async () => {
        const current = editor.innerHTML;
        const tldr = await aiCoPilot.generateTLDR(current);
        editor.innerHTML = tldr;
        showToast('TL;DR action badge extracted!', '💡');
    });

    // 11. Mood Picker Dropdown Popover
    const profileTrigger = document.getElementById('userProfileTrigger');
    const moodPopover = document.getElementById('moodPickerPopover');

    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        moodPopover.classList.toggle('hidden');
        soundEngine.menuPop();
    });

    document.querySelectorAll('.mood-option-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const moodId = item.dataset.mood;
            contextEngine.setMood(moodId);

            document.querySelectorAll('.mood-option-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            moodPopover.classList.add('hidden');

            showToast(`Presence updated to ${contextEngine.getCurrentMood().label}`, contextEngine.getCurrentMood().icon);
        });
    });

    document.addEventListener('click', (e) => {
        if (!moodPopover.contains(e.target) && !profileTrigger.contains(e.target)) {
            moodPopover.classList.add('hidden');
        }
    });

    // 12. Simulation HUD Deck Interactions
    const networkSelect = document.getElementById('networkProfileSelect');
    const networkDot = document.getElementById('networkStatusDot');
    const engineStatusText = document.getElementById('engineStatusText');

    networkSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        feedEngine.setNetworkProfile(val);
        soundEngine.keyTap();

        if (val === 'offline') {
            networkDot.style.backgroundColor = '#ef4444';
            networkDot.style.boxShadow = '0 0 10px #ef4444';
            engineStatusText.textContent = 'OFFLINE QUEUE';
            engineStatusText.style.color = '#ef4444';
            showToast('Simulating Offline Mode (Posts queued locally)', '🔌');
        } else {
            networkDot.style.backgroundColor = '#10b981';
            networkDot.style.boxShadow = '0 0 10px #10b981';
            engineStatusText.textContent = 'STREAM ACTIVE';
            engineStatusText.style.color = '#10b981';
            showToast(`Network profile switched to ${networkSelect.options[networkSelect.selectedIndex].text}`, '📶');
        }
    });

    document.getElementById('personaSelect').addEventListener('change', (e) => {
        const val = e.target.value;
        contextEngine.setPersona(val);
        soundEngine.menuPop();
        showToast(`Switched active persona to ${contextEngine.getCurrentUser().name}`, '👤');
    });

    document.getElementById('streamSpeedSelect').addEventListener('change', (e) => {
        const val = e.target.value;
        liveStreamSimulator.setSpeed(val);
        soundEngine.keyTap();
        showToast(`Team pulse simulation rate set to ${val.toUpperCase()}`, '⏱️');
    });

    themeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        document.body.className = val;
        storageEngine.saveTheme(val);
        soundEngine.menuPop();
        showToast(`Theme switched to ${themeSelect.options[themeSelect.selectedIndex].text}`, '🎨');
    });

    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const soundLabel = document.getElementById('soundLabel');

    soundToggleBtn.addEventListener('click', () => {
        const isMuted = soundEngine.toggleMute();
        soundIcon.textContent = isMuted ? '🔇' : '🔊';
        soundLabel.textContent = isMuted ? 'Muted' : 'Audio';
        showToast(isMuted ? 'Procedural sounds muted' : 'Procedural sounds enabled', isMuted ? '🔇' : '🔊');
    });

    // 13. Stream Filter Pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterVal = pill.dataset.filter;
            feedEngine.setFilter(filterVal);
            soundEngine.keyTap();
        });
    });

    // 14. Modals (Standup Digest & Shortcuts)
    const digestModal = document.getElementById('standupDigestModal');
    const digestPreview = document.getElementById('digestMarkdownPreview');
    const shortcutsModal = document.getElementById('shortcutsModal');

    document.getElementById('standupDigestBtn').addEventListener('click', () => {
        const markdown = standupExporter.generateDigest(contextEngine.getCurrentUser(), feedEngine.posts);
        digestPreview.textContent = markdown;
        digestModal.classList.remove('hidden');
        soundEngine.menuPop();
    });

    document.getElementById('closeDigestModalBtn').addEventListener('click', () => {
        digestModal.classList.add('hidden');
    });

    document.getElementById('shortcutsHelpBtn').addEventListener('click', () => {
        shortcutsModal.classList.remove('hidden');
        soundEngine.menuPop();
    });

    document.getElementById('closeShortcutsModalBtn').addEventListener('click', () => {
        shortcutsModal.classList.add('hidden');
    });

    [digestModal, shortcutsModal].forEach(modal => {
        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    });

    // Copy Digest Handlers
    document.getElementById('copyMarkdownBtn').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(digestPreview.textContent);
            showToast('Daily Standup Markdown copied to clipboard!', '📋');
            soundEngine.pollChime();
        } catch (e) {}
    });

    document.getElementById('copySlackBtn').addEventListener('click', async () => {
        try {
            const slackText = digestPreview.textContent.replace(/^### (.*$)/gim, '*$1*').replace(/^## (.*$)/gim, '*$1*').replace(/^# (.*$)/gim, '*$1*');
            await navigator.clipboard.writeText(slackText);
            showToast('Slack-formatted standup copied to clipboard!', '💬');
            soundEngine.pollChime();
        } catch (e) {}
    });

    // 15. Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + Enter -> Publish
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handlePublish();
            return;
        }

        // Shift + ? -> Shortcuts Modal
        if (e.key === '?' && !editor.contains(document.activeElement)) {
            e.preventDefault();
            shortcutsModal.classList.toggle('hidden');
            soundEngine.menuPop();
            return;
        }

        // Esc -> Close open menus/modals
        if (e.key === 'Escape') {
            digestModal.classList.add('hidden');
            shortcutsModal.classList.add('hidden');
            moodPopover.classList.add('hidden');
            commandSystem.hide();
            mentionSystem.hide();
        }
    });

    // 16. Drag and Drop onto container
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        document.body.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    document.querySelector('.composer-container').addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt.files && dt.files.length > 0) {
            mediaEngine.handleFiles(dt.files);
            showToast(`${dt.files.length} image(s) processed and compressed`, '🖼️');
        }
    });

    console.log('✅ PulseStream Context Engine v3.0 fully operational.');
});
