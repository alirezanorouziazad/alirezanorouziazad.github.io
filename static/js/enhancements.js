/* ===================================================
   ADVANCED INTERACTIONS — Alireza Norouzi Academic CV
   Particles, Typing, Scroll Reveals, 3D Tilt,
   Stats Counter, Timeline & Dark Mode
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 0. STRIP ALL OPAQUE BACKGROUNDS (for particles)
  // =============================================
  function stripBackgrounds() {
    // Move dark background from body to html, make body transparent
    // so the fixed canvas inside body is visible
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.style.setProperty('background-color', '#030712', 'important');
    }

    // Strip all bg classes from body
    Array.from(document.body.classList).forEach(cls => {
      if (cls.match(/^(bg-|dark:bg-)/)) {
        document.body.classList.remove(cls);
      }
    });
    document.body.style.setProperty('background', 'transparent', 'important');
    document.body.style.setProperty('background-color', 'transparent', 'important');

    // Also make #page-bg invisible
    const pageBg = document.getElementById('page-bg');
    if (pageBg) {
      pageBg.style.setProperty('display', 'none', 'important');
    }

    // Strip backgrounds from all major containers
    const selectors = [
      '.page-wrapper',
      '.page-wrapper > div',
      '.page-body',
      '.page-body > div',
      '.page-header',
      '.page-footer',
      '.hbb-section',
      'section',
      '.home-section-bg',
      '[class*="biography"]',
      '[class*="blox-"]'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        Array.from(el.classList).forEach(cls => {
          if (cls.match(/^(bg-|dark:bg-)/)) {
            el.classList.remove(cls);
          }
        });
        el.style.setProperty('background', 'transparent', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        el.style.setProperty('background-image', 'none', 'important');
      });
    });
  }

  // =============================================
  // 1a. NEURAL PARTICLE CANVAS & BREATHING ORBS (BACKUP)
  // =============================================
  function initNeuralParticlesBackup() {
    const target = document.body;
    const canvas = document.createElement('canvas');
    canvas.id = 'neural-particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
    target.insertBefore(canvas, target.firstChild);

    // Make sure content sits above canvas
    document.querySelectorAll('.page-wrapper, .page-header, .page-body, .page-footer, header, nav').forEach(el => {
      el.style.position = 'relative';
      el.style.zIndex = '2';
    });

    const ctx = canvas.getContext('2d');
    let width, height;

    // --- State ---
    let particles = [];
    let time = 0;
    let mouse = { x: -1000, y: -1000, radius: 180 };

    // Track mouse safely
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // --- 1. Neural Particles ---
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseRadius = Math.random() * 2 + 1.5;
        this.radius = this.baseRadius;
        this.baseOpacity = Math.random() * 0.4 + 0.3;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Slight attraction
        if (mouse.x > 0) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += dx * force * 0.015;
            this.y += dy * force * 0.015;
            this.radius = this.baseRadius + force * 1.5;
          } else {
            this.radius = this.baseRadius;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${this.baseOpacity})`;
        ctx.fill();
      }
    }

    const isMobile = width < 768;
    const particleCount = isMobile ? 100 : 300;
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    // --- Main Animation Loop ---
    function animate() {
      ctx.clearRect(0, 0, width, height);
      time++;

      // Draw Neural Particles
      particles.forEach(p => { p.update(); p.draw(); });

      // Connect Neural Particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x > 0) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.3 * (1 - mDist / 180)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // =============================================
  // 1b. ANTIGRAVITY STARFIELD (NEW DEFAULT)
  // =============================================
  function initParticles() {
    const target = document.body;
    let oldCanvas = document.getElementById('antigravity-particles');
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'antigravity-particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
    target.insertBefore(canvas, target.firstChild);

    // Make sure content sits above canvas
    document.querySelectorAll('.page-wrapper, .page-header, .page-body, .page-footer, header, nav').forEach(el => {
      el.style.position = 'relative';
      el.style.zIndex = '2';
    });

    const ctx = canvas.getContext('2d');
    let width, height;

    let particles = [];
    let mouse = { x: -1000, y: -1000, active: false };
    let time = 0;

    // Fluid mouse tracking
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseout', () => {
      mouse.active = false;
    });

    // Antigravity colors: Google-esque hues (blue, red, yellow, green)
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8ab4f8', '#f28b82'];

    class WaveParticle {
      constructor(ox, oy, ringDepth) {
        this.ox = ox; // Origin X
        this.oy = oy; // Origin Y
        this.x = ox;
        this.y = oy;

        // Base Z depth for parallax and scale
        this.baseZ = ringDepth;

        // Actual properties
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;

        // Geometry
        this.baseLength = Math.random() * 4 * this.baseZ + 2;
        this.thickness = this.baseZ * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.min(this.baseZ * 0.4 + 0.2, 0.9);

        // Oscillation offset for natural breathing
        this.oscillationOffset = Math.random() * Math.PI * 2;
        // SLOWED DOWN: base speed for natural breathing
        this.speed = Math.random() * 0.005 + 0.002;
      }

      update() {
        // Natural breath/wave (even without mouse)
        // REDUCED AMPLITUDE: from 10 to 4
        let naturalWanderX = Math.sin(time * this.speed + this.oscillationOffset) * 4 * this.baseZ;
        let naturalWanderY = Math.cos(time * this.speed + this.oscillationOffset) * 4 * this.baseZ;

        let targetX = this.ox + naturalWanderX;
        let targetY = this.oy + naturalWanderY;
        let targetAngle = 0;

        // --- Mouse Wave Lens Effect ---
        if (mouse.active) {
          let dx = this.ox - mouse.x;
          let dy = this.oy - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          let influenceRadius = 400; // slightly larger radius for smoother falloff

          if (dist < influenceRadius) {
            // SLOWED DOWN WAVE: time * 0.02 instead of 0.1
            let wavePhase = (dist / 60) - (time * 0.02);
            let waveAmplitude = (influenceRadius - dist) / influenceRadius;

            // REDUCED DISPLACEMENT: from 40 to 25
            let displacement = Math.sin(wavePhase) * 25 * waveAmplitude * this.baseZ;

            let dirX = dx / dist;
            let dirY = dy / dist;

            targetX += dirX * displacement;
            targetY += dirY * displacement;

            targetAngle = Math.atan2(dirX, -dirY);
            let radialAngle = Math.atan2(dy, dx);
            let blend = Math.abs(Math.sin(wavePhase));
            targetAngle = radialAngle * (1 - blend) + targetAngle * blend;
          }
        }

        // SMOOTHER SPRING PHYSICS: 0.03 instead of 0.08
        this.vx += (targetX - this.x) * 0.03;
        this.vy += (targetY - this.y) * 0.03;

        // HIGHER DAMPING (More friction, less bouncy): 0.85 instead of 0.75
        this.vx *= 0.85;
        this.vy *= 0.85;

        this.x += this.vx;
        this.y += this.vy;

        // Smooth angle rotation (slower rotation: 0.05 instead of 0.1)
        if (Math.abs(targetAngle - this.angle) > Math.PI) {
          if (targetAngle > this.angle) this.angle += Math.PI * 2;
          else this.angle -= Math.PI * 2;
        }
        this.angle += (targetAngle - this.angle) * 0.05;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Stretch length slightly based on velocity to emphasize flow
        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        let dynamicLength = this.baseLength + (speed * 0.5);

        ctx.beginPath();
        ctx.moveTo(-dynamicLength / 2, 0);
        ctx.lineTo(dynamicLength / 2, 0);

        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.restore();
      }
    }

    function init() {
      particles = [];
      const isMobile = window.innerWidth < 768;

      // Create a massive grid / orbital field covering the screen and beyond for parallax
      // Reduce particle count significantly on mobile for readability and performance
      let cols = isMobile ? 8 : 35;
      let rows = isMobile ? 12 : 20;
      let spacingX = window.innerWidth / cols;
      let spacingY = window.innerHeight / rows;

      for (let i = -2; i <= cols + 2; i++) {
        for (let j = -2; j <= rows + 2; j++) {
          // Add organic jitter to the grid
          let jitterX = (Math.random() - 0.5) * spacingX * 1.5;
          let jitterY = (Math.random() - 0.5) * spacingY * 1.5;

          let ox = (i * spacingX) + jitterX;
          let oy = (j * spacingY) + jitterY;

          let depth = Math.random() * 1.5 + 0.5; // Z index 0.5 to 2.0

          // Randomly skip to make the grid less uniform and more "starry"
          // Keep fewer particles on mobile
          let spawnChance = isMobile ? 0.6 : 0.4;
          if (Math.random() > spawnChance) {
            particles.push(new WaveParticle(ox, oy, depth));
          }
        }
      }
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    }

    resize();
    window.addEventListener('resize', resize);

    // --- Main Animation Loop ---
    function animate() {
      ctx.clearRect(0, 0, width, height);
      time++;

      // Draw Particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // =============================================
  // 2. TYPING ANIMATION
  // =============================================
  function initTypingAnimation() {
    // Find the role element using the correct selector
    const bioSection = document.querySelector('.blox-resume-biography-3') ||
      document.querySelector('[class*="biography"]');
    if (!bioSection) return;

    const roleEl = bioSection.querySelector('h3.font-semibold') ||
      bioSection.querySelector('.font-semibold');
    if (!roleEl) return;

    const roles = [
      'AI/ML Research Scientist',
      'Deep Learning Researcher',
      'Medical Imaging Expert',
      'Computer Vision Engineer',
      'Healthcare AI Innovator'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    roleEl.style.minHeight = roleEl.offsetHeight + 'px';
    roleEl.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" style="animation:blink 0.7s infinite;color:#818cf8;">|</span>';
    const textSpan = roleEl.querySelector('.typing-text');

    // Add blink animation
    if (!document.getElementById('typing-style')) {
      const style = document.createElement('style');
      style.id = 'typing-style';
      style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
      document.head.appendChild(style);
    }

    function type() {
      const current = roles[roleIdx];
      if (!isDeleting) {
        textSpan.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isDeleting = true;
          typingSpeed = 2000;
        } else {
          typingSpeed = 80 + Math.random() * 60;
        }
      } else {
        textSpan.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 40;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          typingSpeed = 400;
        }
      }
      setTimeout(type, typingSpeed);
    }
    setTimeout(type, 1000);
  }

  // =============================================
  // 3. SCROLL-TRIGGERED ANIMATIONS
  // =============================================
  function initScrollAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .scroll-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .scroll-animate.scroll-revealed {
        opacity: 1;
        transform: translateY(0);
      }
      .scroll-animate-scale {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      .scroll-animate-scale.scroll-revealed {
        opacity: 1;
        transform: scale(1);
      }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Target HBB sections (skip the hero)
    document.querySelectorAll('.hbb-section, .blox-markdown, section').forEach((el, i) => {
      if (!el.classList.contains('blox-resume-biography-3') && !el.closest('.blox-resume-biography-3')) {
        el.classList.add('scroll-animate');
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        observer.observe(el);
      }
    });

    // Also animate publication list items and any page-body children
    document.querySelectorAll('.page-body .prose > *, .page-body .citation-list > div, .page-body article, .page-body > div > div').forEach((el, i) => {
      if (!el.classList.contains('scroll-animate') && !el.closest('.scroll-animate')) {
        el.classList.add('scroll-animate');
        el.style.transitionDelay = `${(i % 6) * 0.08}s`;
        observer.observe(el);
      }
    });
  }

  // =============================================
  // 4. 3D TILT EFFECT ON PUBLICATION ITEMS
  // =============================================
  function initTiltEffect() {
    // Target citation items on the publications page
    const items = document.querySelectorAll('.citation, [class*="citation"], article, .card');
    items.forEach(item => {
      item.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        item.style.boxShadow = '0 10px 40px rgba(99, 102, 241, 0.1)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        item.style.boxShadow = '';
      });
    });
  }

  // =============================================
  // 6. STATS COUNTER ON HOMEPAGE
  // =============================================
  function initStatsCounter() {
    // Find the markdown/research section
    const researchSection = document.querySelector('.blox-markdown') ||
      document.querySelector('[class*="markdown"]') ||
      document.getElementById('section-markdown');
    if (!researchSection) return;

    // Find the prose container inside
    const proseContainer = researchSection.querySelector('.prose') ||
      researchSection.querySelector('div > div') ||
      researchSection;

    if (document.getElementById('stats-counter')) return;

    const statsHTML = document.createElement('div');
    statsHTML.id = 'stats-counter';
    statsHTML.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1.5rem;
      margin-top: 2.5rem;
      padding: 2rem;
      border-radius: 16px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(12px);
    `;

    const stats = [
      { value: 16, suffix: '+', label: 'Publications', icon: '📄' },
      { value: 4, suffix: '', label: 'Filed Patents', icon: '🔬' },
      { value: 90, suffix: 'K+', label: 'CAD Funding', icon: '💰' },
      { value: 15.1, suffix: '', label: 'Max IF', icon: '📊' }
    ];

    stats.forEach(stat => {
      const div = document.createElement('div');
      div.style.cssText = 'text-align:center;padding:1rem;';
      div.innerHTML = `
        <div style="font-size:2rem;margin-bottom:0.5rem;">${stat.icon}</div>
        <div class="stat-number" data-target="${stat.value}" data-suffix="${stat.suffix}"
             style="font-size:2.2rem;font-weight:800;background:linear-gradient(135deg,#818cf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Inter',sans-serif;">
          0${stat.suffix}
        </div>
        <div style="font-size:0.875rem;color:rgba(255,255,255,0.6);margin-top:0.25rem;letter-spacing:0.05em;text-transform:uppercase;">
          ${stat.label}
        </div>
      `;
      statsHTML.appendChild(div);
    });

    proseContainer.appendChild(statsHTML);

    // Animate counting when visible
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(statsHTML);

    function animateCounters() {
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix;
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }
  }

  // =============================================
  // 7. ENHANCED TIMELINE ANIMATION
  // =============================================
  function initTimeline() {
    const timelineItems = document.querySelectorAll('ol.border-s > li');
    if (!timelineItems.length) return;

    const style = document.createElement('style');
    style.textContent = `
      ol.border-s > li {
        opacity: 0;
        transform: translateX(-20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      ol.border-s > li.timeline-visible {
        opacity: 1;
        transform: translateX(0);
      }
      ol.border-s > li .absolute {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      ol.border-s > li:hover .absolute {
        transform: scale(1.3);
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
      }
      /* Fix timeline icon overlapping text */
      ol.border-s > li {
        margin-left: 1.75rem !important;
        padding-left: 0.5rem;
      }
      ol.border-s > li .absolute.-start-3 {
        left: -2rem;
      }
    `;
    document.head.appendChild(style);

    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-visible');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    timelineItems.forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.15}s`;
      tlObserver.observe(item);
    });
  }

  // =============================================
  // 10. SMOOTH DARK/LIGHT MODE TOGGLE
  // =============================================
  function initDarkModeTransition() {
    const style = document.createElement('style');
    style.textContent = `
      html.theme-transitioning,
      html.theme-transitioning *,
      html.theme-transitioning *::before,
      html.theme-transitioning *::after {
        transition: background-color 0.5s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);

    // Use a flag to prevent infinite observer loop
    let isTransitioning = false;
    const htmlObserver = new MutationObserver((mutations) => {
      if (isTransitioning) return;
      // Only trigger on actual theme changes (dark class toggle)
      const classChanged = mutations.some(m => m.attributeName === 'class');
      if (!classChanged) return;
      isTransitioning = true;
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
        isTransitioning = false;
      }, 600);
    });
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // =============================================
  // PAGE LOAD FADE-IN FOR ALL PAGES
  // =============================================
  function initPageLoadTransition() {
    const style = document.createElement('style');
    style.textContent = `
      .page-body {
        opacity: 0;
        transform: translateY(15px);
        animation: pageLoadIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        animation-delay: 0.1s;
      }
      @keyframes pageLoadIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // =============================================
  // INIT ALL
  // =============================================
  try { stripBackgrounds(); } catch (e) { console.warn('Strip backgrounds error:', e); }
  try { initPageLoadTransition(); } catch (e) { console.warn('Page transition init error:', e); }
  try { initNeuralParticlesBackup(); } catch (e) { console.warn('Particles init error:', e); }
  try { initTypingAnimation(); } catch (e) { console.warn('Typing init error:', e); }
  try { initScrollAnimations(); } catch (e) { console.warn('Scroll init error:', e); }
  try { initTiltEffect(); } catch (e) { console.warn('Tilt init error:', e); }
  try { initStatsCounter(); } catch (e) { console.warn('Stats init error:', e); }
  try { initTimeline(); } catch (e) { console.warn('Timeline init error:', e); }
  try { initDarkModeTransition(); } catch (e) { console.warn('Dark mode init error:', e); }

});
