document.addEventListener('DOMContentLoaded', () => {
  // 🌙 Modo oscuro
  const themeToggle = document.getElementById('theme-bntoggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  // 🎠 Carrusel
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  if (slides.length > 0 && prevBtn && nextBtn) {
    showSlide(currentSlide);

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
  }

  // 📜 Scroll horizontal (opcional si agregas botones)
  const scrollWrappers = document.querySelectorAll('.scroll-wrapper');
  scrollWrappers.forEach(wrapper => {
    const container = wrapper.querySelector('.scroll-container');
    const leftBtn = wrapper.querySelector('.scroll-btn.left');
    const rightBtn = wrapper.querySelector('.scroll-btn.right');

    if (container && leftBtn && rightBtn) {
      leftBtn.addEventListener('click', () => {
        container.scrollBy({ left: -250, behavior: 'smooth' });
      });

      rightBtn.addEventListener('click', () => {
        container.scrollBy({ left: 250, behavior: 'smooth' });
      });
    }
  });
});