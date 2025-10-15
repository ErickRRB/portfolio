/**
 * Scroll-based effects: progress bar and navbar glassmorphism
 */

export function initScrollEffects() {
  const scrollProgress = document.querySelector('.scroll-progress');
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // Update scroll progress bar
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
}
