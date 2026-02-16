class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.data = null; // Store user object or just name
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, data = null) {
        let current = this.root;
        const normalizedWord = word.toLowerCase();

        for (let i = 0; i < normalizedWord.length; i++) {
            const char = normalizedWord[i];
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        current.isEndOfWord = true;
        current.data = data || word;
    }

    search(prefix) {
        let current = this.root;
        const normalizedPrefix = prefix.toLowerCase();

        for (let i = 0; i < normalizedPrefix.length; i++) {
            const char = normalizedPrefix[i];
            if (!current.children[char]) {
                return [];
            }
            current = current.children[char];
        }

        // Find all words from this node
        return this._findAllWords(current);
    }

    _findAllWords(node) {
        let results = [];
        if (node.isEndOfWord) {
            results.push(node.data);
        }

        for (const char in node.children) {
            results = results.concat(this._findAllWords(node.children[char]));
        }
        return results;
    }
}
