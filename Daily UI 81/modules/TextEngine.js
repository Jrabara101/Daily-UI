export class TextEngine {
    constructor(editor, commandSystem, mentionSystem, trie) {
        this.editor = editor;
        this.commandSystem = commandSystem;
        this.mentionSystem = mentionSystem;
        this.trie = trie;

        this.init();
    }

    init() {
        this.editor.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.editor.addEventListener('input', (e) => this.handleInput(e));
        this.editor.addEventListener('paste', (e) => this.handlePaste(e));
        this.editor.addEventListener('blur', () => {
            // Optional: hide menu on blur, but might interfere with clicks
            setTimeout(() => {
                this.commandSystem.hide();
                this.mentionSystem && this.mentionSystem.hide();
            }, 200);
        });
    }

    handlePaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        // Simple plain text insertion
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
        }
    }

    handleInput(e) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        // Only trigger if we are in a text node
        if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent;
            const cursorIndex = range.startOffset;
            const charBeforeCursor = text[cursorIndex - 1];

            // Trigger for Slash Command
            if (charBeforeCursor === '/') {
                if (cursorIndex === 1 || text[cursorIndex - 2] === ' ' || text[cursorIndex - 2] === '\u00A0') {
                    const rect = range.getBoundingClientRect();
                    this.commandSystem.show(rect.left, rect.bottom + window.scrollY);
                    this.mentionSystem && this.mentionSystem.hide();
                }
            }
            // Trigger for Mention
            else if (charBeforeCursor === '@') {
                if (cursorIndex === 1 || text[cursorIndex - 2] === ' ' || text[cursorIndex - 2] === '\u00A0') {
                    const rect = range.getBoundingClientRect();
                    this.mentionSystem && this.mentionSystem.show(rect.left, rect.bottom + window.scrollY, '');
                    this.commandSystem.hide();
                }
            } else {
                this.commandSystem.hide();

                // Check if we are inside a mention sequence
                if (this.mentionSystem && this.mentionSystem.isVisible) {
                    // Find the last @ index
                    const lastAt = text.lastIndexOf('@', cursorIndex - 1);
                    if (lastAt !== -1) {
                        const query = text.substring(lastAt + 1, cursorIndex);
                        // Check for spaces which might invalidate the mention
                        if (!query.includes(' ')) {
                            const rect = range.getBoundingClientRect();
                            this.mentionSystem.show(rect.left, rect.bottom + window.scrollY, query);
                        } else {
                            this.mentionSystem.hide();
                        }
                    } else {
                        this.mentionSystem.hide();
                    }
                }
            }
        } else {
            this.commandSystem.hide();
            this.mentionSystem && this.mentionSystem.hide();
        }
    }

    executeCommand(command) {
        if (!command) return;

        // Cleanup triggers
        document.execCommand('delete', false, null);

        if (this.commandSystem.isVisible) {
            let htmlToInsert = '';
            // Slash Command Logic
            if (command === 'code') {
                htmlToInsert = '<pre style="background:rgba(0,0,0,0.5); padding:10px; border-radius:4px; font-family:monospace; color:#eee;"><code>// Code block\n</code></pre><p><br></p>';
            } else if (command === 'task') {
                htmlToInsert = '<div class="task-item" style="display:flex; gap:8px; align-items:center;"><input type="checkbox"> <span>New Task</span></div><p><br></p>';
            } else if (command === 'poll') {
                htmlToInsert = '<div class="poll-widget" style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;"><strong>Poll Question?</strong><br>⚪ Option 1<br>⚪ Option 2</div><p><br></p>';
            }
            if (htmlToInsert) document.execCommand('insertHTML', false, htmlToInsert);
            this.commandSystem.hide();

        }
    }

    insertMention(name) {
        if (!name) return;

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        const text = textNode.textContent;
        const cursorIndex = range.startOffset;
        const lastAt = text.lastIndexOf('@', cursorIndex - 1);

        // Remove the @query part
        if (lastAt !== -1) {
            range.setStart(textNode, lastAt);
            range.setEnd(textNode, cursorIndex);
            range.deleteContents();
        }

        // Insert chip
        const chip = `<span class="mention-chip" contenteditable="false" style="color: #a5b4fc; background: rgba(99, 102, 241, 0.2); padding: 2px 6px; border-radius: 4px; display: inline-block;">@${name}</span>&nbsp;`;
        document.execCommand('insertHTML', false, chip);

        this.mentionSystem.hide();
    }
}
