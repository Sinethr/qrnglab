/**
 * Quantum Hex Tool Component
 * 
 * Generates hexadecimal tokens using quantum randomness
 */

class QuantumHexTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.results = [];
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="tool-card">
        <div class="tool-header">
          <h2>🔤 Quantum Hex Generator</h2>
          <p class="tool-description">Generate cryptographic-quality hexadecimal tokens and keys</p>
        </div>
        
        <div class="tool-controls">
          <div class="control-row space-y-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="input-group">
                <label for="hex-type" class="block text-sm font-bold text-gray-700 mb-1">Hex Type</label>
                <select id="hex-type" class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm bg-white text-gray-800">
                  <option value="hex8">8-bit Hex (2 chars)</option>
                  <option value="hex16" selected>16-bit Hex (4 chars)</option>
                </select>
              </div>
              
              <div class="input-group">
                <label for="hex-length" class="block text-sm font-bold text-gray-700 mb-1">Number of Tokens</label>
                <input type="number" id="hex-length" value="8" min="1" max="50"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
                <span class="text-xs text-gray-500 mt-1 block">1-50 tokens</span>
              </div>
              
              <div class="input-group">
                <label for="hex-size" class="block text-sm font-bold text-gray-700 mb-1">Block Size</label>
                <input type="number" id="hex-size" value="1" min="1" max="16"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
                <span class="text-xs text-gray-500 mt-1 block">Quantum blocks per token</span>
              </div>
            </div>
          </div>
          
          <div class="control-row flex flex-wrap gap-6 mb-6">
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="hex-uppercase" checked class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="hex-uppercase" class="font-medium text-gray-700 cursor-pointer">Uppercase</label>
            </div>
            
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="hex-prefix" class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="hex-prefix" class="font-medium text-gray-700 cursor-pointer">Add 0x prefix</label>
            </div>
            
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="hex-separators" class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="hex-separators" class="font-medium text-gray-700 cursor-pointer">Add separators</label>
            </div>
          </div>
          
          <button id="generate-hex" class="generate-btn">
            <span class="btn-icon">🔐</span>
            Generate Hex Tokens
          </button>
        </div>
        
        <div class="tool-results">
          <div id="hex-loading" class="loading hidden">
            <div class="spinner"></div>
            <p>Generating quantum entropy...</p>
          </div>
          
          <div id="hex-error" class="error hidden">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
              <h4>Error</h4>
              <p id="hex-error-message"></p>
            </div>
          </div>
          
          <div id="hex-success" class="success hidden">
            <div class="result-header">
              <h3>Hex Tokens</h3>
              <div class="result-actions">
                <button id="copy-all-hex" class="copy-btn">📋 Copy All</button>
                <button id="download-hex" class="download-btn">💾 Download</button>
              </div>
            </div>
            
            <div class="result-metadata">
              <span class="metadata-item">Type: <strong id="hex-type-display"></strong></span>
              <span class="metadata-item">Count: <strong id="hex-count-display"></strong></span>
              <span class="metadata-item">Size: <strong id="hex-size-display"></strong></span>
              <span class="metadata-item">Entropy: <strong id="hex-entropy-display"></strong></span>
            </div>
            
            <div class="hex-results-grid" id="hex-results-list">
              <!-- Results will be populated here -->
            </div>
            
            <div class="security-notice">
              <h4>🔒 Security Notice</h4>
              <p>These tokens use quantum entropy and are suitable for cryptographic purposes. 
                 However, for production systems, always use established cryptographic libraries 
                 and consult security experts.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const generateBtn = this.container.querySelector('#generate-hex');
    const copyAllBtn = this.container.querySelector('#copy-all-hex');
    const downloadBtn = this.container.querySelector('#download-hex');
    const typeSelect = this.container.querySelector('#hex-type');

    generateBtn.addEventListener('click', () => this.generateHex());
    copyAllBtn.addEventListener('click', () => this.copyAllResults());
    downloadBtn.addEventListener('click', () => this.downloadResults());

    // Update UI when type changes
    typeSelect.addEventListener('change', () => this.updateSizeHint());

    // Enter key handling
    this.container.querySelectorAll('input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.generateHex();
        }
      });
    });

    this.updateSizeHint();
  }

  updateSizeHint() {
    const type = this.container.querySelector('#hex-type').value;
    const sizeInput = this.container.querySelector('#hex-size');
    const hint = sizeInput.nextElementSibling;

    if (type === 'hex8') {
      hint.textContent = '1 block = 2 hex chars';
    } else {
      hint.textContent = '1 block = 4 hex chars';
    }
  }

  async generateHex() {
    const type = this.container.querySelector('#hex-type').value;
    const length = parseInt(this.container.querySelector('#hex-length').value);
    const size = parseInt(this.container.querySelector('#hex-size').value);
    const uppercase = this.container.querySelector('#hex-uppercase').checked;
    const prefix = this.container.querySelector('#hex-prefix').checked;
    const separators = this.container.querySelector('#hex-separators').checked;

    // Validation
    if (isNaN(length) || length < 1 || length > 50) {
      this.showError('Number of tokens must be between 1 and 50');
      return;
    }

    if (isNaN(size) || size < 1 || size > 16) {
      this.showError('Block size must be between 1 and 16');
      return;
    }

    this.showLoading();

    try {
      // Get quantum hex data
      const quantumData = await qrngService.getQuantumData(type, length, size);

      // Format hex tokens
      this.results = quantumData.map(hexValue => {
        let formatted = hexValue;

        // Apply case
        formatted = uppercase ? formatted.toUpperCase() : formatted.toLowerCase();

        // Add prefix if requested
        if (prefix) {
          formatted = '0x' + formatted;
        }

        return formatted;
      });

      // Add separators if requested
      if (separators && this.results.length > 1) {
        this.formattedResults = this.results.join(uppercase ? '-' : ':');
      } else {
        this.formattedResults = this.results.join('\n');
      }

      this.showResults(type, length, size);

      // Analytics
      qrngService.emit('tool_usage', {
        tool: 'hex',
        type,
        length,
        size,
        entropy_bits: this.calculateEntropy(type, length, size)
      });

    } catch (error) {
      console.error('Hex generation error:', error);
      this.showError(`Failed to generate hex tokens: ${error.message}`);
    }
  }

  calculateEntropy(type, length, size) {
    const bitsPerToken = type === 'hex8' ? 8 * size : 16 * size;
    return bitsPerToken * length;
  }

  showResults(type, length, size) {
    // Update metadata
    this.container.querySelector('#hex-type-display').textContent =
      type === 'hex8' ? '8-bit Hex' : '16-bit Hex';
    this.container.querySelector('#hex-count-display').textContent = length;
    this.container.querySelector('#hex-size-display').textContent = size;
    this.container.querySelector('#hex-entropy-display').textContent =
      `${this.calculateEntropy(type, length, size)} bits`;

    // Populate results
    const resultsList = this.container.querySelector('#hex-results-list');
    resultsList.innerHTML = '';

    this.results.forEach((token, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'hex-result-item';
      resultItem.innerHTML = `
        <div class="hex-token-display">
          <code class="hex-token">${token}</code>
        </div>
        <div class="hex-token-actions">
          <button class="copy-token-btn" data-token="${token}" title="Copy this token">
            📋
          </button>
          <span class="token-length">${token.replace('0x', '').length} chars</span>
        </div>
      `;

      resultItem.querySelector('.copy-token-btn').addEventListener('click', (e) => {
        this.copyToken(e.target.dataset.token);
      });

      resultsList.appendChild(resultItem);
    });

    this.container.querySelector('#hex-success').classList.remove('hidden');
    this.container.querySelector('#hex-loading').classList.add('hidden');
    this.container.querySelector('#hex-error').classList.add('hidden');
    this.container.querySelector('#generate-hex').disabled = false;
  }

  async copyAllResults() {
    try {
      await navigator.clipboard.writeText(this.formattedResults);
      this.showCopyFeedback(this.container.querySelector('#copy-all-hex'));
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  async copyToken(token) {
    try {
      await navigator.clipboard.writeText(token);
      const btn = this.container.querySelector(`[data-token="${token}"]`);
      this.showCopyFeedback(btn);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✅';
    button.style.background = '#10b981';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 1500);
  }

  downloadResults() {
    const type = this.container.querySelector('#hex-type').value;
    const length = this.results.length;
    const size = parseInt(this.container.querySelector('#hex-size').value);
    const timestamp = new Date().toISOString();

    const content = `Quantum Hex Tokens
Generated: ${timestamp}
Type: ${type === 'hex8' ? '8-bit' : '16-bit'} Hex
Count: ${length}
Block Size: ${size}
Total Entropy: ${this.calculateEntropy(type, length, size)} bits

Tokens:
${this.results.map((token, index) => `${(index + 1).toString().padStart(2, '0')}. ${token}`).join('\n')}

Security Information:
- Generated using ANU Quantum Random Number Generator
- Suitable for cryptographic applications
- Each ${type} token provides ${type === 'hex8' ? 8 * size : 16 * size} bits of entropy
- Total randomness: ${this.calculateEntropy(type, length, size)} bits

Disclaimer:
While these tokens use genuine quantum entropy, always consult
security experts and use established cryptographic libraries
for production systems requiring high security.

---
Generated by Quantum Random Lab
Source: https://quantumnumbers.anu.edu.au/`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-hex-tokens-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showLoading() {
    this.container.querySelector('#hex-loading').classList.remove('hidden');
    this.container.querySelector('#hex-error').classList.add('hidden');
    this.container.querySelector('#hex-success').classList.add('hidden');
    this.container.querySelector('#generate-hex').disabled = true;
  }

  showError(message) {
    this.container.querySelector('#hex-error-message').textContent = message;
    this.container.querySelector('#hex-error').classList.remove('hidden');
    this.container.querySelector('#hex-loading').classList.add('hidden');
    this.container.querySelector('#hex-success').classList.add('hidden');
    this.container.querySelector('#generate-hex').disabled = false;
  }
}

window.QuantumHexTool = QuantumHexTool;