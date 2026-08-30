/**
 * LiveStreamSimulator — Automated Real-Time Team Activity Stream Generator
 * Simulates active distributed team pulses with configurable influx rates.
 */
export class LiveStreamSimulator {
    constructor(feedEngine, soundEngine) {
        this.feedEngine = feedEngine;
        this.soundEngine = soundEngine;
        this.timer = null;
        this.speedMode = 'normal'; // 'paused', 'normal' (25s), 'rapid' (6s)
        this.simulatedPool = [
            {
                user: {
                    name: 'Sarah Chen',
                    handle: '@sarah',
                    role: 'Lead Product Designer',
                    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                    moodIcon: '🎨',
                    moodLabel: 'Design System Polish'
                },
                content: `Uploaded the new <strong>PulseStream v3.0 Design Tokens</strong> into Figma! All typography scales and CSS custom variable mappings are now unified across dark/cyber themes. Check it out and let me know thoughts! #designsystem #figma #tokens`,
                media: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'],
                reactions: { '❤️': 4, '🚀': 6, '🔥': 2 }
            },
            {
                user: {
                    name: 'Marcus Vance',
                    handle: '@marcus',
                    role: 'Principal SRE',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    moodIcon: '⚡',
                    moodLabel: 'Infrastructure Optimization'
                },
                content: `✅ Staging deployment successful! Edge cache hit rates jumped from 78% to <strong>96.4%</strong> following Cloudflare Worker route optimization. Zero dropped frames reported during stress test. #sre #cloudflare #performance`,
                codeSnippet: {
                    lang: 'rust',
                    code: '// Edge Cache Handler\npub async fn handle_request(req: Request) -> Result<Response> {\n    let cache_key = req.headers().get("X-Context-Key");\n    match CACHE.get(cache_key).await {\n        Some(cached) => Ok(cached.into_response()),\n        None => fetch_origin(req).await,\n    }\n}'
                },
                reactions: { '🚀': 8, '🔥': 5, '💡': 3 }
            },
            {
                user: {
                    name: 'Elena Rostova',
                    handle: '@elena',
                    role: 'Senior Machine Learning Eng',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                    moodIcon: '🧠',
                    moodLabel: 'Deep Work (Context Engine)'
                },
                content: `Completed training on the lightweight on-device sentiment classifier! Quantized model size is under <strong>420KB</strong> with 94.2% inference accuracy. Ready for integration into the slash command pipeline. #ml #edgeai`,
                poll: {
                    question: 'Should we enable local sentiment detection by default?',
                    options: ['Yes, fully on-device (Privacy First)', 'Opt-in via Settings', 'Benchmark battery first']
                },
                reactions: { '💡': 7, '👏': 5, '🤯': 3 }
            },
            {
                user: {
                    name: 'David Kim',
                    handle: '@david',
                    role: 'Full Stack Engineer',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                    moodIcon: '☕',
                    moodLabel: 'Wrapping Tasks'
                },
                content: `Merged the keyboard shortcuts controller (Cmd+K palette & Shift+? modal)! Also updated WCAG ARIA labels for assistive technologies. 🚀 #accessibility #keyboardpro`,
                tasks: ['Add focus trap to modals', 'Audit screen reader live regions', 'Verify color contrast in OLED theme'],
                reactions: { '👏': 6, '❤️': 3 }
            }
        ];
        this.currentIndex = 0;
    }

    setSpeed(speed) {
        this.speedMode = speed;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (speed === 'paused') return;

        const intervalMs = speed === 'rapid' ? 6000 : 25000;
        this.timer = setInterval(() => {
            this.triggerNextPulse();
        }, intervalMs);
    }

    triggerNextPulse() {
        if (this.simulatedPool.length === 0) return;

        const pulseData = this.simulatedPool[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.simulatedPool.length;

        this.feedEngine.injectSimulatedPost(pulseData);
        this.soundEngine && this.soundEngine.notificationAlert();
    }
}
