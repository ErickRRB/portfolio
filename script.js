const sections = document.querySelectorAll('section');
const catMessage = document.getElementById('catMessage');
const catGuide = document.querySelector('.cat-guide');
const yearTag = document.getElementById('year');

const messages = {
  inicio: '¡Bienvenido! Soy Rorschach, tu guía felino nocturno. Sigue bajando.',
  'sobre-mi': 'Aquí te cuento parte de la historia de Erick, yo lo acompaño en cada línea de código.',
  habilidades: 'Estas son las habilidades favoritas de mi humano para crear magia.',
  proyectos: 'Mira lo que hemos construido entre siestas y teclados.',
  'cat-art': '¿Te gusta esta ilustración? La soñé con ayuda de IA para que me veas como un gatito negro elegante.',
  contacto: '¿Colaboramos? Miau-mándame un mensaje y se lo llevo a Erick.'
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

if (window.gsap) {
  gsap.to('.cat', {
    y: -8,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.cat-tail', {
    rotate: 16,
    transformOrigin: 'top left',
    duration: 1.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.cat-eye-sparkle', {
    opacity: 0.3,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    stagger: 0.2,
    ease: 'sine.inOut'
  });

  gsap.from('.cat-dialog', {
    opacity: 0,
    y: 12,
    duration: 1,
    ease: 'power2.out'
  });
}

const catPupils = document.querySelectorAll('.cat-eye-pupil');

document.addEventListener('pointermove', (event) => {
  const { clientX, clientY } = event;
  catPupils.forEach((pupil) => {
    const eye = pupil.parentElement;
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - eyeCenterY, clientX - eyeCenterX);
    const offsetX = Math.cos(angle) * 6;
    const offsetY = Math.sin(angle) * 6;
    pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const floatOffset = Math.sin(scrollY / 240) * 6;
  if (window.gsap) {
    gsap.to(catGuide, { y: floatOffset, duration: 0.4, overwrite: true });
  } else {
    catGuide.style.transform = `translateY(${floatOffset}px)`;
  }
});
