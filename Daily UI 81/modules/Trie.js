/**
 * Trie Data Structure with metadata search capabilities.
 * Supports prefix matching for User Mentions (@) and Hashtags (#).
 */
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.dataList = []; // Can hold multiple entities or rich objects
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Insert a token with associated entity data.
     * @param {string} word - The searchable string
     * @param {object|string} data - Associated metadata object or string
     */
    insert(word, data = null) {
        if (!word) return;
        let current = this.root;
        const normalized = word.toLowerCase().trim();

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        current.isEndOfWord = true;
        
        const payload = data || { name: word, id: word };
        if (!current.dataList.some(d => (d.id || d.name || d) === (payload.id || payload.name || payload))) {
            current.dataList.push(payload);
        }
    }

    /**
     * Search all data entities matching a given prefix.
     * @param {string} prefix
     * @returns {Array<object|string>}
     */
    search(prefix = '') {
        let current = this.root;
        const normalized = prefix.toLowerCase().trim();

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            if (!current.children[char]) {
                return [];
            }
            current = current.children[char];
        }

        return this._findAllWords(current);
    }

    _findAllWords(node) {
        let results = [];
        if (node.isEndOfWord && node.dataList.length > 0) {
            results.push(...node.dataList);
        }

        for (const char in node.children) {
            results = results.concat(this._findAllWords(node.children[char]));
        }
        return results;
    }
}
