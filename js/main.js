/**
 * ALMADA GASTROBAR - MOBILE INTERACTIVE SCRIPTS
 * Seamless Infinite Carousel, Category Filtering, and WhatsApp Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- REAL DATA SET (PRATOS & DRINKS) ---
  const menuData = {
    pratos: [
      { image: 'assets/images/carne.jpeg', alt: 'Picanha na chapa com queijo coalho e mandioca' },
      { image: 'assets/images/churrasco.jpeg', alt: 'Picanha fatiada com batatas rústicas' },
      { image: 'assets/images/churras.jpeg', alt: 'Churrasco com batatas fritas e linguiça' },
      { image: 'assets/images/churrasco com banana empanada.jpeg', alt: 'Churrasco com arroz e banana empanada' },
      { image: 'assets/images/arroz.jpeg', alt: 'Prato nobre com arroz de brócolis e carne' },
      { image: 'assets/images/fritos.jpeg', alt: 'Camarões crocantes empanados' },
      { image: 'assets/images/salada.jpeg', alt: 'Burrata ao pesto especial com tomates confit' },
      { image: 'assets/images/parmegina.jpeg', alt: 'Parmegiana gratinada no forno' }
    ],
    drinks: [
      { image: 'assets/images/drink1.jpeg', alt: 'Gin Tônica artesanal com especiarias' },
      { image: 'assets/images/drink2.jpeg', alt: 'Drink tropical de maracujá' },
      { image: 'assets/images/drink3.jpeg', alt: 'Cocktail autoral Almada com espuma' },
      { image: 'assets/images/drink4.jpeg', alt: 'Caipirinha especial de frutas' },
      { image: 'assets/images/drink6.jpeg', alt: 'Aperol Spritz refrescante com laranja' },
      { image: 'assets/images/drink8.jpeg', alt: 'Whiskey cocktail defumado premium' },
      { image: 'assets/images/chop.jpeg', alt: 'Chopp artesanal gelado com colarinho' }
    ]
  };

  const carouselViewport = document.getElementById('carousel-viewport');
  const tabButtons = document.querySelectorAll('.tab-btn');
  let currentCategory = 'pratos';
  let itemPitch = 147; // 135px width + 12px gap
  let isSilentShifting = false;

  // Render carousel with cloned sets for true seamless infinite scrolling
  function renderCarousel(category) {
    if (!carouselViewport) return;
    currentCategory = category;
    const baseItems = menuData[category] || menuData.pratos;

    // Smooth transition
    carouselViewport.style.opacity = '0';
    carouselViewport.style.transform = 'translateY(4px)';
    carouselViewport.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    setTimeout(() => {
      // 3 duplicate sets: [Set 1, Set 2 (middle active), Set 3]
      const tripleItems = [...baseItems, ...baseItems, ...baseItems];
      carouselViewport.innerHTML = tripleItems.map(item => `
        <article class="dish-card">
          <img src="${item.image}" alt="${item.alt}" loading="lazy">
        </article>
      `).join('');

      // Measure exact item pitch dynamically
      const firstCard = carouselViewport.querySelector('.dish-card');
      if (firstCard) {
        itemPitch = firstCard.offsetWidth + 12;
      }
      const singleSetWidth = baseItems.length * itemPitch;

      // Position in the middle set silently
      carouselViewport.scrollLeft = singleSetWidth;

      carouselViewport.style.opacity = '1';
      carouselViewport.style.transform = 'translateY(0)';
    }, 180);
  }

  // Silent infinite loop repositioning on scroll
  if (carouselViewport) {
    carouselViewport.addEventListener('scroll', () => {
      if (isSilentShifting) return;
      const baseItems = menuData[currentCategory] || menuData.pratos;
      const singleSetWidth = baseItems.length * itemPitch;
      if (singleSetWidth <= 0) return;

      // If user scrolled forward into Set 3, silently shift back to Set 2
      if (carouselViewport.scrollLeft >= singleSetWidth * 2) {
        isSilentShifting = true;
        carouselViewport.scrollLeft -= singleSetWidth;
        requestAnimationFrame(() => {
          isSilentShifting = false;
        });
      }
      // If user scrolled backward into Set 1, silently shift forward to Set 2
      else if (carouselViewport.scrollLeft <= singleSetWidth * 0.2) {
        isSilentShifting = true;
        carouselViewport.scrollLeft += singleSetWidth;
        requestAnimationFrame(() => {
          isSilentShifting = false;
        });
      }
    }, { passive: true });
  }

  // Smooth forward/backward scroll with floating glass buttons
  function scrollCarousel(direction) {
    if (!carouselViewport) return;
    const scrollStep = Math.max(carouselViewport.clientWidth * 0.75, itemPitch * 2);

    if (direction === 'next') {
      carouselViewport.scrollBy({ left: scrollStep, behavior: 'smooth' });
    } else {
      carouselViewport.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    }
  }

  // Floating Glass Edge Buttons
  const floatPrev = document.getElementById('carousel-float-prev');
  const floatNext = document.getElementById('carousel-float-next');

  if (floatPrev) {
    floatPrev.addEventListener('click', (e) => {
      e.preventDefault();
      scrollCarousel('prev');
    });
  }

  if (floatNext) {
    floatNext.addEventListener('click', (e) => {
      e.preventDefault();
      scrollCarousel('next');
    });
  }

  // Category Tab switching listeners
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderCarousel(category);
    });
  });

  // Initial render
  renderCarousel('pratos');

  // --- TOAST NOTIFICATION HELPER ---
  const toast = document.getElementById('toast-notice');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Direct WhatsApp contact handler
  const phoneLinks = document.querySelectorAll('.cta-phone-link, .phone-action');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      showToast('Abrindo contato no WhatsApp...');
    });
  });

  // Smooth scroll for internal navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
