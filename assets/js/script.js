// GitHub Repository Config
const REPO_OWNER = 'Spinotek-Organization';
const REPO_NAME = 'spinotek-hima-ti-polhas';
const IGNORED_FOLDERS = ['assets', '.git', '.github', '.vscode'];

// Typing Animation Phrases
const typingPhrases = [
    "Spinotek x HIMA TI Politeknik Hasnur.",
    "Bridging Academia to Industry.",
    "Upgrading Skills for the Future.",
    "Collaborating for Digital Excellence.",
    "Empowering the Next Gen Developers."
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch & Render Projects (Priority)
    fetchProjects();

    // 2. Initialize Typing Animation
    try {
        if (document.getElementById('typing-text')) {
            initTypingAnimation();
        }
    } catch (e) {
        console.error("Failed to init typing:", e);
    }

    // 3. Interactions
    setupParallax();
    initMobileMenu();
});

function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            menu.classList.toggle('flex');
        });
    }
}

async function fetchProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`);
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter for directories that are not in the ignored list
        const projectFolders = data.filter(item => 
            item.type === 'dir' && !IGNORED_FOLDERS.includes(item.name)
        );

        if (projectFolders.length === 0) {
            renderEmptyState(grid);
        } else {
            // Map GitHub data to our project structure
            // Note: Since we only have the folder name, we use defaults for other fields
            const projects = projectFolders.map(folder => ({
                name: formatProjectName(folder.name),
                folder: folder.name,
                description: "Click to explore this showcase.",
                tech: ["html5", "css3", "javascript"], // Default stack assumption
                status: "LIVE",
                icon: "🚀"
            }));
            
            renderProjects(projects, grid);
        }

    } catch (error) {
        console.error("Failed to fetch projects:", error);
        renderEmptyState(grid, true);
    }
}

function formatProjectName(folderName) {
    // Convert 'my-project-name' to 'My Project Name'
    return folderName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function renderEmptyState(grid, isError = false) {
    grid.innerHTML = `
        <div class="col-span-full py-20 text-center space-y-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full ${isError ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'} mb-4">
                ${isError 
                    ? '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
                    : '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>'
                }
            </div>
            <h3 class="text-2xl font-bold text-slate-900">${isError ? 'System Offline' : 'Waiting for Submissions'}</h3>
            <p class="text-slate-500 max-w-md mx-auto">
                ${isError 
                    ? 'Could not connect to the repository. Please try again later.' 
                    : 'Projects will appear here automatically once participants submit their work via Pull Request.'}
            </p>
            ${!isError ? `
            <a href="https://github.com/${REPO_OWNER}/${REPO_NAME}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-blue-700 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Submit Project
            </a>` : ''}
        </div>
    `;
}

function initTypingAnimation() {
    const target = document.getElementById('typing-text');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentPhrase = typingPhrases[phraseIndex];
        
        if (isDeleting) {
            charIndex--;
            typeSpeed = 40;
        } else {
            charIndex++;
            typeSpeed = 80;
        }

        target.textContent = currentPhrase.substring(0, charIndex);

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2500; // Stay at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function renderProjects(data, grid) {
    grid.innerHTML = '';

    data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'group relative bg-white border border-slate-200 p-8 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer flex flex-col justify-between';
        // Use folder name for simple linking
        card.onclick = () => window.location.href = `./${project.folder}/`;

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-8">
                    <div class="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-primary/5 transition-colors duration-500">
                        ${project.icon}
                    </div>
                    <span class="px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black text-slate-500 tracking-[0.1em] font-mono group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        ${project.status}
                    </span>
                </div>

                <h3 class="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors capitalize">${project.name}</h3>
                <p class="text-slate-500 text-[15px] leading-relaxed mb-8 font-medium">${project.description}</p>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-slate-50">
                <div class="flex -space-x-2">
                    ${project.tech.map(t => `<i class="devicon-${t}-plain text-xl p-2 bg-slate-50 rounded-full border border-slate-100 text-slate-400 group-hover:text-slate-900 group-hover:border-slate-200 transition-all"></i>`).join('')}
                </div>
                <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function setupParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        
        const blobs = document.querySelectorAll('.animate-pulse-slow');
        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 3;
            blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
}
