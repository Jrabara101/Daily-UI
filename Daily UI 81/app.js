import { TextEngine } from './modules/TextEngine.js';
import { CommandSystem } from './modules/CommandSystem.js';
import { MentionSystem } from './modules/MentionSystem.js';
import { Trie } from './modules/Trie.js';
import { MediaEngine } from './modules/MediaEngine.js';
import { FeedEngine } from './modules/FeedEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('PulseStream System Initializing...');

    // DOM Elements
    const editor = document.getElementById('editor');
    const commandMenu = document.getElementById('commandMenu');
    const mentionMenu = document.getElementById('mentionMenu');

    // Initialize Modules
    const userTrie = new Trie();
    // Seed Trie with some dummy data
    ['Sarah', 'Sam', 'Scott', 'Sandra', 'Mike', 'Michelle', 'Alex', 'Amanda', 'David', 'Elena'].forEach(name => userTrie.insert(name));

    const feedEngine = new FeedEngine();
    const commandSystem = new CommandSystem(commandMenu, editor);
    const mentionSystem = new MentionSystem(mentionMenu, editor, userTrie);
    const mediaEngine = new MediaEngine();
    const textEngine = new TextEngine(editor, commandSystem, mentionSystem, userTrie);

    // Global Event Listeners
    document.getElementById('postBtn').addEventListener('click', () => {
        const content = editor.innerHTML;
        // Simple validation to check if there is text or images
        const hasText = content.replace(/<[^>]*>/g, '').trim().length > 0;
        const hasMedia = mediaEngine.getFiles().length > 0;

        if (hasText || hasMedia) {
            feedEngine.post(content, mediaEngine.getFiles());

            // Reset editor
            editor.innerHTML = '';
            mediaEngine.clear();
        }
    });

    document.getElementById('addMediaBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
        mediaEngine.handleFiles(e.target.files);
    });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle Drop on Editor Area
    editor.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        mediaEngine.handleFiles(files);
    });

    // Also handle drop on the whole container for better UX
    document.querySelector('.composer-container').addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        mediaEngine.handleFiles(files);
    });

    console.log('PulseStream System Active.');
});
