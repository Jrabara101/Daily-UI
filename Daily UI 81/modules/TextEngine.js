/**
 * TextEngine — Input Parser, Rich Formatting, Trigger Dispatcher, and AI Block Integration
 */
export class TextEngine {
    constructor(editor, commandSystem, mentionSystem, trie, blockRegistry, aiCoPilot, soundEngine) {
        this.editor = editor;
        this.commandSystem = commandSystem;
        this.mentionSystem = mentionSystem;
        this.trie = trie;
        this.blockRegistry = blockRegistry;
        this.aiCoPilot = aiCoPilot;
        this.soundEngine = soundEngine;

        this.init();
    }

    init() {
        this.editor.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.editor.addEventListener('input', (e) => this.handleInput(e));
        this.editor.addEventListener('paste', (e) => this.handlePaste(e));

        // Global hook for mouse selections from menu
        window.__pulseStream_onCommandSelect = (cmd) => this.executeCommand(cmd);
        window.__pulseStream_onMentionSelect = (name) => this.insertMention(name);
    }

    handlePaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
    }

    handleKeydown(e) {
        const activeSystem = this.commandSystem.isVisible ? this.commandSystem :
            (this.mentionSystem && this.mentionSystem.isVisible) ? this.mentionSystem : null;

        if (activeSystem) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeSystem.navigate('up');
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeSystem.navigate('down');
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                const selection = activeSystem.executeCurrentSelection();
                if (activeSystem === this.commandSystem) {
                    this.executeCommand(selection);
                } else {
                    this.insertMention(selection);
                }
                return;
            }
            if (e.key === 'Escape') {
                activeSystem.hide();
                return;
            }
        } else {
            // Typing key sound
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                this.soundEngine && this.soundEngine.keyTap();
            }
        }
    }

    handleInput(e) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent;
            const cursorIndex = range.startOffset;

            // Check Slash command
            const lastSlash = text.lastIndexOf('/', cursorIndex - 1);
            if (lastSlash !== -1 && (lastSlash === 0 || text[lastSlash - 1] === ' ' || text[lastSlash - 1] === '\u00A0')) {
                const query = text.substring(lastSlash + 1, cursorIndex);
                if (!query.includes(' ')) {
                    const rect = range.getBoundingClientRect();
                    this.commandSystem.show(rect.left, rect.bottom + window.scrollY, query);
                    this.mentionSystem && this.mentionSystem.hide();
                    return;
                }
            }

            // Check Mention @
            const lastAt = text.lastIndexOf('@', cursorIndex - 1);
            if (lastAt !== -1 && (lastAt === 0 || text[lastAt - 1] === ' ' || text[lastAt - 1] === '\u00A0')) {
                const query = text.substring(lastAt + 1, cursorIndex);
                if (!query.includes(' ')) {
                    const rect = range.getBoundingClientRect();
                    this.mentionSystem.show(rect.left, rect.bottom + window.scrollY, query, '@');
                    this.commandSystem.hide();
                    return;
                }
            }

            // Check Hashtag #
            const lastHash = text.lastIndexOf('#', cursorIndex - 1);
            if (lastHash !== -1 && (lastHash === 0 || text[lastHash - 1] === ' ' || text[lastHash - 1] === '\u00A0')) {
                const query = text.substring(lastHash + 1, cursorIndex);
                if (!query.includes(' ')) {
                    const rect = range.getBoundingClientRect();
                    this.mentionSystem.show(rect.left, rect.bottom + window.scrollY, query, '#');
                    this.commandSystem.hide();
                    return;
                }
            }
        }

        this.commandSystem.hide();
        this.mentionSystem && this.mentionSystem.hide();
    }

    async executeCommand(command) {
        if (!command) return;

        this.commandSystem.hide();

        // Delete the typed /query
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textNode = range.startContainer;
            if (textNode.nodeType === Node.TEXT_NODE) {
                const text = textNode.textContent;
                const cursorIndex = range.startOffset;
                const lastSlash = text.lastIndexOf('/', cursorIndex - 1);
                if (lastSlash !== -1) {
                    range.setStart(textNode, lastSlash);
                    range.setEnd(textNode, cursorIndex);
                    range.deleteContents();
                }
            }
        }

        // 1. Interactive Blocks
        if (command === 'poll') {
            const pollHtml = this.blockRegistry.createPollTemplate();
            document.execCommand('insertHTML', false, pollHtml + '<p><br></p>');
            this.soundEngine && this.soundEngine.pollChime();
        } else if (command === 'task') {
            const taskHtml = this.blockRegistry.createTaskTemplate();
            document.execCommand('insertHTML', false, taskHtml + '<p><br></p>');
            this.soundEngine && this.soundEngine.keyTap();
        } else if (command === 'code') {
            const codeHtml = this.blockRegistry.createCodeTemplate();
            document.execCommand('insertHTML', false, codeHtml + '<p><br></p>');
            this.soundEngine && this.soundEngine.keyTap();
        } else if (command === 'voice') {
            const voiceHtml = this.blockRegistry.createVoiceTemplate();
            document.execCommand('insertHTML', false, voiceHtml + '<p><br></p>');
            this.soundEngine && this.soundEngine.menuPop();
        } 
        // 2. AI Co-Pilot Transformations
        else if (command === 'ai-polish') {
            const polished = await this.aiCoPilot.polishTone(this.editor.innerHTML);
            this.editor.innerHTML = polished;
        } else if (command === 'ai-standup') {
            const standup = await this.aiCoPilot.formatStandup(this.editor.innerHTML);
            this.editor.innerHTML = standup;
        } else if (command === 'ai-tldr') {
            const tldr = await this.aiCoPilot.generateTLDR(this.editor.innerHTML);
            this.editor.innerHTML = tldr;
        }
    }

    insertMention(name) {
        if (!name) return;

        const isHash = this.mentionSystem.mode === '#';
        const triggerChar = isHash ? '#' : '@';

        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textNode = range.startContainer;
            if (textNode.nodeType === Node.TEXT_NODE) {
                const text = textNode.textContent;
                const cursorIndex = range.startOffset;
                const lastTrigger = text.lastIndexOf(triggerChar, cursorIndex - 1);

                if (lastTrigger !== -1) {
                    range.setStart(textNode, lastTrigger);
                    range.setEnd(textNode, cursorIndex);
                    range.deleteContents();
                }
            }
        }

        const chipHtml = isHash 
            ? `<span class="hashtag-chip" contenteditable="false">#${name}</span>&nbsp;`
            : `<span class="mention-chip" contenteditable="false">@${name}</span>&nbsp;`;

        document.execCommand('insertHTML', false, chipHtml);
        this.mentionSystem.hide();
        this.soundEngine && this.soundEngine.keyTap();
    }
}
