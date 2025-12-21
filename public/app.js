/**
 * Main Application Controller for Quantum Random Lab
 * 
 * Orchestrates the various quantum tools and manages application state
 */

class QuantumRandomApp {
  constructor() {
    this.tools = {};
    this.currentSection = 'core';
    this.init();
  }

  async init() {
    // console.log('🔬 Initializing Quantum Random Lab...');

    // Initialize navigation
    this.initNavigation();

    // Initialize all tools
    this.initializeTools();

    // Initialize service monitoring
    this.initServiceMonitoring();

    // Initialize analytics
    this.initAnalytics();

    // Set up global event listeners
    this.setupGlobalEventListeners();

    // console.log('✅ Quantum Random Lab initialized successfully');
  }

  initNavigation() {
    const navButtons = document.querySelectorAll('.nav-link');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        this.switchSection(section);
      });
    });
  }

  switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.section === sectionName) {
        btn.classList.add('active');
      }
    });

    // Update sections
    document.querySelectorAll('.tool-section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionName;
    }

    // Analytics
    if (window.qrngService) {
      qrngService.emit('navigation', {
        section: sectionName,
        timestamp: new Date().toISOString()
      });
    }
  }

  initializeTools() {
    try {
      // Initialize only tools that have containers on the page
      const toolConfigs = [
        { id: 'quantum-integer-tool', class: QuantumIntegerTool, name: 'integer' },
        { id: 'quantum-number-picker-tool', class: QuantumNumberPickerTool, name: 'numberPicker' },
        { id: 'quantum-coin-flip-tool', class: QuantumCoinFlipTool, name: 'coinFlip' },
        { id: 'quantum-dice-tool', class: QuantumDiceTool, name: 'dice' },
        { id: 'quantum-name-tool', class: QuantumNameTool, name: 'nameSelector' },
        { id: 'quantum-color-tool', class: QuantumColorTool, name: 'colorGenerator' },
        { id: 'quantum-hex-tool', class: QuantumHexTool, name: 'hexGenerator' },
        { id: 'quantum-password-tool', class: QuantumPasswordTool, name: 'passwordGenerator' }
      ];

      let initializedCount = 0;

      toolConfigs.forEach(config => {
        const container = document.getElementById(config.id);
        if (container) {
          this.tools[config.name] = new config.class(config.id);
          initializedCount++;
          // console.log(`✅ Initialized ${config.name}`);
        }
      });

      // console.log(`🎯 ${initializedCount} quantum tool(s) initialized`);

    } catch (error) {
      console.error('❌ Failed to initialize tools:', error);
      this.showGlobalError('Failed to initialize quantum tools. Please refresh the page.');
    }
  }

  initServiceMonitoring() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');

    if (!statusIndicator || !statusText) return;

    // Monitor service health
    const updateServiceStatus = async () => {
      try {
        const health = await qrngService.getHealth();

        if (health.status === 'healthy' && health.apiKeyConfigured) {
          statusIndicator.className = 'status-indicator healthy';
          statusIndicator.textContent = '●';
          statusText.textContent = 'Quantum service online';
        } else if (health.status === 'healthy' && !health.apiKeyConfigured) {
          statusIndicator.className = 'status-indicator error';
          statusIndicator.textContent = '●';
          statusText.textContent = 'API key required';
        } else {
          statusIndicator.className = 'status-indicator error';
          statusIndicator.textContent = '●';
          statusText.textContent = 'Service unavailable';
        }
      } catch (error) {
        statusIndicator.className = 'status-indicator error';
        statusIndicator.textContent = '●';
        statusText.textContent = 'Connection failed';
      }
    };

    // Initial check
    updateServiceStatus();

    // Periodic health checks
    setInterval(updateServiceStatus, 30000); // Every 30 seconds
  }

  initAnalytics() {
    if (!window.qrngService) return;

    // Track tool usage
    qrngService.addEventListener('tool_usage', (data) => {
      // console.log(`📊 Tool used: ${data.tool}`, data);

      // Could send to analytics service here
      this.logUsageStatistics(data);
    });

    // Track service events
    qrngService.addEventListener('request', () => {
      this.incrementCounter('api_requests');
    });

    qrngService.addEventListener('error', (data) => {
      console.warn('📊 API Error:', data.error);
      this.incrementCounter('api_errors');

      // Global Rate Limit Notification
      if (data.error && (data.error.includes('Too many requests') || data.error.includes('try again after'))) {
        this.showGlobalError(`⚠️ <strong>API Rate Limit Exceeded:</strong> ${data.error}`);
      }
    });

    qrngService.addEventListener('cache_hit', () => {
      this.incrementCounter('cache_hits');
    });

    qrngService.addEventListener('cache_miss', () => {
      this.incrementCounter('cache_misses');
    });
  }

  logUsageStatistics(data) {
    // Store usage stats in localStorage for demo purposes
    try {
      const stats = JSON.parse(localStorage.getItem('quantumLabStats') || '{}');
      const tool = data.tool;

      if (!stats[tool]) {
        stats[tool] = { count: 0, lastUsed: null };
      }

      stats[tool].count++;
      stats[tool].lastUsed = data.timestamp;

      localStorage.setItem('quantumLabStats', JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to log usage statistics:', error);
    }
  }

  incrementCounter(name) {
    try {
      const counters = JSON.parse(localStorage.getItem('quantumLabCounters') || '{}');
      counters[name] = (counters[name] || 0) + 1;
      localStorage.setItem('quantumLabCounters', JSON.stringify(counters));
    } catch (error) {
      console.warn('Failed to increment counter:', error);
    }
  }

  setupGlobalEventListeners() {
    // Global error handling
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.logError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.logError(event.reason);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + R for refresh (but don't prevent normal refresh)
      if ((event.ctrlKey || event.metaKey) && event.key === 'r' && event.shiftKey) {
        event.preventDefault();
        this.refreshAllTools();
      }

      // ESC to close any open modals/dropdowns
      if (event.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Service worker registration (if available)
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
  }

  async registerServiceWorker() {
    try {
      // Note: You'd need to create a service worker file
      // const registration = await navigator.serviceWorker.register('/sw.js');
      // console.log('Service Worker registered:', registration);
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }

  refreshAllTools() {
    // console.log('🔄 Refreshing all quantum tools...');

    // Clear caches
    qrngService.clearCache();

    // Reinitialize tools if needed
    // This could be expanded to refresh specific tool states

    // Show notification
    this.showNotification('🔄 All tools refreshed', 'success');
  }

  closeAllModals() {
    // Close any open dropdowns, modals, or expanded sections
    document.querySelectorAll('.dropdown.open').forEach(el => {
      el.classList.remove('open');
    });
  }

  showGlobalError(message) {
    // Create a global error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'global-error';

    // Add inline styles to ensure visibility and positioning
    Object.assign(errorDiv.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '9999',
      backgroundColor: '#FEF2F2',
      color: '#991B1B',
      borderBottom: '1px solid #FCA5A5',
      padding: '1rem',
      textAlign: 'center',
      boxShadow: '0 4px 6px -1px androidx.core.graphics.drawable.IconCompatParcelizer'
    });

    errorDiv.innerHTML = `
      <div class="error-content" style="display: flex; justify-content: center; items-align: center; gap: 0.5rem; max-width: 1200px; margin: 0 auto;">
        <span class="error-message">${message}</span>
        <button class="error-close" style="background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #991B1B;">&times;</button>
      </div>
    `;

    document.body.appendChild(errorDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 10000);

    // Manual close
    errorDiv.querySelector('.error-close').addEventListener('click', () => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  logError(error) {
    // Log errors for debugging
    try {
      const errorLog = JSON.parse(localStorage.getItem('quantumLabErrors') || '[]');
      errorLog.push({
        timestamp: new Date().toISOString(),
        message: error.message || String(error),
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href
      });

      // Keep only last 10 errors
      if (errorLog.length > 10) {
        errorLog.splice(0, errorLog.length - 10);
      }

      localStorage.setItem('quantumLabErrors', JSON.stringify(errorLog));
    } catch (e) {
      console.warn('Failed to log error:', e);
    }
  }

  // Public API methods
  getTool(toolName) {
    return this.tools[toolName];
  }

  getUsageStatistics() {
    try {
      return {
        stats: JSON.parse(localStorage.getItem('quantumLabStats') || '{}'),
        counters: JSON.parse(localStorage.getItem('quantumLabCounters') || '{}'),
        errors: JSON.parse(localStorage.getItem('quantumLabErrors') || '[]')
      };
    } catch (error) {
      return { stats: {}, counters: {}, errors: [] };
    }
  }

  clearAllData() {
    if (confirm('Clear all app data including usage statistics and cached values?')) {
      localStorage.removeItem('quantumLabStats');
      localStorage.removeItem('quantumLabCounters');
      localStorage.removeItem('quantumLabErrors');
      localStorage.removeItem('quantumCoinHistory');
      qrngService.clearCache();
      this.showNotification('✅ All data cleared', 'success');
    }
  }
}

// Global utility functions
window.showPrivacyInfo = () => {
  alert(`🔒 Privacy Policy

Quantum Random Lab respects your privacy:

• All random number generation happens locally in your browser
• We do not store, transmit, or log any generated content (passwords, names, etc.)
• Usage statistics are stored locally on your device only
• No personal data is collected or transmitted to external servers
• The ANU QRNG API receives only requests for random data, no personal information

Your generated content never leaves your device unless you explicitly copy or download it.`);
};

window.showApiInfo = async () => {
  try {
    const health = await qrngService.getHealth();
    const cacheStatus = qrngService.getCacheStatus();
    const stats = app.getUsageStatistics();

    const info = `📊 API Status Information

Service Status: ${health.status}
API Key Configured: ${health.apiKeyConfigured ? 'Yes' : 'No'}
Last Check: ${new Date(health.timestamp).toLocaleString()}

Cache Status:
${cacheStatus.map(cache =>
      `${cache.type}: ${cache.count}/${cache.capacity} (${cache.percentage}%)`
    ).join('\n')}

Usage Statistics:
API Requests: ${stats.counters.api_requests || 0}
Cache Hits: ${stats.counters.cache_hits || 0}
Cache Misses: ${stats.counters.cache_misses || 0}
Errors: ${stats.counters.api_errors || 0}`;

    alert(info);
  } catch (error) {
    alert('Failed to fetch API status information.');
  }
};

// Initialize the application when DOM is ready
let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new QuantumRandomApp();
  });
} else {
  app = new QuantumRandomApp();
}

// Export for global access
window.app = app;