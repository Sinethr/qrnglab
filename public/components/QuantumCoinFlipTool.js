/**
 * Quantum Coin Flip Tool Component
 * 
 * Simulates coin flips using quantum randomness with visual history
 */

class QuantumCoinFlipTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.history = [];
    this.maxHistory = 10;
    this.currentRotation = 0;
    this.init();
  }

  init() {
    // Inject custom styles for 3D effects if they don't exist
    const styleId = 'coin-flip-3d-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
            .perspective-1000 { perspective: 1000px; }
            .transform-style-3d { transform-style: preserve-3d; }
            .backface-hidden { backface-visibility: hidden; }
            .rotate-y-180 { transform: rotateY(180deg); }
        `;
      document.head.appendChild(style);
    }

    this.container.innerHTML = `
        <div class="bg-white rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-sm border border-gray-100">
            <!-- Header -->
            <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">🪙 Quantum Coin Flip</h3>
                <p class="text-gray-600">Fair coin flips using quantum randomness</p>
            </div>

            <div class="space-y-6">
                <!-- Controls -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                    <div>
                        <label for="coin-count" class="block text-sm font-semibold text-gray-700 mb-2">Number of Flips</label>
                        <div class="flex items-center gap-2">
                             <button id="decrease-count" class="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-2xl flex items-center justify-center transition-colors border border-gray-200 active:scale-95 touch-manipulation select-none">-</button>
                             <div class="relative flex-1">
                                 <input type="number" id="coin-count"  
                                     class="w-full h-12 px-4 border border-gray-300 rounded-xl text-center font-bold text-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm bg-white"
                                     placeholder="Max 20" />
                             </div>
                             <button id="increase-count" class="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-2xl flex items-center justify-center transition-colors border border-gray-200 active:scale-95 touch-manipulation select-none">+</button>
                        </div>
                    </div>
                    
                    <div>
                        <label for="coin-speed" class="block text-sm font-semibold text-gray-700 mb-2">Animation Speed</label>
                        <select id="coin-speed" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white shadow-sm">
                            <option value="fast">Fast ⚡</option>
                            <option value="normal" selected>Normal 🎯</option>
                            <option value="slow">Slow 🐢</option>
                        </select>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button id="flip-coin" class="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait">
                        <span class="text-xl">🪙</span>
                        <span>Flip Coin</span>
                    </button>
                    
                    <button id="clear-history" class="px-6 py-3 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <span>🗑️</span>
                        <span class="hidden sm:inline">Clear</span>
                    </button>
                </div>
            </div>
            
            <!-- Error Message -->
            <div id="coin-error" class="hidden mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                <span class="text-lg">⚠️</span>
                <span id="coin-error-message"></span>
            </div>
            
            <!-- Animation Stage -->
            <div class="relative mt-12 mb-8 min-h-[220px] flex flex-col items-center justify-center">
                <!-- Loading Indicator -->
                <div id="coin-loading" class="hidden absolute top-0 left-0 w-full h-full z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div class="flex flex-col items-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
                        <span class="text-sm font-medium text-emerald-800">Quantum flipping...</span>
                    </div>
                </div>

                 <!-- The Coin -->
                <div class="perspective-1000">
                    <div id="animated-coin" class="w-40 h-40 relative transform-style-3d cursor-pointer transition-transform ease-out" style="transform: rotateY(0deg);">
                        <!-- Heads Face -->
                        <div class="absolute inset-0 w-full h-full rounded-full backface-hidden shadow-2xl border-4 border-yellow-300 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center">
                            <div class="text-center text-yellow-100 drop-shadow-md">
                                <span class="text-5xl block mb-1">👑</span>
                                <span class="text-xs font-bold tracking-widest opacity-80">HEADS</span>
                            </div>
                        </div>
                        
                        <!-- Tails Face -->
                        <div class="absolute inset-0 w-full h-full rounded-full backface-hidden shadow-2xl border-4 border-slate-300 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 flex items-center justify-center rotate-y-180">
                            <div class="text-center text-slate-100 drop-shadow-md">
                                <span class="text-5xl block mb-1">🦅</span>
                                <span class="text-xs font-bold tracking-widest opacity-80">TAILS</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Result Display -->
                <div id="current-result" class="mt-8 text-center h-12 transition-all duration-300 opacity-0 transform translate-y-2">
                    <div class="text-3xl font-black tracking-tight" id="result-text">HEADS</div>
                    <div class="text-xs text-gray-400 mt-1">Quantum Value: <span id="quantum-value" class="font-mono">--</span></div>
                </div>
            </div>
            
            <!-- History Strip -->
            <div id="flip-history" class="mt-8 border-t border-gray-100 pt-6">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider">History <span id="history-stats" class="text-gray-400 font-normal normal-case ml-2"></span></h4>
                    <button id="export-history" class="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline hidden">
                        Export CSV
                    </button>
                </div>
                
                <div id="history-strip" class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    <div class="w-full text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
                        No flips yet - give it a spin!
                    </div>
                </div>
            </div>
        </div>
    `;

    this.bindEvents();
    this.loadHistory();
  }

  bindEvents() {
    const flipBtn = this.container.querySelector('#flip-coin');
    const clearBtn = this.container.querySelector('#clear-history');
    const exportBtn = this.container.querySelector('#export-history');
    const countInput = this.container.querySelector('#coin-count');

    flipBtn.addEventListener('click', () => this.flipCoin());
    clearBtn.addEventListener('click', () => this.clearHistory());
    exportBtn.addEventListener('click', () => this.exportStatistics());

    // Enter key handling
    countInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.flipCoin();
    });

    // Custom +/- controls
    this.container.querySelector('#decrease-count').addEventListener('click', () => {
      let val = parseInt(countInput.value) || 0;
      if (val > 1) countInput.value = val - 1;
    });

    this.container.querySelector('#increase-count').addEventListener('click', () => {
      let val = parseInt(countInput.value) || 0;
      if (val < 20) countInput.value = val + 1;
    });
  }

  async flipCoin() {
    const countInput = this.container.querySelector('#coin-count');
    const count = parseInt(countInput.value);

    // Reset UI
    this.container.querySelector('#coin-error').classList.add('hidden');

    if (isNaN(count) || count < 1 || count > 20) {
      this.showError('Please enter a valid number of flips (1-20)');
      return;
    }

    this.toggleLoading(true);

    try {
      // Get quantum random uint8 values
      const quantumData = await qrngService.getUint8(count);

      // Process flips sequentially
      for (let i = 0; i < count; i++) {
        const rawValue = quantumData[i];
        const isHeads = rawValue % 2 === 0;

        await this.animateFlip(isHeads, i === count - 1, rawValue);

        // Add to history
        this.addToHistory({
          result: isHeads ? 'heads' : 'tails',
          timestamp: new Date(),
          quantumValue: rawValue
        });

        // Small delay between multiple flips
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      this.updateHistoryDisplay();

      // Analytics
      if (window.qrngService) {
        qrngService.emit('tool_usage', {
          tool: 'coinflip',
          count,
          results: quantumData.map(v => v % 2 === 0 ? 'heads' : 'tails')
        });
      }

    } catch (error) {
      console.error('Coin flip error:', error);
      this.showError(`Failed to flip coin: ${error.message}`);
    } finally {
      this.toggleLoading(false);
    }
  }

  async animateFlip(isHeads, isLast = true, quantumValue) {
    const coin = this.container.querySelector('#animated-coin');
    const resultDiv = this.container.querySelector('#current-result');
    const resultText = this.container.querySelector('#result-text');
    const quantumValueDisplay = this.container.querySelector('#quantum-value');
    const speed = this.container.querySelector('#coin-speed').value;

    // Durations in ms
    const durations = {
      fast: 600,
      normal: 1200,
      slow: 2000
    };
    const duration = durations[speed] || 1200;

    // Reset result visibility for start of flip
    resultDiv.classList.remove('opacity-100', 'translate-y-0');
    resultDiv.classList.add('opacity-0', 'translate-y-2');

    // Calculate new rotation
    // We want to spin multiple times (e.g., 5 full rotations = 1800 deg)
    // plus the target face (0 for heads, 180 for tails)
    const spins = 5;
    const degreesPerSpin = 360;

    const currentRot = this.currentRotation;

    let nextRotation = currentRot + (spins * degreesPerSpin);

    // Adjust for target face
    // If we want Heads (mod 360 == 0)
    // If we want Tails (mod 360 == 180)
    const currentMod = currentRot % 360;

    let adjustment = 0;
    if (isHeads) {
      // We want end % 360 = 0.
      // If current is 180, we need to add 180. 
      if (currentMod !== 0) adjustment = 180;
    } else {
      // We want end % 360 = 180.
      // If current is 0, we need to add 180.
      if (currentMod === 0) adjustment = 180;
    }

    nextRotation += adjustment;

    // Apply animation
    coin.style.transitionDuration = `${duration}ms`;
    coin.style.transform = `rotateY(${nextRotation}deg)`;

    this.currentRotation = nextRotation;

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, duration));

    // Show result
    if (isLast) {
      const colorClass = isHeads ? 'text-yellow-600' : 'text-slate-600';

      resultText.textContent = isHeads ? 'HEADS' : 'TAILS';
      resultText.className = `text-3xl font-black tracking-tight ${colorClass}`;
      quantumValueDisplay.textContent = quantumValue;

      resultDiv.classList.remove('opacity-0', 'translate-y-2');
      resultDiv.classList.add('opacity-100', 'translate-y-0');
    }
  }

  addToHistory(flip) {
    this.history.unshift(flip);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }
    this.saveHistory();
  }

  updateHistoryDisplay() {
    const historyStrip = this.container.querySelector('#history-strip');
    const historyStats = this.container.querySelector('#history-stats');
    const exportBtn = this.container.querySelector('#export-history');

    if (this.history.length === 0) {
      historyStrip.innerHTML = '<div class="w-full text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">No flips yet - give it a spin!</div>';
      historyStats.textContent = '';
      exportBtn.classList.add('hidden');
      return;
    }

    // Stats
    const heads = this.history.filter(f => f.result === 'heads').length;
    const headPct = Math.round((heads / this.history.length) * 100);
    historyStats.textContent = `(${heads}H / ${this.history.length - heads}T - ${headPct}%)`;
    exportBtn.classList.remove('hidden');

    historyStrip.innerHTML = this.history.map(flip => {
      const isHeads = flip.result === 'heads';
      const bgColor = isHeads ? 'bg-yellow-100 border-yellow-200 text-yellow-700' : 'bg-slate-100 border-slate-200 text-slate-700';
      const icon = isHeads ? '👑' : '🦅';

      return `
        <div class="flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-lg border ${bgColor} p-1 transition-transform hover:scale-105" title="Quantum Value: ${flip.quantumValue}">
            <span class="text-xl mb-1">${icon}</span>
            <span class="text-xs font-bold uppercase">${flip.result}</span>
        </div>
      `;
    }).join('');
  }

  showError(message) {
    const errorDiv = this.container.querySelector('#coin-error');
    this.container.querySelector('#coin-error-message').textContent = message;
    errorDiv.classList.remove('hidden');
  }

  toggleLoading(isLoading) {
    const btn = this.container.querySelector('#flip-coin');
    const loadDiv = this.container.querySelector('#coin-loading');

    if (isLoading) {
      btn.disabled = true;
      loadDiv.classList.remove('hidden');
    } else {
      btn.disabled = false;
      loadDiv.classList.add('hidden');
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('quantumCoinHistory', JSON.stringify(this.history));
    } catch (e) { console.warn(e); }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('quantumCoinHistory');
      if (saved) {
        this.history = JSON.parse(saved).map(f => ({ ...f, timestamp: new Date(f.timestamp) }));
        this.updateHistoryDisplay();
      }
    } catch (e) { console.warn(e); }
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.updateHistoryDisplay();
  }

  exportStatistics() {
    if (this.history.length === 0) return;
    const heads = this.history.filter(f => f.result === 'heads').length;
    const tails = this.history.length - heads;
    const content = `Quantum Coin Flip Stats\nGenerated: ${new Date().toLocaleString()}\n\nHeads: ${heads}\nTails: ${tails}\nTotal: ${this.history.length}\n\nHistory:\n${this.history.map((f, i) => `${i + 1}. ${f.result.toUpperCase()} (Val: ${f.quantumValue})`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-coin-stats.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Export for global use
window.QuantumCoinFlipTool = QuantumCoinFlipTool;