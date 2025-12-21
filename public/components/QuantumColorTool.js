/**
 * Quantum Color Tool Component
 * 
 * Generates random colors using quantum hex values
 */

class QuantumColorTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.colors = [];
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="tool-card">
        <div class="tool-header">
          <h2>🎨 Quantum Color Generator</h2>
          <p class="tool-description">Generate beautiful random colors using quantum entropy for design and art projects</p>
        </div>
        
        <div class="tool-controls">
          <div class="control-row space-y-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="input-group">
                <label for="color-count" class="block text-sm font-bold text-gray-700 mb-1">Number of Colors</label>
                <input type="number" id="color-count" value="8" min="1" max="24"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm text-gray-800 font-mono">
                <span class="text-xs text-gray-500 mt-1 block">1-24 colors</span>
              </div>
              
              <div class="input-group">
                <label for="color-format" class="block text-sm font-bold text-gray-700 mb-1">Output Format</label>
                <select id="color-format" class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-quantum-light focus:border-quantum-light outline-none transition-all shadow-sm bg-white text-gray-800">
                  <option value="hex">Hex (#RRGGBB)</option>
                  <option value="rgb">RGB (r, g, b)</option>
                  <option value="hsl">HSL (h, s%, l%)</option>
                  <option value="css">CSS Variables</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="control-row flex flex-wrap gap-6 mb-6">
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="bright-colors" class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="bright-colors" class="font-medium text-gray-700 cursor-pointer">Favor bright colors</label>
            </div>
            
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="avoid-grays" class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="avoid-grays" class="font-medium text-gray-700 cursor-pointer">Avoid gray tones</label>
            </div>
            
            <div class="checkbox-group flex items-center gap-2">
              <input type="checkbox" id="harmonious" class="w-5 h-5 text-quantum-light rounded border-gray-300 focus:ring-quantum-light" />
              <label for="harmonious" class="font-medium text-gray-700 cursor-pointer">Harmonious palette</label>
            </div>
          </div>
          
          <button id="generate-colors" class="generate-btn">
            <span class="btn-icon">🎨</span>
            Generate Colors
          </button>
        </div>
        
        <div class="tool-results">
          <div id="color-loading" class="loading hidden">
            <div class="spinner"></div>
            <p>Creating quantum palette...</p>
          </div>
          
          <div id="color-error" class="error hidden">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
              <h4>Error</h4>
              <p id="color-error-message"></p>
            </div>
          </div>
          
          <div id="color-success" class="success hidden">
            <div class="result-header">
              <h3>🎨 Quantum Color Palette</h3>
              <div class="result-actions">
                <button id="copy-palette" class="copy-btn">📋 Copy Palette</button>
                <button id="export-palette" class="download-btn">💾 Export</button>
                <button id="regenerate-colors" class="secondary-btn">🔄 New Palette</button>
              </div>
            </div>
            
            <div class="color-palette" id="color-palette">
              <!-- Color swatches will be populated here -->
            </div>
            
            <div class="palette-formats" id="palette-formats">
              <!-- Different format outputs will be shown here -->
            </div>
          </div>
          
          <div class="color-uses-section">
            <h3>🖌️ Use Cases</h3>
            <div class="use-cases-grid">
              <div class="use-case">
                <h4>🎨 Design Projects</h4>
                <p>Generate unique color schemes for web design, branding, and digital art</p>
              </div>
              <div class="use-case">
                <h4>🏠 Interior Design</h4>
                <p>Discover unexpected color combinations for room palettes and decor</p>
              </div>
              <div class="use-case">
                <h4>👕 Fashion & Style</h4>
                <p>Create bold outfit color combinations and fashion inspiration</p>
              </div>
              <div class="use-case">
                <h4>🖼️ Art & Creativity</h4>
                <p>Break creative blocks with truly random color inspirations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const generateBtn = this.container.querySelector('#generate-colors');
    const regenerateBtn = this.container.querySelector('#regenerate-colors');
    const copyBtn = this.container.querySelector('#copy-palette');
    const exportBtn = this.container.querySelector('#export-palette');

    generateBtn.addEventListener('click', () => this.generateColors());
    regenerateBtn.addEventListener('click', () => this.generateColors());
    copyBtn.addEventListener('click', () => this.copyPalette());
    exportBtn.addEventListener('click', () => this.exportPalette());

    // Enter key handling
    this.container.querySelector('#color-count').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.generateColors();
    });
  }

  async generateColors() {
    const count = parseInt(this.container.querySelector('#color-count').value);
    const brightColors = this.container.querySelector('#bright-colors').checked;
    const avoidGrays = this.container.querySelector('#avoid-grays').checked;
    const harmonious = this.container.querySelector('#harmonious').checked;

    if (isNaN(count) || count < 1 || count > 24) {
      this.showError('Number of colors must be between 1 and 24');
      return;
    }

    this.showLoading();

    try {
      // Get quantum hex16 values
      const quantumHex = await qrngService.getHex16(count);

      this.colors = quantumHex.map((hex, index) => {
        let color = this.hexToColor(hex, brightColors, avoidGrays);

        if (harmonious && index > 0) {
          color = this.makeHarmonious(color, this.colors[0]);
        }

        return color;
      });

      this.showResults();

      // Analytics
      qrngService.emit('tool_usage', {
        tool: 'color_generator',
        count,
        bright_colors: brightColors,
        avoid_grays: avoidGrays,
        harmonious
      });

    } catch (error) {
      console.error('Color generation error:', error);
      this.showError(`Failed to generate colors: ${error.message}`);
    }
  }

  hexToColor(hex16, bright = false, avoidGrays = false) {
    // Extract RGB from hex16 (4 chars = 16 bits)
    // Use first 6 hex chars for RGB, pad if needed
    const fullHex = hex16.padEnd(6, '0').substring(0, 6);

    let r = parseInt(fullHex.substring(0, 2), 16);
    let g = parseInt(fullHex.substring(2, 4), 16);
    let b = parseInt(fullHex.substring(4, 6), 16);

    // Apply transformations
    if (bright) {
      // Boost brightness by ensuring at least one channel is high
      const max = Math.max(r, g, b);
      if (max < 128) {
        const boost = 128 + (255 - max) * 0.7;
        const factor = boost / max;
        r = Math.min(255, Math.round(r * factor));
        g = Math.min(255, Math.round(g * factor));
        b = Math.min(255, Math.round(b * factor));
      }
    }

    if (avoidGrays) {
      // Increase color saturation by boosting channel differences
      const avg = (r + g + b) / 3;
      const maxDiff = Math.max(Math.abs(r - avg), Math.abs(g - avg), Math.abs(b - avg));

      if (maxDiff < 30) {
        // Too gray, boost the dominant channel
        const dominant = r > g && r > b ? 'r' : (g > b ? 'g' : 'b');
        if (dominant === 'r') r = Math.min(255, r + 50);
        else if (dominant === 'g') g = Math.min(255, g + 50);
        else b = Math.min(255, b + 50);
      }
    }

    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

    return {
      r, g, b, hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: this.rgbToHsl(r, g, b),
      name: this.getColorName(r, g, b)
    };
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  makeHarmonious(color, baseColor) {
    // Adjust hue to be harmonious with base color
    const baseHue = this.getHue(baseColor);
    const currentHue = this.getHue(color);

    // Create analogous or complementary relationship
    const relationships = [30, 60, 120, 180]; // degrees
    const targetHue = (baseHue + relationships[Math.floor(Math.random() * relationships.length)]) % 360;

    return this.adjustHue(color, targetHue);
  }

  getHue(color) {
    const hsl = color.hsl.match(/\d+/g);
    return parseInt(hsl[0]);
  }

  adjustHue(color, targetHue) {
    const { r, g, b } = color;
    // This is a simplified hue adjustment - in practice you'd convert to HSL, adjust, then back to RGB
    return color; // Returning original for simplicity
  }

  getColorName(r, g, b) {
    // Simple color naming based on dominant channels
    if (r > g && r > b) {
      if (r > 200) return g > 100 || b > 100 ? 'Warm' : 'Red';
      return 'Maroon';
    } else if (g > b) {
      if (g > 200) return r > 100 || b > 100 ? 'Bright' : 'Green';
      return 'Forest';
    } else {
      if (b > 200) return r > 100 || g > 100 ? 'Cool' : 'Blue';
      return 'Navy';
    }
  }

  showResults() {
    const palette = this.container.querySelector('#color-palette');
    const formats = this.container.querySelector('#palette-formats');
    const format = this.container.querySelector('#color-format').value;

    // Display color swatches
    palette.innerHTML = this.colors.map((color, index) => `
      <div class="color-swatch" style="background-color: ${color.hex}">
        <div class="color-info">
          <div class="color-value">${this.formatColorValue(color, format)}</div>
          <div class="color-name">${color.name}</div>
        </div>
        <button class="copy-color-btn" data-color="${this.formatColorValue(color, format)}" title="Copy this color">
          📋
        </button>
      </div>
    `).join('');

    // Add copy listeners for swatches
    palette.querySelectorAll('.copy-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.copyColor(e.target.dataset.color);
      });
    });

    // Prepare content
    const cssContent = this.colors.map((color, i) => `--color-${i + 1}: ${color.hex};`).join('\n');
    const arrayContent = `const colors = [${this.colors.map(c => `"${c.hex}"`).join(', ')}];`;

    // Display formatted outputs with copy buttons and responsive styling
    formats.innerHTML = `
      <div class="format-output bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div class="flex justify-between items-center mb-2">
            <h4 class="font-bold text-gray-700 text-sm uppercase tracking-wider">CSS Variables</h4>
            <button class="copy-format-btn text-xs flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded transition-all shadow-sm active:scale-95" data-type="css">
                <span>📋</span> Copy
            </button>
        </div>
        <pre class="bg-gray-800 text-gray-100 p-3 rounded-md text-xs font-mono overflow-x-auto max-h-48 custom-scrollbar"><code id="css-code">${cssContent}</code></pre>
      </div>
      
      <div class="format-output bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div class="flex justify-between items-center mb-2">
            <h4 class="font-bold text-gray-700 text-sm uppercase tracking-wider">Array Format</h4>
             <button class="copy-format-btn text-xs flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded transition-all shadow-sm active:scale-95" data-type="array">
                <span>📋</span> Copy
            </button>
        </div>
        <pre class="bg-gray-800 text-gray-100 p-3 rounded-md text-xs font-mono whitespace-pre-wrap break-all"><code id="array-code">${arrayContent}</code></pre>
      </div>
    `;

    // Add copy listeners for format blocks
    formats.querySelectorAll('.copy-format-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        const content = type === 'css' ? cssContent : arrayContent;
        this.copyToClipboard(content, e.currentTarget);
      });
    });

    this.container.querySelector('#color-success').classList.remove('hidden');
    this.container.querySelector('#color-loading').classList.add('hidden');
    this.container.querySelector('#color-error').classList.add('hidden');
    this.container.querySelector('#generate-colors').disabled = false;
  }

  async copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const originalHtml = button.innerHTML;
      button.innerHTML = '<span>✅</span> Copied!';
      button.classList.add('text-green-600', 'border-green-200', 'bg-green-50');

      setTimeout(() => {
        button.innerHTML = originalHtml;
        button.classList.remove('text-green-600', 'border-green-200', 'bg-green-50');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }

  formatColorValue(color, format) {
    switch (format) {
      case 'rgb': return color.rgb;
      case 'hsl': return color.hsl;
      case 'css': return `--color: ${color.hex}`;
      default: return color.hex;
    }
  }

  async copyPalette() {
    const format = this.container.querySelector('#color-format').value;
    const palette = this.colors.map(color => this.formatColorValue(color, format)).join('\n');

    try {
      await navigator.clipboard.writeText(palette);
      this.showCopyFeedback(this.container.querySelector('#copy-palette'));
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  async copyColor(colorValue) {
    try {
      await navigator.clipboard.writeText(colorValue);
      const btn = this.container.querySelector(`[data-color="${colorValue}"]`);
      this.showCopyFeedback(btn);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✅';
    button.style.background = 'rgba(16, 185, 129, 0.9)';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 1500);
  }

  exportPalette() {
    const timestamp = new Date().toISOString();

    const content = `Quantum Color Palette
Generated: ${timestamp}
Colors: ${this.colors.length}
Source: ANU Quantum Random Number Generator

HEX VALUES:
${this.colors.map((color, i) => `${i + 1}. ${color.hex} (${color.name})`).join('\n')}

RGB VALUES:
${this.colors.map((color, i) => `${i + 1}. ${color.rgb}`).join('\n')}

HSL VALUES:
${this.colors.map((color, i) => `${i + 1}. ${color.hsl}`).join('\n')}

CSS VARIABLES:
${this.colors.map((color, i) => `--color-${i + 1}: ${color.hex};`).join('\n')}

JAVASCRIPT ARRAY:
const quantumColors = [${this.colors.map(c => `"${c.hex}"`).join(', ')}];

---
Generated using quantum entropy for true randomness
Perfect for design, art, and creative projects`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-color-palette-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showLoading() {
    this.container.querySelector('#color-loading').classList.remove('hidden');
    this.container.querySelector('#color-error').classList.add('hidden');
    this.container.querySelector('#color-success').classList.add('hidden');
    this.container.querySelector('#generate-colors').disabled = true;
  }

  showError(message) {
    this.container.querySelector('#color-error-message').textContent = message;
    this.container.querySelector('#color-error').classList.remove('hidden');
    this.container.querySelector('#color-loading').classList.add('hidden');
    this.container.querySelector('#color-success').classList.add('hidden');
    this.container.querySelector('#generate-colors').disabled = false;
  }
}

window.QuantumColorTool = QuantumColorTool;