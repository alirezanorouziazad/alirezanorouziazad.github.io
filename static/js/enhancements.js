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
  // 1. 3D FIBONACCI SPHERE WITH PULSE WAVE
  // =============================================
  function initParticleSphere() {
    const target = document.body;

    // Remove any old canvases
    ['neural-particles', 'antigravity-particles', 'sphere-particles'].forEach(id => {
      const old = document.getElementById(id);
      if (old) old.remove();
    });

    const canvas = document.createElement('canvas');
    canvas.id = 'sphere-particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
    target.insertBefore(canvas, target.firstChild);

    // Content above canvas
    document.querySelectorAll('.page-wrapper, .page-header, .page-body, .page-footer, header, nav').forEach(el => {
      el.style.position = 'relative';
      el.style.zIndex = '2';
    });

    const ctx = canvas.getContext('2d');
    let W, H, sphereRadius;
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 500 : 1500;
    const PERSPECTIVE = 600;
    const ROTATION_SPEED_X = 0.0025;
    const ROTATION_SPEED_Y = 0.0045;

    // Fibonacci sphere distribution — returns array of {x,y,z} on unit sphere
    function fibonacciSphere(n) {
      const points = [];
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        points.push({
          x: Math.cos(theta) * radiusAtY,
          y: y,
          z: Math.sin(theta) * radiusAtY
        });
      }
      return points;
    }

    let basePoints = fibonacciSphere(PARTICLE_COUNT);
    let angleX = 0;
    let angleY = 0;
    let time = 0;
    let frameCount = 0;

    // Pre-allocate projected array for reuse (avoid GC pressure)
    const projected = new Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      projected[i] = { x: 0, y: 0, z: 0, depthNorm: 0, scale: 0, pulseIntensity: 0 };
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      sphereRadius = Math.sqrt(W * W + H * H) * 0.55;
    }
    resize();
    window.addEventListener('resize', resize);

    function animate() {
      // Motion blur trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, W, H);

      angleX += ROTATION_SPEED_X;
      angleY += ROTATION_SPEED_Y;
      time += 0.02;
      frameCount++;

      // Pre-compute sin/cos once per frame (not per particle)
      const cosAX = Math.cos(angleX), sinAX = Math.sin(angleX);
      const cosAY = Math.cos(angleY), sinAY = Math.sin(angleY);
      const halfW = W * 0.5, halfH = H * 0.5;
      const invSphereR2 = 1 / (sphereRadius * 2);

      // Transform & project all particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const bp = basePoints[i];
        // Scale to sphere radius
        let px = bp.x * sphereRadius;
        let py = bp.y * sphereRadius;
        let pz = bp.z * sphereRadius;

        // Rotate X (inline)
        const ry = py * cosAX - pz * sinAX;
        const rz = py * sinAX + pz * cosAX;
        // Rotate Y (inline)
        const rx = px * cosAY + rz * sinAY;
        const fz = -px * sinAY + rz * cosAY;

        // Perspective projection
        const depth = fz + PERSPECTIVE;
        const scale = PERSPECTIVE / depth;

        const pr = projected[i];
        pr.x = halfW + rx * scale;
        pr.y = halfH + ry * scale;
        pr.z = fz;
        pr.depthNorm = (fz + sphereRadius) * invSphereR2;
        pr.scale = scale;

        // Pulse wave
        const pulseWave = Math.sin(bp.y * 4 + time * 2);
        pr.pulseIntensity = pulseWave > 0 ? pulseWave : 0;
      }

      // Z-sort every 5th frame (barely noticeable, saves a lot of CPU)
      if (frameCount % 5 === 0) {
        projected.sort((a, b) => a.z - b.z);
      }

      // Draw particles — NO shadowBlur (biggest perf killer)
      // Simulate glow by drawing a larger faint circle behind bright particles
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const pt = projected[i];

        // VIEWPORT CULLING — skip particles outside the screen
        if (pt.x < -20 || pt.x > W + 20 || pt.y < -20 || pt.y > H + 20) continue;

        const dn = pt.depthNorm;
        const pi = pt.pulseIntensity;

        // Base size: 0.5 to 3 based on depth
        let baseSize = 0.5 + dn * 2.5;
        let size = baseSize + pi * baseSize * 1.2;
        let drawRadius = Math.max(size * pt.scale * 0.5, 0.3);

        // Base opacity
        let baseOpacity = 0.1 + dn * 0.5;

        if (pi > 0.1) {
          // Simulate glow: draw a larger, faint halo behind the particle
          const glowRadius = drawRadius * 2.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, glowRadius, 0, 6.2832);
          ctx.fillStyle = `rgba(0, 200, 255, ${pi * 0.12})`;
          ctx.fill();

          // Bright cyan/neon core
          const t = pi;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, drawRadius, 0, 6.2832);
          ctx.fillStyle = `rgba(${30 + t * 200 | 0}, ${180 + t * 75 | 0}, 255, ${Math.min(baseOpacity + t * 0.5, 1.0)})`;
          ctx.fill();
        } else {
          // Dim blue base
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, drawRadius, 0, 6.2832);
          ctx.fillStyle = `rgba(40, 60, 180, ${baseOpacity})`;
          ctx.fill();
        }
      }

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
  try { initParticleSphere(); } catch (e) { console.warn('Particles init error:', e); }
  try { initTypingAnimation(); } catch (e) { console.warn('Typing init error:', e); }
  try { initScrollAnimations(); } catch (e) { console.warn('Scroll init error:', e); }
  try { initTiltEffect(); } catch (e) { console.warn('Tilt init error:', e); }
  try { initStatsCounter(); } catch (e) { console.warn('Stats init error:', e); }
  try { initTimeline(); } catch (e) { console.warn('Timeline init error:', e); }
  try { initDarkModeTransition(); } catch (e) { console.warn('Dark mode init error:', e); }

});
