
// Global Header Component
function createHeader() {
    const header = document.createElement('header');
    header.className = 'sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300';

    // Get current page filename for active state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Helper to get active class
    const getActiveClass = (pageName) => {
        return currentPage === pageName ? 'text-quantum-light font-semibold' : 'text-quantum-dark hover:text-quantum-light';
    };

    header.innerHTML = `
        <div class="flex h-16 items-center justify-between mx-4 sm:mx-12 lg:mx-32 xl:mx-40">
            <!-- Logo -->
            <div class="flex items-center gap-3">
                <a href="index.html" class="flex items-center gap-3">
                    <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-quantum-light">
                        <span class="text-2xl">⚛️</span>
                    </div>
                    <span class="text-lg font-bold text-quantum-darkest font-mono">Quantum Random Lab</span>
                </a>
            </div>
            
            <!-- Navigation Links -->
            <nav class="hidden lg:flex items-center gap-8">
                <!-- Free Tools Dropdown (Styled as Button) -->
                <div class="relative group">
                    <button class="bg-quantum-light text-white px-4 py-2 rounded-lg hover:bg-quantum-medium transition-colors flex items-center gap-1 font-mono text-sm font-semibold shadow-md hover:shadow-lg">
                        <span>FREE Tools</span>
                        <span class="text-xs">▼</span>
                    </button>
                    <!-- Dropdown Menu -->
                    <div class="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div class="p-4">
                            <!-- Number Tools -->
                            <div class="mb-4">
                                <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Number Tools</h4>
                                <div class="space-y-1">
                                    <a href="quantum-random-integer-generator.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">🔢 Quantum Random Integers</a>
                                    <a href="quantum-random-number-picker.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">🎯 Quantum Random Picker</a>
                                </div>
                            </div>
                            
                            <!-- Fair Selection -->
                            <div class="mb-4">
                                <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Fair Selection</h4>
                                <div class="space-y-1">
                                    <a href="quantum-random-coin-flip-generator.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">🪙 Quantum Random Coin Flip</a>
                                    <a href="quantum-random-dice-roller.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">🎲 Quantum Random Dice</a>
                                    <a href="quantum-random-name-picker.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">👥 Quantum Random Name Selector</a>
                                </div>
                            </div>
                            
                            <!-- Creative Tools -->
                            <div class="mb-4">
                                <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Creative Tools</h4>
                                <div class="space-y-1">
                                    <a href="quantum-random-color-generator.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">🎨 Quantum Random Colors</a>
                                    <a href="quantum-random-hex-generator.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">🔠 Quantum Random Hex</a>
                                </div>
                            </div>
                            
                            <!-- Security -->
                            <div>
                                <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Security</h4>
                                <div class="space-y-1">
                                    <a href="quantum-random-password-generator.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">🔐 Quantum Random Password</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Educate Me Dropdown -->
                <div class="relative group">
                    <button class="text-sm font-mono ${getActiveClass('educate')} transition-colors flex items-center gap-1">
                        <span>Educate Me</span>
                        <span class="text-xs">▼</span>
                    </button>
                    <!-- Dropdown Menu -->
                    <div class="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div class="p-4">
                            <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-3">Articles & Resources</h4>
                            <div class="space-y-1">
                                <a href="quantum-random-number-generator-science.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">
                                    <div class="font-semibold">⚛️ The Science Behind Quantum Randomness</div>
                                    <div class="text-xs text-gray-500 mt-1">Explore true randomness vs pseudo-randomness</div>
                                </a>
                                <a href="quantum-random-number-generator-academic.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">
                                    <div class="font-semibold">📊 Academic QRNG Research</div>
                                    <div class="text-xs text-gray-500 mt-1">Laboratory methods and applications</div>
                                </a>
                                <a href="quantum-randomness-universe-physics.html" class="block px-3 py-2 rounded-lg hover:bg-quantum-light/5 text-sm text-quantum-dark hover:text-quantum-light transition-colors">
                                    <div class="font-semibold">✨ Where the Universe Reveals Its Randomness</div>
                                    <div class="text-xs text-gray-500 mt-1">The mystique of quantum uncertainty</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <a href="about.html" class="text-sm font-mono ${getActiveClass('about.html')} transition-colors">About</a>
                <a href="docs.html" class="text-sm font-mono ${getActiveClass('docs.html')} transition-colors">Docs</a>
            </nav>
            
            <!-- Mobile Menu Button -->
            <button class="lg:hidden p-2 rounded-lg hover:bg-gray-100" id="mobile-menu-btn">
                <svg class="w-6 h-6 text-quantum-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        
        <!-- Mobile Menu (Hidden by default) -->
        <div id="mobile-menu" class="hidden lg:hidden border-t border-gray-200 bg-white">
            <div class="px-4 py-4 space-y-4">
                <!-- Number Tools -->
                <div>
                    <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Number Tools</h4>
                    <div class="space-y-1 ml-2">
                        <a href="quantum-random-integer-generator.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">🔢 Quantum Random Integers</a>
                        <a href="quantum-random-number-picker.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">🎯 Quantum Random Picker</a>
                    </div>
                </div>
                
                <!-- Fair Selection -->
                <div>
                    <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Fair Selection</h4>
                    <div class="space-y-1 ml-2">
                        <a href="quantum-random-coin-flip-generator.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">🪙 Quantum Random Coin Flip</a>
                        <a href="quantum-random-dice-roller.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">🎲 Quantum Random Dice</a>
                        <a href="quantum-random-name-picker.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">👥 Quantum Random Name Selector</a>
                    </div>
                </div>
                
                <!-- Creative Tools -->
                <div>
                    <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Creative Tools</h4>
                    <div class="space-y-1 ml-2">
                        <a href="quantum-random-color-generator.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">🎨 Quantum Random Colors</a>
                        <a href="quantum-random-hex-generator.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">🔠 Quantum Random Hex</a>
                    </div>
                </div>
                
                <!-- Security -->
                <div>
                    <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Security</h4>
                    <div class="space-y-1 ml-2">
                        <a href="quantum-random-password-generator.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">🔐 Quantum Random Password</a>
                    </div>
                </div>
                
                <!-- Educate Me -->
                <div>
                    <h4 class="text-xs font-mono font-bold text-quantum-light uppercase tracking-wider mb-2">Educate Me</h4>
                    <div class="space-y-1 ml-2">
                        <a href="quantum-random-number-generator-science.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">⚛️ The Science Behind QRNG</a>
                        <a href="quantum-random-number-generator-academic.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">📊 Academic QRNG Research</a>
                        <a href="quantum-randomness-universe-physics.html" class="block py-2 text-sm text-quantum-dark hover:text-quantum-light">✨ Universe Randomness</a>
                    </div>
                </div>
                
                <!-- Other Links -->
                <div class="border-t border-gray-200 pt-4 space-y-2">
                    <a href="about.html" class="block py-2 text-sm font-mono ${getActiveClass('about.html')}">About</a>
                    <a href="docs.html" class="block py-2 text-sm font-mono ${getActiveClass('docs.html')}">Docs</a>
                </div>
            </div>
        </div>
    `;

    return header;
}

// Insert header when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.replaceWith(createHeader());

        // Initialize mobile menu after header is inserted
        initMobileMenu();
    }
});

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');

            // Animate menu icon
            const svg = mobileMenuBtn.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                // Show hamburger
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            } else {
                // Show close (X)
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
                const svg = mobileMenuBtn.querySelector('svg');
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
    }
}
