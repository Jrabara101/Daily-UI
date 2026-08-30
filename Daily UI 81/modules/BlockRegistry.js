/**
 * BlockRegistry — Stateful Interactive Widgets for Posts
 * Supports Live Polls, Interactive Checklists, Syntax-Highlighted Code, and Audio Voice Memos.
 */
export class BlockRegistry {
    constructor(soundEngine) {
        this.soundEngine = soundEngine;
        this.activeAudioIntervals = new Map();
    }

    /**
     * Create Poll Block HTML
     */
    createPollTemplate(question = 'What should we prioritize next?', options = ['⚡ Edge Cache Architecture', '🎨 Design System Tokens', '🤖 Pulse AI Tone Assist']) {
        const pollId = 'poll_' + Math.random().toString(36).substr(2, 9);
        const optionsData = options.map((opt, i) => ({
            id: i,
            text: opt,
            votes: i === 0 ? 3 : (i === 1 ? 2 : 1)
        }));
        const totalVotes = optionsData.reduce((sum, o) => sum + o.votes, 0);

        return `
            <div class="interactive-poll-widget" data-block-type="poll" data-poll-id="${pollId}" data-total-votes="${totalVotes}">
                <div class="poll-header">
                    <span class="poll-icon">📊</span>
                    <strong class="poll-question">${question}</strong>
                </div>
                <div class="poll-options-list">
                    ${optionsData.map((opt, i) => {
                        const pct = Math.round((opt.votes / totalVotes) * 100);
                        return `
                            <button class="poll-option-btn" data-option-index="${i}" data-votes="${opt.votes}">
                                <div class="poll-progress-fill" style="width: ${pct}%;"></div>
                                <div class="poll-option-content">
                                    <span class="poll-option-radio"></span>
                                    <span class="poll-option-text">${opt.text}</span>
                                    <span class="poll-option-pct">${pct}%</span>
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
                <div class="poll-footer">
                    <span class="poll-voter-count">${totalVotes} total team votes</span>
                    <span class="poll-status-tag">Live Team Poll</span>
                </div>
            </div>
        `;
    }

    /**
     * Create Checklist Block HTML
     */
    createTaskTemplate(tasks = ['Implement WebP media pipeline', 'Optimize Trie autocomplete query', 'Benchmark zero-CLS rendering']) {
        const taskId = 'task_' + Math.random().toString(36).substr(2, 9);
        return `
            <div class="interactive-task-widget" data-block-type="task" data-task-id="${taskId}">
                <div class="task-widget-header">
                    <span class="task-widget-title">📌 Action Items</span>
                    <span class="task-progress-badge">0/${tasks.length} done</span>
                </div>
                <div class="task-progress-track">
                    <div class="task-progress-fill" style="width: 0%;"></div>
                </div>
                <div class="task-items-list">
                    ${tasks.map((t, idx) => `
                        <label class="task-item-row">
                            <input type="checkbox" class="task-checkbox" data-index="${idx}">
                            <span class="custom-check-box"></span>
                            <span class="task-label-text">${t}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Create Syntax Code Block HTML
     */
    createCodeTemplate(language = 'javascript', code = `// Real-Time Context Stream Worker\nexport async function processContextStream(pulse) {\n  const sentiment = await analyzeSentiment(pulse.text);\n  return { ...pulse, mood: sentiment.mood, verified: true };\n}`) {
        const codeId = 'code_' + Math.random().toString(36).substr(2, 9);
        return `
            <div class="interactive-code-widget" data-block-type="code" data-code-id="${codeId}">
                <div class="code-widget-header">
                    <div class="code-lang-tag">
                        <span class="code-dot"></span>
                        <span>${language.toUpperCase()}</span>
                    </div>
                    <button class="code-copy-btn" title="Copy code snippet">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copy</span>
                    </button>
                </div>
                <pre class="code-pre"><code>${this.escapeHtml(code)}</code></pre>
            </div>
        `;
    }

    /**
     * Create Voice Memo Block HTML
     */
    createVoiceTemplate(duration = '0:34', title = 'Async Audio Standup') {
        const voiceId = 'voice_' + Math.random().toString(36).substr(2, 9);
        return `
            <div class="interactive-voice-widget" data-block-type="voice" data-voice-id="${voiceId}">
                <button class="voice-play-btn" title="Play Voice Memo">
                    <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <svg class="pause-icon hidden" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                </button>
                <div class="voice-info-wrap">
                    <div class="voice-header-row">
                        <span class="voice-title">${title}</span>
                        <span class="voice-duration">${duration}</span>
                    </div>
                    <div class="voice-waveform-bars">
                        ${Array.from({ length: 28 }).map((_, i) => {
                            const h = 20 + Math.sin(i * 0.5) * 15 + Math.random() * 25;
                            return `<div class="wave-bar" style="height: ${Math.max(15, Math.min(100, h))}%;"></div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize listeners for interactive widgets inside a container (e.g. feed)
     */
    bindInteractions(container) {
        if (!container) return;

        // 1. Poll voting handler
        container.querySelectorAll('.interactive-poll-widget').forEach(pollEl => {
            if (pollEl.dataset.bound) return;
            pollEl.dataset.bound = 'true';

            const optionBtns = pollEl.querySelectorAll('.poll-option-btn');
            optionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (pollEl.classList.contains('voted')) return;

                    pollEl.classList.add('voted');
                    btn.classList.add('selected');

                    let totalVotes = parseInt(pollEl.dataset.totalVotes || '0', 10) + 1;
                    pollEl.dataset.totalVotes = totalVotes;

                    let myVotes = parseInt(btn.dataset.votes || '0', 10) + 1;
                    btn.dataset.votes = myVotes;

                    // Recalculate percentages
                    optionBtns.forEach(b => {
                        const votes = parseInt(b.dataset.votes || '0', 10);
                        const pct = Math.round((votes / totalVotes) * 100);
                        const fill = b.querySelector('.poll-progress-fill');
                        const pctText = b.querySelector('.poll-option-pct');
                        if (fill) fill.style.width = `${pct}%`;
                        if (pctText) pctText.textContent = `${pct}%`;
                    });

                    const countText = pollEl.querySelector('.poll-voter-count');
                    if (countText) countText.textContent = `${totalVotes} total team votes (You voted)`;

                    this.soundEngine && this.soundEngine.pollChime();
                });
            });
        });

        // 2. Checklist toggle handler
        container.querySelectorAll('.interactive-task-widget').forEach(taskEl => {
            if (taskEl.dataset.bound) return;
            taskEl.dataset.bound = 'true';

            const checkboxes = taskEl.querySelectorAll('.task-checkbox');
            const progressFill = taskEl.querySelector('.task-progress-fill');
            const progressBadge = taskEl.querySelector('.task-progress-badge');

            const updateTaskProgress = () => {
                const total = checkboxes.length;
                const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
                const pct = total === 0 ? 0 : Math.round((checked / total) * 100);

                if (progressFill) progressFill.style.width = `${pct}%`;
                if (progressBadge) {
                    progressBadge.textContent = `${checked}/${total} done (${pct}%)`;
                    if (checked === total && total > 0) {
                        progressBadge.classList.add('completed');
                    } else {
                        progressBadge.classList.remove('completed');
                    }
                }
            };

            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const row = cb.closest('.task-item-row');
                    if (row) {
                        if (cb.checked) row.classList.add('checked');
                        else row.classList.remove('checked');
                    }
                    updateTaskProgress();
                    this.soundEngine && this.soundEngine.keyTap();
                });
            });
        });

        // 3. Code copy snippet handler
        container.querySelectorAll('.interactive-code-widget').forEach(codeEl => {
            if (codeEl.dataset.bound) return;
            codeEl.dataset.bound = 'true';

            const copyBtn = codeEl.querySelector('.code-copy-btn');
            const codeContent = codeEl.querySelector('code');

            if (copyBtn && codeContent) {
                copyBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await navigator.clipboard.writeText(codeContent.innerText);
                        copyBtn.classList.add('copied');
                        copyBtn.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span style="color:#10b981;">Copied!</span>
                        `;
                        this.soundEngine && this.soundEngine.reactionBurst();
                        setTimeout(() => {
                            copyBtn.classList.remove('copied');
                            copyBtn.innerHTML = `
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                <span>Copy</span>
                            `;
                        }, 2000);
                    } catch (err) {
                        console.error('Clipboard copy failed:', err);
                    }
                });
            }
        });

        // 4. Voice memo player simulation handler
        container.querySelectorAll('.interactive-voice-widget').forEach(voiceEl => {
            if (voiceEl.dataset.bound) return;
            voiceEl.dataset.bound = 'true';

            const playBtn = voiceEl.querySelector('.voice-play-btn');
            const playIcon = voiceEl.querySelector('.play-icon');
            const pauseIcon = voiceEl.querySelector('.pause-icon');
            const waveBars = voiceEl.querySelectorAll('.wave-bar');

            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isPlaying = voiceEl.classList.toggle('playing');

                    if (isPlaying) {
                        playIcon.classList.add('hidden');
                        pauseIcon.classList.remove('hidden');
                        this.soundEngine && this.soundEngine.menuPop();

                        // Wave animation loop
                        const animInterval = setInterval(() => {
                            waveBars.forEach(bar => {
                                const h = 15 + Math.random() * 85;
                                bar.style.height = `${h}%`;
                                bar.style.opacity = Math.random() > 0.3 ? '1' : '0.5';
                            });
                        }, 120);

                        this.activeAudioIntervals.set(voiceEl, animInterval);

                        // Auto stop after 6 seconds simulation
                        setTimeout(() => {
                            if (voiceEl.classList.contains('playing')) {
                                voiceEl.classList.remove('playing');
                                playIcon.classList.remove('hidden');
                                pauseIcon.classList.add('hidden');
                                clearInterval(animInterval);
                                this.activeAudioIntervals.delete(voiceEl);
                            }
                        }, 6000);

                    } else {
                        playIcon.classList.remove('hidden');
                        pauseIcon.classList.add('hidden');
                        const interval = this.activeAudioIntervals.get(voiceEl);
                        if (interval) {
                            clearInterval(interval);
                            this.activeAudioIntervals.delete(voiceEl);
                        }
                    }
                });
            }
        });
    }

    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
