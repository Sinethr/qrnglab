/**
 * Quantum Dice Tool Component
 * 
 * Simulates dice rolls with presets and custom configurations
 * Refactored with Tailwind CSS and Custom Dice Visuals
 */

class QuantumDiceTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cache = []; // Cache quantum values for smooth rolling
    this.rollHistory = [];
    this.init();
  }

  init() {
    // Inject custom styles as we did for Coin Flip (if needed)
    // We'll primarily use Tailwind, but a few specific dice styles might be cleaner in CSS
    const styleId = 'dice-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
            .die-face-d6 {
                display: grid;
                grid-template-areas: 
                    "a . c"
                    "e g f"
                    "d . b";
                padding: 4px; /* Reduced padding */
            }
            .pip { display: none; background-color: #1f2937; border-radius: 50%; width: 10px; height: 10px; place-self: center; box-shadow: inset 0 1px 1px rgba(0,0,0,0.5); }
            .die-face-d6[data-val="1"] .pip:nth-child(7) { display: block; grid-area: g; width: 14px; height: 14px; background-color: #db2716; } /* Center red dot */
            
            .die-face-d6[data-val="2"] .pip:nth-child(1) { display: block; grid-area: a; }
            .die-face-d6[data-val="2"] .pip:nth-child(2) { display: block; grid-area: b; }
            
            .die-face-d6[data-val="3"] .pip:nth-child(1) { display: block; grid-area: a; }
            .die-face-d6[data-val="3"] .pip:nth-child(7) { display: block; grid-area: g; }
            .die-face-d6[data-val="3"] .pip:nth-child(2) { display: block; grid-area: b; }

            .die-face-d6[data-val="4"] .pip:nth-child(1) { display: block; grid-area: a; }
            .die-face-d6[data-val="4"] .pip:nth-child(3) { display: block; grid-area: c; }
            .die-face-d6[data-val="4"] .pip:nth-child(4) { display: block; grid-area: d; }
            .die-face-d6[data-val="4"] .pip:nth-child(2) { display: block; grid-area: b; }

            .die-face-d6[data-val="5"] .pip:nth-child(1) { display: block; grid-area: a; }
            .die-face-d6[data-val="5"] .pip:nth-child(3) { display: block; grid-area: c; }
            .die-face-d6[data-val="5"] .pip:nth-child(7) { display: block; grid-area: g; }
            .die-face-d6[data-val="5"] .pip:nth-child(4) { display: block; grid-area: d; }
            .die-face-d6[data-val="5"] .pip:nth-child(2) { display: block; grid-area: b; }

            .die-face-d6[data-val="6"] .pip:nth-child(1) { display: block; grid-area: a; }
            .die-face-d6[data-val="6"] .pip:nth-child(3) { display: block; grid-area: c; }
            .die-face-d6[data-val="6"] .pip:nth-child(5) { display: block; grid-area: e; }
            .die-face-d6[data-val="6"] .pip:nth-child(6) { display: block; grid-area: f; }
            .die-face-d6[data-val="6"] .pip:nth-child(4) { display: block; grid-area: d; }
            .die-face-d6[data-val="6"] .pip:nth-child(2) { display: block; grid-area: b; }

            @keyframes rollIn {
                0% { transform: rotateX(720deg) rotateY(360deg) scale(0.5); opacity: 0; }
                80% { transform: scale(1.1); }
                100% { transform: rotateX(0) rotateY(0) scale(1); opacity: 1; }
            }
        `;
      document.head.appendChild(style);
    }

    this.container.innerHTML = `
      <div class="bg-white rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-sm border border-gray-100">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">🎲 Quantum Dice Roller</h2>
          <p class="text-gray-600">Roll dice with quantum randomness - perfect for games and fair decisions</p>
        </div>
        
        <!-- Controls -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <!-- Preset Selection -->
            <div class="md:col-span-4">
              <label for="dice-preset" class="block text-sm font-bold text-gray-700 mb-1">Preset</label>
              <div class="relative">
                <select id="dice-preset" class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm bg-white text-gray-800 appearance-none">
                    <option value="d6" selected>1d6 (Standard Die)</option>
                    <option value="2d6">2d6 (Board Games)</option>
                    <option value="3d6">3d6 (Stats)</option>
                    <option value="d20">1d20 (D&D / RPG)</option>
                    <option value="d100">1d100 (Percentile)</option>
                    <option value="custom">Custom Configuration...</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            <!-- Custom Controls (Hidden by default) -->
            <div id="custom-controls" class="hidden md:col-span-8 grid grid-cols-2 gap-4">
               <div>
                <label for="dice-sides" class="block text-sm font-bold text-gray-700 mb-1">Sides</label>
                <input type="number" id="dice-sides" value="6" min="2" max="1000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm font-mono text-center">
               </div>
               <div>
                <label for="dice-count" class="block text-sm font-bold text-gray-700 mb-1">Count</label>
                <input type="number" id="dice-count" value="1" min="1" max="10"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm font-mono text-center">
               </div>
            </div>

            <!-- Standard Count Display (Only for presets, readonly-ish feel) -->
            <div id="standard-info" class="md:col-span-8 flex items-center text-gray-500 text-sm italic">
                Select 'Custom' to change sides and count manually.
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-6 items-center justify-between border-t border-gray-200 pt-6">
            <div class="flex flex-col sm:flex-row gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="show-individual" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 transition duration-150 ease-in-out" />
                    <span class="text-gray-700 text-sm font-medium">Show details</span>
                </label>
                
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="auto-sum" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 transition duration-150 ease-in-out" />
                    <span class="text-gray-700 text-sm font-medium">Sum total</span>
                </label>
            </div>
            
            <button id="roll-dice" class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                <span class="text-xl">🎲</span>
                <span>ROLL DICE</span>
            </button>
          </div>
        </div>
        
        <!-- Display Area -->
        <div class="min-h-[200px] flex flex-col items-center justify-center mb-8 relative">
           <!-- Loading -->
           <div id="dice-loading" class="hidden absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
             <div class="animate-spin rounded-full h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 mb-3"></div>
             <p class="text-emerald-800 font-medium animate-pulse">Rolling quantum dice...</p>
           </div>

           <!-- Dice Container -->
           <div id="dice-animation" class="flex flex-wrap justify-center gap-6 p-4 perspective-1000">
             <!-- Animated dice injected here -->
             <div class="text-gray-400 text-center italic">
                Ready to roll.
             </div>
           </div>
           
           <!-- Text Result -->
           <div id="dice-result" class="hidden mt-8 text-center w-full animate-fade-in-up">
              <div class="mb-2">
                <span id="result-value" class="text-5xl font-black text-gray-800 tracking-tight"></span>
              </div>
              <div id="result-label" class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4"></div>
              
              <div id="individual-rolls" class="flex flex-wrap justify-center gap-2 max-w-lg mx-auto p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-600 font-mono text-sm leading-relaxed">
              </div>
           </div>

           <!-- Error -->
           <div id="dice-error" class="hidden mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
              <span class="text-xl">⚠️</span>
              <span id="dice-error-message"></span>
           </div>
        </div>
        
        <!-- History -->
        <div id="dice-history" class="border-t border-gray-100 pt-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800">Roll History</h3>
            <div class="flex gap-2">
                <button id="export-dice-history" class="text-xs font-medium text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1 rounded-md transition-colors hidden">
                    Export
                </button>
                <button id="clear-dice-history" class="text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-md transition-colors">
                    Clear
                </button>
            </div>
          </div>
          
          <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" id="history-list">
             <div class="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 italic text-sm">
                Your lucky rolls will appear here
             </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateControlsForPreset();
    this.preloadQuantumCache();
  }

  bindEvents() {
    const rollBtn = this.container.querySelector('#roll-dice');
    const presetSelect = this.container.querySelector('#dice-preset');
    const clearBtn = this.container.querySelector('#clear-dice-history');
    const exportBtn = this.container.querySelector('#export-dice-history');

    rollBtn.addEventListener('click', () => this.rollDice());
    presetSelect.addEventListener('change', () => this.updateControlsForPreset());
    clearBtn.addEventListener('click', () => this.clearHistory());
    exportBtn.addEventListener('click', () => this.exportHistory());

    // Enter key handling
    this.container.querySelectorAll('input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.rollDice();
        }
      });
    });
  }

  updateControlsForPreset() {
    const preset = this.container.querySelector('#dice-preset').value;
    const customControls = this.container.querySelector('#custom-controls');
    const standardInfo = this.container.querySelector('#standard-info');
    const sidesInput = this.container.querySelector('#dice-sides');
    const countInput = this.container.querySelector('#dice-count');

    const presets = {
      'd6': { sides: 6, count: 1 },
      '2d6': { sides: 6, count: 2 },
      '3d6': { sides: 6, count: 3 },
      'd20': { sides: 20, count: 1 },
      'd100': { sides: 100, count: 1 }
    };

    if (preset === 'custom') {
      customControls.classList.remove('hidden');
      customControls.classList.add('grid'); // restore grid layout
      standardInfo.classList.add('hidden');
    } else {
      customControls.classList.add('hidden');
      customControls.classList.remove('grid');
      standardInfo.classList.remove('hidden');

      const config = presets[preset];
      if (config) {
        sidesInput.value = config.sides;
        countInput.value = config.count;
      }
    }
  }

  async preloadQuantumCache() {
    try {
      this.cache = await qrngService.getUint16(50);
    } catch (error) {
      console.warn('Failed to preload quantum cache:', error);
    }
  }

  async rollDice() {
    const sides = parseInt(this.container.querySelector('#dice-sides').value);
    const count = parseInt(this.container.querySelector('#dice-count').value);

    // Reset UI
    this.container.querySelector('#dice-error').classList.add('hidden');

    if (isNaN(sides) || sides < 2 || sides > 1000) {
      this.showError('Number of sides must be between 2 and 1000');
      return;
    }

    if (isNaN(count) || count < 1 || count > 10) {
      this.showError('Number of dice must be between 1 and 10');
      return;
    }

    this.showLoading();

    try {
      // Get quantum values (use cache if available)
      let quantumData;
      if (this.cache.length >= count) {
        quantumData = this.cache.splice(0, count);
        // Refill cache in background
        this.preloadQuantumCache();
      } else {
        quantumData = await qrngService.getUint16(count);
      }

      // Map to dice values
      const rolls = quantumData.map(raw => {
        return 1 + (raw % sides);
      });

      const sum = rolls.reduce((a, b) => a + b, 0);

      await this.animateDiceRoll(rolls, sides);
      this.showResults(rolls, sum, sides);

      // Add to history
      this.addToHistory({
        rolls,
        sum,
        sides,
        count,
        timestamp: new Date()
      });

      this.hideLoading();

      // Analytics
      if (window.qrngService) {
        qrngService.emit('tool_usage', {
          tool: 'dice',
          sides,
          count,
          rolls,
          sum
        });
      }

    } catch (error) {
      console.error('Dice roll error:', error);
      this.showError(`Failed to roll dice: ${error.message}`);
    }
  }

  async animateDiceRoll(rolls, sides) {
    const diceContainer = this.container.querySelector('#dice-animation');
    const resultDiv = this.container.querySelector('#dice-result');

    // Hide previous result
    resultDiv.classList.add('hidden');

    // Clear previous dice
    diceContainer.innerHTML = '';

    // Create animated dice
    rolls.forEach((roll, index) => {
      const dieWrapper = document.createElement('div');
      dieWrapper.style.animation = `rollIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s forwards`;
      dieWrapper.style.opacity = '0'; // start invisible

      dieWrapper.innerHTML = this.renderDieHTML(roll, sides);

      diceContainer.appendChild(dieWrapper);
    });

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000 + (rolls.length * 100)));
  }

  renderDieHTML(value, sides) {
    // D6 Special Rendering
    if (sides === 6) {
      return `
            <div class="die-face-d6 w-20 h-20 bg-white rounded-xl shadow-lg border-2 border-slate-200 flex-shrink-0" data-val="${value}">
                <div class="pip"></div><div class="pip"></div><div class="pip"></div>
                <div class="pip"></div><div class="pip"></div><div class="pip"></div>
                <div class="pip"></div>
            </div>
          `;
    }

    // Generic Dice (D20, D12, etc)
    // Different colors for different dice types could be cool, keeping it clean for now
    return `
        <div class="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg border-2 border-indigo-300 text-white font-bold text-2xl flex-shrink-0 relative overflow-hidden">
             <div class="absolute inset-0 bg-white opacity-10 rounded-full transform scale-150 translate-x-10 -translate-y-10"></div>
             <span class="relative z-10 drop-shadow-md">${value}</span>
             <span class="absolute bottom-1 right-2 text-[10px] uppercase opacity-50 font-normal tracking-wider">d${sides}</span>
        </div>
      `;
  }

  showResults(rolls, sum, sides) {
    const resultDiv = this.container.querySelector('#dice-result');
    const resultValue = this.container.querySelector('#result-value');
    const resultLabel = this.container.querySelector('#result-label');
    const individualRolls = this.container.querySelector('#individual-rolls');

    const showIndividual = this.container.querySelector('#show-individual').checked;
    const autoSum = this.container.querySelector('#auto-sum').checked;

    // Determine what to show as main result
    if (rolls.length === 1) {
      resultValue.textContent = rolls[0];
      resultLabel.textContent = `Result (d${sides})`;
    } else if (autoSum) {
      resultValue.textContent = sum;
      resultLabel.textContent = `Total Sum (${rolls.length}d${sides})`;
    } else {
      resultValue.textContent = rolls.join(', ');
      resultLabel.textContent = `Rolled ${rolls.length}d${sides}`;
    }

    // Show individual rolls text if requested
    if (showIndividual && rolls.length > 1) {
      individualRolls.innerHTML = rolls.map((roll, i) =>
        `<span class="inline-block px-2 py-1 bg-white border border-gray-200 rounded shadow-sm font-bold text-gray-700">${roll}</span>${i < rolls.length - 1 ? '<span class="text-gray-300">+</span>' : ''}`
      ).join(' ');

      // If we are showing sum as main result, make sure we show the string representation below clearly
      if (autoSum) {
        const expression = `( ${rolls.join(' + ')} )`;
        // Append equals sum just to be clear
        individualRolls.innerHTML = expression;
      }

      individualRolls.classList.remove('hidden');
    } else {
      individualRolls.classList.add('hidden');
    }

    resultDiv.classList.remove('hidden');
  }

  addToHistory(rollData) {
    this.rollHistory.unshift(rollData);
    if (this.rollHistory.length > 20) {
      this.rollHistory = this.rollHistory.slice(0, 20);
    }
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyList = this.container.querySelector('#history-list');
    const exportBtn = this.container.querySelector('#export-dice-history');

    if (this.rollHistory.length === 0) {
      historyList.innerHTML = '<div class="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 italic text-sm">Your lucky rolls will appear here</div>';
      exportBtn.classList.add('hidden');
      return;
    }

    exportBtn.classList.remove('hidden');

    historyList.innerHTML = this.rollHistory.map((roll, index) => {
      const timeAgo = this.getTimeAgo(roll.timestamp);

      // Fix for long text overlap
      let resultMain = '';
      let resultSub = '';

      if (roll.count === 1) {
        resultMain = roll.rolls[0];
        resultSub = `${roll.sides}-sided die`;
      } else {
        resultMain = roll.sum;
        // Truncate long addition strings
        const fullString = roll.rolls.join(' + ');
        if (fullString.length > 20) {
          resultSub = `${roll.count}d${roll.sides} (${fullString.substring(0, 20)}...)`;
        } else {
          resultSub = `${roll.count}d${roll.sides} (${fullString})`;
        }
      }

      return `
        <div class="flex items-center justify-between p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors group">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                ${roll.count === 1 && roll.sides === 6 ? this.getD6Unicode(roll.rolls[0]) : '#'}
            </div>
            <div class="flex flex-col min-w-0">
                <div class="font-bold text-gray-800 text-lg leading-tight truncate" title="${roll.count > 1 ? roll.rolls.join(' + ') : ''}">
                    ${resultMain}
                </div>
                <div class="text-xs text-gray-500 truncate font-mono">
                    ${resultSub}
                </div>
            </div>
          </div>
          <div class="text-xs text-gray-400 whitespace-nowrap ml-4 font-medium">
            ${timeAgo}
          </div>
        </div>
      `;
    }).join('');
  }

  getD6Unicode(val) {
    const map = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return map[val - 1] || val;
  }

  getTimeAgo(timestamp) {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  }

  clearHistory() {
    this.rollHistory = [];
    this.updateHistoryDisplay();
  }

  exportHistory() {
    const content = `Quantum Dice Roll History\nGenerated: ${new Date().toLocaleString()}\n\n` +
      this.rollHistory.map((r, i) => {
        const num = this.rollHistory.length - i;
        const main = r.count === 1 ? r.rolls[0] : `${r.sum} (${r.rolls.join('+')})`;
        return `${num}. ${main} [${r.count}d${r.sides}]`;
      }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-dice-history.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showLoading() {
    this.container.querySelector('#dice-loading').classList.remove('hidden');
    this.container.querySelector('#dice-error').classList.add('hidden');
    this.container.querySelector('#roll-dice').disabled = true;
  }

  hideLoading() {
    this.container.querySelector('#dice-loading').classList.add('hidden');
    this.container.querySelector('#roll-dice').disabled = false;
  }

  showError(message) {
    this.container.querySelector('#dice-error-message').textContent = message;
    this.container.querySelector('#dice-error').classList.remove('hidden');
    this.container.querySelector('#dice-loading').classList.add('hidden');
    this.container.querySelector('#roll-dice').disabled = false;
  }
}

window.QuantumDiceTool = QuantumDiceTool;