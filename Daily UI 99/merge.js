const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Admin\\Daily-UI\\Daily UI 99';

function readContent(file) {
    return fs.readFileSync(path.join(dir, file), 'utf-8');
}

let c_python = readContent('code.html'); // python
let c_paradigms = readContent('code1.html'); // paradigms
let c_low_level = readContent('code2.html'); // low-level
let c_home = readContent('code3.html'); // home
let c_categories = readContent('code4.html'); // categories

function extractTag(content, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = content.match(regex);
    return match ? content.substring(match.index, match.index + match[0].length) : '';
}

function processMain(content, id, replacements) {
    let mainMatch = content.match(/<main([^>]*)>([\s\S]*?)<\/main>/i);
    if (!mainMatch) return '';
    let attrs = mainMatch[1];
    let inner = mainMatch[2];
    
    // Add view-section class and id
    if (attrs.includes('class="')) {
        attrs = attrs.replace('class="', 'class="view-section ');
    } else {
        attrs += ' class="view-section"';
    }
    attrs += ` id="${id}"`;

    if (replacements && replacements.length > 0) {
        replacements.forEach(([search, replace]) => {
            inner = inner.split(search).join(replace);
        });
    }

    // Default replacement for # links
    inner = inner.replace(/href="#"/g, 'href="#home"');

    return `<main${attrs}>\n${inner}\n</main>`;
}

const headCommon = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>CodeNexus | The Enlightened Terminal</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;700;800&family=Inter:wght@100;300;400;500;600;900&family=Space_Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-primary-fixed": "#00083f", "on-secondary-fixed-variant": "#4b5e67",
                        "tertiary-fixed": "#f4a237", "surface-container-low": "#0f141a",
                        "surface-bright": "#262c36", "error-container": "#a70138",
                        "on-tertiary": "#593400", "surface-tint": "#9aa8ff",
                        "outline": "#72757d", "on-tertiary-fixed-variant": "#573300",
                        "error-dim": "#d73357", "secondary-dim": "#c3d8e2",
                        "background": "#0a0e14", "on-tertiary-fixed": "#2a1600",
                        "inverse-surface": "#f8f9ff", "outline-variant": "#44484f",
                        "surface": "#0a0e14", "tertiary-dim": "#e4942a",
                        "primary": "#9aa8ff", "error": "#ff6e84",
                        "surface-container-lowest": "#000000", "on-primary-fixed-variant": "#1b2c7f",
                        "inverse-primary": "#4958ac", "on-surface-variant": "#a8abb3",
                        "surface-container-highest": "#20262f", "secondary-fixed-dim": "#c3d8e2",
                        "tertiary-fixed-dim": "#e4942a", "tertiary": "#ffb151",
                        "surface-container": "#151a21", "on-surface": "#f1f3fc",
                        "on-background": "#f1f3fc", "secondary-container": "#374952",
                        "inverse-on-surface": "#51555c", "on-secondary-fixed": "#2f424a",
                        "on-secondary-container": "#bfd3de", "on-primary-container": "#00156d",
                        "on-error": "#490013", "primary-fixed-dim": "#8998f0",
                        "on-primary": "#122479", "secondary": "#d1e6f0",
                        "primary-dim": "#8998f0", "surface-variant": "#20262f",
                        "surface-dim": "#0a0e14", "secondary-fixed": "#d1e6f0",
                        "on-tertiary-container": "#4b2b00", "surface-container-high": "#1b2028",
                        "on-error-container": "#ffb2b9", "primary-container": "#8c9bf3",
                        "on-secondary": "#41545d", "tertiary-container": "#f4a237",
                        "primary-fixed": "#96a5ff"
                    },
                    fontFamily: {
                        "headline": ["Manrope"], "body": ["Inter"], "label": ["Space Grotesk"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"}
                }
            }
        }
    </script>
    <style>
        html { scroll-behavior: auto; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block; vertical-align: middle; line-height: 1;
        }
        .glass-nav, .glass-panel, .glass-card { background: rgba(10, 14, 20, 0.6); backdrop-filter: blur(12px); }
        .glass-panel { background: rgba(32, 38, 47, 0.6); backdrop-filter: blur(20px); }
        .glass-card { background: rgba(32, 38, 47, 0.4); }
        .hero-gradient { background: radial-gradient(circle at top right, rgba(154, 168, 255, 0.15), transparent), radial-gradient(circle at bottom left, rgba(255, 177, 81, 0.05), transparent); }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { display: flex; width: max-content; animation: scroll 40s linear infinite; }
        .text-gradient { background: linear-gradient(135deg, #9aa8ff 0%, #8c9bf3 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .view-section { display: none; }
        .view-section.active { display: block; }
        .view-section.flex.active { display: flex; }
    </style>
</head>
<body class="bg-background text-on-background font-body selection:bg-primary/30">
    <nav class="fixed top-0 w-full z-50 bg-[#0a0e14]/60 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] h-20 px-8 flex justify-between items-center font-['Manrope'] antialiased tracking-tight">
        <div class="flex items-center gap-12">
            <a href="#home" class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#9aa8ff] to-[#8c9bf3]">CodeNexus</a>
            <div class="hidden md:flex gap-8">
                <a class="nav-link text-slate-400 font-medium hover:text-[#9aa8ff] transition-colors" href="#home" data-target="home">Home</a>
                <a class="nav-link text-slate-400 font-medium hover:text-[#9aa8ff] transition-colors" href="#categories" data-target="categories">Categories</a>
                <a class="nav-link text-slate-400 font-medium hover:text-[#9aa8ff] transition-colors" href="#paradigms" data-target="paradigms">Paradigms</a>
                <a class="nav-link text-slate-400 font-medium hover:text-[#9aa8ff] transition-colors" href="#low-level" data-target="low-level">Low Level</a>
            </div>
        </div>
        <div class="flex items-center gap-6">
            <button class="p-2 hover:bg-[#262c36]/50 transition-all duration-300 rounded-full active:scale-95 transform">
                <span class="material-symbols-outlined text-[#9aa8ff]" data-icon="contrast">contrast</span>
            </button>
            <div class="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/15 overflow-hidden border-[#9aa8ff]">
                <img alt="User Profile Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpaFLGt6aePArlOyrRMnVHEJV3rAkQG2ngO44ZdrY8Ps0g5nJYn9gLurGA-yTopoMV9jkiiaGybg5KMnZHY8iEdibnwmvI2Ggqyq2Sarw4tFgVM7LjZ1fmFhGXGKKvSua132USMPVcXpbUgrYhXH9p7eW5NQoOTHyqiCpEKzchM_EYPoT-fUaGkLI73Hhy06m4cfR5ZFgOQcWT9K7zqHxUXRFAooMeSlATgD5CFoW6y3-FHEyp2WuLdDv7llsRhjVvtejaWKqoEAIQ"/>
            </div>
        </div>
    </nav>
`;

// Regex replacements for home buttons
const homeReplacements = [
    ['href="#"', 'href="#python"'], // catch deep dive into python link
    ['<button class="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl active:scale-95 transform transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">', '<a href="#categories" style="display:inline-block" class="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl active:scale-95 transform transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">'],
    ['Start Exploring\n                    </button>', 'Start Exploring\n                    </a>']
];

let mainHome = processMain(c_home, 'home', homeReplacements);
mainHome = mainHome.replace(/<span class="px-3 py-1 rounded-full border border-outline-variant\/20 hover:bg-surface-bright cursor-pointer transition-colors">Python<\/span>/g, '<a href="#python" class="px-3 py-1 rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors inline-block">Python</a>');
mainHome = mainHome.replace(/<span class="px-3 py-1 rounded-full border border-outline-variant\/20 hover:bg-surface-bright cursor-pointer transition-colors">Rust<\/span>/g, '<a href="#low-level" class="px-3 py-1 rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors inline-block">Rust</a>');
mainHome = mainHome.replace(/<span class="px-3 py-1 rounded-full border border-outline-variant\/20 hover:bg-surface-bright cursor-pointer transition-colors">C\+\+<\/span>/g, '<a href="#paradigms" class="px-3 py-1 rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors inline-block">C++</a>');
mainHome = mainHome.replace(/<span class="px-3 py-1 rounded-full border border-outline-variant\/20 hover:bg-surface-bright cursor-pointer transition-colors">Go<\/span>/g, '<a href="#categories" class="px-3 py-1 rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors inline-block">Go</a>');
mainHome = mainHome.replace(/<span class="px-3 py-1 rounded-full border border-outline-variant\/20 hover:bg-surface-bright cursor-pointer transition-colors">TypeScript<\/span>/g, '<a href="#paradigms" class="px-3 py-1 rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors inline-block">TypeScript</a>');
mainHome = mainHome.replace(/<button class="font-label text-xs uppercase tracking-widest text-primary flex items-center gap-2 group\/btn">([\s\S]*?)Learn Hardware([\s\S]*?)<\/button>/g, '<a href="#low-level" class="font-label text-xs uppercase tracking-widest text-primary flex items-center gap-2 group/btn">$1Learn Hardware$2</a>');
mainHome = mainHome.replace(/<button class="font-label text-xs uppercase tracking-widest text-primary flex items-center gap-2 group\/btn">([\s\S]*?)Explore Logic([\s\S]*?)<\/button>/g, '<a href="#paradigms" class="font-label text-xs uppercase tracking-widest text-primary flex items-center gap-2 group/btn">$1Explore Logic$2</a>');
mainHome = mainHome.replace(/<button class="font-label text-xs uppercase tracking-widest text-primary flex items-center gap-2 group\/btn">([\s\S]*?)Analyze Flow([\s\S]*?)<\/button>/g, '<a href="#paradigms" class="font-label text-xs uppercase tracking-widest text-primary flex items-center gap-2 group/btn">$1Analyze Flow$2</a>');

const mainCategories = processMain(c_categories, 'categories', []);

let mainParadigms = processMain(c_paradigms, 'paradigms', [
    ['<button class="text-primary hover:underline font-bold text-sm">Explore Core</button>', '<a href="#python" class="text-primary hover:underline font-bold text-sm">Explore Core</a>']
]);

const mainLowLevel = processMain(c_low_level, 'low-level', []);

let mainPython = processMain(c_python, 'python', [
    ['<button class="px-8 py-4 bg-gradient-to-br from-[#9aa8ff] to-[#8c9bf3] text-on-primary-container font-bold rounded-xl transition-all hover:opacity-90 active:scale-95">', '<a href="#home" style="display:inline-block" class="px-8 py-4 bg-gradient-to-br from-[#9aa8ff] to-[#8c9bf3] text-on-primary-container font-bold rounded-xl transition-all hover:opacity-90 active:scale-95">'],
    ['<button class="px-8 py-4 bg-surface-container border border-outline-variant/30 text-on-surface font-bold rounded-xl transition-all hover:bg-surface-bright active:scale-95">', '<a href="#home" style="display:inline-block" class="px-8 py-4 bg-surface-container border border-outline-variant/30 text-on-surface font-bold rounded-xl transition-all hover:bg-surface-bright active:scale-95">']
]);
mainPython = mainPython.replace(/Get Started\s*<\/button>/g, 'Get Started</a>');
mainPython = mainPython.replace(/Documentation\s*<\/button>/g, 'Documentation</a>');

const footerContent = extractTag(c_home, 'footer');

const tailCommon = `
    ${footerContent}
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('.view-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        function navigate() {
            let hash = window.location.hash || '#home';
            let targetId = hash.substring(1);
            
            sections.forEach(sec => sec.classList.remove('active'));
            const activeSec = document.getElementById(targetId);
            if (activeSec) {
                activeSec.classList.add('active');
            } else {
                document.getElementById('home').classList.add('active');
                targetId = 'home';
            }
            window.scrollTo(0,0);
            
            navLinks.forEach(link => {
                if (link.dataset.target === targetId) {
                    link.classList.add('text-[#9aa8ff]', 'border-b-2', 'border-[#9aa8ff]', 'pb-1');
                    link.classList.remove('text-slate-400');
                } else {
                    link.classList.remove('text-[#9aa8ff]', 'border-b-2', 'border-[#9aa8ff]', 'pb-1');
                    link.classList.add('text-slate-400');
                }
            });
        }
        window.addEventListener('hashchange', navigate);
        setTimeout(navigate, 0); // initial load
    });
    </script>
</body>
</html>`;

const finalHtml = headCommon + mainHome + mainCategories + mainParadigms + mainLowLevel + mainPython + tailCommon;
fs.writeFileSync(path.join(dir, 'index.html'), finalHtml);
console.log('Successfully generated index.html!');
