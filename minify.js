const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const publicDir = path.join(__dirname, 'public');
const filesToMinify = [
    // CSS
    { type: 'css', input: 'styles.css', output: 'styles.min.css' },
    { type: 'css', input: 'components.css', output: 'components.min.css' },
    // JS - Core
    { type: 'js', input: 'app.js', output: 'app.min.js' },
    { type: 'js', input: 'header.js', output: 'header.min.js' },
    { type: 'js', input: 'ads.js', output: 'ads.min.js' },
    // JS - Services
    { type: 'js', input: 'services/qrngService.js', output: 'services/qrngService.min.js' },
    // JS - Components
    { type: 'js', input: 'components/QuantumIntegerTool.js', output: 'components/QuantumIntegerTool.min.js' },
    { type: 'js', input: 'components/QuantumDiceTool.js', output: 'components/QuantumDiceTool.min.js' },
    { type: 'js', input: 'components/QuantumNameTool.js', output: 'components/QuantumNameTool.min.js' },
    { type: 'js', input: 'components/QuantumPasswordTool.js', output: 'components/QuantumPasswordTool.min.js' },
    { type: 'js', input: 'components/QuantumCoinFlipTool.js', output: 'components/QuantumCoinFlipTool.min.js' },
    { type: 'js', input: 'components/QuantumColorTool.js', output: 'components/QuantumColorTool.min.js' },
    { type: 'js', input: 'components/QuantumHexTool.js', output: 'components/QuantumHexTool.min.js' },
    { type: 'js', input: 'components/QuantumNumberPickerTool.js', output: 'components/QuantumNumberPickerTool.min.js' },
];

// Helper to minify
function minifyFile(file) {
    const inputPath = path.join(publicDir, file.input);
    const outputPath = path.join(publicDir, file.output);

    console.log(`Minifying ${file.input} -> ${file.output}...`);

    try {
        if (file.type === 'js') {
            // Using terser via npx
            execSync(`npx -y terser "${inputPath}" -o "${outputPath}" --compress --mangle`, { stdio: 'inherit' });
        } else if (file.type === 'css') {
            // Using clean-css-cli via npx
            execSync(`npx -y clean-css-cli -o "${outputPath}" "${inputPath}"`, { stdio: 'inherit' });
        }
    } catch (error) {
        console.error(`Failed to minify ${file.input}:`, error);
    }
}

// Helper to update HTML references
function updateHtmlReferences() {
    const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

    htmlFiles.forEach(htmlFile => {
        const filePath = path.join(publicDir, htmlFile);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        filesToMinify.forEach(file => {
            // Regex to match: src=["'](path/to/)?filename["']
            // We replace filename with filename.min

            const regexes = [
                new RegExp(`src=["'](.*?)${file.input.replace(/\//g, '\\/')}\\?v=\\d+["']`, 'g'), // Handle version tags
                new RegExp(`src=["'](.*?)${file.input.replace(/\//g, '\\/')}["']`, 'g'),
                new RegExp(`href=["'](.*?)${file.input.replace(/\//g, '\\/')}["']`, 'g')
            ];

            regexes.forEach(regex => {
                if (regex.test(content)) {
                    content = content.replace(regex, (match, prefix) => {
                        // Check if already minified to avoid double minification if run twice
                        if (match.includes('.min.')) return match;

                        // Replace the filename part
                        // If it has a version tag, we might want to keep it or just replace the whole filename
                        // For simplicity, let's just replace the filename with .min.js and dropping version tag if simpler,
                        // or we can append the version tag back? 
                        // The regex captured the prefix. match is the full string `src="components/QuantumDiceTool.js?v=2"`

                        // Simplest: Replace file.input with file.output
                        return match.replace(file.input, file.output);
                    });
                    modified = true;
                }
            });
        });

        if (modified) {
            console.log(`Updating references in ${htmlFile}...`);
            fs.writeFileSync(filePath, content);
        }
    });
}

// Main execution
console.log('Starting minification process...');

// 1. Minify files
filesToMinify.forEach(minifyFile);

// 2. Update HTML
console.log('Updating HTML references...');
updateHtmlReferences();

console.log('Build complete!');
