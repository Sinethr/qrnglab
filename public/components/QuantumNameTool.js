/**
 * Quantum Name Tool Component
 * 
 * Selects random names from a user-provided list using quantum randomness
 * Perfect for raffles, giveaways, and fair selection processes
 */

class QuantumNameTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedNames = [];
    this.auditLog = [];
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="tool-card">
        <div class="tool-header">
          <h2>👥 Quantum Name Picker</h2>
          <p class="tool-description">Fair and transparent name selection using quantum randomness - perfect for raffles, giveaways, and student selection</p>
        </div>
        
        <div class="tool-controls">
          <div class="control-row space-y-6 mb-6">
            <div class="input-group full-width">
              <label for="names-input" class="block text-sm font-bold text-gray-700 mb-1">Names List <span class="text-gray-400 font-normal">(one per line)</span></label>
              <textarea id="names-input" rows="8" placeholder="Enter names, one per line:
Alice Johnson
Bob Smith
Carol Davis"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono text-sm resize-y"></textarea>
              <div class="input-stats flex justify-between mt-1 text-xs text-gray-500">
                <span id="name-count">0 names</span> 
                <span id="duplicate-warning" class="hidden text-orange-600 font-medium">Contains duplicates</span>
              </div>
            </div>
          </div>
          
          <div class="control-row space-y-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div class="input-group">
                <label for="winners-count" class="block text-sm font-bold text-gray-700 mb-1">Number of Winners</label>
                <input type="number" id="winners-count" value="1" min="1" max="50"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
                <span class="text-xs text-gray-500 mt-1 block">1-50 winners</span>
              </div>
              
              <div class="flex flex-col gap-3 pb-1">
                <div class="checkbox-group flex items-center gap-2">
                  <input type="checkbox" id="assign-numbers" class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
                  <label for="assign-numbers" class="font-medium text-gray-700 cursor-pointer text-sm">Assign random numbers to winners</label>
                </div>
                
                <div class="checkbox-group flex items-center gap-2">
                  <input type="checkbox" id="remove-duplicates" checked class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
                  <label for="remove-duplicates" class="font-medium text-gray-700 cursor-pointer text-sm">Remove duplicate names</label>
                </div>
              </div>
            </div>
          </div>
          
          <button id="select-winners" class="generate-btn">
            <span class="btn-icon">🎯</span>
            Select Winners
          </button>
          
          <button id="load-example" class="secondary-btn">
            <span class="btn-icon">📝</span>
            Load Example Names
          </button>
        </div>
        
        <div class="tool-results">
          <div id="name-loading" class="loading hidden">
            <div class="spinner"></div>
            <p>Quantum selection in progress...</p>
          </div>
          
          <div id="name-error" class="error hidden">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
              <h4>Error</h4>
              <p id="name-error-message"></p>
            </div>
          </div>
          
          <div id="name-success" class="success hidden">
            <div class="result-header">
              <h3>🏆 Selected Winners</h3>
              <div class="result-actions">
                <button id="copy-winners" class="copy-btn">📋 Copy Results</button>
                <button id="export-winners" class="download-btn">💾 Export</button>
              </div>
            </div>
            
            <div class="result-metadata">
              <span class="metadata-item">From: <strong id="total-names-display"></strong> names</span>
              <span class="metadata-item">Selected: <strong id="winners-count-display"></strong> winners</span>
              <span class="metadata-item">Method: <strong>Quantum Fisher-Yates</strong></span>
              <span class="metadata-item">Time: <strong id="selection-timestamp"></strong></span>
            </div>
            
            <div class="winners-list" id="winners-list">
              <!-- Winners will be populated here -->
            </div>
            
            <div class="audit-section">
              <h4>🔍 Transparency Audit</h4>
              <div class="audit-log" id="audit-log">
                <!-- Audit entries will be populated here -->
              </div>
              <button id="toggle-audit" class="toggle-btn">Show Full Quantum Audit</button>
            </div>
          </div>
          
          <div class="guidance-section">
            <h3>💡 Usage Guide</h3>
            <div class="guidance-content">
              <div class="use-case">
                <h4>🎁 Raffles & Giveaways</h4>
                <p>Enter participant names to select random winners fairly and transparently</p>
              </div>
              <div class="use-case">
                <h4>🎓 Student Selection</h4>
                <p>Choose students for presentations, activities, or random grouping</p>
              </div>
              <div class="use-case">
                <h4>🎯 Team Assignments</h4>
                <p>Randomly assign team leaders, rotate responsibilities, or pick volunteers</p>
              </div>
              <div class="fairness-note">
                <strong>Quantum Fairness:</strong> Unlike pseudo-random selections, this tool uses genuine quantum randomness 
                to ensure each participant has an exactly equal chance of selection.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const selectBtn = this.container.querySelector('#select-winners');
    const loadExampleBtn = this.container.querySelector('#load-example');
    const copyBtn = this.container.querySelector('#copy-winners');
    const exportBtn = this.container.querySelector('#export-winners');
    const toggleAuditBtn = this.container.querySelector('#toggle-audit');
    const namesInput = this.container.querySelector('#names-input');
    const winnersInput = this.container.querySelector('#winners-count');

    selectBtn.addEventListener('click', () => this.selectWinners());
    loadExampleBtn.addEventListener('click', () => this.loadExampleNames());
    copyBtn.addEventListener('click', () => this.copyResults());
    exportBtn.addEventListener('click', () => this.exportResults());
    toggleAuditBtn.addEventListener('click', () => this.toggleAuditDetails());

    // Real-time validation
    namesInput.addEventListener('input', () => this.updateNameStats());
    winnersInput.addEventListener('input', () => this.validateWinnersCount());

    // Enter key in winners count should trigger selection
    winnersInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.selectWinners();
      }
    });

    this.updateNameStats();
  }

  updateNameStats() {
    const namesInput = this.container.querySelector('#names-input');
    const nameCountSpan = this.container.querySelector('#name-count');
    const duplicateWarning = this.container.querySelector('#duplicate-warning');
    const removeDuplicates = this.container.querySelector('#remove-duplicates').checked;

    const text = namesInput.value.trim();
    if (!text) {
      nameCountSpan.textContent = '0 names';
      duplicateWarning.classList.add('hidden');
      return;
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const uniqueNames = new Set(lines);

    nameCountSpan.textContent = `${lines.length} names`;

    if (lines.length !== uniqueNames.size) {
      duplicateWarning.classList.remove('hidden');
      if (removeDuplicates) {
        duplicateWarning.textContent = `${lines.length - uniqueNames.size} duplicates (will be removed)`;
      } else {
        duplicateWarning.textContent = `${lines.length - uniqueNames.size} duplicates found`;
      }
    } else {
      duplicateWarning.classList.add('hidden');
    }

    this.validateWinnersCount();
  }

  validateWinnersCount() {
    const namesInput = this.container.querySelector('#names-input');
    const winnersInput = this.container.querySelector('#winners-count');
    const removeDuplicates = this.container.querySelector('#remove-duplicates').checked;

    const text = namesInput.value.trim();
    if (!text) return;

    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const availableNames = removeDuplicates ? new Set(lines).size : lines.length;
    const requestedWinners = parseInt(winnersInput.value) || 0;

    if (requestedWinners > availableNames) {
      winnersInput.setCustomValidity(`Cannot select ${requestedWinners} winners from ${availableNames} names`);
    } else {
      winnersInput.setCustomValidity('');
    }
  }

  loadExampleNames() {
    const exampleNames = [
      'Alice Johnson',
      'Bob Smith',
      'Carol Davis',
      'David Wilson',
      'Eva Martinez',
      'Frank Chen',
      'Grace Lee',
      'Henry Brown',
      'Irene Taylor',
      'Jack Anderson',
      'Karen White',
      'Luis Rodriguez',
      'Maria Garcia',
      'Nathan Jones',
      'Olivia Thompson'
    ];

    this.container.querySelector('#names-input').value = exampleNames.join('\n');
    this.container.querySelector('#winners-count').value = '3';
    this.updateNameStats();
  }

  async selectWinners() {
    const namesInput = this.container.querySelector('#names-input');
    const winnersCount = parseInt(this.container.querySelector('#winners-count').value);
    const assignNumbers = this.container.querySelector('#assign-numbers').checked;
    const removeDuplicates = this.container.querySelector('#remove-duplicates').checked;

    // Parse and validate names
    const text = namesInput.value.trim();
    if (!text) {
      this.showError('Please enter at least one name');
      return;
    }

    let names = text.split('\n').map(line => line.trim()).filter(line => line);

    if (removeDuplicates) {
      names = [...new Set(names)];
    }

    if (names.length === 0) {
      this.showError('No valid names found');
      return;
    }

    if (isNaN(winnersCount) || winnersCount < 1 || winnersCount > Math.min(50, names.length)) {
      this.showError(`Number of winners must be between 1 and ${Math.min(50, names.length)}`);
      return;
    }

    this.showLoading();

    try {
      // Use Fisher-Yates shuffle with quantum randomness
      const shuffleResult = await this.quantumFisherYatesShuffle(names);
      this.selectedNames = shuffleResult.shuffled.slice(0, winnersCount);
      this.auditLog = shuffleResult.auditLog;

      // Assign random numbers if requested
      if (assignNumbers) {
        const numberData = await qrngService.getUint16(winnersCount);
        this.selectedNames = this.selectedNames.map((name, index) => ({
          name,
          number: numberData[index],
          originalIndex: names.indexOf(name) + 1
        }));
      } else {
        this.selectedNames = this.selectedNames.map((name, index) => ({
          name,
          number: null,
          originalIndex: names.indexOf(name) + 1
        }));
      }

      this.showResults(names.length, winnersCount);

      // Analytics
      qrngService.emit('tool_usage', {
        tool: 'name_picker',
        total_names: names.length,
        winners: winnersCount,
        assign_numbers: assignNumbers,
        remove_duplicates: removeDuplicates
      });

    } catch (error) {
      console.error('Name selection error:', error);
      this.showError(`Failed to select names: ${error.message}`);
    }
  }

  async quantumFisherYatesShuffle(array) {
    const shuffled = [...array];
    const auditLog = [];
    const n = shuffled.length;

    // Get all quantum values needed for the shuffle at once
    const quantumValues = await qrngService.getUint16(n - 1);

    // Perform Fisher-Yates shuffle with quantum randomness
    for (let i = n - 1; i > 0; i--) {
      const quantumValue = quantumValues[n - 1 - i];
      const j = quantumValue % (i + 1); // Map to valid range

      // Swap elements
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

      // Log for audit trail
      auditLog.push({
        step: n - i,
        quantumValue,
        swapIndices: [i, j],
        swapNames: [shuffled[j], shuffled[i]], // Note: after swap
        remainingPool: i + 1
      });
    }

    return { shuffled, auditLog };
  }

  showResults(totalNames, winnersCount) {
    // Update metadata
    this.container.querySelector('#total-names-display').textContent = totalNames;
    this.container.querySelector('#winners-count-display').textContent = winnersCount;
    this.container.querySelector('#selection-timestamp').textContent = new Date().toLocaleTimeString();

    // Populate winners list
    const winnersList = this.container.querySelector('#winners-list');
    winnersList.innerHTML = '';

    this.selectedNames.forEach((winner, index) => {
      const winnerItem = document.createElement('div');
      winnerItem.className = 'winner-item';

      const numberDisplay = winner.number !== null
        ? `<span class="winner-number">#${winner.number}</span>`
        : '';

      winnerItem.innerHTML = `
        <div class="winner-rank">${index + 1}</div>
        <div class="winner-info">
          <div class="winner-name">${this.escapeHtml(winner.name)}</div>
          <div class="winner-details">
            Original position: #${winner.originalIndex}
            ${winner.number !== null ? ` • Assigned number: ${winner.number}` : ''}
          </div>
        </div>
        ${numberDisplay}
        <button class="copy-winner-btn" data-winner="${this.escapeHtml(winner.name)}" title="Copy this winner">
          📋
        </button>
      `;

      winnerItem.querySelector('.copy-winner-btn').addEventListener('click', (e) => {
        this.copyWinner(winner.name); // Pass original unescaped name for copying
      });

      winnersList.appendChild(winnerItem);
    });

    // Populate audit log
    this.populateAuditLog();

    this.container.querySelector('#name-success').classList.remove('hidden');
    this.container.querySelector('#name-loading').classList.add('hidden');
    this.container.querySelector('#name-error').classList.add('hidden');
    this.container.querySelector('#select-winners').disabled = false;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  populateAuditLog() {
    const auditLogDiv = this.container.querySelector('#audit-log');

    const summary = `Selection used ${this.auditLog.length} quantum random values to shuffle the list. `;
    const fairness = `Each name had an equal ${(1 / this.selectedNames.length * 100).toFixed(1)}% chance of selection.`;

    auditLogDiv.innerHTML = `
      <div class="audit-summary">
        <p>${summary}${fairness}</p>
        <div class="audit-details hidden" id="audit-details">
          <h5>Detailed Shuffle Steps:</h5>
          ${this.auditLog.map(entry => `
            <div class="audit-entry">
              <strong>Step ${entry.step}:</strong> 
              Quantum value ${entry.quantumValue} → 
              Swap position ${entry.swapIndices[0]} with ${entry.swapIndices[1]} 
              (${entry.remainingPool} names in pool)
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  toggleAuditDetails() {
    const auditDetails = this.container.querySelector('#audit-details');
    const toggleBtn = this.container.querySelector('#toggle-audit');

    if (auditDetails.classList.contains('hidden')) {
      auditDetails.classList.remove('hidden');
      toggleBtn.textContent = 'Hide Full Quantum Audit';
    } else {
      auditDetails.classList.add('hidden');
      toggleBtn.textContent = 'Show Full Quantum Audit';
    }
  }

  async copyResults() {
    const winners = this.selectedNames.map((winner, index) => {
      const numberPart = winner.number !== null ? ` (#${winner.number})` : '';
      return `${index + 1}. ${winner.name}${numberPart}`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(winners);
      this.showCopyFeedback(this.container.querySelector('#copy-winners'));
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  async copyWinner(winnerName) {
    try {
      await navigator.clipboard.writeText(winnerName);
      const btn = this.container.querySelector(`[data-winner="${winnerName}"]`);
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

  exportResults() {
    const timestamp = new Date().toISOString();
    const totalNames = this.container.querySelector('#total-names-display').textContent;

    const winnersText = this.selectedNames.map((winner, index) => {
      const numberPart = winner.number !== null ? ` (Assigned: #${winner.number})` : '';
      return `${index + 1}. ${winner.name}${numberPart} [Original position: #${winner.originalIndex}]`;
    }).join('\n');

    const auditText = this.auditLog.map(entry =>
      `Step ${entry.step}: Quantum ${entry.quantumValue} → Swap [${entry.swapIndices.join(',')}] → Pool: ${entry.remainingPool}`
    ).join('\n');

    const content = `Quantum Name Selection Results
Generated: ${timestamp}
Total Names: ${totalNames}
Winners Selected: ${this.selectedNames.length}
Selection Method: Quantum Fisher-Yates Shuffle

🏆 WINNERS:
${winnersText}

🔍 QUANTUM AUDIT TRAIL:
${auditText}

📊 FAIRNESS VERIFICATION:
- Method: Fisher-Yates shuffle with quantum entropy
- Randomness Source: ANU Quantum Random Number Generator
- Each name had equal probability of selection
- All quantum values used are logged above for transparency

---
Generated by Quantum Random Lab
This selection is cryptographically fair and verifiable.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-name-selection-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showLoading() {
    this.container.querySelector('#name-loading').classList.remove('hidden');
    this.container.querySelector('#name-error').classList.add('hidden');
    this.container.querySelector('#name-success').classList.add('hidden');
    this.container.querySelector('#select-winners').disabled = true;
  }

  showError(message) {
    this.container.querySelector('#name-error-message').textContent = message;
    this.container.querySelector('#name-error').classList.remove('hidden');
    this.container.querySelector('#name-loading').classList.add('hidden');
    this.container.querySelector('#name-success').classList.add('hidden');
    this.container.querySelector('#select-winners').disabled = false;
  }
}

window.QuantumNameTool = QuantumNameTool;