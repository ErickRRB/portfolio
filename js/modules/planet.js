/**
 * Planet and satellite 3D animations with performance optimizations
 */

import { DeviceDetect } from '../utils/device-detect.js';

export function initPlanet() {
  if (!window.gsap) return;

  const shouldReduce = DeviceDetect.shouldReduceAnimations();

  // Baseline transforms to avoid GSAP errors
  gsap.set('.orbit', {
    rotateX: 58,
    rotateY: 0,
    rotateZ: -20,
    transformOrigin: '50% 50%'
  });
  gsap.set('.ring, .ring-front, .ring-back', {
    rotateX: 62,
    rotateY: 0
  });

  // Orbital spin with synchronized cat orientation
  const orbitEl = document.querySelector('.orbit');
  if (!orbitEl) return;

  // Reduce or disable animations on mobile/iOS
  const orbitDuration = shouldReduce ? 30 : 18;
  const enableMouseParallax = !DeviceDetect.isMobile();

  const orbitSpin = gsap.to('.orbit', {
    rotation: 360,
    duration: orbitDuration,
    ease: 'none',
    repeat: -1,
    transformOrigin: '50% 50%',
    paused: shouldReduce, // Pause on reduced motion
    onUpdate() {
      const r = gsap.getProperty(orbitEl, 'rotation');
      orbitEl.style.setProperty('--orbit-rot', r + 'deg');
    }
  });

  // Mouse parallax and lighting (desktop only)
  if (enableMouseParallax) {
    const hv = document.querySelector('.hero-visual');
    if (!hv) return;

    const setLight = (lx, ly) => {
      document.querySelectorAll('.planet, .satellite').forEach(el => {
        el.style.setProperty('--lx', lx + '%');
        el.style.setProperty('--ly', ly + '%');
      });
    };

    // Initial light position
    setLight(30, 35);

    // Throttled mouse parallax
    let rafMouse = null;
    hv.addEventListener('mousemove', (e) => {
      if (rafMouse) return;
      rafMouse = requestAnimationFrame(() => {
        const rect = hv.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;

        const lx = 25 + nx * 50;
        const ly = 28 + ny * 44;
        setLight(lx, ly);

        rafMouse = null;
      });
    }, { passive: true });
  }

  // Respect reduced motion globally
  if (shouldReduce) {
    gsap.globalTimeline.timeScale(0.3); // Slow down all animations significantly
  }
}
