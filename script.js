/* =====================================================
   MANAV - Video Editor Portfolio | script.js
   ===================================================== */

'use strict';

// ─── Portfolio Data ──────────────────────────────────
const PORTFOLIO = [
    { id: 1, title: 'Cinematic Brand Story', category: 'commercial', tools: 'Premiere Pro, After Effects', client: 'LuxBrand Co.', desc: 'A high-end brand film capturing the ethos of a luxury lifestyle brand, featuring slow-motion cinematography and intricate color grading.', yt: 'dQw4w9WgXcQ', emoji: '🎬' },
    { id: 2, title: 'Mountain Wedding Film', category: 'wedding', tools: 'DaVinci Resolve, Premiere', client: 'Sharma & Priya', desc: 'An emotional and cinematic wedding documentary blending candid moments with thoughtfully choreographed sequences in the Himalayas.', yt: 'dQw4w9WgXcQ', emoji: '💍' },
    { id: 3, title: 'Tech Channel Rebrand', category: 'youtube', tools: 'After Effects, Premiere', client: 'TechVision YT', desc: 'Complete visual rebrand for a 500k subscriber tech channel — new intro, lower-thirds, end-screens and episode edits.', yt: 'dQw4w9WgXcQ', emoji: '📱' },
    { id: 4, title: 'Fashion Week Recap', category: 'commercial', tools: 'Premiere Pro, Photoshop', client: 'StyleIndia', desc: 'Fast-paced fashion recap reel for a major Indian Fashion Week event, delivered across social media platforms within 24 hours.', yt: 'dQw4w9WgXcQ', emoji: '👗' },
    { id: 5, title: 'Indie Music Video', category: 'music', tools: 'After Effects, DaVinci', client: 'Aryan Raj Music', desc: 'Narrative-driven music video blending live action with motion graphics for an independent artist with 2M+ views.', yt: 'dQw4w9WgXcQ', emoji: '🎵' },
    { id: 6, title: 'Corporate Annual Report', category: 'corporate', tools: 'Premiere, Motion Graphics', client: 'Nexus Corp', desc: 'A crisp 8-minute corporate presentation combining animated infographics with interview footage for annual stakeholders meeting.', yt: 'dQw4w9WgXcQ', emoji: '🏢' },
    { id: 7, title: 'Travel Vlog Series', category: 'youtube', tools: 'Premiere Pro, Lightroom', client: 'Wanderlust YT', desc: 'Long-form travel vlog series across Southeast Asia — edited weekly with consistent visual style and dynamic pacing.', yt: 'dQw4w9WgXcQ', emoji: '✈️' },
    { id: 8, title: 'Product Launch Ad', category: 'commercial', tools: 'After Effects, Cinema 4D', client: 'GadgetX India', desc: '30-second product reveal advertisement featuring 3D product mockups parented to live footage for seamless integration.', yt: 'dQw4w9WgXcQ', emoji: '🚀' },
    { id: 9, title: 'Destination Wedding Edit', category: 'wedding', tools: 'DaVinci Resolve', client: 'Mehta Wedding Films', desc: 'A Goa beach wedding film with cinematic color science, surreal DaVinci grade, and bespoke soundscape design.', yt: 'dQw4w9WgXcQ', emoji: '🌊' },
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

    // Lens glass
    const glassGeo = new THREE.CircleGeometry(0.38, 32);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0a1a3a, emissive: 0x0a1a4a, roughness: 0.0, metalness: 1.0, transparent: true, opacity: 0.9 });
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
function setupCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    let cx = 0, cy = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
        cx = e.clientX; cy = e.clientY;
    });

    function cursorLoop() {
        rx += (cx - rx) * 0.15; ry += (cy - ry) * 0.15;
        dot.style.left = cx + 'px'; dot.style.top = cy + 'px';
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    // Hide on mobile
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
    const iframe = overlay.querySelector('iframe');
    iframe.src = `https://www.youtube.com/embed/${item.yt}?autoplay=1&mute=1`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    const iframe = overlay.querySelector('iframe');
    iframe.src = '';
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
// CONTACT FORM — Formspree async submit
// ─────────────────────────────────────────────────────────
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');
    const statusDiv = document.getElementById('form-status');
    if (!form) return;

    // Pre-fill hidden tracking fields
    const tsField = document.getElementById('submitted_at');
    const devField = document.getElementById('visitor_device');
    if (tsField) tsField.value = new Date().toISOString();
    if (devField) devField.value = `${navigator.userAgent.slice(0, 80)} | ${window.innerWidth}x${window.innerHeight}`;

    // Mirror email into _replyto so Formspree auto-replies to visitor
    const emailInput = form.querySelector('[name="email"]');
    const replyToField = document.getElementById('_replyto');
    const subjectField = document.getElementById('_subject');
    const nameInput = form.querySelector('[name="name"]');
    if (emailInput && replyToField) {
        emailInput.addEventListener('input', () => { replyToField.value = emailInput.value; });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic validation
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const project = (form.querySelector('[name="project"]') || {}).value || '';
        if (!name || !email) {
            showToast('Please fill in your name and email.', 'error');
            return;
        }

        // Update hidden fields with latest values
        if (tsField) tsField.value = new Date().toISOString();
        if (replyToField) replyToField.value = email;
        if (subjectField) subjectField.value = `🎬 New Inquiry: ${project} from ${name}`;

        // Loading state
        if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.classList.add('loading'); }

        try {
            const data = new FormData(form);
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                // ── SUCCESS ──
                form.reset();
                if (statusDiv) {
                    statusDiv.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
                    statusDiv.className = 'form-status visible success';
                }
                showToast(`Thanks ${name}! Your inquiry has been sent. Check your email for a greeting from me.`, 'success');
                // Google Analytics event (if GA is installed)
                if (typeof gtag === 'function') {
                    gtag('event', 'form_submit', { event_category: 'Contact', event_label: project });
                }
            } else {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.error || 'Server error');
            }
        } catch (err) {
            if (statusDiv) {
                statusDiv.textContent = '✗ Something went wrong. Please email me directly.';
                statusDiv.className = 'form-status visible error';
            }
            showToast('Submission failed. Please email manav@example.com directly.', 'error');
            console.error('Form error:', err);
        } finally {
            if (submitBtn) { submitBtn.textContent = 'Send Message ✉'; submitBtn.classList.remove('loading'); }
        }
    });
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
