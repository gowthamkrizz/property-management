/**
 * STACKLY - HERO SLIDER & GALLERY INTERACTION SCRIPT
 * High-performance, butter-smooth slider & carousel animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. HERO SLIDER (HENDON KENSINGTON EXACT)
  // ==========================================
  const slides = document.querySelectorAll('.hendon-hero-slide, .hero-slide');
  const prevBtn = document.querySelector('.hero-prev-btn');
  const nextBtn = document.querySelector('.hero-next-btn');
  const currentSlideEl = document.querySelector('.current-slide');
  const totalSlideEl = document.querySelector('.total-slides');
  const paginationContainer = document.querySelector('.hero-pagination-bullets') || document.getElementById('hero-pagination');

  if (slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval = null;
    let isTransitioning = false;
    let bullets = [];

    if (totalSlideEl) {
      totalSlideEl.textContent = `0${totalSlides}`;
    }

    // Build pagination bullets if container exists
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const bullet = document.createElement('div');
        bullet.className = `hero-bullet ${i === 0 ? 'active' : ''}`;
        bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
        bullet.addEventListener('click', (e) => {
          e.preventDefault();
          if (currentIndex !== i) {
            showSlide(i);
            resetTimer();
          }
        });
        paginationContainer.appendChild(bullet);
        bullets.push(bullet);
      });
    }

    function updateBullets(index) {
      bullets.forEach((b, i) => {
        if (i === index) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    function showSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
          slide.classList.add('active');
          // Restart Ken Burns animation cleanly
          const bg = slide.querySelector('.hendon-slide-bg, .hero-slide-bg');
          if (bg) {
            bg.style.animation = 'none';
            void bg.offsetHeight; // trigger reflow
            bg.style.animation = '';
          }
        }
      });

      if (currentSlideEl) {
        currentSlideEl.textContent = `0${index + 1}`;
      }
      updateBullets(index);
      currentIndex = index;

      setTimeout(() => {
        isTransitioning = false;
      }, 700);
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % totalSlides;
      showSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      showSlide(prevIndex);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetTimer();
      });
    }

    function startTimer() {
      autoSlideInterval = setInterval(nextSlide, 7000);
    }

    function resetTimer() {
      clearInterval(autoSlideInterval);
      startTimer();
    }

    startTimer();

    const heroSection = document.querySelector('.hendon-hero-slider, .hero-slider-section');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
      heroSection.addEventListener('mouseleave', startTimer);

      // Touch swipe gestures
      let touchStartX = 0;
      let touchEndX = 0;

      heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          nextSlide();
          resetTimer();
        } else if (touchEndX - touchStartX > 50) {
          prevSlide();
          resetTimer();
        }
      }, { passive: true });
    }
  }

  // ==========================================
  // 2. CUSTOM INTERIORS GALLERY CAROUSEL & PARALLAX
  // ==========================================
  const galleryTrack = document.querySelector('.gallery-track');
  const galleryPrev = document.querySelector('.gallery-prev-btn');
  const galleryNext = document.querySelector('.gallery-next-btn');

  if (galleryTrack) {
    let currentGalleryOffset = 0;
    const cards = galleryTrack.querySelectorAll('.gallery-card');

    function getCardShift() {
      if (cards.length === 0) return 330;
      return cards[0].offsetWidth + 32;
    }

    function updateGalleryPosition() {
      if (cards.length === 0) return;
      const shift = getCardShift();
      const maxOffset = Math.max(0, (cards.length * shift) - galleryTrack.parentElement.offsetWidth);
      currentGalleryOffset = Math.max(0, Math.min(currentGalleryOffset, maxOffset));
      galleryTrack.style.transform = `translateX(-${currentGalleryOffset}px)`;
    }

    if (galleryNext) {
      galleryNext.addEventListener('click', (e) => {
        e.preventDefault();
        const shift = getCardShift();
        const maxOffset = Math.max(0, (cards.length * shift) - galleryTrack.parentElement.offsetWidth);
        currentGalleryOffset = Math.min(currentGalleryOffset + shift, maxOffset);
        updateGalleryPosition();
      });
    }

    if (galleryPrev) {
      galleryPrev.addEventListener('click', (e) => {
        e.preventDefault();
        const shift = getCardShift();
        currentGalleryOffset = Math.max(0, currentGalleryOffset - shift);
        updateGalleryPosition();
      });
    }

    window.addEventListener('resize', updateGalleryPosition);

    // Subtle 3D tilt & parallax on gallery cards
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const img = card.querySelector('.gallery-img-wrap img');
        if (img) {
          img.style.transform = `scale(1.09) translate(${x * 0.03}px, ${y * 0.03}px)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        const img = card.querySelector('.gallery-img-wrap img');
        if (img) {
          img.style.transform = '';
        }
      });
    });
  }

  // ==========================================
  // 3. EASE-OUT SMOOTH NUMERIC COUNTERS
  // ==========================================
  const counterElements = document.querySelectorAll('.metric-number[data-target], .qodef-counter-number[data-target]');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.getAttribute('data-target');
          const suffix = entry.target.getAttribute('data-suffix') || '';
          const duration = 1800; // 1.8 seconds smooth count
          let startTime = null;

          function animateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // Cubic ease out
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);

            entry.target.innerText = currentVal.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              entry.target.innerText = target.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(animateCounter);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(num => counterObserver.observe(num));
  }
});
