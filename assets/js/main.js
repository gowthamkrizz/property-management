/**
 * STACKLY - GLOBAL LUXURY SCRIPTS
 * Hendon Kensington Exact Replica: Sticky Header, Smooth Scrolling, Offcanvas Drawer, Accordion, Modals & Toast
 */

(function() {
  function initApp() {
    // 1. BUTTER-SMOOTH STICKY HEADER (RAF OPTIMIZED)
    const header = document.getElementById('qodef-page-header') || document.querySelector('.site-header');
    const scrollThreshold = 50;
    let isTicking = false;

    function updateHeaderOnScroll() {
      if (!header) return;
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollY > scrollThreshold) {
        if (!header.classList.contains('qodef-header-scrolled')) {
          header.classList.add('qodef-header-scrolled');
          header.classList.add('scrolled');
        }
      } else {
        if (header.classList.contains('qodef-header-scrolled')) {
          header.classList.remove('qodef-header-scrolled');
          header.classList.remove('scrolled');
        }
      }

      // Back to top visibility
      const backToTop = document.getElementById('qodef-back-to-top');
      if (backToTop) {
        if (currentScrollY > 300) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      }

      isTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateHeaderOnScroll);
        isTicking = true;
      }
    }, { passive: true });

    updateHeaderOnScroll();

    // 2. BACK TO TOP (SMOOTH SCROLL)
    const backToTop = document.getElementById('qodef-back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // 3. OFFCANVAS SIDE AREA (ROBUST MULTI-PAGE CONTROLLER)
    function getSideAreaElements() {
      return {
        sideArea: document.getElementById('qodef-side-area') || document.querySelector('.offcanvas-panel'),
        sideCover: document.getElementById('qodef-side-cover') || document.querySelector('.offcanvas-overlay')
      };
    }

    window.openSideArea = function() {
      const { sideArea, sideCover } = getSideAreaElements();
      if (sideArea) {
        sideArea.classList.add('qodef-side-area-opened', 'active');
        sideArea.setAttribute('aria-hidden', 'false');
      }
      if (sideCover) {
        sideCover.classList.add('active');
        sideCover.setAttribute('aria-hidden', 'false');
      }
      document.body.classList.add('qodef-side-area-open');
      document.body.style.overflow = 'hidden';
    };

    window.closeSideArea = function() {
      const { sideArea, sideCover } = getSideAreaElements();
      if (sideArea) {
        sideArea.classList.remove('qodef-side-area-opened', 'active');
        sideArea.setAttribute('aria-hidden', 'true');
      }
      if (sideCover) {
        sideCover.classList.remove('active');
        sideCover.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('qodef-side-area-open');
      document.body.style.overflow = '';
    };

    // Attach explicit direct listeners for instant responsiveness on mobile & desktop
    function initSideAreaEvents() {
      const { sideCover } = getSideAreaElements();
      const closeButtons = document.querySelectorAll('#qodef-side-close, .qodef-side-area-close, .offcanvas-close');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.closeSideArea();
        });
        btn.addEventListener('touchend', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.closeSideArea();
        }, { passive: false });
      });

      if (sideCover) {
        sideCover.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.closeSideArea();
        });
        sideCover.addEventListener('touchend', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.closeSideArea();
        }, { passive: false });
      }

      const openButtons = document.querySelectorAll('.qodef-side-area-opener, .header-offcanvas-trigger, .nav-menu-toggle, #qodef-side-area-opener-trigger');
      openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.openSideArea();
        });
      });
    }
    initSideAreaEvents();

    // Global Delegated Click Handling for Side Area (redundant fallback)
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('.qodef-side-area-opener, .header-offcanvas-trigger, .nav-menu-toggle, #qodef-side-area-opener-trigger');
      if (opener) {
        e.preventDefault();
        e.stopPropagation();
        window.openSideArea();
        return;
      }

      const closer = e.target.closest('.qodef-side-area-close, .offcanvas-close, #qodef-side-close, .qodef-side-area-cover, .offcanvas-overlay');
      if (closer) {
        e.preventDefault();
        e.stopPropagation();
        window.closeSideArea();
        return;
      }

      // Close when clicking an in-page anchor inside side area
      const sideLink = e.target.closest('#qodef-side-area a, .offcanvas-panel a');
      if (sideLink) {
        const href = sideLink.getAttribute('href');
        if (href && href.startsWith('#')) {
          window.closeSideArea();
        }
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        window.closeSideArea();
        const openAuth = document.querySelector('.header-auth-wrapper.is-open');
        if (openAuth) openAuth.classList.remove('is-open');
      }
    });

    // 3.5 HEADER AUTH (LOGIN / SIGNUP) INTERACTIVE DROPDOWN
    const authWrapper = document.querySelector('.header-auth-wrapper');
    if (authWrapper) {
      const authCaret = authWrapper.querySelector('.header-auth-caret');
      if (authCaret) {
        authCaret.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          authWrapper.classList.toggle('is-open');
        });
      }

      document.addEventListener('click', (e) => {
        if (!authWrapper.contains(e.target)) {
          authWrapper.classList.remove('is-open');
        }
      });
    }

    // 4. SMOOTH ANCHOR NAVIGATION (ACCOUNTING FOR FIXED HEADER)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        try {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Close offcanvas if open
            window.closeSideArea();
          }
        } catch(err) {
          // invalid selector, allow default
        }
      });
    });

    // 5. ACCORDION (SMOOTH FLUID HEIGHT EXPANSION)
    const accordionItems = document.querySelectorAll('.qodef-accordion-item, .accordion-item');
    accordionItems.forEach(item => {
      const title = item.querySelector('.qodef-accordion-title, .accordion-header');
      if (!title) return;

      title.addEventListener('click', () => {
        const container = item.closest('.qodef-accordion, .neighborhood-accordion, .faq-accordion');
        const isAlreadyActive = item.classList.contains('active');

        if (container) {
          container.querySelectorAll('.qodef-accordion-item, .accordion-item').forEach(sibling => {
            sibling.classList.remove('active');
            const siblingContent = sibling.querySelector('.qodef-accordion-content, .accordion-body');
            if (siblingContent) {
              siblingContent.style.maxHeight = '0px';
            }
          });
        }

        if (!isAlreadyActive) {
          item.classList.add('active');
          const content = item.querySelector('.qodef-accordion-content, .accordion-body');
          if (content) {
            content.style.maxHeight = content.scrollHeight + 30 + 'px';
          }
        }
      });
    });

    // Ensure initial active accordion is sized
    document.querySelectorAll('.accordion-item.active, .qodef-accordion-item.active').forEach(activeItem => {
      const content = activeItem.querySelector('.qodef-accordion-content, .accordion-body');
      if (content) {
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });

    // 6. COMPREHENSIVE STAGGERED SCROLL REVEAL & MASKED REVEALS
    const revealElements = document.querySelectorAll(
      '.triple-item, .feature-box, .highlight-box, .villa-card, .gallery-card, ' +
      '.contact-card, .useful-link-card, .visit-field-group, .footer-col, .masked-reveal-box, ' +
      '.stagger-item, .fade-up, .team-card, .milestone-card, .advisor-card, .material-palette-card, ' +
      '.lifestyle-card, .gallery-showcase-card, .accordion-item'
    );

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Apply subtle stagger if items share the same parent grid
            const parent = entry.target.parentElement;
            if (parent) {
              const siblings = Array.from(parent.children);
              const siblingIndex = siblings.indexOf(entry.target);
              entry.target.style.transitionDelay = `${Math.min(siblingIndex * 0.1, 0.55)}s`;
            }
            entry.target.classList.add('is-revealed', 'revealed');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

      revealElements.forEach(el => {
        // Immediate viewport check: elements already in or near viewport reveal immediately
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < (window.innerHeight + 150) && rect.bottom > -100;

        if (isInViewport) {
          el.classList.add('is-revealed', 'revealed');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        } else {
          el.style.opacity = '0';
          el.style.transform = 'translateY(24px)';
          el.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
          revealObserver.observe(el);
        }
      });

      // Safety Watchdog: Guarantee that NO element ever remains stuck at opacity 0
      setTimeout(() => {
        revealElements.forEach(el => {
          if (!el.classList.contains('is-revealed')) {
            el.classList.add('is-revealed', 'revealed');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
        });
      }, 1200);

      // Footer Line Reveal
      const footerLine = document.getElementById('footer-reveal-line') || document.querySelector('.footer-reveal-line');
      if (footerLine) {
        const lineObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              footerLine.classList.add('revealed');
              obs.unobserve(footerLine);
            }
          });
        }, { threshold: 0.1 });
        lineObserver.observe(footerLine);
      }
    }

    // 6.2 BUTTER-SMOOTH ARCHITECTURAL SVG DRAWING CONTROLLER (SLOW & FLUID)
    const svgsToAnimate = document.querySelectorAll('.concept-icon-svg');
    svgsToAnimate.forEach((svg, svgIndex) => {
      const card = svg.closest('.triple-item, .feature-box, .highlight-box, .concept-icon-box, div') || svg.parentElement;
      const elements = Array.from(svg.querySelectorAll('polygon, line, rect, circle, path'));
      
      // Ensure pathLength 100 for standard mathematical dash offsets
      elements.forEach(el => {
        el.setAttribute('pathLength', '100');
        el.style.strokeDasharray = '100';
        el.style.strokeDashoffset = '0';
      });

      let animId = null;

      function startSlowDraw(duration = 2200) {
        if (animId) cancelAnimationFrame(animId);

        const startTime = performance.now();

        // Stagger delays for layers (outer frame -> inner lines -> details)
        const delays = elements.map(el => {
          if (el.classList.contains('svg-path-frame')) return 0;
          if (el.classList.contains('svg-path-line') || el.classList.contains('svg-path-base')) return 200;
          return 420;
        });

        // Set initial state to undrawn
        elements.forEach(el => {
          el.style.strokeDashoffset = '100';
        });

        function animateFrame(now) {
          const elapsed = now - startTime;
          let isFinished = true;

          elements.forEach((el, idx) => {
            const delay = delays[idx];
            const activeElapsed = Math.max(0, elapsed - delay);
            const activeDuration = duration - delay;
            const progress = Math.min(1, activeElapsed / activeDuration);

            if (progress < 1) isFinished = false;

            // Quintic / cubic smooth ease-in-out
            const eased = progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentOffset = 100 * (1 - eased);
            el.style.strokeDashoffset = currentOffset.toFixed(2);
          });

          if (!isFinished) {
            animId = requestAnimationFrame(animateFrame);
          } else {
            elements.forEach(el => {
              el.style.strokeDashoffset = '0';
            });
            animId = null;
          }
        }

        animId = requestAnimationFrame(animateFrame);
      }

      // Smooth hover trigger: re-draws slowly and gracefully
      if (card) {
        card.addEventListener('mouseenter', () => {
          startSlowDraw(2200);
        });
      }

      // Staggered scroll trigger
      if ('IntersectionObserver' in window && card) {
        const iconObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                startSlowDraw(2400);
              }, (svgIndex % 4) * 220);
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        iconObserver.observe(card);
      }
    });

    // 6.3 UNIVERSAL EASE-OUT NUMERIC COUNTERS FOR ALL PAGES
    const counterElements = document.querySelectorAll('.metric-number, .qodef-counter-number');
    if (counterElements.length > 0 && 'IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            let target = el.getAttribute('data-target');
            let suffix = el.getAttribute('data-suffix') || '';
            let prefix = el.getAttribute('data-prefix') || '';

            if (!target) {
              const rawText = el.innerText.trim();
              const numMatch = rawText.match(/(\d+[\d,.]*)/);
              if (numMatch) {
                target = parseFloat(numMatch[1].replace(/,/g, ''));
                const parts = rawText.split(numMatch[1]);
                prefix = parts[0] || '';
                suffix = parts[1] || '';
              }
            } else {
              target = parseFloat(target);
            }

            if (!isNaN(target) && target > 0) {
              const duration = 2000;
              let startTime = null;

              function animateCounter(currentTime) {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeOutProgress * target);
                el.innerText = prefix + currentVal.toLocaleString() + suffix;

                if (progress < 1) {
                  requestAnimationFrame(animateCounter);
                } else {
                  el.innerText = prefix + target.toLocaleString() + suffix;
                }
              }

              requestAnimationFrame(animateCounter);
            }
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.2 });

      counterElements.forEach(num => counterObserver.observe(num));
    }

    // 7. TOAST NOTIFICATION SYSTEM
    window.showToast = function(message, type = 'info', duration = 4000) {
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      const toast = document.createElement('div');

      const isError = type === 'error' || /error|invalid|verify|check|please|required|failed/i.test(message);
      const isSuccess = type === 'success' || /confirmed|success|transmitted|granted|subscribed|received|selected/i.test(message);

      let toastClass = 'toast';
      let iconSvg = '';
      if (isError) {
        toastClass += ' toast-error';
        iconSvg = `<span class="toast-icon toast-icon-error">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </span>`;
      } else if (isSuccess) {
        toastClass += ' toast-success';
        iconSvg = `<span class="toast-icon toast-icon-success">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>`;
      } else {
        iconSvg = `<span class="toast-icon toast-icon-info">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </span>`;
      }

      toast.className = toastClass;
      toast.innerHTML = `
        ${iconSvg}
        <div class="toast-content">${message}</div>
        <button type="button" class="toast-close" aria-label="Dismiss">&times;</button>
      `;

      const closeBtn = toast.querySelector('.toast-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 350);
        });
      }

      container.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 40);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, duration);
    };

    // ------------------------------------------------------------------------
    // 8. BESPOKE JAVASCRIPT FORM VALIDATION ENGINE (ALL FORMS)
    // ------------------------------------------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+\-()]{7,20}$/;

    function showFieldError(field, message) {
      if (!field) return;
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      const group = field.closest('.form-group, .visit-field-group, .form-check, .vip-registry-box, .footer-col') || field.parentElement;
      if (group) {
        group.classList.add('has-error');
        group.classList.remove('is-valid');
      }

      // Check if .field-error-msg already exists
      let errorEl = (group ? group.querySelector('.field-error-msg') : null) || (field.parentElement ? field.parentElement.querySelector('.field-error-msg') : null);
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error-msg';
        if (field.nextSibling) {
          field.parentNode.insertBefore(errorEl, field.nextSibling);
        } else {
          field.parentNode.appendChild(errorEl);
        }
      }
      errorEl.innerHTML = `
        <span class="field-error-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </span>
        <span class="field-error-text">${message}</span>
      `;
      errorEl.style.display = 'inline-flex';

      // Re-trigger shake animation
      field.classList.remove('field-shaking');
      void field.offsetWidth; // Force DOM reflow
      field.classList.add('field-shaking');
    }

    function clearFieldError(field) {
      if (!field) return;
      field.classList.remove('is-invalid', 'field-shaking');
      const group = field.closest('.form-group, .visit-field-group, .form-check, .vip-registry-box, .footer-col') || field.parentElement;
      if (group) {
        group.classList.remove('has-error');
      }
      const errorEl = (group ? group.querySelector('.field-error-msg') : null) || (field.parentElement ? field.parentElement.querySelector('.field-error-msg') : null);
      if (errorEl) {
        errorEl.style.display = 'none';
      }
    }

    function bindRealtimeInputValidation(form) {
      if (!form) return;
      form.noValidate = true;
      form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => clearFieldError(input));
        input.addEventListener('change', () => clearFieldError(input));
      });
    }

    // A. SCHEDULE A VISIT FORM (#kensington-visit-form)
    const visitForm = document.getElementById('kensington-visit-form');
    if (visitForm) {
      bindRealtimeInputValidation(visitForm);

      const dateInput = visitForm.querySelector('#visit-date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        if (!dateInput.value) {
          dateInput.value = today;
        }
      }

      visitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let isValid = true;
        let firstInvalid = null;

        const fullName = visitForm.querySelector('#visit-fullname');
        if (fullName) {
          if (!fullName.value.trim() || fullName.value.trim().length < 2) {
            showFieldError(fullName, 'Please enter your full legal name and title.');
            isValid = false;
            if (!firstInvalid) firstInvalid = fullName;
          } else {
            clearFieldError(fullName);
            fullName.classList.add('is-valid');
          }
        }

        const email = visitForm.querySelector('#visit-email');
        if (email) {
          if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            showFieldError(email, 'Please provide a valid confidential email address.');
            isValid = false;
            if (!firstInvalid) firstInvalid = email;
          } else {
            clearFieldError(email);
            email.classList.add('is-valid');
          }
        }

        const phone = visitForm.querySelector('#visit-phone');
        if (phone) {
          const digits = phone.value.replace(/\D/g, '');
          if (!phone.value.trim() || digits.length < 7) {
            showFieldError(phone, 'Please provide a valid telephone number with country code.');
            isValid = false;
            if (!firstInvalid) firstInvalid = phone;
          } else {
            clearFieldError(phone);
            phone.classList.add('is-valid');
          }
        }

        const residence = visitForm.querySelector('#visit-residence');
        if (residence) {
          if (!residence.value || residence.value === '') {
            showFieldError(residence, 'Please choose a Kensington residence of interest.');
            isValid = false;
            if (!firstInvalid) firstInvalid = residence;
          } else {
            clearFieldError(residence);
            residence.classList.add('is-valid');
          }
        }

        const date = visitForm.querySelector('#visit-date');
        if (date) {
          if (!date.value) {
            showFieldError(date, 'Please select your preferred appointment date.');
            isValid = false;
            if (!firstInvalid) firstInvalid = date;
          } else {
            clearFieldError(date);
            date.classList.add('is-valid');
          }
        }

        const time = visitForm.querySelector('#visit-time');
        if (time) {
          if (!time.value) {
            showFieldError(time, 'Please select a preferred viewing time window.');
            isValid = false;
            if (!firstInvalid) firstInvalid = time;
          } else {
            clearFieldError(time);
            time.classList.add('is-valid');
          }
        }

        if (!isValid) {
          if (firstInvalid) firstInvalid.focus();
          showToast('Please complete the highlighted consultation requirements.');
          return;
        }

        const submitBtn = visitForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          const origHTML = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span style="display:inline-block; animation:spin 1s linear infinite; margin-right:8px;">◌</span> SECURING PRIVATE SHOWING...';
          submitBtn.disabled = true;

          setTimeout(() => {
            window.location.href = '404.html';
          }, 450);
        } else {
          window.location.href = '404.html';
        }
      });
    }

    // B. CONTACT CONSULTATION FORM (#contact-consultation-form)
    const contactForm = document.getElementById('contact-consultation-form');
    if (contactForm) {
      bindRealtimeInputValidation(contactForm);

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let isValid = true;
        let firstInvalid = null;

        const nameInput = contactForm.querySelector('#c-name');
        if (nameInput) {
          if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            showFieldError(nameInput, 'Please enter your full legal name and title.');
            isValid = false;
            if (!firstInvalid) firstInvalid = nameInput;
          } else {
            clearFieldError(nameInput);
            nameInput.classList.add('is-valid');
          }
        }

        const emailInput = contactForm.querySelector('#c-email');
        if (emailInput) {
          if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showFieldError(emailInput, 'Please provide a valid private email address.');
            isValid = false;
            if (!firstInvalid) firstInvalid = emailInput;
          } else {
            clearFieldError(emailInput);
            emailInput.classList.add('is-valid');
          }
        }

        const phoneInput = contactForm.querySelector('#c-phone');
        if (phoneInput) {
          const digits = phoneInput.value.replace(/\D/g, '');
          if (!phoneInput.value.trim() || digits.length < 7) {
            showFieldError(phoneInput, 'Please provide a valid phone or WhatsApp number (min 7 digits).');
            isValid = false;
            if (!firstInvalid) firstInvalid = phoneInput;
          } else {
            clearFieldError(phoneInput);
            phoneInput.classList.add('is-valid');
          }
        }

        if (!isValid) {
          if (firstInvalid) firstInvalid.focus();
          showToast('Please verify the highlighted fields in your confidential inquiry.');
          return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          const origText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span style="display:inline-block; animation:spin 1s linear infinite; margin-right:8px;">◌</span> TRANSMITTING DOSSIER...';
          submitBtn.disabled = true;

          setTimeout(() => {
            window.location.href = '404.html';
          }, 450);
        } else {
          window.location.href = '404.html';
        }
      });
    }

    // C. CONFIDENTIAL PRIVATE REGISTRY FORMS (.registry-form, #confidential-registry-form)
    document.querySelectorAll('.registry-form, #confidential-registry-form').forEach(form => {
      bindRealtimeInputValidation(form);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"], .registry-input');
        if (emailInput) {
          if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showFieldError(emailInput, 'Please provide a valid email address.');
            emailInput.focus();
            showToast('Please enter a valid email to join the Private Registry.');
            return;
          }
          clearFieldError(emailInput);
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const origText = submitBtn.innerHTML;
          submitBtn.innerHTML = 'PROCESSING...';
          submitBtn.disabled = true;

          setTimeout(() => {
            window.location.href = '404.html';
          }, 450);
        } else {
          window.location.href = '404.html';
        }
      });
    });

    // D. FOOTER ENQUIRY FORMS (.footer-enquiry-form)
    document.querySelectorAll('.footer-enquiry-form').forEach(form => {
      bindRealtimeInputValidation(form);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"], input');
        if (emailInput) {
          if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showFieldError(emailInput, 'Please enter a valid email address.');
            emailInput.focus();
            showToast('Please provide a valid email for the Private Dossier dispatch.');
            return;
          }
          clearFieldError(emailInput);
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const origText = submitBtn.innerHTML;
          submitBtn.innerHTML = '...';
          submitBtn.disabled = true;

          setTimeout(() => {
            window.location.href = '404.html';
          }, 450);
        } else {
          window.location.href = '404.html';
        }
      });
    });

    // E. GENERAL / MODAL FORMS FALLBACK HANDLER
    document.querySelectorAll('form:not(#kensington-visit-form):not(#contact-consultation-form):not(.registry-form):not(#confidential-registry-form):not(.footer-enquiry-form):not(#auth-login-form):not(#auth-signup-form):not(#mortgage-calculator-form)').forEach(form => {
      bindRealtimeInputValidation(form);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        let firstInvalid = null;

        form.querySelectorAll('input, select, textarea').forEach(field => {
          const isRequired = field.hasAttribute('required') || field.classList.contains('required');
          const val = field.value ? field.value.trim() : '';
          const type = field.getAttribute('type') || field.tagName.toLowerCase();

          if (type === 'email' && val && !emailRegex.test(val)) {
            showFieldError(field, 'Please enter a valid email.');
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
          } else if (isRequired && !val) {
            showFieldError(field, 'This field is required.');
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
          } else {
            clearFieldError(field);
          }
        });

        if (!isValid) {
          if (firstInvalid) firstInvalid.focus();
          showToast('Please check the highlighted fields.');
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const origText = submitBtn.innerHTML;
          submitBtn.innerHTML = 'PROCESSING...';
          submitBtn.disabled = true;

          setTimeout(() => {
            window.location.href = '404.html';
          }, 450);
        } else {
          window.location.href = '404.html';
        }
      });
    });

    // F. CTA BUTTONS GLOBAL HANDLER
    document.addEventListener('click', (e) => {
      const ctaBtn = e.target.closest('button.btn-solid-dark, .btn-kensington, .btn-outline-white, .btn-solid-copper, .btn-luxury, .btn-appointment-primary');
      if (!ctaBtn) return;
      // Exclude forms' submit buttons (they are handled by form submit validation)
      if (ctaBtn.type === 'submit' || ctaBtn.closest('form') && ctaBtn.id === 'btn-calc-mortgage') return;
      // Exclude drawer close buttons or nav toggles
      if (ctaBtn.classList.contains('qodef-side-area-close') || ctaBtn.classList.contains('offcanvas-close') || ctaBtn.classList.contains('villa-tab-btn') || ctaBtn.classList.contains('property-filter-btn') || ctaBtn.classList.contains('hendon-nav-btn')) return;

      // If it's a CTA button, navigate to 404.html
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
