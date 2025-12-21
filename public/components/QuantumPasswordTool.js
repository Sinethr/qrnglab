/**
 * Quantum Password Tool Component
 * 
 * Generates secure password suggestions using quantum entropy
 * Updated with visual strength indicators
 */

class QuantumPasswordTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentPassword = '';
    this.strength = { score: 0, level: 'Weak' }; // Default
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div id="password-tool-card" class="relative w-full max-w-5xl mx-auto rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 bg-gray-100 min-h-[600px] flex flex-col justify-center">
        
        <!-- Animated Background Layer -->
        <div id="bg-layer" class="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out bg-cover bg-center opacity-30" 
             style="background-image: url('/assets/images/pwd-strength-1.png');">
        </div>
        
        <!-- Content Layer -->
        <div class="relative z-10 w-full max-w-3xl mx-auto p-6 md:p-12">
          
          <!-- Header -->
          <div class="text-center mb-8 space-y-2">
            <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Random Password Generator</h2>
            <p class="text-gray-700 text-lg font-medium">Instantly create strong and secure passwords.</p>
          </div>

          <!-- Glassmorphism Container for Controls -->
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 space-y-8">
            
            <!-- Password Display Section -->
            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-quantum-light rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div class="relative flex flex-col md:flex-row gap-4">
                <div class="relative flex-grow">
                  <input type="text" id="password-output" readonly 
                    class="w-full pl-6 pr-32 py-4 md:py-5 text-xl md:text-2xl font-mono text-gray-800 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner"
                    value="Generating...">
                  
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <span id="strength-badge" class="hidden sm:inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-500">Init</span>
                    <button id="regenerate-btn" class="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50" title="Regenerate">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button id="copy-btn" class="w-full md:w-auto bg-[#0066FF] hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform active:scale-95 text-lg flex items-center justify-center gap-2">
                  <span>Copy</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Controls Grid -->
            <div class="grid gap-8">
              
              <!-- Length Slider Row -->
              <div class="grid md:grid-cols-[160px_1fr] gap-4 items-center">
                 <label class="text-gray-700 font-bold text-lg flex items-center gap-2">
                   Length: <span id="length-display" class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-lg">12</span>
                 </label>
                 
                 <div class="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <button id="decrease-length" class="w-8 h-8 rounded-full bg-white text-gray-600 shadow-sm border border-gray-200 hover:border-blue-400 hover:text-blue-500 font-bold transition-all text-xl leading-none flex items-center justify-center pb-1">-</button>
                    <input type="range" id="length-slider" min="4" max="64" value="12" 
                           class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#0066FF] hover:accent-blue-600 transition-all">
                    <button id="increase-length" class="w-8 h-8 rounded-full bg-white text-gray-600 shadow-sm border border-gray-200 hover:border-blue-400 hover:text-blue-500 font-bold transition-all text-xl leading-none flex items-center justify-center pb-1">+</button>
                 </div>
              </div>

              <!-- Character Options Row -->
              <div class="grid md:grid-cols-[160px_1fr] gap-4 items-start">
                <span class="text-gray-700 font-bold text-lg pt-1">Characters:</span>
                
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <label class="flex items-center gap-2 cursor-pointer bg-white border-2 border-transparent hover:border-blue-100 rounded-lg p-2 transition-all">
                    <div class="relative flex items-center justify-center w-5 h-5">
                      <input type="checkbox" id="char-uppercase" checked class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded bg-white checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer">
                      <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="text-gray-700 font-medium">ABC</span>
                  </label>
                  
                  <label class="flex items-center gap-2 cursor-pointer bg-white border-2 border-transparent hover:border-blue-100 rounded-lg p-2 transition-all">
                    <div class="relative flex items-center justify-center w-5 h-5">
                      <input type="checkbox" id="char-lowercase" checked class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded bg-white checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer">
                      <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="text-gray-700 font-medium">abc</span>
                  </label>
                  
                  <label class="flex items-center gap-2 cursor-pointer bg-white border-2 border-transparent hover:border-blue-100 rounded-lg p-2 transition-all">
                    <div class="relative flex items-center justify-center w-5 h-5">
                      <input type="checkbox" id="char-numbers" checked class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded bg-white checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer">
                      <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="text-gray-700 font-medium">123</span>
                  </label>
                  
                  <label class="flex items-center gap-2 cursor-pointer bg-white border-2 border-transparent hover:border-blue-100 rounded-lg p-2 transition-all">
                    <div class="relative flex items-center justify-center w-5 h-5">
                      <input type="checkbox" id="char-symbols" class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded bg-white checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer">
                      <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="text-gray-700 font-medium">#$&</span>
                  </label>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      
      <!-- Footer Note -->
      <p class="text-center text-gray-400 mt-6 text-xs max-w-2xl mx-auto">
        🔒 Generated using <a href="https://quantumnumbers.anu.edu.au/" target="_blank" class="hover:text-blue-500 underline decoration-dotted">ANU Quantum Random Numbers</a>. 
        Data is fetched securely via HTTPS.
      </p>
    `;

    this.bindEvents();
    this.generatePassword();
  }

  bindEvents() {
    const els = {
      regenerateBtn: this.container.querySelector('#regenerate-btn'),
      copyBtn: this.container.querySelector('#copy-btn'),
      lengthSlider: this.container.querySelector('#length-slider'),
      decreaseLength: this.container.querySelector('#decrease-length'),
      increaseLength: this.container.querySelector('#increase-length'),
      checkboxes: this.container.querySelectorAll('input[type="checkbox"]')
    };

    els.regenerateBtn.addEventListener('click', () => this.generatePassword());
    els.copyBtn.addEventListener('click', () => this.copyPassword());

    const updateLength = (val) => {
      let newVal = parseInt(val);
      if (newVal < 4) newVal = 4;
      if (newVal > 64) newVal = 64;
      els.lengthSlider.value = newVal;
      this.container.querySelector('#length-display').textContent = newVal;
      this.generatePassword();
    };

    els.lengthSlider.addEventListener('input', (e) => updateLength(e.target.value));
    els.decreaseLength.addEventListener('click', () => updateLength(parseInt(els.lengthSlider.value) - 1));
    els.increaseLength.addEventListener('click', () => updateLength(parseInt(els.lengthSlider.value) + 1));

    els.checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(els.checkboxes).filter(c => c.checked);
        if (checked.length === 0) {
          cb.checked = true;
          return;
        }
        this.generatePassword();
      });
    });
  }

  async generatePassword() {
    const length = parseInt(this.container.querySelector('#length-slider').value);
    const options = {
      uppercase: this.container.querySelector('#char-uppercase').checked,
      lowercase: this.container.querySelector('#char-lowercase').checked,
      numbers: this.container.querySelector('#char-numbers').checked,
      symbols: this.container.querySelector('#char-symbols').checked,
    };

    const regenBtn = this.container.querySelector('#regenerate-btn svg');
    regenBtn.classList.add('animate-spin');

    try {
      let charset = '';
      if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (options.numbers) charset += '0123456789';
      if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      const quantumData = await qrngService.getUint8(length);

      let password = '';
      for (let i = 0; i < length; i++) {
        const charIndex = quantumData[i] % charset.length;
        password += charset[charIndex];
      }

      this.currentPassword = password;
      this.updateUI(password);

    } catch (error) {
      console.error('Generation failed', error);
      this.currentPassword = 'Error-Generating'; // Simple error handling
    } finally {
      setTimeout(() => regenBtn.classList.remove('animate-spin'), 500);
    }
  }

  updateUI(password) {
    const output = this.container.querySelector('#password-output');
    output.value = password;

    const strength = this.calculateStrength(password);
    this.updateStrengthBadge(strength);
    this.updateImage(strength);
  }

  calculateStrength(password) {
    let score = 0;
    const len = password.length;

    if (len < 8) score += 10;
    else if (len < 12) score += 40;
    else if (len < 16) score += 70;
    else score += 90;

    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 20;

    let level = 'Weak';
    let color = 'text-red-500 bg-red-100';

    if (score < 40) {
      level = 'Very Weak';
      color = 'text-red-600 bg-red-100';
    } else if (score < 70) {
      level = 'Weak';
      color = 'text-orange-600 bg-orange-100';
    } else if (score < 90) {
      level = 'Strong';
      color = 'text-green-600 bg-green-100';
    } else {
      level = 'Very Strong';
      color = 'text-emerald-800 bg-emerald-100';
    }

    return { level, color, score };
  }

  updateStrengthBadge(strength) {
    const badge = this.container.querySelector('#strength-badge');
    badge.textContent = strength.level;
    badge.className = `hidden sm:inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${strength.color}`;
  }

  updateImage(strength) {
    const bgLayer = this.container.querySelector('#bg-layer');
    let src = '/assets/images/pwd-strength-1.png';

    if (strength.level === 'Very Weak') src = '/assets/images/pwd-strength-1.png'; // Tent
    else if (strength.level === 'Weak') src = '/assets/images/pwd-strength-2.png'; // Camper
    else if (strength.level === 'Strong') src = '/assets/images/pwd-strength-3.png'; // Castle
    else if (strength.level === 'Very Strong') src = '/assets/images/pwd-strength-4.png'; // Fortress

    // Preload image to avoid flicker
    const img = new Image();
    img.src = src;
    img.onload = () => {
      bgLayer.style.backgroundImage = `url('${src}')`;
    };
  }

  async copyPassword() {
    try {
      await navigator.clipboard.writeText(this.currentPassword);
      const btn = this.container.querySelector('#copy-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="flex items-center gap-2">✅ <span>Copied!</span></span>`;
      btn.classList.add('bg-green-600', 'hover:bg-green-700');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
      }, 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  }
}

window.QuantumPasswordTool = QuantumPasswordTool;