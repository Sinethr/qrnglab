/**
 * Quantum Integer Tool Component
 * 
 * Generates random integers within a specified range using quantum randomness
 */

class QuantumIntegerTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.results = [];
    this.init();
  }

  init() {
    this.container.innerHTML = `
        <h3 class="bento-tool-title">🔢 Random Integers</h3>
        <p class="bento-tool-description">Generate random integers within any range using quantum randomness</p>
        
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label for="int-min" class="block text-sm font-bold text-gray-700 mb-1">Minimum Value</label>
              <input type="number" id="int-min" value="1" min="-999999" max="999999" placeholder="e.g., 1" 
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
            </div>
            
            <div>
              <label for="int-max" class="block text-sm font-bold text-gray-700 mb-1">Maximum Value</label>
              <input type="number" id="int-max" value="100" min="-999999" max="999999" placeholder="e.g., 100"
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
            </div>
          </div>
          
          <div>
            <label for="int-count" class="block text-sm font-bold text-gray-700 mb-1">How many numbers?</label>
            <input type="number" id="int-count" value="10" min="1" max="100" placeholder="1-100"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
            <span class="body-small" style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Maximum 100 numbers per generation</span>
          </div>
          
          <div class="flex gap-6 items-center mt-3">
            <label class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
              <input type="checkbox" id="int-unique" class="w-5 h-5 rounded border-gray-300 focus:ring-quantum-light cursor-pointer" style="accent-color: var(--quantum-light, #8b5cf6);" />
              <span class="font-medium text-gray-700">Unique values only</span>
            </label>
            
            <label class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
              <input type="checkbox" id="int-sort" class="w-5 h-5 rounded border-gray-300 focus:ring-quantum-light cursor-pointer" style="accent-color: var(--quantum-light, #8b5cf6);" />
              <span class="font-medium text-gray-700">Sort results</span>
            </label>
          </div>
          
          <button id="generate-integers" class="btn-primary generate-btn">
            <span>⚛️</span>
            Generate Quantum Integers
          </button>
        </div>
          
        
        <div id="int-loading" class="hidden" style="margin-top: 2rem;">
          <div class="loading-spinner"></div>
          <p class="body-medium text-center" style="color: var(--text-secondary);">Generating quantum integers...</p>
        </div>
        
        <div id="int-error" class="hidden" style="margin-top: 2rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px;">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">⚠️</span>
            <div>
              <h4 class="headline-small" style="color: #dc2626; margin-bottom: 0.25rem;">Error</h4>
              <p class="body-medium" style="color: #6b7280;" id="int-error-message"></p>
            </div>
          </div>
        </div>
        
        <div id="int-success" class="hidden">
          <div class="result-display">
            <div class="result-label">Generated Integers</div>
            <div class="integer-results-grid" id="integer-results-list" style="margin-top: 1rem;">
              <!-- Results will be populated here -->
            </div>
          </div>
          
          <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
            <button id="copy-all-integers" class="btn-secondary" style="font-size: 0.875rem; padding: 0.625rem 1.25rem;">
              📋 Copy All
            </button>
            <button id="download-integers" class="btn-secondary" style="font-size: 0.875rem; padding: 0.625rem 1.25rem;">
              💾 Download
            </button>
          </div>
          
          <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
            <span class="body-small" style="color: var(--text-secondary);">Range: <strong id="int-range-display" style="color: var(--text-primary);"></strong></span>
            <span class="body-small" style="color: var(--text-secondary);">Count: <strong id="int-count-display" style="color: var(--text-primary);"></strong></span>
            <span class="body-small" style="color: var(--text-secondary);">Time: <strong id="int-timestamp" style="color: var(--text-primary);"></strong></span>
          </div>
        </div>
      </div>`;

    this.bindEvents();
  }

  bindEvents() {
    const generateBtn = this.container.querySelector('#generate-integers');
    const copyAllBtn = this.container.querySelector('#copy-all-integers');
    const downloadBtn = this.container.querySelector('#download-integers');
    const minInput = this.container.querySelector('#int-min');
    const maxInput = this.container.querySelector('#int-max');

    generateBtn.addEventListener('click', () => this.generateIntegers());
    copyAllBtn.addEventListener('click', () => this.copyAllResults());
    downloadBtn.addEventListener('click', () => this.downloadResults());

    // Auto-update max when min changes
    minInput.addEventListener('change', () => {
      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);
      if (min > max) {
        maxInput.value = min;
      }
    });

    // Auto-update min when max changes
    maxInput.addEventListener('change', () => {
      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);
      if (max < min) {
        minInput.value = max;
      }
    });

    // Enter key handling
    this.container.querySelectorAll('input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.generateIntegers();
        }
      });
    });
  }

  async generateIntegers() {
    const min = parseInt(this.container.querySelector('#int-min').value);
    const max = parseInt(this.container.querySelector('#int-max').value);
    const count = parseInt(this.container.querySelector('#int-count').value);
    const unique = this.container.querySelector('#int-unique').checked;
    const sort = this.container.querySelector('#int-sort').checked;

    // Validation
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
      this.showError('Please enter valid numbers for all fields');
      return;
    }

    if (min > max) {
      this.showError('Minimum value cannot be greater than maximum value');
      return;
    }

    if (count < 1 || count > 100) {
      this.showError('Count must be between 1 and 100');
      return;
    }

    if (unique && (max - min + 1) < count) {
      this.showError(`Cannot generate ${count} unique values in range [${min}, ${max}] (only ${max - min + 1} possible values)`);
      return;
    }

    this.showLoading();

    try {
      const range = max - min + 1;
      const neededValues = unique ? Math.max(count, count * 2) : count; // Extra for uniqueness
      const quantumData = await qrngService.getUint16(neededValues);

      // Map quantum values to target range
      const mappedValues = [];
      const usedValues = new Set();

      for (const rawValue of quantumData) {
        const mapped = min + (rawValue % range);

        if (unique) {
          if (!usedValues.has(mapped)) {
            mappedValues.push(mapped);
            usedValues.add(mapped);
          }
        } else {
          mappedValues.push(mapped);
        }

        if (mappedValues.length >= count) break;
      }

      // If we still need more unique values, generate additional quantum data
      while (unique && mappedValues.length < count) {
        const additionalData = await qrngService.getUint16(count * 2);
        for (const rawValue of additionalData) {
          const mapped = min + (rawValue % range);
          if (!usedValues.has(mapped)) {
            mappedValues.push(mapped);
            usedValues.add(mapped);
            if (mappedValues.length >= count) break;
          }
        }
      }

      // Sort if requested
      if (sort) {
        mappedValues.sort((a, b) => a - b);
      }

      this.results = mappedValues.slice(0, count);
      this.showResults();

      // Analytics
      qrngService.emit('tool_usage', {
        tool: 'integer',
        range: [min, max],
        count,
        unique,
        sort
      });

    } catch (error) {
      console.error('Integer generation error:', error);
      this.showError(`Failed to generate integers: ${error.message}`);
    }
  }

  showLoading() {
    this.container.querySelector('#int-loading').classList.remove('hidden');
    this.container.querySelector('#int-error').classList.add('hidden');
    this.container.querySelector('#int-success').classList.add('hidden');
    this.container.querySelector('#generate-integers').disabled = true;
  }

  showError(message) {
    this.container.querySelector('#int-error-message').textContent = message;
    this.container.querySelector('#int-error').classList.remove('hidden');
    this.container.querySelector('#int-loading').classList.add('hidden');
    this.container.querySelector('#int-success').classList.add('hidden');
    this.container.querySelector('#generate-integers').disabled = false;
  }

  showResults() {
    const min = parseInt(this.container.querySelector('#int-min').value);
    const max = parseInt(this.container.querySelector('#int-max').value);
    const count = this.results.length;

    // Update metadata
    this.container.querySelector('#int-range-display').textContent = `${min} - ${max}`;
    this.container.querySelector('#int-count-display').textContent = count;
    this.container.querySelector('#int-timestamp').textContent = new Date().toLocaleTimeString();

    // Populate results
    const resultsList = this.container.querySelector('#integer-results-list');
    resultsList.innerHTML = '';

    this.results.forEach((value, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'integer-item';
      resultItem.textContent = value;
      resultItem.dataset.value = value;
      resultItem.title = 'Click to copy';

      resultItem.addEventListener('click', () => {
        this.copyValue(value, resultItem);
      });

      resultsList.appendChild(resultItem);
    });

    this.container.querySelector('#int-success').classList.remove('hidden');
    this.container.querySelector('#int-loading').classList.add('hidden');
    this.container.querySelector('#int-error').classList.add('hidden');
    this.container.querySelector('#generate-integers').disabled = false;
  }

  async copyAllResults() {
    const text = this.results.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      this.showCopyFeedback(this.container.querySelector('#copy-all-integers'));
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  async copyValue(value, element) {
    try {
      await navigator.clipboard.writeText(value);
      if (element) {
        element.classList.add('copied');
        setTimeout(() => {
          element.classList.remove('copied');
        }, 1000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✅';
    button.style.background = 'var(--green)';
    button.style.color = 'var(--white)';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 1500);
  }

  downloadResults() {
    const min = parseInt(this.container.querySelector('#int-min').value);
    const max = parseInt(this.container.querySelector('#int-max').value);
    const timestamp = new Date().toISOString();

    const content = `Quantum Random Integers
Generated: ${timestamp}
Range: [${min}, ${max}]
Count: ${this.results.length}

Results:
${this.results.map((value, index) => `${index + 1}. ${value}`).join('\n')}

---
Generated using ANU Quantum Random Number Generator
Source: Quantum Random Lab`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-integers-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Export for global use
window.QuantumIntegerTool = QuantumIntegerTool;