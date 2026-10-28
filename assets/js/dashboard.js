/**
 * STACKLY - ADMIN & CUSTOMER DASHBOARD SCRIPTS
 * Sidebar toggle, Property CRUD simulation, Concierge chat, Analytics
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DASHBOARD SIDEBAR TOGGLE & MOBILE DRAWER (ENHANCED)
  const sidebar = document.querySelector('.dash-sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
  const sidebarOverlay = document.getElementById('dash-sidebar-overlay');
  const sidebarClose = document.getElementById('dash-sidebar-close');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // 1.3 DASHBOARD INSTANT SMOOTH VIEW SWITCHING (SPA SEPARATE PAGES FOR ADMIN & CLIENT)
  const dashboardPageViews = document.querySelectorAll('.dash-page-view');
  const dashboardNavItems = document.querySelectorAll('.dash-nav-item[data-view]');

  function activateDashboardView(viewId, updateHash = true) {
    if (!dashboardPageViews || dashboardPageViews.length === 0) return;

    let targetView = document.getElementById(viewId);
    if (!targetView) {
      targetView = document.querySelector('.dash-page-view.active') || dashboardPageViews[0];
    }
    if (!targetView) return;

    dashboardPageViews.forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });

    targetView.style.display = 'block';
    void targetView.offsetWidth; // Force CSS animation reflow
    targetView.classList.add('active');

    // Update active nav item
    dashboardNavItems.forEach(item => {
      if (item.getAttribute('data-view') === targetView.id) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update URL hash
    if (updateHash) {
      const hash = targetView.id.replace('view-', '');
      if (window.history.pushState) {
        window.history.pushState(null, null, `#${hash}`);
      } else {
        window.location.hash = hash;
      }
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (dashboardNavItems.length > 0 && dashboardPageViews.length > 0) {
    dashboardNavItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const viewId = this.getAttribute('data-view');
        if (viewId) {
          activateDashboardView(viewId, true);
          if (window.innerWidth <= 991) {
            closeSidebar();
          }
        }
      });
    });

    // Also support any internal button linking to a view (e.g. data-admin-switch / data-view-switch)
    document.querySelectorAll('[data-admin-switch], [data-view-switch]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const targetViewId = this.getAttribute('data-admin-switch') || this.getAttribute('data-view-switch');
        if (targetViewId) {
          activateDashboardView(targetViewId, true);
        }
      });
    });

    // Handle hash on load and hash changes
    function handleDashboardHash() {
      const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
      if (!rawHash) {
        const defaultView = document.querySelector('.dash-page-view.active') || dashboardPageViews[0];
        if (defaultView) activateDashboardView(defaultView.id, false);
        return;
      }

      const aliasMap = {
        // Admin
        'dashboard': 'view-dashboard',
        'overview': 'view-dashboard',
        'admin-overview': 'view-dashboard',
        'listings': 'view-listings',
        'property-table': 'view-listings',
        'inquiries': 'view-inquiries',
        'inquiries-card': 'view-inquiries',
        'tours': 'view-tours',
        'viewings': 'view-tours',
        'escrow': 'view-escrow',
        'admin-escrow': 'view-escrow',
        'clients': 'view-clients',
        'investors': 'view-clients',
        'admin-clients': 'view-clients',
        // Client / Patron
        'my-portfolio': 'view-my-portfolio',
        'portfolio': 'view-my-portfolio',
        'saved-residences': 'view-saved-residences',
        'saved-units': 'view-saved-residences',
        'saved': 'view-saved-residences',
        'upcoming-tours': 'view-upcoming-tours',
        'private-tours': 'view-upcoming-tours',
        'concierge-chat': 'view-concierge-chat',
        'chat': 'view-concierge-chat',
        'document-vault': 'view-document-vault',
        'vault': 'view-document-vault'
      };

      const targetViewId = aliasMap[rawHash] || `view-${rawHash}`;
      activateDashboardView(targetViewId, false);
    }

    window.addEventListener('hashchange', handleDashboardHash);
    handleDashboardHash();
  }

  // 1.5 ACCURATE OFFSET NAVIGATION (WITHOUT OVERLAPPING UNDER FIXED TOPBAR)
  document.querySelectorAll('.dash-nav-item[href^="#"]:not([data-view])').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = window.innerWidth <= 991 ? 82 : 94;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        if (window.innerWidth <= 991) {
          closeSidebar();
        }
      }
    });
  });

  // SCROLLSPY: Automatically highlight active sidebar section without overlapping
  const navSections = document.querySelectorAll('#my-portfolio, #saved-residences, #upcoming-tours, #concierge-chat, #document-vault, #admin-overview, #property-table, #inquiries-card, #viewings, #admin-escrow, #admin-clients');
  if (navSections.length > 0) {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollY = window.pageYOffset + 120;
        navSections.forEach(sec => {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          const id = sec.getAttribute('id');
          if (scrollY >= top && scrollY < top + height) {
            document.querySelectorAll('.dash-nav-item').forEach(link => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                link.classList.remove('active');
              }
            });
          }
        });
      }, 50);
    }, { passive: true });
  }

  // Auto-close drawer on mobile when clicking non-hash links
  document.querySelectorAll('.dash-nav-item:not([href^="#"])').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        closeSidebar();
      }
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeSidebar();
    }
  });

  // Global click outside fallback for mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 991 && sidebar && sidebar.classList.contains('active')) {
      if (!sidebar.contains(e.target) && (!sidebarToggle || !sidebarToggle.contains(e.target))) {
        closeSidebar();
      }
    }
  });

  // 2. ADMIN PROPERTY TABLE SEARCH & CATEGORY FILTER
  const propertySearch = document.getElementById('admin-prop-search');
  if (propertySearch) {
    propertySearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const propertyRows = document.querySelectorAll('#property-table .dash-table tbody tr');
      propertyRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }

  // Category filter buttons for listings
  document.querySelectorAll('#property-table .dash-filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      const container = this.closest('#property-table') || document;
      container.querySelectorAll('.dash-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const rows = container.querySelectorAll('.dash-table tbody tr');
      rows.forEach(row => {
        if (filter === 'all') {
          row.style.display = '';
        } else {
          const categoryCell = row.children[1] ? row.children[1].textContent.toLowerCase() : '';
          const matches = categoryCell.includes(filter);
          row.style.display = matches ? '' : 'none';
        }
      });
    });
  });

  // 2.5 INVESTOR DIRECTORY SEARCH
  const investorSearch = document.getElementById('admin-investor-search');
  if (investorSearch) {
    investorSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const investorRows = document.querySelectorAll('#admin-clients .dash-table tbody tr');
      investorRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }

  // 3. TABLE ROW ACTIONS (DELETE & STATUS TOGGLE)
  document.querySelectorAll('.btn-delete-row').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const row = this.closest('tr');
      if (confirm('Are you sure you want to remove this property listing from the Stackly portfolio?')) {
        row.style.opacity = '0';
        setTimeout(() => {
          row.remove();
          if (window.showToast) window.showToast('Listing removed successfully.');
        }, 300);
      }
    });
  });

  // 4. ADD NEW PROPERTY MODAL SIMULATION
  const addPropForm = document.getElementById('add-property-form');
  if (addPropForm) {
    addPropForm.noValidate = true;

    addPropForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('new-prop-title');
      const priceInput = document.getElementById('new-prop-price');
      const typeInput = document.getElementById('new-prop-type');

      let isValid = true;
      if (!titleInput.value.trim() || titleInput.value.trim().length < 3) {
        titleInput.classList.add('is-invalid');
        isValid = false;
      } else {
        titleInput.classList.remove('is-invalid');
      }

      if (!priceInput.value.trim()) {
        priceInput.classList.add('is-invalid');
        isValid = false;
      } else {
        priceInput.classList.remove('is-invalid');
      }

      if (!isValid) {
        showToast('Please provide a valid property title and price valuation.');
        return;
      }

      const title = titleInput.value.trim();
      const price = priceInput.value.trim();
      const type = typeInput ? typeInput.value : 'Luxury Villa';
      const tableBody = document.querySelector('.dash-table tbody');

      if (tableBody) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>
            <div class="property-cell">
              <img src="assets/images/property-villa-1.webp" alt="${title}" class="property-thumb">
              <div>
                <strong>${title}</strong>
                <p style="font-size:0.75rem; margin:0; color:#888;">London, UK</p>
              </div>
            </div>
          </td>
          <td>${type}</td>
          <td>${price}</td>
          <td><span class="status-badge active">Active</span></td>
          <td>
            <div class="action-btns-group">
              <button class="btn-table-action" onclick="showToast('Listing updated.')">Edit</button>
              <button class="btn-table-action btn-delete-row" onclick="this.closest('tr').remove(); showToast('Listing removed.');">Delete</button>
            </div>
          </td>
        `;
        tableBody.prepend(newRow);
      }

      const modal = addPropForm.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
      addPropForm.reset();
      if (window.showToast) window.showToast(`Property "${title}" published to Stackly Portfolio!`);
    });
  }

  // 5. CUSTOMER DASHBOARD - INTERACTIVE CONCIERGE CHAT
  const chatInput = document.getElementById('concierge-chat-input');
  const chatForm = document.getElementById('concierge-chat-form');
  const chatMessages = document.getElementById('chat-messages-container');

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (!msg) return;

      // Add client message
      const clientMsg = document.createElement('div');
      clientMsg.className = 'chat-bubble client';
      clientMsg.textContent = msg;
      chatMessages.appendChild(clientMsg);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Concierge automated smart reply
      setTimeout(() => {
        const advisorMsg = document.createElement('div');
        advisorMsg.className = 'chat-bubble advisor';
        advisorMsg.textContent = "Thank you for contacting Stackly Private Concierge. I have received your request regarding the Kensington Residence and am reviewing the architectural dossier now. I will confirm your private showing details shortly.";
        chatMessages.appendChild(advisorMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 900);
    });
  }

  // 6. DYNAMIC AUTHENTICATED CREDENTIAL DISPLAY IN BOTH DASHBOARDS
  function initAuthCredentials() {
    let authUser = null;
    let registeredUser = null;

    try {
      const storedAuth = localStorage.getItem('stackly_auth_user') || sessionStorage.getItem('stackly_auth_user');
      if (storedAuth) authUser = JSON.parse(storedAuth);
    } catch (e) {
      console.warn('Could not read auth user', e);
    }

    try {
      const storedReg = localStorage.getItem('stackly_registered_user');
      if (storedReg) registeredUser = JSON.parse(storedReg);
    } catch (e) {
      console.warn('Could not read registered user', e);
    }

    // Default fallbacks if visiting dashboard directly
    const defaultClient = {
      email: (registeredUser && registeredUser.email) ? registeredUser.email : 'patron@stackly-kensington.com',
      password: (registeredUser && registeredUser.password) ? registeredUser.password : 'LuxuryKensington2026!',
      name: (registeredUser && registeredUser.name) ? registeredUser.name : 'Lord Alistair Sterling'
    };

    const defaultAdmin = {
      email: 'admin@stackly-properties.com',
      password: 'AdminCipher2026!',
      name: 'Julian Vance'
    };

    // Client Dashboard Elements
    const dispClientEmail = document.getElementById('display-client-email');
    const dispClientPass = document.getElementById('display-client-password');
    const topbarClientEmail = document.getElementById('topbar-user-email');
    const topbarClientName = document.getElementById('topbar-client-name');
    const clientUserEmail = document.getElementById('client-user-email');
    const clientUserName = document.getElementById('client-user-name');
    const clientHeroTitle = document.getElementById('client-hero-title');
    const toggleClientBtn = document.getElementById('toggle-client-pass-btn');

    if (dispClientEmail || dispClientPass || topbarClientEmail || topbarClientName) {
      const activeEmail = (authUser && authUser.email) ? authUser.email : defaultClient.email;
      const activePass = (authUser && authUser.password) ? authUser.password : defaultClient.password;
      
      let activeName = defaultClient.name;
      if (registeredUser && registeredUser.name) {
        activeName = registeredUser.name;
      } else if (authUser && authUser.email && authUser.email !== defaultClient.email) {
        const username = authUser.email.split('@')[0].replace(/[._-]/g, ' ');
        activeName = username.replace(/\b\w/g, char => char.toUpperCase());
      }

      if (dispClientEmail) dispClientEmail.textContent = activeEmail;
      if (dispClientPass) dispClientPass.textContent = activePass;
      if (topbarClientEmail) topbarClientEmail.textContent = activeEmail;
      if (topbarClientName) topbarClientName.textContent = activeName;
      if (clientUserEmail) clientUserEmail.textContent = activeEmail;
      if (clientUserName) clientUserName.textContent = activeName;
      if (clientHeroTitle) clientHeroTitle.textContent = `Welcome, ${activeName}`;

      if (toggleClientBtn && dispClientPass) {
        let isPassVisible = true;
        toggleClientBtn.addEventListener('click', (e) => {
          e.preventDefault();
          isPassVisible = !isPassVisible;
          dispClientPass.textContent = isPassVisible ? activePass : '••••••••••••••••';
          toggleClientBtn.textContent = isPassVisible ? 'Hide' : 'Show';
        });
      }
    }

    // Admin Dashboard Elements
    const dispAdminEmail = document.getElementById('display-admin-email');
    const dispAdminPass = document.getElementById('display-admin-password');
    const topbarAdminEmail = document.getElementById('topbar-admin-email');
    const topbarAdminName = document.getElementById('topbar-admin-name');
    const adminUserEmail = document.getElementById('admin-user-email');
    const adminUserName = document.getElementById('admin-user-name');
    const toggleAdminBtn = document.getElementById('toggle-admin-pass-btn');

    if (dispAdminEmail || dispAdminPass || topbarAdminEmail || topbarAdminName || adminUserEmail || adminUserName) {
      const activeEmail = (authUser && authUser.email) ? authUser.email : defaultAdmin.email;
      const activePass = (authUser && authUser.password) ? authUser.password : defaultAdmin.password;

      let activeAdminName = defaultAdmin.name;
      if (registeredUser && registeredUser.name) {
        activeAdminName = registeredUser.name;
      } else if (authUser && authUser.email && authUser.email !== defaultAdmin.email) {
        const username = authUser.email.split('@')[0].replace(/[._-]/g, ' ');
        activeAdminName = username.replace(/\b\w/g, char => char.toUpperCase());
      }

      if (dispAdminEmail) dispAdminEmail.textContent = activeEmail;
      if (dispAdminPass) dispAdminPass.textContent = activePass;
      if (topbarAdminEmail) topbarAdminEmail.textContent = activeEmail;
      if (topbarAdminName) topbarAdminName.textContent = activeAdminName;
      if (adminUserEmail) adminUserEmail.textContent = activeEmail;
      if (adminUserName) adminUserName.textContent = activeAdminName;

      if (toggleAdminBtn && dispAdminPass) {
        let isPassVisible = true;
        toggleAdminBtn.addEventListener('click', (e) => {
          e.preventDefault();
          isPassVisible = !isPassVisible;
          dispAdminPass.textContent = isPassVisible ? activePass : '••••••••••••••••';
          toggleAdminBtn.textContent = isPassVisible ? 'Hide' : 'Show';
        });
      }
    }

    // Sign Out Handlers (clears active session so login page remains completely blank)
    document.querySelectorAll('a[title="Sign Out"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          localStorage.removeItem('stackly_auth_user');
          sessionStorage.removeItem('stackly_auth_user');
        } catch (err) {}
        window.location.href = 'login.html';
      });
    });
  }

  initAuthCredentials();
});
