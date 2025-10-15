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



yearTag.textContent = new Date().getFullYear();

if (catContainer) {
  const catImageSrc = catContainer.dataset.catSrc;
  console.log('Cat image src:', catImageSrc);
  if (catImageSrc) {
    const catIllustration = new Image();
    catIllustration.alt = 'Ilustración de Rorschach, el gato guía felino.';
    catIllustration.loading = 'lazy';
    catIllustration.decoding = 'async';
    catIllustration.addEventListener('load', () => {
      console.log('✓ Cat image loaded successfully!');
      catContainer.dataset.loaded = 'true';
      catContainer.appendChild(catIllustration);
      catGuide.classList.add('cat-ready');
    });
    catIllustration.addEventListener('error', (e) => {
      console.error('✗ Error loading cat image:', e);
      catGuide.classList.add('cat-image-missing');
      if (catMessage) {
        catMessage.textContent = 'Añade la ilustración del gatito en assets/cat-companion.png para verlo aquí.';
      }
    });
    catIllustration.src = catImageSrc;
  }
} else {
  console.error('Cat container not found!');
}

if (window.fetch) {
  const mouseCursorSrc = document.body.dataset.mouseCursor || 'assets/mouse-cursor.svg';
  console.log('Mouse cursor src:', mouseCursorSrc);
  fetch(mouseCursorSrc, { method: 'HEAD' })
    .then((response) => {
      if (response.ok) {
        console.log('✓ Cursor SVG loaded successfully!');
        document.documentElement.style.setProperty('--mouse-cursor', `url("${mouseCursorSrc}") 6 2, auto`);
        document.documentElement.style.setProperty('--mouse-cursor-interactive', `url("${mouseCursorSrc}") 6 2, pointer`);
      } else {
        console.error('✗ Cursor SVG not found (status:', response.status, ')');
      }
    })
    .catch((e) => {
      console.error('✗ Error loading cursor:', e);
    });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const message = messages[id];
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
    gsap.to(catGuide, { y: floatOffset, duration: 0.4, overwrite: true });
  } else {
    catGuide.style.transform = `translateY(${floatOffset}px)`;
  }
});
