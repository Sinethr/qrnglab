/**
 * Quantum Number Picker Tool Component
 * 
 * Picks unique random numbers from a range - optimized for lottery draws and ticket selection
 */

class QuantumNumberPickerTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.results = [];
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="tool-card">
        <div class="tool-header">
          <h2>🎟️ Quantum Number Picker</h2>
          <p class="tool-description">Pick unique random numbers from any range - perfect for lottery draws, ticket selection, and fair number assignment</p>
        </div>
        
        <div class="tool-controls">
          <div class="control-row space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="input-group">
                <label for="pick-min" class="block text-sm font-bold text-gray-700 mb-1">Minimum Number</label>
                <input type="number" id="pick-min" value="1" min="0" max="999999" 
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
              </div>
              
              <div class="input-group">
                <label for="pick-max" class="block text-sm font-bold text-gray-700 mb-1">Maximum Number</label>
                <input type="number" id="pick-max" value="49" min="1" max="999999"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
              </div>
              
              <div class="input-group">
                <label for="pick-count" class="block text-sm font-bold text-gray-700 mb-1">How Many to Pick</label>
                <input type="number" id="pick-count" value="6" min="1" max="100"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
                <span class="text-xs text-gray-500 mt-1 block" id="pick-hint">Max: 49 numbers</span>
              </div>
            </div>
          </div>
          
          <div class="control-row mt-6 mb-6">
            <div class="preset-buttons flex flex-wrap gap-2">
              <button class="preset-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-md transition-colors border border-gray-300" data-preset="lottery649">Lottery 6/49</button>
              <button class="preset-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-md transition-colors border border-gray-300" data-preset="powerball">Powerball 5/69</button>
              <button class="preset-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-md transition-colors border border-gray-300" data-preset="mega">Mega 5/70</button>
              <button class="preset-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-md transition-colors border border-gray-300" data-preset="euro">Euro 5/50</button>
            </div>
          </div>
          
          <div class="control-row flex gap-6 items-center mb-6">
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="sort-results" checked class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="sort-results" class="font-medium text-gray-700 cursor-pointer">Sort results</label>
            </div>
            
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="show-positions" class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="show-positions" class="font-medium text-gray-700 cursor-pointer">Show draw positions</label>
            </div>
          </div>
          
          <button id="pick-numbers" class="generate-btn">
            <span class="btn-icon">🎯</span>
            Pick Numbers
          </button>
        </div>
        
        <div class="tool-results">
          <div id="pick-loading" class="loading hidden">
            <div class="spinner"></div>
            <p>Quantum number selection...</p>
          </div>
          
          <div id="pick-error" class="error hidden">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
              <h4>Error</h4>
              <p id="pick-error-message"></p>
            </div>
          </div>
          
          <div id="pick-success" class="success hidden">
            <div class="result-header">
              <h3>🎯 Selected Numbers</h3>
              <div class="result-actions">
                <button id="copy-pick-results" class="copy-btn">📋 Copy Numbers</button>
                <button id="download-pick-results" class="download-btn">💾 Download</button>
                <button id="pick-again" class="secondary-btn">🔄 Pick Again</button>
              </div>
            </div>
            
            <div class="result-metadata">
              <span class="metadata-item">Range: <strong id="pick-range-display"></strong></span>
              <span class="metadata-item">Selected: <strong id="pick-count-display"></strong></span>
              <span class="metadata-item">Method: <strong>Quantum Unique Selection</strong></span>
              <span class="metadata-item">Time: <strong id="pick-timestamp"></strong></span>
            </div>
            
            <div class="number-balls-display" id="number-balls">
              <!-- Number balls will be populated here -->
            </div>
            
            <div class="selection-details" id="selection-details">
              <!-- Selection order details when show-positions is checked -->
            </div>
          </div>
          
          <div class="use-cases-section">
            <h3>🎯 Common Use Cases</h3>
            <div class="use-cases-grid">
              <div class="use-case">
                <h4>🎰 Lottery Numbers</h4>
                <p>Generate fair lottery number combinations for any lottery system</p>
              </div>
              <div class="use-case">
                <h4>🎟️ Ticket Draws</h4>
                <p>Select winning ticket numbers for raffles and prize drawings</p>
              </div>
              <div class="use-case">
                <h4>📋 ID Assignment</h4>
                <p>Assign unique ID numbers for participants, teams, or items</p>
              </div>
              <div class="use-case">
                <h4>🎲 Game Numbers</h4>
                <p>Generate number sets for bingo, keno, or custom games</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateMaxHint();
  }

  bindEvents() {
    const pickBtn = this.container.querySelector('#pick-numbers');
    const pickAgainBtn = this.container.querySelector('#pick-again');
    const copyBtn = this.container.querySelector('#copy-pick-results');
    const downloadBtn = this.container.querySelector('#download-pick-results');
    const minInput = this.container.querySelector('#pick-min');
    const maxInput = this.container.querySelector('#pick-max');
    const countInput = this.container.querySelector('#pick-count');

    pickBtn.addEventListener('click', () => this.pickNumbers());
    pickAgainBtn.addEventListener('click', () => this.pickNumbers());
    copyBtn.addEventListener('click', () => this.copyResults());
    downloadBtn.addEventListener('click', () => this.downloadResults());

    // Preset buttons
    this.container.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
    });

    // Auto-update validation
    [minInput, maxInput, countInput].forEach(input => {
      input.addEventListener('input', () => this.updateMaxHint());
    });

    // Auto-fix range
    minInput.addEventListener('change', () => {
      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);
      if (min > max) maxInput.value = min;
      this.updateMaxHint();
    });

    maxInput.addEventListener('change', () => {
      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);
      if (max < min) minInput.value = max;
      this.updateMaxHint();
    });

    // Enter key handling
    [minInput, maxInput, countInput].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.pickNumbers();
      });
    });
  }

  updateMaxHint() {
    const min = parseInt(this.container.querySelector('#pick-min').value) || 0;
    const max = parseInt(this.container.querySelector('#pick-max').value) || 0;
    const available = Math.max(0, max - min + 1);
    const hint = this.container.querySelector('#pick-hint');

    hint.textContent = `Max: ${Math.min(available, 100)} numbers`;

    // Update count input max
    const countInput = this.container.querySelector('#pick-count');
    countInput.max = Math.min(available, 100);
  }

  applyPreset(preset) {
    const presets = {
      'lottery649': { min: 1, max: 49, count: 6 },
      'powerball': { min: 1, max: 69, count: 5 },
      'mega': { min: 1, max: 70, count: 5 },
      'euro': { min: 1, max: 50, count: 5 }
    };

    const config = presets[preset];
    if (config) {
      this.container.querySelector('#pick-min').value = config.min;
      this.container.querySelector('#pick-max').value = config.max;
      this.container.querySelector('#pick-count').value = config.count;
      this.updateMaxHint();
    }
  }

  async pickNumbers() {
    const min = parseInt(this.container.querySelector('#pick-min').value);
    const max = parseInt(this.container.querySelector('#pick-max').value);
    const count = parseInt(this.container.querySelector('#pick-count').value);
    const sort = this.container.querySelector('#sort-results').checked;
    const showPositions = this.container.querySelector('#show-positions').checked;

    // Validation
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
      this.showError('Please enter valid numbers for all fields');
      return;
    }

    if (min > max) {
      this.showError('Minimum cannot be greater than maximum');
      return;
    }

    const available = max - min + 1;
    if (count > available) {
      this.showError(`Cannot pick ${count} unique numbers from ${available} available numbers`);
      return;
    }

    if (count > 100) {
      this.showError('Cannot pick more than 100 numbers at once');
      return;
    }

    this.showLoading();

    try {
      // Use efficient algorithm based on ratio
      let selectedNumbers;
      let selectionOrder = [];

      if (count / available > 0.5) {
        // More than half - generate all and remove unwanted
        selectedNumbers = await this.selectByRemoval(min, max, count);
      } else {
        // Less than half - use rejection sampling for uniqueness
        const result = await this.selectByRejection(min, max, count);
        selectedNumbers = result.numbers;
        selectionOrder = result.order;
      }

      // Sort if requested (keep original order for positions)
      this.results = {
        numbers: sort ? [...selectedNumbers].sort((a, b) => a - b) : selectedNumbers,
        originalOrder: selectionOrder,
        sorted: sort,
        showPositions,
        range: [min, max],
        count
      };

      this.showResults();

      // Analytics
      qrngService.emit('tool_usage', {
        tool: 'number_picker',
        range: [min, max],
        count,
        total_possible: available,
        selection_ratio: count / available
      });

    } catch (error) {
      console.error('Number picking error:', error);
      this.showError(`Failed to pick numbers: ${error.message}`);
    }
  }

  async selectByRejection(min, max, count) {
    const selected = new Set();
    const order = [];
    const range = max - min + 1;

    // Estimate how many quantum values we'll need (with buffer)
    const estimatedNeeded = Math.ceil(count * 1.5);
    let quantumValues = await qrngService.getUint16(estimatedNeeded);
    let quantumIndex = 0;

    while (selected.size < count) {
      // Get more quantum values if needed
      if (quantumIndex >= quantumValues.length) {
        const additional = await qrngService.getUint16(Math.max(50, count));
        quantumValues = quantumValues.concat(additional);
      }

      const mapped = min + (quantumValues[quantumIndex] % range);
      quantumIndex++;

      if (!selected.has(mapped)) {
        selected.add(mapped);
        order.push({ number: mapped, position: selected.size });
      }
    }

    return {
      numbers: Array.from(selected),
      order
    };
  }

  async selectByRemoval(min, max, count) {
    // Create full range and shuffle, then take first 'count' elements
    const allNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    // Fisher-Yates shuffle with quantum randomness
    const quantumValues = await qrngService.getUint16(allNumbers.length);

    for (let i = allNumbers.length - 1; i > 0; i--) {
      const j = quantumValues[allNumbers.length - 1 - i] % (i + 1);
      [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }

    return allNumbers.slice(0, count);
  }

  showResults() {
    // Update metadata
    this.container.querySelector('#pick-range-display').textContent =
      `[${this.results.range[0]}, ${this.results.range[1]}]`;
    this.container.querySelector('#pick-count-display').textContent =
      `${this.results.count} of ${this.results.range[1] - this.results.range[0] + 1}`;
    this.container.querySelector('#pick-timestamp').textContent =
      new Date().toLocaleTimeString();

    // Display number balls
    const ballsContainer = this.container.querySelector('#number-balls');
    ballsContainer.innerHTML = '';

    this.results.numbers.forEach((number, index) => {
      const ball = document.createElement('div');
      ball.className = 'number-ball';
      ball.textContent = number;
      ball.style.animationDelay = `${index * 100}ms`;
      ballsContainer.appendChild(ball);
    });

    // Show selection details if requested
    const detailsContainer = this.container.querySelector('#selection-details');
    if (this.results.showPositions && this.results.originalOrder.length > 0) {
      detailsContainer.innerHTML = `
        <h4>Selection Order</h4>
        <div class="selection-order">
          ${this.results.originalOrder.map(item =>
        `<span class="order-item">Position ${item.position}: ${item.number}</span>`
      ).join('')}
        </div>
      `;
      detailsContainer.style.display = 'block';
    } else {
      detailsContainer.style.display = 'none';
    }

    this.container.querySelector('#pick-success').classList.remove('hidden');
    this.container.querySelector('#pick-loading').classList.add('hidden');
    this.container.querySelector('#pick-error').classList.add('hidden');
    this.container.querySelector('#pick-numbers').disabled = false;
  }

  async copyResults() {
    const numbersText = this.results.numbers.join(', ');
    try {
      await navigator.clipboard.writeText(numbersText);
      this.showCopyFeedback(this.container.querySelector('#copy-pick-results'));
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✅ Copied';
    button.style.background = '#10b981';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 1500);
  }

  downloadResults() {
    const timestamp = new Date().toISOString();
    const numbersText = this.results.numbers.join(', ');
    const range = `${this.results.range[0]}-${this.results.range[1]}`;

    let content = `Quantum Number Selection
Generated: ${timestamp}
Range: ${range}
Selected: ${this.results.count} numbers
Method: Quantum Unique Selection

SELECTED NUMBERS:
${numbersText}

FORMATTED FOR LOTTERY:
${this.results.numbers.join(' - ')}`;

    if (this.results.showPositions && this.results.originalOrder.length > 0) {
      content += `\n\nSELECTION ORDER:
${this.results.originalOrder.map(item =>
        `${item.position}. ${item.number}`
      ).join('\n')}`;
    }

    content += `\n\nSTATISTICS:
Total possible numbers: ${this.results.range[1] - this.results.range[0] + 1}
Numbers selected: ${this.results.count}
Selection probability: 1 in ${Math.round((this.results.range[1] - this.results.range[0] + 1) / this.results.count)}

---
Generated using ANU Quantum Random Number Generator
Each number had an equal chance of selection`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-numbers-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showLoading() {
    this.container.querySelector('#pick-loading').classList.remove('hidden');
    this.container.querySelector('#pick-error').classList.add('hidden');
    this.container.querySelector('#pick-success').classList.add('hidden');
    this.container.querySelector('#pick-numbers').disabled = true;
  }

  showError(message) {
    this.container.querySelector('#pick-error-message').textContent = message;
    this.container.querySelector('#pick-error').classList.remove('hidden');
    this.container.querySelector('#pick-loading').classList.add('hidden');
    this.container.querySelector('#pick-success').classList.add('hidden');
    this.container.querySelector('#pick-numbers').disabled = false;
  }
}

window.QuantumNumberPickerTool = QuantumNumberPickerTool;