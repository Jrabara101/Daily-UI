/**
 * Pulse Data sorting Worker
 * Handles weighted popularity calculations off-thread
 */

self.onmessage = function(e) {
    const { items, type } = e.data;

    if (type === 'SORT_TRENDS') {
        const calculateDecayScore = (item) => {
            const hoursOld = (Date.now() - item.timestamp) / (1000 * 60 * 60);
            const score = (item.likes + item.shares * 2) / Math.pow(hoursOld + 2, 1.8);
            return score;
        };

        const sorted = items.sort((a, b) => calculateDecayScore(b) - calculateDecayScore(a));
        self.postMessage({ type: 'SORTED_TRENDS', sorted });
    }
};
