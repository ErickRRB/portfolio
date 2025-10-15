const sections = document.querySelectorAll('section');
const catMessage = document.getElementById('catMessage');
const catGuide = document.querySelector('.cat-guide');
const yearTag = document.getElementById('year');

const messages = {
  inicio: '¡Bienvenido! Soy tu guía gatuna. Sigue bajando.',
  'sobre-mi': 'Aquí conocerás mi historia y motivaciones.',
  habilidades: 'Estas son mis habilidades favoritas para crear magia.',
  proyectos: 'Mira lo que he construido entre siestas y teclados.',
  contacto: '¿Colaboramos? Miau-mándame un mensaje.'
};

yearTag.textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const message = messages[id];
      if (message) {
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

const catEyes = document.querySelectorAll('.cat-eye');

document.addEventListener('pointermove', (event) => {
  const { clientX, clientY } = event;
  catEyes.forEach((eye) => {
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - eyeCenterY, clientX - eyeCenterX);
    const offsetX = Math.cos(angle) * 4;
    const offsetY = Math.sin(angle) * 4;
    eye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  catGuide.style.transform = `translateY(${Math.sin(scrollY / 200) * 10}px)`;
});
