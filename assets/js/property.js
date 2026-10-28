/**
 * STACKLY - PROPERTY & FLOOR PLAN INTERACTIVITY
 * Villa Filters, Floor Plan Switcher, Mortgage Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. FLOOR PLAN INTERACTIVE SWITCHER
  // ==========================================
  const floorplanTabs = document.querySelectorAll('.floorplan-tab-item');
  const floorplanImg = document.getElementById('floorplan-display-img');
  const activeBadge = document.getElementById('floorplan-active-badge');
  const fpAreaEl = document.getElementById('fp-area-val');
  const fpBedsEl = document.getElementById('fp-beds-val');
  const fpBathsEl = document.getElementById('fp-baths-val');
  const fpTerraceEl = document.getElementById('fp-terrace-val');
  const specsBar = document.querySelector('.floorplan-specs-bar');

  const floorplanData = {
    penthouse: {
      title: 'PENTHOUSE PANORAMA • LEVEL 12-14',
      img: 'assets/images/floorplan-schematic.webp',
      alt: 'Penthouse Panorama Luxury Suite',
      area: '480 m² / 5,166 sq.ft',
      beds: '4 Master En-Suites',
      baths: '5.5 Marble Baths',
      terrace: '120 m² Wraparound'
    },
    duplex: {
      title: 'THE KENSINGTON DUPLEX • LEVEL 04-05',
      img: 'assets/images/property-duplex.webp',
      alt: 'The Kensington Duplex Architecture',
      area: '340 m² / 3,660 sq.ft',
      beds: '3 Grand Suites',
      baths: '4 Designer Baths',
      terrace: '65 m² Sky Garden'
    },
    garden: {
      title: 'PRIVATE GARDEN VILLA • GROUND LEVEL',
      img: 'assets/images/property-villa-1.webp',
      alt: 'Private Garden Villa Residence',
      area: '290 m² / 3,121 sq.ft',
      beds: '3 Bedrooms + Study',
      baths: '3.5 Luxury Baths',
      terrace: '95 m² Private Oasis'
    }
  };

  // Preload all tab images to prevent blank flicker
  Object.values(floorplanData).forEach(item => {
    const preloader = new Image();
    preloader.src = item.img;
  });

  floorplanTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      if (tab.classList.contains('active')) return;

      floorplanTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const planKey = tab.getAttribute('data-plan');
      const data = floorplanData[planKey];
      if (data) {
        if (floorplanImg) {
          // Smooth fade out and subtle scale
          floorplanImg.style.opacity = '0.2';
          floorplanImg.style.transform = 'scale(0.96)';

          if (activeBadge) {
            activeBadge.style.opacity = '0';
            activeBadge.style.transform = 'translateY(-6px)';
          }

          if (specsBar) {
            specsBar.style.opacity = '0.35';
            specsBar.style.transform = 'translateY(6px)';
          }

          setTimeout(() => {
            floorplanImg.src = data.img;
            floorplanImg.alt = data.alt || 'Architectural View';

            if (activeBadge) {
              activeBadge.textContent = data.title;
              activeBadge.style.opacity = '1';
              activeBadge.style.transform = 'translateY(0)';
            }

            if (fpAreaEl) fpAreaEl.textContent = data.area;
            if (fpBedsEl) fpBedsEl.textContent = data.beds;
            if (fpBathsEl) fpBathsEl.textContent = data.baths;
            if (fpTerraceEl) fpTerraceEl.textContent = data.terrace;

            // Fade back in smoothly with scale punch
            requestAnimationFrame(() => {
              floorplanImg.style.opacity = '1';
              floorplanImg.style.transform = 'scale(1)';

              if (specsBar) {
                specsBar.style.opacity = '1';
                specsBar.style.transform = 'translateY(0)';
              }
            });
          }, 180);
        }
      }
    });
  });

  // ==========================================
  // 2. VILLA & PROPERTY FILTER TABS
  // ==========================================
  const villaTabs = document.querySelectorAll('.villa-tab-btn, .property-filter-btn');
  const propertyCards = document.querySelectorAll('.villa-card, .property-grid-item');

  villaTabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      villaTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      propertyCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
    // ==========================================
  // 3. FINANCIAL MORTGAGE ESTIMATOR CALCULATOR
  // ==========================================
  function recalculateMortgage() {
    const price = parseFloat(document.getElementById('calc-price')?.value || 4850000);
    const deposit = parseFloat(document.getElementById('calc-deposit')?.value || 1212500);
    const rate = parseFloat(document.getElementById('calc-rate')?.value || 4.2) / 100 / 12;
    const years = parseFloat(document.getElementById('calc-term')?.value || 25);
    const totalMonths = years * 12;

    const principal = Math.max(0, price - deposit);
    if (principal > 0 && rate > 0) {
      const monthly = (principal * rate * Math.pow(1 + rate, totalMonths)) / (Math.pow(1 + rate, totalMonths) - 1);
      const resultEl = document.getElementById('calc-result-val');
      if (resultEl) {
        resultEl.textContent = '£' + Math.round(monthly).toLocaleString('en-GB');
      }
    }
  }

  const calcBtn = document.getElementById('btn-calc-mortgage');
  if (calcBtn) {
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      recalculateMortgage();
      if (window.showToast) {
        window.showToast('Debt service calculated based on prime UK lending rates.');
      }
    });

    ['calc-price', 'calc-deposit', 'calc-rate', 'calc-term'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', recalculateMortgage);
        el.addEventListener('change', recalculateMortgage);
      }
    });
  }
});
