const sections = document.querySelectorAll('section');
const catMessage = document.getElementById('catMessage');
const catGuide = document.querySelector('.cat-guide');
const catContainer = document.querySelector('.cat');
const yearTag = document.getElementById('year');

const messages = {
  inicio: '¡Bienvenido! Soy Rorschach, tu guía felino nocturno. Sigue bajando.',
  'sobre-mi': 'Aquí te cuento parte de la historia de Erick, yo lo acompaño en cada línea de código.',
  habilidades: 'Estas son las habilidades favoritas de mi humano para crear magia.',
  proyectos: 'Mira lo que hemos construido entre siestas y teclados.',
  contacto: '¿Colaboramos? Prometo llevar tu mensaje a Erick con mi collar rojo reluciente.'
};

const messagesMobile = {
  inicio: '¡Hola! 👋',
  'sobre-mi': 'Sobre Erick 📖',
  habilidades: 'Skills ⚡',
  proyectos: 'Proyectos 🚀',
  contacto: '¡Hablemos! 💬'
};



yearTag.textContent = new Date().getFullYear();

// Scroll Progress Indicator
const scrollProgress = document.querySelector('.scroll-progress');
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  if (scrollProgress) {
    scrollProgress.style.width = scrollPercent + '%';
  }

  // Navbar glassmorphism effect
  if (nav) {
    if (scrollTop > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
}, { passive: true });

if (catContainer) {
  const catImageSrc = catContainer.dataset.catSrc;
  if (catImageSrc) {
    const catIllustration = new Image();
    catIllustration.alt = 'Ilustración de Rorschach, el gato guía felino.';
    catIllustration.loading = 'lazy';
    catIllustration.decoding = 'async';
    catIllustration.addEventListener('load', () => {
      catContainer.dataset.loaded = 'true';
      catContainer.appendChild(catIllustration);
      catGuide.classList.add('cat-ready');
    });
    catIllustration.addEventListener('error', () => {
      catGuide.classList.add('cat-image-missing');
      if (catMessage) {
        catMessage.textContent = 'Añade la ilustración del gatito en assets/cat-companion.png para verlo aquí.';
      }
    });
    catIllustration.src = catImageSrc;
  }
}

if (window.fetch) {
  const mouseCursorSrc = document.body.dataset.mouseCursor || '/assets/mouse-cursor.svg';
  fetch(mouseCursorSrc, { method: 'HEAD' })
    .then((response) => {
      if (response.ok) {
        document.documentElement.style.setProperty('--mouse-cursor', `url("${mouseCursorSrc}") 6 2, auto`);
        document.documentElement.style.setProperty('--mouse-cursor-interactive', `url("${mouseCursorSrc}") 6 2, pointer`);
      }
    })
    .catch(() => {});
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const isMobile = window.innerWidth <= 900;
      const message = isMobile ? messagesMobile[id] : messages[id];
      if (message && !catGuide.classList.contains('cat-image-missing')) {
        catGuide.classList.add('is-speaking');
        catMessage.textContent = message;
        setTimeout(() => catGuide.classList.remove('is-speaking'), 1500);
      }
      entry.target.classList.add('is-visible');
    }
  });
}, {
  threshold: 0.35
});

sections.forEach((section) => observer.observe(section));

if (window.gsap) {
  gsap.to('.cat', {
    y: -8,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.from('.cat-dialog', {
    opacity: 0,
    y: 12,
    duration: 1,
    ease: 'power2.out'
  });
}

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const floatOffset = Math.sin(scrollY / 240) * 6;
  if (window.gsap) {
    gsap.to(catGuide, { y: floatOffset, duration: 0.4, overwrite: 'auto' });
  } else {
    catGuide.style.transform = `translateY(${floatOffset}px)`;
  }
});

/* ===== Starfield + Constelaciones (Canvas) ===== */
(() => {

    // --- Shooting Stars ---
  let trails = [];
  const TRAIL_EVERY_MS = 3500; // frecuencia
  const TRAIL_LIFE = 1400;     // vida en ms

  function spawnTrail(){
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const y = rand(h*0.1, h*0.9);
    const speed = rand(0.7, 1.2) * dpr;
    const len = rand(120, 220) * dpr;
    const thickness = rand(1.0, 1.8) * dpr;

    trails.push({
      t0: performance.now(),
      x: side === 'left' ? -50 * dpr : w + 50 * dpr,
      y,
      vx: side === 'left' ? speed * 0.9 : -speed * 0.9,
      vy: rand(-0.15, 0.15) * speed,
      len, thickness
    });
  }

  setInterval(() => {
    if (!paused && Math.random() < 0.7) spawnTrail();
  }, TRAIL_EVERY_MS);

  // --- Cat Asteroids ---
  let catAsteroids = [];
  const CAT_ASTEROID_EVERY_MS = 4500; // frecuencia
  const CAT_ASTEROID_LIFE = 3000;     // vida en ms
  const catAsteroidImg = new Image();
  catAsteroidImg.src = '/assets/cat-astronaut.png';

  function spawnCatAsteroid(){
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const y = rand(h*0.15, h*0.85);
    const speed = rand(0.4, 0.8) * dpr;
    const size = rand(32, 50) * dpr;
    const rotation = rand(0, Math.PI * 2);
    const rotationSpeed = rand(-0.08, 0.08);

    catAsteroids.push({
      t0: performance.now(),
      x: side === 'left' ? -size - 20 * dpr : w + size + 20 * dpr,
      y,
      vx: side === 'left' ? speed : -speed,
      vy: rand(-0.1, 0.1) * speed,
      size,
      rotation,
      rotationSpeed
    });
  }

  setInterval(() => {
    if (!paused && Math.random() < 0.5 && catAsteroidImg.complete) spawnCatAsteroid();
  }, CAT_ASTEROID_EVERY_MS);

  const canvas = document.getElementById('bg-stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let w = 0, h = 0, dpr = 1;
  let stars = [];
  let rafId = null;

  // Config
  const STAR_COUNT_BASE = 140;      // cantidad base de estrellas
  const LINK_DIST = 150;            // distancia máxima para “constelar” (px @ scale 1)
  const MAX_R = 1.8;                // radio máximo de estrella (px @ scale 1)
  const PARALLAX_X = 12;            // amplitud parallax X
  const PARALLAX_Y = 8;             // amplitud parallax Y
  const BG_GLOW = true;             // glow sutil de fondo
  const MOTION_SPEED = 0.015;       // velocidad global de movimiento

    // --- Parallax inputs ---
  let parallaxMouse = { x: 0, y: 0 };  // -1..1
  let scrollYNorm = 0;                  // 0..1 aprox

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;  // -1..1
    const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1 (arriba=-1)
    parallaxMouse.x = nx;
    parallaxMouse.y = ny;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    scrollYNorm = window.scrollY / max; // 0..1
  }, { passive: true });

  // Maneja DPR + resize
  const fit = () => {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    w = Math.floor(vw * dpr);
    h = Math.floor(vh * dpr);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
    generateStars();
  };

  // util
  const rand = (a, b) => a + Math.random() * (b - a);

  function generateStars() {
    const count = Math.round(STAR_COUNT_BASE * Math.min(1.2, Math.max(0.75, (window.innerWidth / 1280))));
    stars = Array.from({ length: count }).map(() => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.4, MAX_R) * dpr,
      z: rand(0.3, 1.5),               // “profundidad” para parallax
      tw: rand(0.75, 1.25),            // factor de twinkle
      phase: rand(0, Math.PI * 2)      // fase para variación
    }));
  }

  let t = 0;
  function draw() {
    t += MOTION_SPEED;

    // Limpia
    ctx.clearRect(0, 0, w, h);

    // Glow sutil de fondo
    if (BG_GLOW) {
      const g = ctx.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.5, h * 0.6, Math.max(w, h) * 0.7);
      g.addColorStop(0, 'rgba(155, 94, 255, 0.08)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // Estrellas
    for (const s of stars) {
      const mouseAmpX = PARALLAX_X * 0.7 * parallaxMouse.x;
      const mouseAmpY = PARALLAX_Y * 0.7 * parallaxMouse.y;
      const scrollAmpY = 20 * scrollYNorm; // leve desplazamiento vertical

      const sx = s.x + (Math.sin(t * 0.6 + s.phase) * PARALLAX_X + mouseAmpX) * s.z;
      const sy = s.y + (Math.cos(t * 0.5 + s.phase) * PARALLAX_Y + mouseAmpY + scrollAmpY) * s.z;

      const twAlpha = 0.75 + Math.sin(t * 2 * s.tw + s.phase) * 0.25; // 0.5..1
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,240,255,${0.85 * twAlpha})`;
      ctx.fill();
    }

    // Líneas “constelación” entre puntos cercanos (con coste controlado)
    ctx.lineWidth = 0.6 * dpr;
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        // Limita comparaciones para rendimiento (salteo simple)
        if ((j - i) > 45) break;

        const b = stars[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST * dpr) {
          const alpha = 1 - (dist / (LINK_DIST * dpr));
          ctx.strokeStyle = `rgba(0,212,255,${0.08 * alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Dibujar trails (meteoros)
    const now = performance.now();
    trails = trails.filter(tr => (now - tr.t0) < TRAIL_LIFE);
    for (const tr of trails){
      const life = (now - tr.t0) / TRAIL_LIFE;         // 0..1
      const fade = 1 - life;
      tr.x += tr.vx * 12;
      tr.y += tr.vy * 12;

      ctx.strokeStyle = `rgba(230,240,255,${0.25 * fade})`;
      ctx.lineWidth = tr.thickness;
      ctx.beginPath();
      ctx.moveTo(tr.x, tr.y);
      ctx.lineTo(tr.x - tr.vx * tr.len, tr.y - tr.vy * tr.len);
      ctx.stroke();
    }

    // Dibujar gatos asteroides
    catAsteroids = catAsteroids.filter(cat => (now - cat.t0) < CAT_ASTEROID_LIFE);
    for (const cat of catAsteroids){
      const life = (now - cat.t0) / CAT_ASTEROID_LIFE; // 0..1
      const fade = 1 - life;
      cat.x += cat.vx * 8;
      cat.y += cat.vy * 8;
      cat.rotation += cat.rotationSpeed;

      ctx.save();
      ctx.globalAlpha = 0.7 * fade;
      ctx.translate(cat.x, cat.y);
      ctx.rotate(cat.rotation);
      ctx.drawImage(catAsteroidImg, -cat.size / 2, -cat.size / 2, cat.size, cat.size);
      ctx.restore();
    }

    rafId = requestAnimationFrame(draw);
  }

  // Respeta prefers-reduced-motion
  const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = mediaMotion.matches;
  function start() {
    if (!paused && rafId == null) rafId = requestAnimationFrame(draw);
  }
  function stop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  }
  mediaMotion.addEventListener?.('change', (e) => {
    paused = e.matches;
    paused ? stop() : start();
  });

  // Resize con debounce
  let resizeTid = null;
  window.addEventListener('resize', () => {
    stop();
    clearTimeout(resizeTid);
    resizeTid = setTimeout(() => {
      fit();
      paused ? stop() : start();
    }, 120);
  }, { passive: true });

  // Init
  fit();
  paused ? stop() : start();
})();

/* === Mejora planeta/anillos/luna === */
(function(){
  if (!window.gsap) return;

    // Baseline para que GSAP tenga valores numéricos desde el inicio (evita el error)
    gsap.set('.orbit', { rotateX: 58, rotateY: 0, rotateZ: -20, transformOrigin: '50% 50%' });
    gsap.set('.ring, .ring-front, .ring-back', { rotateX: 62, rotateY: 0 });

    // ---- Spin orbital con orientación sincronizada del gato ----
    const orbitEl = document.querySelector('.orbit');

    const orbitSpin = gsap.to('.orbit', {
      rotation: 360,
      duration: 18,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
      onUpdate() {
        const r = gsap.getProperty(orbitEl, 'rotation'); // grados actuales
        orbitEl.style.setProperty('--orbit-rot', r + 'deg');
      }
    });
  // Parallax y dirección de luz con el mouse
  const hv = document.querySelector('.hero-visual');
  if (!hv) return;

  const setLight = (lx, ly) => {
    // Actualiza la “luz” en planeta y luna
    document.querySelectorAll('.planet, .satellite').forEach(el => {
      el.style.setProperty('--lx', lx + '%');
      el.style.setProperty('--ly', ly + '%');
    });
  };

  // Posición inicial de la luz
  setLight(30, 35);

  // Los anillos ahora permanecen estáticos para evitar efecto de "rodado"
  // gsap.to('.ring, .ring-back, .ring-front', { rotation: '+=360', duration: 35, ease: 'none', repeat: -1 });

  // Parallax suave del mouse (sin quickTo para evitar errores)
  let _rafMouse = null;
  hv.addEventListener('mousemove', (e) => {
    if (_rafMouse) return; // Throttle
    _rafMouse = requestAnimationFrame(() => {
      const rect = hv.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;   // 0..1
      const ny = (e.clientY - rect.top) / rect.height;   // 0..1

      // Actualizar luz
      const lx = 25 + nx * 50;
      const ly = 28 + ny * 44;
      setLight(lx, ly);

      _rafMouse = null;
    });
  });

  // Seguridad por accesibilidad
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    gsap.globalTimeline.timeScale(0.6);
  }
})();