const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const SOURCE_DIR = __dirname;
const DIST_DIR = path.join(__dirname, 'dist');

const HTML_FILES = [
    'index.html',
    'about.html',
    'services.html',
    'projects.html',
    'contact.html'
];

const JS_FILES = [
    'nav.js',
    'particles.js',
    'projects.js'
];

const STATIC_ASSETS = [
    'favicon.png',
    'profile_old.jpg',
    'styles.css',
    'animations.css'
];

const STATIC_DIRS = [
    'images'
];

const OBFUSCATOR_OPTIONS = {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    selfDefending: false,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75
};

console.log('--- Yash Vishal Portfolio Web Production Builder ---');

// 1. Recreate clean dist directory
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// Helper to copy recursive directory
function copyFolderRecursiveSync(source, target) {
    let files = [];
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }

    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(file => {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                fs.copyFileSync(curSource, path.join(targetFolder, file));
            }
        });
    }
}

// 2. Copy static files & directories
console.log('\nCopying static assets...');
STATIC_ASSETS.forEach(file => {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`- Copied asset: ${file}`);
    } else {
        console.warn(`[WARN] Static asset not found: ${file}`);
    }
});

STATIC_DIRS.forEach(dir => {
    const src = path.join(SOURCE_DIR, dir);
    if (fs.existsSync(src)) {
        copyFolderRecursiveSync(src, DIST_DIR);
        console.log(`- Copied asset directory: ${dir}`);
    } else {
        console.warn(`[WARN] Directory not found: ${dir}`);
    }
});

// 3. Compile and Obfuscate Javascript files
console.log('\nObfuscating JavaScript assets...');
JS_FILES.forEach(file => {
    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(DIST_DIR, file);
    if (!fs.existsSync(srcPath)) {
        console.warn(`[WARN] JS file not found: ${srcPath}`);
        return;
    }

    console.log(`- Obfuscating ${file}...`);
    const code = fs.readFileSync(srcPath, 'utf8');
    try {
        const result = JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS);
        fs.writeFileSync(destPath, result.getObfuscatedCode(), 'utf8');
        console.log(`  [SUCCESS] Secured JS written to dist/${file}`);
    } catch (err) {
        console.error(`  [ERROR] Failed to obfuscate ${file}:`, err.message);
        process.exit(1);
    }
});

// 4. Copy clean static HTML files to dist
console.log('\nCopying clean static HTML pages...');
HTML_FILES.forEach(file => {
    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(DIST_DIR, file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  [SUCCESS] Copied clean HTML: dist/${file}`);
    } else {
        console.warn(`[WARN] HTML file not found: ${srcPath}`);
    }
});

console.log('\n--- Build finished successfully! Web production assets compiled inside dist/ ---');
