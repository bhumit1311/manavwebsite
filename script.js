/* =====================================================
   MANAV - Video Editor Portfolio | script.js
   ===================================================== */

'use strict';

// ─── Helpers ─────────────────────────────────────────
function fetchWithTimeout(url, options = {}, ms = 10000) {
    if (window.AbortSignal && typeof AbortSignal.timeout === 'function') {
        return fetch(url, { ...options, signal: AbortSignal.timeout(ms) });
    }
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

// ─── Portfolio Data ──────────────────────────────────
const PORTFOLIO = [
    { id: 1, title: 'Fortune Air Diwali Reel', category: 'commercial', tools: 'Premiere Pro, After Effects', client: 'Fortune Air', desc: 'High-energy Diwali commercial reel for Fortune Air — vibrant colour grading and dynamic cuts.', driveId: '19aApncxKmJWu9k17OfMq3gJWkmTsZklk', emoji: '🎬' },
    { id: 2, title: 'Hiren & Krishna Teaser', category: 'wedding', tools: 'DaVinci Resolve, Premiere', client: 'Hiren & Krishna', desc: 'A cinematic wedding teaser capturing love, rituals and raw emotions with a contemporary cinematic grade.', driveId: '1AAMiyFRUKuWvbDXsQ2ASkR0RjDY6lcnV', emoji: '💍' },
    { id: 3, title: 'Jayneel Riya Reel', category: 'wedding', tools: 'Premiere Pro, After Effects', client: 'Jayneel & Riya', desc: 'Short-form wedding reel highlighting the best moments from a beautiful ceremony and reception.', driveId: '15htJKfeIgUdah-TIWY4hTf_J_UnjGfpJ', emoji: '💒' },
    { id: 4, title: 'Nazarbaug Diwali Reel', category: 'commercial', tools: 'Premiere Pro, Photoshop', client: 'Nazarbaug', desc: 'Festive Diwali promotional reel for Nazarbaug — warm tones, quick cuts and celebratory energy.', driveId: '1Cv51cMYD_dkcGAJnldKMDlb99buhNXjz', emoji: '🪔' },
    { id: 5, title: 'Neimish Creative Reel', category: 'youtube', tools: 'After Effects, Premiere', client: 'Neimish', desc: 'A dynamic creative reel showcasing visual storytelling through fast-paced editing and motion graphics.', driveId: '1E2oSq-6N9FZ5lFnVEHArXERmR5Xa4ilu', emoji: '📱' },
    { id: 6, title: 'Shreenand New Reel', category: 'youtube', tools: 'Premiere, Motion Graphics', client: 'Shreenand', desc: 'Modern lifestyle reel with slick transitions, colour science and branded motion graphics.', driveId: '1iN4Y4HUstrZSEgx3E1sXFT8CE31CIxii', emoji: '🎥' },
    { id: 7, title: 'Sequence Edit', category: 'corporate', tools: 'Premiere Pro, After Effects', client: 'Studio Project', desc: 'A polished sequence edit demonstrating professional multi-camera workflow and colour consistency.', driveId: '150Wuos1yDQy6GqijErZOovu3EFl4Y3tS', emoji: '🏢' },
    { id: 8, title: 'Engagement Reel', category: 'wedding', tools: 'DaVinci Resolve', client: 'Engagement Film', desc: 'Emotion-filled engagement reel with soft, romantic colour grade capturing every candid moment.', driveId: '10Y9p3VupK7OYf-aajIGyXXnBS1BOLUoW', emoji: '💑' },
    { id: 9, title: 'Final Reel', category: 'commercial', tools: 'Premiere Pro, After Effects', client: 'Studio Showcase', desc: 'A studio showreel demonstrating range across commercial, wedding and lifestyle productions.', driveId: '1mNZxiQrEtQaVgLbBra-7_jDwv4QdP8rf', emoji: '🌟' },
    { id: 10, title: 'Pure Dental Opening Reel', category: 'corporate', tools: 'Premiere Pro, After Effects', client: 'Pure Dental', desc: 'Grand opening promotional reel for Pure Dental Clinic — clean aesthetics, professional grade and brand-aligned visuals.', driveId: '1MN39UX73rPlhKgGNx1hk1JQq6TUs-7QY', emoji: '🦷' },
];

const TESTIMONIALS = [
    { name: 'Rahul Sharma', company: 'LuxBrand Co.', rating: 5, text: 'Manav completely transformed our brand video. The attention to detail, colour grading, and the way he captured our story was extraordinary. Absolutely world-class work!', initials: 'RS' },
    { name: 'Priya Kapoor', company: 'StyleIndia', rating: 5, text: 'We needed a fashion recap within 24 hours after the event. Manav delivered a stunning edit that went viral on Instagram. He is our go-to editor now.', initials: 'PK' },
    { name: 'Aryan Raj', company: 'Independent Artist', rating: 5, text: 'My music video hit 2 million views largely because of the incredible editing. Manav understood my vision and went beyond my expectations every step of the way.', initials: 'AR' },
    { name: 'Sunita Mehta', company: 'Mehta Wedding Films', rating: 5, text: 'Hired Manav for our destination wedding. The final film made my parents cry tears of joy. He has a rare gift for finding the emotion in every moment.', initials: 'SM' },
    { name: 'Vikram Nair', company: 'Nexus Corp', rating: 5, text: 'Our corporate video for the annual stakeholder meeting received rave reviews from the board. Professional, punctual, and immensely talented.', initials: 'VN' },
    { name: 'Anjali Desai', company: 'TechVision YT', rating: 5, text: 'Manav overhauled our entire YouTube visual identity. Our watch time went up 40% since the rebrand. Best investment we made for our channel.', initials: 'AD' },
];

// ─── State ───────────────────────────────────────────
let activeFilter = 'all';
let threeScene, threeCamera, threeRenderer, cameraMesh, animFrameId;

// ─── DOM Ready ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    populatePortfolio();
    populateTestimonials();
    setupNav();
    setupCursor();
    setupPortfolioFilters();
    setupModal();
    setupContactForm();
    setupHamburger();
    setupScrollReveal();
    setupCounters();
    setupSkillBars();
    loadVideoConfigFromServer(); // Sync video config from admin panel
});


// ─────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────
function initLoading() {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('loading-bar');
    const pct = document.getElementById('loading-percent');
    if (!screen) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12 + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                screen.style.transition = 'opacity 0.6s ease';
                screen.style.opacity = '0';
                setTimeout(() => {
                    screen.style.display = 'none';
                    initIntro();
                }, 600);
            }, 400);
        }
        const p = Math.min(Math.round(progress), 100);
        bar.style.width = p + '%';
        pct.textContent = p + '%';
    }, 80);
}

// ─────────────────────────────────────────────────────────
// 3D INTRO — Three.js Camera
// ─────────────────────────────────────────────────────────
function initIntro() {
    const introScreen = document.getElementById('intro-screen');
    const canvas = document.getElementById('intro-canvas');
    if (!introScreen || !canvas || typeof THREE === 'undefined') {
        // Fallback: skip intro if Three.js not loaded
        setTimeout(enterMainSite, 500);
        return;
    }
    document.body.classList.add('intro-active');

    // Three.js setup
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    threeCamera.position.z = 5;
    threeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.setClearColor(0x000000, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    threeScene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xe8b86d, 2.0);
    keyLight.position.set(3, 4, 3);
    threeScene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xc084fc, 0.8);
    fillLight.position.set(-3, 1, 2);
    threeScene.add(fillLight);
    const rimLight = new THREE.PointLight(0xe8b86d, 1.5, 8);
    rimLight.position.set(0, -2, 3);
    threeScene.add(rimLight);

    // Camera Body Group
    cameraMesh = new THREE.Group();

    // Body
    const bodyGeo = new THREE.BoxGeometry(2.2, 1.4, 1.1);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    cameraMesh.add(body);

    // Top panel / pentaprism hump
    const humpGeo = new THREE.BoxGeometry(0.9, 0.45, 0.9);
    const humpMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.4, metalness: 0.7 });
    const hump = new THREE.Mesh(humpGeo, humpMat);
    hump.position.set(0, 0.92, 0);
    cameraMesh.add(hump);

    // Lens barrel
    const lensGeo = new THREE.CylinderGeometry(0.52, 0.58, 1.0, 32);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2, metalness: 0.9 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 0.9);
    cameraMesh.add(lens);

    // Lens glass — Logo Texture
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 512;
    logoCanvas.height = 512;
    const ctx = logoCanvas.getContext('2d');

    // Circular beige background
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f0e8';
    ctx.fill();

    // Camera body (rounded rect)
    ctx.fillStyle = '#111111';
    const bx = 135, by = 155, bw = 160, bh = 115, br = 12;
    ctx.beginPath();
    ctx.moveTo(bx + br, by);
    ctx.lineTo(bx + bw - br, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
    ctx.lineTo(bx + bw, by + bh - br);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
    ctx.lineTo(bx + br, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
    ctx.lineTo(bx, by + br);
    ctx.quadraticCurveTo(bx, by, bx + br, by);
    ctx.closePath();
    ctx.fill();

    // Film reels (two circles on top)
    ctx.beginPath();
    ctx.arc(190, 140, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(255, 140, 24, 0, Math.PI * 2);
    ctx.fill();

    // Play button (red triangle)
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(195, 185);
    ctx.lineTo(195, 240);
    ctx.lineTo(250, 212);
    ctx.closePath();
    ctx.fill();

    // Viewfinder / lens cone (right side triangle)
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.moveTo(295, 165);
    ctx.lineTo(295, 260);
    ctx.lineTo(360, 195);
    ctx.lineTo(360, 230);
    ctx.lineTo(295, 260);
    // Re-draw as a proper trapezoid
    ctx.closePath();
    ctx.fill();
    // Actually draw a cleaner viewfinder
    ctx.beginPath();
    ctx.moveTo(295, 170);
    ctx.lineTo(350, 190);
    ctx.lineTo(350, 240);
    ctx.lineTo(295, 260);
    ctx.closePath();
    ctx.fill();

    // Text: SHRADDHA
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 52px "Arial Black", "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SHRADDHA', 256, 320);

    // Text: VIDEOLOGY
    ctx.font = 'bold 42px "Arial Black", "Impact", sans-serif';
    ctx.fillText('VIDEOLOGY', 256, 370);

    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    logoTexture.needsUpdate = true;

    const glassGeo = new THREE.CircleGeometry(0.38, 64);
    const glassMat = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: false,
        side: THREE.FrontSide
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 0, 1.42);
    cameraMesh.add(glass);

    // Lens reflection ring
    const ringGeo = new THREE.RingGeometry(0.36, 0.40, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xe8b86d, emissive: 0xe8b86d, emissiveIntensity: 0.4, roughness: 0.1, metalness: 1.0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0, 1.43);
    cameraMesh.add(ring);

    // Shutter button
    const shutterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0xe8b86d, roughness: 0.2, metalness: 0.9 });
    const shutter = new THREE.Mesh(shutterGeo, shutterMat);
    shutter.position.set(0.7, 0.78, 0.3);
    cameraMesh.add(shutter);

    // Grip
    const gripGeo = new THREE.BoxGeometry(0.55, 1.4, 1.1);
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.7, metalness: 0.3 });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.set(1.07, 0, 0);
    cameraMesh.add(grip);

    threeScene.add(cameraMesh);

    // Mouse parallax tracking
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    let idleAngle = 0;
    function animate() {
        animFrameId = requestAnimationFrame(animate);
        idleAngle += 0.004;
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        cameraMesh.rotation.y = targetX * 0.5 + Math.sin(idleAngle) * 0.08;
        cameraMesh.rotation.x = -targetY * 0.25 + Math.cos(idleAngle * 0.7) * 0.04;
        cameraMesh.position.y = Math.sin(idleAngle * 0.8) * 0.08;

        threeRenderer.render(threeScene, threeCamera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        threeCamera.aspect = window.innerWidth / window.innerHeight;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Click to enter
    introScreen.addEventListener('click', shutterTransition);
}

function shutterTransition() {
    const introScreen = document.getElementById('intro-screen');
    const flash = document.getElementById('flash-overlay');
    introScreen.removeEventListener('click', shutterTransition);

    // Shutter click sound (Web Audio API)
    playShutterSound();

    // Shutter animation: camera squish
    if (cameraMesh) {
        cameraMesh.scale.y = 0.85;
        setTimeout(() => { cameraMesh.scale.y = 1; }, 80);
    }

    // Flash sequence
    flash.style.transition = 'opacity 0.08s ease';
    flash.style.opacity = '1';
    setTimeout(() => {
        flash.style.transition = 'opacity 0.5s ease';
        flash.style.opacity = '0';
        // Slide intro up
        setTimeout(() => {
            introScreen.style.transition = 'transform 0.9s cubic-bezier(0.76,0,0.24,1), opacity 0.6s ease';
            introScreen.style.transform = 'translateY(-100%)';
            introScreen.style.opacity = '0';
            setTimeout(() => {
                introScreen.style.display = 'none';
                cancelAnimationFrame(animFrameId);
                enterMainSite();
            }, 900);
        }, 100);
    }, 120);
}

function playShutterSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3) * 0.6;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        src.connect(gain); gain.connect(ctx.destination);
        src.start();
    } catch (e) { }
}

function enterMainSite() {
    document.body.classList.remove('intro-active');
    const main = document.getElementById('main-site');
    if (main) {
        main.style.opacity = '0';
        main.style.display = 'block';
        main.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { main.style.opacity = '1'; }, 50);
    }
    animateHero();
}

// ─────────────────────────────────────────────────────────
// HERO ANIMATION
// ─────────────────────────────────────────────────────────
function animateHero() {
    const items = [
        document.querySelector('.hero-eyebrow'),
        document.querySelector('.hero-name'),
        document.querySelector('.hero-title'),
        document.querySelector('.hero-tagline'),
        document.querySelector('.hero-cta-group'),
    ];
    items.forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease, clip-path 0.9s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.clipPath = el.style.clipPath ? 'inset(0 0 0% 0)' : undefined;
        }, 200 + i * 150);
    });
}

// ─────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────
function setupNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });
}

// ─────────────────────────────────────────────────────────
// HAMBURGER MENU
// ─────────────────────────────────────────────────────────
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
}

// ─────────────────────────────────────────────────────────
// CURSOR
// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
// CURSOR
// ─────────────────────────────────────────────────────────
function setupCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    document.body.classList.add('has-custom-cursor');
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    let cx = 0, cy = 0, rx = 0, ry = 0;
    let firstMove = true;

    document.addEventListener('mousemove', (e) => {
        cx = e.clientX; cy = e.clientY;
        if (firstMove) { rx = cx; ry = cy; firstMove = false; }
    });

    // Handle Hover States (Alternative to CSS :has for better compatibility)
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .portfolio-card, .reel-thumb');
        if (target) cursor.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .portfolio-card, .reel-thumb');
        if (!target) cursor.classList.remove('hovering');
    });

    function cursorLoop() {
        // Smooth interpolation for the ring
        rx += (cx - rx) * 0.15; ry += (cy - ry) * 0.15;

        if (dot) dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

        requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

    // Hide if touch device
    if ('ontouchstart' in window) cursor.style.display = 'none';
}

// ─────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────
function setupScrollReveal() {
    const els = document.querySelectorAll('.reveal-up');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
}

// ─────────────────────────────────────────────────────────
// ANIMATED COUNTERS
// ─────────────────────────────────────────────────────────
function setupCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = Date.now();

    function tick() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    tick();
}

// ─────────────────────────────────────────────────────────
// SKILL BARS
// ─────────────────────────────────────────────────────────
function setupSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.dataset.width || '90';
                setTimeout(() => { entry.target.style.width = target + '%'; }, 200);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    bars.forEach(bar => io.observe(bar));
}

// ─────────────────────────────────────────────────────────
// PORTFOLIO
// ─────────────────────────────────────────────────────────
function populatePortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    PORTFOLIO.forEach(item => {
        const card = document.createElement('div');
        card.className = 'portfolio-card reveal-up';
        card.dataset.category = item.category;
        card.innerHTML = `
      <div class="portfolio-thumb">${item.emoji}</div>
      <div class="portfolio-overlay">
        <div class="portfolio-category">${item.category}</div>
        <div class="portfolio-name">${item.title}</div>
        <div class="portfolio-tools">${item.tools}</div>
      </div>
      <div class="play-btn">▶</div>
    `;
        card.addEventListener('click', () => openModal(item));
        grid.appendChild(card);
    });
    setupScrollReveal();
}

function setupPortfolioFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            filterPortfolio();
        });
    });
}

function filterPortfolio() {
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        const match = activeFilter === 'all' || card.dataset.category === activeFilter;
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity = match ? '1' : '0.2';
        card.style.transform = match ? 'scale(1)' : 'scale(0.95)';
        card.style.pointerEvents = match ? 'auto' : 'none';
    });
}

// ─────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────
function setupModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(item) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    overlay.querySelector('.modal-title').textContent = item.title;
    overlay.querySelector('.modal-client').textContent = item.client;
    overlay.querySelector('.modal-tools').textContent = item.tools;
    overlay.querySelector('.modal-cat').textContent = item.category.toUpperCase();
    overlay.querySelector('.modal-desc').textContent = item.desc;

    // Use Google Drive iframe — works on any device, no local files needed
    const videoWrap = overlay.querySelector('.modal-video');
    videoWrap.innerHTML = `
        <iframe
            id="modal-drive-iframe"
            src="https://drive.google.com/file/d/${item.driveId}/preview"
            style="width:100%;height:100%;border:none;border-radius:8px;background:#000"
            allow="autoplay; fullscreen"
            allowfullscreen
        ></iframe>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    // Clear iframe src to stop Drive video playback
    const iframe = overlay.querySelector('#modal-drive-iframe');
    if (iframe) iframe.src = '';
    const videoWrap = overlay.querySelector('.modal-video');
    if (videoWrap) videoWrap.innerHTML = '';
    document.body.style.overflow = '';
}

// ─────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────
function populateTestimonials() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;
    TESTIMONIALS.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
      <div class="stars">${'★'.repeat(t.rating)}</div>
      <p class="testimonial-quote">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.initials}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-company">${t.company}</div>
        </div>
      </div>
    `;
        track.appendChild(card);
    });
}

// ─────────────────────────────────────────────────────────
// TOAST HELPER
// ─────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toast.className = `toast ${type} show`;
    setTimeout(() => { toast.className = 'toast'; }, 5000);
}

// ─────────────────────────────────────────────────────────
// CONTACT FORM — saves to database only
// ─────────────────────────────────────────────────────────
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');
    const statusDiv = document.getElementById('form-status');
    if (!form) return;

    // Determine Server URL (Local vs Render)
    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(location.hostname);
    const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || isIP;
    const SERVER_URL = isLocal ? `http://${location.hostname}:3001` : 'https://manavwebsite.onrender.com';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const phone = (form.querySelector('[name="phone"]') || {}).value || '';
        const project = (form.querySelector('[name="project"]') || {}).value || '';
        const message = (form.querySelector('[name="message"]') || {}).value || '';

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';

        if (!name || !email) {
            if (statusDiv) {
                statusDiv.textContent = 'Please fill in required fields';
                statusDiv.className = 'form-status visible error';
            }
            return;
        }

        const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        if (submitBtn) {
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
        }

        try {
            // First attempt
            const res = await fetchWithTimeout(`${SERVER_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, project, message })
            });

            if (res.ok) {
                if (statusDiv) {
                    statusDiv.textContent = '✓ Message received! We\'ll get back to you soon.';
                    statusDiv.className = 'form-status visible success';
                }
                showToast(`Thanks ${name}! Your message has been saved. 🎬`, 'success');
                form.reset();
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            console.error('Submission failed:', err);

            // If it's a timeout or network error, it might be the Render free tier "waking up"
            if (statusDiv) {
                statusDiv.textContent = '⏱ Server is waking up (Render free tier). Please wait 30s and try again.';
                statusDiv.className = 'form-status visible error';
            }
            showToast('The server is currently waking up. Please try again in a moment.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
    // ── Keep-Alive (To prevent Render free tier sleep) ──
    function startKeepAlive() {
        // Ping every 10 mins (600,000ms)
        setInterval(async () => {
            try {
                await fetch(`${SERVER_URL}/api/health`);
                console.log('💓 Keep-alive ping sent');
            } catch (e) {
                console.warn('💓 Keep-alive ping failed (server may be sleeping)');
            }
        }, 600000);
    }
    startKeepAlive();
}

// ─────────────────────────────────────────────────────────
// SHOWREEL MULTI-VIDEO SWITCHER
// ─────────────────────────────────────────────────────────
function playReel(thumb, driveId, label, num) {
    // Update main player — swap iframe src to Drive preview URL
    const iframe = document.getElementById('main-reel-iframe');
    const mainTitle = document.getElementById('main-reel-title');
    const counter = document.getElementById('reel-counter');
    if (iframe) {
        iframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
    }
    // Always read the latest label from the DOM (may have been updated by server config)
    const thumbLabel = thumb.querySelector('.reel-thumb-label');
    const currentLabel = thumbLabel ? thumbLabel.textContent : label;
    if (mainTitle) mainTitle.textContent = `🎬 ${currentLabel} — Studio Showcase`;
    if (counter && num) counter.textContent = num + ' / 10';

    // Update active thumbnail highlight
    document.querySelectorAll('.reel-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    // Scroll thumb into view inside its track
    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}


// ─────────────────────────────────────────────────────────
// SMOOTH SCROLL for anchor links
// ─────────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ─────────────────────────────────────────────────────────
// PARALLAX HERO
// ─────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        const scrollY = window.scrollY;
        hero.style.transform = `translateY(${scrollY * 0.25}px)`;
        hero.style.opacity = 1 - scrollY / 600;
    }
});

// ─────────────────────────────────────────────────────────
// LOAD VIDEO CONFIG FROM SERVER (Admin Panel Sync)
// ─────────────────────────────────────────────────────────
// Maps admin slot IDs → PORTFOLIO array indexes and showreel thumb indexes
const SLOT_TO_PORTFOLIO = {
    'slot_fortune': 0,  // PORTFOLIO[0]  = Fortune Air Diwali Reel
    'slot_hiren': 1,  // PORTFOLIO[1]  = Hiren & Krishna Teaser
    'slot_jayneel': 2,  // PORTFOLIO[2]  = Jayneel Riya Reel
    'slot_nazarbaug': 3,  // PORTFOLIO[3]  = Nazarbaug Diwali Reel
    'slot_neimish': 4,  // PORTFOLIO[4]  = Neimish Creative Reel
    'slot_shreenand': 5,  // PORTFOLIO[5]  = Shreenand New Reel
    'slot_sequence': 6,  // PORTFOLIO[6]  = Sequence Edit
    'slot_engagement': 7,  // PORTFOLIO[7]  = Engagement Reel
    'slot_final': 8,  // PORTFOLIO[8]  = Final Reel
    'slot_dental': 9,  // PORTFOLIO[9]  = Pure Dental Opening Reel
};

// Showreel thumbnails in index.html are in this order (0-indexed):
// 0=Final, 1=Fortune, 2=Hiren, 3=Jayneel, 4=Nazarbaug, 5=Neimish, 6=Shreenand, 7=Sequence, 8=Engagement, 9=Dental
const SLOT_TO_SHOWREEL = {
    'slot_final': 0,
    'slot_fortune': 1,
    'slot_hiren': 2,
    'slot_jayneel': 3,
    'slot_nazarbaug': 4,
    'slot_neimish': 5,
    'slot_shreenand': 6,
    'slot_sequence': 7,
    'slot_engagement': 8,
    'slot_dental': 9,
};

async function loadVideoConfigFromServer() {
    // Determine Server URL
    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(location.hostname);
    const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || isIP;
    const SERVER_URL = isLocal ? `http://${location.hostname}:3001` : 'https://manavwebsite.onrender.com';

    try {
        const res = await fetchWithTimeout(`${SERVER_URL}/api/videos`, {}, 10000);
        if (!res.ok) return; // Server error — keep defaults
        const config = await res.json();

        if (!config || Object.keys(config).length === 0) return; // No config saved yet

        const reelThumbs = document.querySelectorAll('.reel-thumb');
        const mainIframe = document.getElementById('main-reel-iframe');

        Object.keys(config).forEach(slotId => {
            const driveId = config[slotId].drive_id;
            const label = config[slotId].display_label;
            if (!driveId) return;

            // 1. Update PORTFOLIO array (for modal playback)
            const portfolioIdx = SLOT_TO_PORTFOLIO[slotId];
            if (portfolioIdx !== undefined && PORTFOLIO[portfolioIdx]) {
                PORTFOLIO[portfolioIdx].driveId = driveId;
            }

            // 2. Update showreel thumbnails in the DOM
            const showreelIdx = SLOT_TO_SHOWREEL[slotId];
            if (showreelIdx !== undefined && reelThumbs[showreelIdx]) {
                const thumb = reelThumbs[showreelIdx];
                const img = thumb.querySelector('img');
                if (img) img.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;

                const labelEl = thumb.querySelector('.reel-thumb-label');
                if (labelEl && label) labelEl.textContent = label;

                // Update onclick handler with new driveId and label
                const num = showreelIdx + 1;
                const displayTitle = label || thumb.querySelector('.reel-thumb-label')?.textContent || '';
                thumb.setAttribute('onclick', `playReel(this,'${driveId}','${displayTitle}',${num})`);

                // If this is the first thumb (active by default) and it's slot_final, update main iframe
                if (slotId === 'slot_final' && mainIframe) {
                    mainIframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
                    const titleEl = document.getElementById('main-reel-title');
                    if (titleEl && label) titleEl.textContent = `🎬 ${label} — Studio Showcase`;
                }
            }
        });

        console.log('✅ Video config loaded from server');
    } catch (e) {
        // Server unreachable (e.g. Render sleeping) — silently keep hardcoded defaults
        console.log('💤 Server not reachable — using default video config');
    }
}
