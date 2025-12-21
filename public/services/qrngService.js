/**
 * Quantum Random Number Generator Service
 * 
 * Provides a unified interface for fetching and caching quantum random data
 * from the ANU QRNG API proxy with intelligent caching and error handling.
 */

class QRNGService {
  constructor() {
    this.cache = {
      uint8: [],
      uint16: [],
      hex8: [],
      hex16: []
    };
    this.cacheSize = {
      uint8: 1000,
      uint16: 500,
      hex8: 200,
      hex16: 100
    };
    this.requestInProgress = {};
    this.eventListeners = new Map();
  }

  /**
   * Add event listener for service events
   * Events: 'request', 'success', 'error', 'cache_hit', 'cache_miss'
   */
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Emit event to listeners
   */
  emit(event, data = {}) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback({ ...data, timestamp: new Date().toISOString() });
        } catch (error) {
          // console.error('Event listener error:', error);
        }
      });
    }
  }

  /**
   * Get quantum random numbers with intelligent caching
   * 
   * @param {string} type - Data type: uint8, uint16, hex8, hex16
   * @param {number} count - Number of values needed
   * @param {number} size - Block size (for hex types only)
   * @param {boolean} useCache - Whether to use cached values
   * @returns {Promise<number[]|string[]>} - Array of random values
   */
  async getQuantumData(type, count, size = null, useCache = true) {
    this.emit('request', { type, count, size, useCache });

    // Validate parameters
    if (!['uint8', 'uint16', 'hex8', 'hex16'].includes(type)) {
      throw new Error(`Invalid type: ${type}`);
    }

    if (count <= 0 || count > 1024) {
      throw new Error(`Invalid count: ${count}. Must be between 1 and 1024`);
    }

    // Try to serve from cache first
    if (useCache && this.cache[type].length >= count) {
      const values = this.cache[type].splice(0, count);
      this.emit('cache_hit', { type, count, remaining: this.cache[type].length });

      // Refill cache in background if running low
      if (this.cache[type].length < this.cacheSize[type] * 0.3) {
        this.refillCache(type, size).catch(() => { }); // catch(console.error);
      }

      return values;
    }

    this.emit('cache_miss', { type, count, cacheSize: this.cache[type].length });

    // Fetch fresh data
    try {
      const data = await this.fetchFromAPI(type, count, size);

      // Add extra to cache if we fetched more than needed
      if (useCache && data.length > count) {
        const excess = data.splice(count);
        this.cache[type].unshift(...excess);
        this.cache[type] = this.cache[type].slice(0, this.cacheSize[type]);
      }

      this.emit('success', { type, count, fetched: data.length });
      return data;

    } catch (error) {
      this.emit('error', { type, count, error: error.message });
      throw error;
    }
  }

  /**
   * Fetch data directly from the API
   */
  async fetchFromAPI(type, length, size = null) {
    const params = new URLSearchParams({ type, length: length.toString() });

    if (size && ['hex8', 'hex16'].includes(type)) {
      params.append('size', size.toString());
    }

    const cacheKey = `${type}_${length}_${size}`;

    // Prevent duplicate requests
    if (this.requestInProgress[cacheKey]) {
      return this.requestInProgress[cacheKey];
    }

    try {
      this.requestInProgress[cacheKey] = this._makeRequest(params);
      const response = await this.requestInProgress[cacheKey];

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data.data;

    } finally {
      delete this.requestInProgress[cacheKey];
    }
  }

  /**
   * Make HTTP request with timeout and retry logic
   */
  async _makeRequest(params, retries = 2) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`/api/qrng?${params}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);
      return response;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        if (retries > 0) {
          // console.warn('Request timeout, retrying...');
          return this._makeRequest(params, retries - 1);
        }
        throw new Error('Request timeout after retries');
      }

      throw error;
    }
  }

  /**
   * Refill cache in background
   */
  async refillCache(type, size = null) {
    try {
      const needed = this.cacheSize[type] - this.cache[type].length;
      if (needed <= 0) return;

      const fetchAmount = Math.min(needed * 2, 1024); // Fetch extra for efficiency
      const data = await this.fetchFromAPI(type, fetchAmount, size);

      this.cache[type].push(...data);
      this.cache[type] = this.cache[type].slice(0, this.cacheSize[type]);

    } catch (error) {
      // console.warn('Cache refill failed:', error.message);
    }
  }

  /**
   * Pre-warm caches for better UX
   */
  async prewarmCaches() {
    const types = ['uint8', 'uint16'];

    await Promise.allSettled(
      types.map(type => this.refillCache(type))
    );
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus() {
    return Object.entries(this.cache).map(([type, values]) => ({
      type,
      count: values.length,
      capacity: this.cacheSize[type],
      percentage: Math.round(values.length / this.cacheSize[type] * 100)
    }));
  }

  /**
   * Clear all caches
   */
  clearCache() {
    Object.keys(this.cache).forEach(type => {
      this.cache[type] = [];
    });
  }

  /**
   * Get service health information
   */
  async getHealth() {
    try {
      const response = await fetch('/api/health');
      return await response.json();
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Convenience methods for specific data types
   */
  async getUint8(count, useCache = true) {
    return this.getQuantumData('uint8', count, null, useCache);
  }

  async getUint16(count, useCache = true) {
    return this.getQuantumData('uint16', count, null, useCache);
  }

  async getHex8(count, size = 1, useCache = true) {
    return this.getQuantumData('hex8', count, size, useCache);
  }

  async getHex16(count, size = 1, useCache = true) {
    return this.getQuantumData('hex16', count, size, useCache);
  }
}

// Create singleton instance
const qrngService = new QRNGService();

// Auto-prewarm caches when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    qrngService.prewarmCaches();
  });
} else {
  qrngService.prewarmCaches();
}

// Export for use in other modules
window.qrngService = qrngService;