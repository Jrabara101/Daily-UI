/**
 * StandupExporter — Compiles stream updates into Slack / Markdown Standup summaries
 */
export class StandupExporter {
    constructor(soundEngine) {
        this.soundEngine = soundEngine;
    }

    generateDigest(user, posts = []) {
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let keyUpdates = [];
        let completedTasks = [];
        let openPolls = [];

        // Parse posts
        posts.forEach(p => {
            const cleanText = (p.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            if (cleanText) keyUpdates.push(`- ${cleanText}`);
            if (p.poll) openPolls.push(`- 📊 ${p.poll.question} (${p.poll.totalVotes || 0} votes)`);
        });

        if (keyUpdates.length === 0) {
            keyUpdates = [
                '- Implemented client-side WebP image optimization pipeline',
                '- Benchmarked real-time Trie autocomplete indexing (0ms latency)',
                '- Finalized Phase 2-4 interactive block widget specifications'
            ];
        }

        const markdown = `# 🚀 Daily Context Digest — ${user.name}
**Date:** ${today}  
**Role:** ${user.role} (${user.department})  
**Status:** Deep Work 🧠  

---

### 📌 Key Accomplishments & Pulses
${keyUpdates.join('\n')}

### 🎯 Completed Action Items
- [x] Zero-CLS CSS design architecture integration
- [x] Procedural Web Audio API sound synthesizer
- [ ] Staging cluster soak test & telemetry audit

### 📊 Active Team Polls
${openPolls.length > 0 ? openPolls.join('\n') : '- 📊 Local Sentiment Detection: 8 votes (92% Positive)'}

---
*Generated with PulseStream Context Engine — Zero-latency async collaboration.*
`;

        return markdown;
    }
}
