/**
 * Cat guide companion with section-based messages
 */

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

export function initCatGuide() {
  const catMessage = document.getElementById('catMessage');
  const catGuide = document.querySelector('.cat-guide');
  const catContainer = document.querySelector('.cat');
  const sections = document.querySelectorAll('section');

  if (!catContainer || !catMessage || !catGuide) return;

  // Load cat image with iOS Safari optimizations
  loadCatImage(catContainer, catGuide, catMessage);

  // Setup section observer for messages
  setupSectionObserver(sections, catGuide, catMessage);

  // Setup floating animation
  setupFloatingAnimation(catGuide);
}

function loadCatImage(catContainer, catGuide, catMessage) {
  const catImageSrc = catContainer.dataset.catSrc;
  if (!catImageSrc) return;

  const catIllustration = new Image();
  catIllustration.alt = 'Ilustración de Rorschach, el gato guía felino.';

  // Safari iOS fix: eager loading
  if ('loading' in HTMLImageElement.prototype) {
    catIllustration.loading = 'eager';
  }
  catIllustration.decoding = 'async';

  catIllustration.addEventListener('load', () => {
    catContainer.dataset.loaded = 'true';
    catContainer.appendChild(catIllustration);
    catGuide.classList.add('cat-ready');
    // Force reflow for iOS
    void catIllustration.offsetWidth;
  });

  catIllustration.addEventListener('error', (e) => {
    console.error('Error loading cat image:', e);
    catGuide.classList.add('cat-image-missing');
    if (catMessage) {
      catMessage.textContent = 'Error cargando imagen';
    }
  });

  // iOS Safari fix: set src after all listeners
  setTimeout(() => {
    catIllustration.src = catImageSrc;
  }, 100);
}

function setupSectionObserver(sections, catGuide, catMessage) {
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
}

function setupFloatingAnimation(catGuide) {
  // Gentle floating animation on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const floatOffset = Math.sin(scrollY / 240) * 6;

    if (window.gsap) {
      gsap.to(catGuide, { y: floatOffset, duration: 0.4, overwrite: 'auto' });
    } else {
      catGuide.style.transform = `translateY(${floatOffset}px)`;
    }
  }, { passive: true });

  // GSAP animations if available
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
}
