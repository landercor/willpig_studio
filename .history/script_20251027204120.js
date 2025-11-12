document.addEventListener('DOMContentLoaded', () => {
  // Carrusel principal
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  if (nextBtn && prevBtn && slides.length > 0) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    showSlide(currentSlide); // Mostrar la primera slide al cargar
  }

  // Scroll horizontal con botones (requiere estructura con .scroll-wrapper y botones .scroll-btn)
  const scrollWrappers = document.querySelectorAll('.scroll-wrapper');
  scrollWrappers.forEach(wrapper => {
    const container = wrapper.querySelector('.scroll-container');
    const leftBtn = wrapper.querySelector('.scroll-btn.left');
    const rightBtn = wrapper.querySelector('.scroll-btn.right');

    if (leftBtn && rightBtn && container) {
      leftBtn.addEventListener('click', () => {
        container.scrollBy({ left: -250, behavior: 'smooth' });
      });

      rightBtn.addEventListener('click', () => {
        container.scrollBy({ left: 250, behavior: 'smooth' });
      });
    }
  });
});