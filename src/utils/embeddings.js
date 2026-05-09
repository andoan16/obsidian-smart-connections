// embeddings.js - Utility functions for generating embeddings

const MAX_BATCH_SIZE = 32; // Limit batch size to prevent memory issues
const CACHE_TTL = 300000; // 5 minutes cache TTL

class EmbeddingCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  get(key) {
    const now = Date.now();
    const timestamp = this.timestamps.get(key);
    
    if (!timestamp || now - timestamp > CACHE_TTL) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  set(key, value) {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }
}

const embeddingCache = new EmbeddingCache();

// Split array into chunks
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Generate cache key for text
function generateCacheKey(text) {
  return `${text.length}:${text.substring(0, 100)}`;
}

// Clean up cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of embeddingCache.timestamps) {
    if (now - timestamp > CACHE_TTL) {
      embeddingCache.cache.delete(key);
      embeddingCache.timestamps.delete(key);
    }
  }
}, 60000); // Check every minute

module.exports = {
  MAX_BATCH_SIZE,
  embeddingCache,
  chunkArray,
  generateCacheKey
};