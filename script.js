document.addEventListener('DOMContentLoaded', () => {
  // 0) Lenis para smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical'
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 1) Conectar Lenis con ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length
        ? lenis.scrollTo(value, { immediate: true })
        : lenis.scroll.instance.scroll.y; // 👈 FIX REAL AQUÍ
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });
  ScrollTrigger.addEventListener('refresh', () => lenis.update());
  ScrollTrigger.refresh();

  // 2) Animación de entrada (Hero, Navbar, Botón)
  const logo      = document.querySelector('.navbar .logo');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const heroTitle = document.querySelector('.hero-content h1');
  const heroText  = document.querySelector('.hero-content p');
  const heroBtn   = document.querySelector('.btn');
  const navbar    = document.querySelector('.navbar');

  const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });
  tl.from(logo,      { y: -50, opacity: 0, duration: 0.6 })
    .from(navLinks,  { y: -30, opacity: 0, duration: 0.6, stagger: 0.2 }, '-=0.4')
    .from(heroTitle, { y:  50, opacity: 0, duration: 0.8 }, '-=0.5')
    .from(heroText,  { y:  50, opacity: 0, duration: 0.8 }, '-=0.6')
    .from(heroBtn,   { scale: 0.8, opacity: 0, duration: 0.8 }, '-=0.6');

  // 3) Navbar: cambia fondo al hacer scroll
  window.addEventListener('scroll', () => {
    const solidBg = 'rgba(245,240,225,1)';
    const transpBg = 'rgba(245,240,225,0.8)';
    gsap.to(navbar, {
      backgroundColor: window.scrollY > 50 ? solidBg : transpBg,
      duration: 0.3
    });
  });

  // 4) Hover en botón principal
  heroBtn.addEventListener('mouseenter', () => {
    gsap.to(heroBtn, { scale: 1.05, duration: 0.2 });
  });
  heroBtn.addEventListener('mouseleave', () => {
    gsap.to(heroBtn, { scale: 1, duration: 0.2 });
  });

  // 5) Menú hamburguesa móvil
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // 6) Animación on-scroll de Features
  gsap.utils.toArray('.feature-card').forEach(card => {
    gsap.fromTo(card,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power1.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 7) Carrusel Testimonios con scroll-snap
  const container = document.querySelector('.testimonials-container');
  const cards     = Array.from(document.querySelectorAll('.testimonial-card'));
  const prevBtn   = document.querySelector('.testimonial-arrow.prev');
  const nextBtn   = document.querySelector('.testimonial-arrow.next');
  let index = 0;

  if (cards.length > 0) {
    const style  = getComputedStyle(cards[0]);
    const mL     = parseFloat(style.marginLeft);
    const mR     = parseFloat(style.marginRight);
    const slideW = cards[0].offsetWidth + mL + mR;

    prevBtn.addEventListener('click', () => {
      index = Math.max(index - 1, 0);
      container.scrollTo({ left: index * slideW, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      index = Math.min(index + 1, cards.length - 1);
      container.scrollTo({ left: index * slideW, behavior: 'smooth' });
    });

    // Animación on-scroll de testimonios
    cards.forEach(card => {
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power1.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // 8) FAQ con acordeones animados
  document.querySelectorAll('.faq-item').forEach(item => {
    const q   = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open);
      if (open) {
        const h = ans.scrollHeight;
        gsap.to(ans, { height: h, opacity: 1, duration: 0.3, ease: 'power1.out' });
      } else {
        gsap.to(ans, { height: 0, opacity: 0, duration: 0.3, ease: 'power1.out' });
      }
    });
  });

  // 9) Forzar refresh para asegurar disparo de ScrollTrigger
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
});
