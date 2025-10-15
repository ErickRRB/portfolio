/**
 * Starfield canvas animation with parallax, shooting stars, and cat asteroids
 */

import { DeviceDetect } from '../utils/device-detect.js';

export function initStarfield() {
  const canvas = document.getElementById('bg-stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  let w = 0, h = 0, dpr = 1;
  let stars = [];
  let trails = [];
  let catAsteroids = [];
  let rafId = null;
  let paused = false;

  // Config - adjusted based on device
  const getConfig = () => {
    const isMobile = DeviceDetect.isMobile();
    const reducedMotion = DeviceDetect.prefersReducedMotion();

    return {
      STAR_COUNT_BASE: isMobile ? 100 : 140,
      LINK_DIST: isMobile ? 120 : 150,
      MAX_R: 1.8,
      PARALLAX_X: isMobile ? 8 : 12,
      PARALLAX_Y: isMobile ? 5 : 8,
      BG_GLOW: !reducedMotion,
      MOTION_SPEED: isMobile ? 0.01 : 0.015,
      ENABLE_TRAILS: !isMobile && !reducedMotion, // Disable trails on mobile only
      ENABLE_CAT_ASTEROIDS: !isMobile && !reducedMotion // Disable cat asteroids on mobile only
    };
  };

  let config = getConfig();

  // Shooting Stars
  const TRAIL_EVERY_MS = 3500;
  const TRAIL_LIFE = 1400;

  function spawnTrail() {
    if (!config.ENABLE_TRAILS) return;

    const side = Math.random() < 0.5 ? 'left' : 'right';
    const y = rand(h * 0.1, h * 0.9);
    const speed = rand(0.7, 1.2) * dpr;
    const len = rand(120, 220) * dpr;
    const thickness = rand(1.0, 1.8) * dpr;

    trails.push({
      t0: performance.now(),
      x: side === 'left' ? -50 * dpr : w + 50 * dpr,
      y,
      vx: side === 'left' ? speed * 0.9 : -speed * 0.9,
      vy: rand(-0.15, 0.15) * speed,
      len,
      thickness
    });
  }

  const trailInterval = setInterval(() => {
    if (!paused && Math.random() < 0.7) spawnTrail();
  }, TRAIL_EVERY_MS);

  // Cat Asteroids
  const CAT_ASTEROID_EVERY_MS = 4500;
  const CAT_ASTEROID_LIFE = 3000;
  const catAsteroidImg = new Image();
  catAsteroidImg.src = '/assets/cat-astronaut.png';

  function spawnCatAsteroid() {
    if (!config.ENABLE_CAT_ASTEROIDS || !catAsteroidImg.complete) return;

    const side = Math.random() < 0.5 ? 'left' : 'right';
    const y = rand(h * 0.15, h * 0.85);
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

  const catInterval = setInterval(() => {
    if (!paused && Math.random() < 0.5) spawnCatAsteroid();
  }, CAT_ASTEROID_EVERY_MS);

  // Parallax inputs
  let parallaxMouse = { x: 0, y: 0 };
  let scrollYNorm = 0;

  window.addEventListener('mousemove', (e) => {
    if (DeviceDetect.isMobile()) return; // Skip on mobile for performance

    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    parallaxMouse.x = nx;
    parallaxMouse.y = ny;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    scrollYNorm = window.scrollY / max;
  }, { passive: true });

  // Fit canvas to viewport
  const fit = () => {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    // Reduce DPR on mobile for better performance
    if (DeviceDetect.isMobile()) {
      dpr = Math.min(dpr, 1.5);
    }

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

  const rand = (a, b) => a + Math.random() * (b - a);

  function generateStars() {
    const count = Math.round(config.STAR_COUNT_BASE * Math.min(1.2, Math.max(0.75, (window.innerWidth / 1280))));
    stars = Array.from({ length: count }).map(() => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.4, config.MAX_R) * dpr,
      z: rand(0.3, 1.5),
      tw: rand(0.75, 1.25),
      phase: rand(0, Math.PI * 2)
    }));
  }

  let t = 0;

  function draw() {
    t += config.MOTION_SPEED;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background glow
    if (config.BG_GLOW) {
      const g = ctx.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.5, h * 0.6, Math.max(w, h) * 0.7);
      g.addColorStop(0, 'rgba(155, 94, 255, 0.08)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // Stars
    for (const s of stars) {
      const mouseAmpX = config.PARALLAX_X * 0.7 * parallaxMouse.x;
      const mouseAmpY = config.PARALLAX_Y * 0.7 * parallaxMouse.y;
      const scrollAmpY = 20 * scrollYNorm;

      const sx = s.x + (Math.sin(t * 0.6 + s.phase) * config.PARALLAX_X + mouseAmpX) * s.z;
      const sy = s.y + (Math.cos(t * 0.5 + s.phase) * config.PARALLAX_Y + mouseAmpY + scrollAmpY) * s.z;

      const twAlpha = 0.75 + Math.sin(t * 2 * s.tw + s.phase) * 0.25;
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,240,255,${0.85 * twAlpha})`;
      ctx.fill();
    }

    // Constellation lines
    ctx.lineWidth = 0.6 * dpr;
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        if ((j - i) > 45) break;

        const b = stars[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.LINK_DIST * dpr) {
          const alpha = 1 - (dist / (config.LINK_DIST * dpr));
          ctx.strokeStyle = `rgba(0,212,255,${0.08 * alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Shooting stars
    if (config.ENABLE_TRAILS) {
      const now = performance.now();
      trails = trails.filter(tr => (now - tr.t0) < TRAIL_LIFE);
      for (const tr of trails) {
        const life = (now - tr.t0) / TRAIL_LIFE;
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
    }

    // Cat asteroids
    if (config.ENABLE_CAT_ASTEROIDS) {
      const now = performance.now();
      catAsteroids = catAsteroids.filter(cat => (now - cat.t0) < CAT_ASTEROID_LIFE);
      for (const cat of catAsteroids) {
        const life = (now - cat.t0) / CAT_ASTEROID_LIFE;
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
    }

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (!paused && rafId == null) {
      rafId = requestAnimationFrame(draw);
    }
  }

  function stop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Handle reduced motion preference - only pause if user explicitly prefers reduced motion
  const updateMotionPreference = () => {
    paused = DeviceDetect.prefersReducedMotion();
    config = getConfig(); // Update config based on new preference

    if (paused) {
      stop();
    } else {
      start();
    }
  };

  DeviceDetect.onReducedMotionChange(updateMotionPreference);
  updateMotionPreference();

  // Resize with debounce
  let resizeTid = null;
  window.addEventListener('resize', () => {
    stop();
    clearTimeout(resizeTid);
    resizeTid = setTimeout(() => {
      config = getConfig(); // Update config on resize
      fit();
      if (!paused) start();
    }, 120);
  }, { passive: true });

  // Initialize
  fit();
  if (!paused) start();

  // Cleanup
  return () => {
    stop();
    clearInterval(trailInterval);
    clearInterval(catInterval);
  };
}
