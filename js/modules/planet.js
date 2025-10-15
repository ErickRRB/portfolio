/**
 * Planet and satellite 3D animations with performance optimizations
 */

import { DeviceDetect } from '../utils/device-detect.js';

export function initPlanet() {
  if (!window.gsap) return;

  const isMobile = DeviceDetect.isMobile();
  const reducedMotion = DeviceDetect.prefersReducedMotion();

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
  const catBody = document.querySelector('.sat-body');
  if (!orbitEl || !catBody) return;

  // Random starting position for orbit (0-360 degrees)
  const randomStartAngle = Math.random() * 360;
  gsap.set('.orbit', { rotation: randomStartAngle });

  // Random tumbling speeds for the cat
  const tumbleSpeedX = 3 + Math.random() * 4; // 3-7 seconds
  const tumbleSpeedY = 4 + Math.random() * 5; // 4-9 seconds
  const tumbleSpeedZ = 5 + Math.random() * 6; // 5-11 seconds

  // Slow down animations on mobile but keep them running
  const orbitDuration = isMobile ? 24 : 18;
  const enableMouseParallax = !isMobile;

  const orbitSpin = gsap.to('.orbit', {
    rotation: randomStartAngle + 360,
    duration: orbitDuration,
    ease: 'none',
    repeat: -1,
    transformOrigin: '50% 50%',
    onUpdate() {
      const r = gsap.getProperty(orbitEl, 'rotation');
      orbitEl.style.setProperty('--orbit-rot', r + 'deg');
    }
  });

  // Cat tumbling animation - rotates freely in all axes (unless reduced motion)
  if (!reducedMotion) {
    gsap.to('.sat-body', {
      rotationX: 360,
      duration: tumbleSpeedX * (isMobile ? 1.5 : 1), // Slower on mobile
      ease: 'none',
      repeat: -1
    });

    gsap.to('.sat-body', {
      rotationY: 360,
      duration: tumbleSpeedY * (isMobile ? 1.5 : 1),
      ease: 'none',
      repeat: -1
    });

    gsap.to('.sat-body', {
      rotationZ: 360,
      duration: tumbleSpeedZ * (isMobile ? 1.5 : 1),
      ease: 'none',
      repeat: -1
    });
  }

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

  // Respect reduced motion globally - only for actual reduced motion preference, not mobile
  if (reducedMotion) {
    gsap.globalTimeline.timeScale(0.5); // Slow down for accessibility
  } else if (isMobile) {
    gsap.globalTimeline.timeScale(0.85); // Slightly slower on mobile for performance
  }
}
