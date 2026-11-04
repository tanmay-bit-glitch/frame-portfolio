/**
 * FRAME — Cinema & 35mm Photography Portfolio
 * Complete Interactive Experience Script
 */

(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const systemTheme = matchMedia('(prefers-color-scheme: light)');

  /* ==========================================================================
     1. THEME ENGINE
     ========================================================================== */
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];

  function applyTheme(choice) {
    const resolved = choice === 'system' 
      ? (systemTheme.matches ? 'light' : 'dark') 
      : choice;
    root.dataset.theme = resolved;
    root.dataset.themePreference = choice;
    themeButtons.forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.themeChoice === choice);
    });
  }

  const initialTheme = localStorage.getItem('frame-theme') || 'dark';
  applyTheme(initialTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.themeChoice;
      localStorage.setItem('frame-theme', choice);
      applyTheme(choice);
      playSound('click');
    });
  });

  systemTheme.addEventListener('change', () => {
    if ((localStorage.getItem('frame-theme') || 'dark') === 'system') {
      applyTheme('system');
    }
  });

  /* ==========================================================================
     2. WEB AUDIO SYNTHESIZER (Camera Shutter & Sound FX)
     ========================================================================== */
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('frame-sound') === 'true';

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.classList.toggle('is-active', soundEnabled);
    const soundText = soundToggle.querySelector('.sound-text');
    if (soundText) soundText.textContent = soundEnabled ? 'FX ON' : 'FX OFF';

    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('frame-sound', soundEnabled);
      soundToggle.classList.toggle('is-active', soundEnabled);
      if (soundText) soundText.textContent = soundEnabled ? 'FX ON' : 'FX OFF';
      if (soundEnabled) {
        initAudio();
        playSound('shutter');
      }
    });
  }

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'click') {
      // Gentle tactile mechanical click
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'shutter') {
      // 35mm SLR mechanical shutter click + mirror slap
      const bufferSize = audioCtx.sampleRate * 0.07;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.015));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 3.0;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    } else if (type === 'beep') {
      // Film leader SMPTE synch tone (1000Hz)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  }

  /* ==========================================================================
     3. LIVE 24 FPS SMPTE TIMECODE
     ========================================================================== */
  const timecodeDisplay = document.getElementById('timecodeDisplay');
  let frameCount = 0;
  function updateTimecode() {
    frameCount = (frameCount + 1) % 24;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const f = String(frameCount).padStart(2, '0');
    if (timecodeDisplay) {
      timecodeDisplay.textContent = `${h}:${m}:${s}:${f}`;
    }
  }
  setInterval(updateTimecode, 1000 / 24);

  // India Standard Time clock
  const studioClock = document.getElementById('studioClock');
  function updateStudioClock() {
    if (!studioClock) return;
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const istTime = new Intl.DateTimeFormat([], options).format(new Date());
    studioClock.textContent = `${istTime} IST`;
  }
  updateStudioClock();
  setInterval(updateStudioClock, 1000);

  /* ==========================================================================
     4. CUSTOM RETICLE VIEWFINDER CURSOR
     ========================================================================== */
  const cursor = document.getElementById('customCursor');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  if (cursor && !prefersReduced.matches && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      curX += (mouseX - curX) * 0.22;
      curY += (mouseY - curY) * 0.22;
      cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Image hover trigger
    document.querySelectorAll('.project-frame, .portrait-frame').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering-image'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering-image'));
    });

    // Link/Button hover trigger
    document.querySelectorAll('a, button, .chip').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering-link'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering-link'));
    });
  }

  /* ==========================================================================
     5. 35MM ACADEMY COUNTDOWN LEADER
     ========================================================================== */
  let countdownTimer = null;

  function runCountdown() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (prefersReduced.matches) {
      hero.classList.remove('is-counting');
      return;
    }

    let leader = document.querySelector('.leader-countdown');
    if (!leader) {
      // Re-create leader if user clicks "REPLAY LEADER"
      leader = document.createElement('div');
      leader.className = 'leader-countdown';
      leader.setAttribute('data-frame', 'number');
      leader.setAttribute('aria-hidden', 'true');
      leader.innerHTML = `
        <div class="leader-target">
          <div class="target-crosshair horiz"></div>
          <div class="target-crosshair vert"></div>
          <div class="target-circle c1"></div>
          <div class="target-circle c2"></div>
          <div class="target-sweep"></div>
        </div>
        <span class="leader-number is-ticking">3</span>
        <div class="leader-hud">
          <span class="film-stock-tag">35MM SMPTE // 5219</span>
          <span class="take-tag">TAKE 001 · 24 FPS</span>
        </div>
      `;
      hero.appendChild(leader);
    }

    hero.classList.add('is-counting');
    const number = leader.querySelector('.leader-number');
    const values = ['3', '2', '1', '●'];
    let frame = 0;

    if (number) number.textContent = values[0];
    playSound('beep');

    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
      frame += 1;
      if (frame < values.length) {
        if (number) {
          number.textContent = values[frame];
          number.classList.remove('is-ticking');
          void number.offsetWidth;
          number.classList.add('is-ticking');
        }
        playSound(values[frame] === '●' ? 'shutter' : 'beep');
      } else {
        clearInterval(countdownTimer);
        leader.animate([
          { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(0.6)' }
        ], {
          duration: 500,
          easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
          fill: 'forwards'
        }).finished.then(() => {
          leader.remove();
          hero.classList.remove('is-counting');
        });
      }
    }, 450);
  }

  runCountdown();

  const replayBtn = document.getElementById('replayCountdownBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      runCountdown();
      playSound('click');
    });
  }

  /* ==========================================================================
     6. FULLSCREEN NAVIGATION MENU
     ========================================================================== */
  const menu = document.getElementById('site-menu');
  const menuButton = document.querySelector('.menu-trigger');
  const closeButton = document.querySelector('.menu-close');
  const menuLinks = [...document.querySelectorAll('.menu-links a')];
  let lastMenuFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    closeButton?.focus();
    playSound('click');
  }

  function closeMenu(targetSelector) {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    const delay = prefersReduced.matches ? 0 : 500;
    setTimeout(() => {
      menu.inert = true;
      menu.setAttribute('aria-hidden', 'true');
      if (targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } else {
        lastMenuFocusedElement?.focus();
      }
    }, delay);
  }

  if (menuButton && closeButton) {
    menuButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', () => closeMenu());
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        closeMenu(target);
        playSound('click');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  /* ==========================================================================
     7. CURATED GALLERY: DYNAMIC MASONRY, PROGRESSIVE BLUR & SCROLL REVEAL (PHASE 3)
     ========================================================================== */
  const galleryGrid = document.getElementById('galleryGrid');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryCountStatus = document.getElementById('galleryCountStatus');

  let allPhotos = [];
  let activeFilteredPhotos = [];
  let galleryObserver = null;
  let currentFilteredIndex = 0;
  let lastLbFocusedElement = null;

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lbBackdrop = document.getElementById('lightboxBackdrop');
  const lbCloseBtn = document.getElementById('lightboxCloseBtn');
  const lbPrevBtn = document.getElementById('lbPrevBtn');
  const lbNextBtn = document.getElementById('lbNextBtn');
  const lbMediaWrapper = document.getElementById('lbMediaWrapper');
  const ratioBtns = document.querySelectorAll('.ratio-btn');

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initGallery() {
    // 1. Try reading embedded JSON first for instant zero-fetch initialization
    const embeddedScript = document.getElementById('photosData');
    if (embeddedScript && embeddedScript.textContent.trim()) {
      try {
        allPhotos = JSON.parse(embeddedScript.textContent.trim());
        renderGalleryWithFilter('all');
        setupFilterListeners();
        setupLightboxListeners();
        if (window.location.hash) {
          const target = document.querySelector(window.location.hash);
          if (target) {
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'auto', block: 'start' });
            }, 50);
          }
        }
        return;
      } catch (err) {
        console.warn('Failed to parse embedded photosData, falling back to fetch:', err);
      }
    }

    // 2. Fallback to fetch('data/photos.json')
    fetch('data/photos.json')
      .then(res => res.json())
      .then(data => {
        allPhotos = data;
        renderGalleryWithFilter('all');
        setupFilterListeners();
        setupLightboxListeners();
        if (window.location.hash) {
          const target = document.querySelector(window.location.hash);
          if (target) {
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'auto', block: 'start' });
            }, 50);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load photos.json:', err);
      });
  }

  function getColumnCount() {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  }

  function renderGalleryWithFilter(filter = 'all') {
    if (!galleryGrid) return;

    if (filter === 'all') {
      activeFilteredPhotos = [...allPhotos];
    } else {
      activeFilteredPhotos = allPhotos.filter(p => p.category === filter);
    }

    // Update status counter
    if (galleryCountStatus) {
      const activeName = filter === 'all' ? 'ALL' : filter.toUpperCase();
      galleryCountStatus.innerHTML = '<span>SHOWING: ' + String(activeFilteredPhotos.length).padStart(2, '0') + ' / ' + String(allPhotos.length).padStart(2, '0') + ' FRAMES (' + activeName + ')</span>';
    }

    // Disconnect any existing observer
    if (galleryObserver) {
      galleryObserver.disconnect();
    }

    galleryGrid.innerHTML = '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const numCols = getColumnCount();

    // Distribute photos into columns with equal item count and balanced heights
    const colBuckets = Array.from({ length: numCols }, () => []);
    const colHeights = new Array(numCols).fill(0);
    const maxItemsPerCol = Math.ceil(activeFilteredPhotos.length / numCols);

    activeFilteredPhotos.forEach((photo, idx) => {
      const relH = photo.height / photo.width;
      let bestCol = -1;
      let minH = Infinity;
      for (let c = 0; c < numCols; c++) {
        if (colBuckets[c].length < maxItemsPerCol && colHeights[c] < minH) {
          minH = colHeights[c];
          bestCol = c;
        }
      }
      if (bestCol === -1) bestCol = 0;
      colBuckets[bestCol].push({ photo, idx });
      colHeights[bestCol] += relH;
    });

    // Compute column scale factor so all columns finish at the EXACT same baseline at the bottom!
    const targetHeight = Math.max(...colHeights);
    const colScales = colHeights.map(h => (h > 0 ? targetHeight / h : 1));

    // Render columns and cards
    colBuckets.forEach((bucket, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = 'gallery-column';
      colEl.dataset.col = colIdx;

      const scale = colScales[colIdx] || 1;

      bucket.forEach(({ photo, idx }) => {
        const card = document.createElement('article');
        card.className = 'gallery-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-label', 'View ' + photo.title + ' (' + photo.category + ')');
        card.dataset.index = idx;
        card.dataset.slug = photo.slug;
        card.dataset.category = photo.category;
        card.id = 'frame-' + (idx + 1);

        const numStr = String(idx + 1).padStart(2, '0') + ' / ' + String(activeFilteredPhotos.length).padStart(2, '0');
        const exifStr = [photo.exif.aperture, photo.exif.shutterSpeed, photo.exif.iso ? 'ISO ' + photo.exif.iso : ''].filter(Boolean).join(' • ');

        // Scaled aspect ratio guarantees all columns align at the bottom with edge-to-edge images
        const scaledRatio = (photo.aspectRatio / scale).toFixed(4);

        card.innerHTML = `
          <div class="card-media-wrapper" style="--card-aspect-ratio: ${scaledRatio};">
            <img src="${photo.placeholder}" alt="" aria-hidden="true" class="card-placeholder">
            <img
              src="${photo.srcset['1280'] || photo.srcset['640']}"
              srcset="${photo.srcset['640']} 640w, ${photo.srcset['1280']} 1280w, ${photo.srcset['1920']} 1920w"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              alt="${escapeHtml(photo.alt)}"
              width="${photo.width}"
              height="${photo.height}"
              loading="${idx < 4 ? 'eager' : 'lazy'}"
              decoding="async"
              class="card-img"
            >
            <div class="card-overlay" aria-hidden="true">
              <div class="card-meta-top">
                <span class="card-num">${numStr}</span>
                <span class="card-category">${escapeHtml(photo.category)}</span>
              </div>
              <div class="card-meta-bottom">
                <h3 class="card-title">${escapeHtml(photo.title)}</h3>
                <p class="card-exif">${escapeHtml(exifStr)}</p>
              </div>
            </div>
          </div>
        `;

        // Progressive image loading transition
        const realImg = card.querySelector('.card-img');
        const placeholder = card.querySelector('.card-placeholder');

        const onImageLoaded = () => {
          realImg.classList.add('is-loaded');
          if (placeholder) {
            placeholder.classList.add('is-hidden');
          }
        };

        if (realImg.complete) {
          onImageLoaded();
        } else {
          realImg.addEventListener('load', onImageLoaded);
        }

        // Full-page animated blurred background spread on hover
        card.addEventListener('mouseenter', () => {
          card.classList.add('is-hovered');
        });

        card.addEventListener('mouseleave', () => {
          card.classList.remove('is-hovered');
          });

        // In-place Click to Zoom / Focus event
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFocusCard(card, idx, photo);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFocusCard(card, idx, photo);
          }
        });

        colEl.appendChild(card);
      });

      galleryGrid.appendChild(colEl);
    });

    // Scroll Reveal with IntersectionObserver
    if (prefersReducedMotion) {
      document.querySelectorAll('.gallery-card').forEach(c => c.classList.add('is-revealed'));
    } else {
      let queueCounter = 0;
      galleryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const staggerDelay = (queueCounter % 3) * 70;
            queueCounter++;
            setTimeout(() => {
              card.classList.add('is-revealed');
            }, staggerDelay);
            observer.unobserve(card);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      });

      document.querySelectorAll('.gallery-card').forEach(card => {
        galleryObserver.observe(card);
      });
    }
  }

  // Handle window resize column adjustments with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const activeTab = document.querySelector('.filter-tab.is-active');
      const filter = activeTab ? activeTab.dataset.filter : 'all';
      renderGalleryWithFilter(filter);
    }, 200);
  });

  function setupFilterListeners() {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.dataset.filter;
        renderGalleryWithFilter(filter);
        playSound('click');
      });
    });
  }

  /* ==========================================================================
     IN-PLACE CLICK ZOOM / FOCUS SYSTEM (PHASE 4)
     ========================================================================== */
  let activeFocusedCard = null;
  let activeFocusedIndex = -1;
  let focusBackdrop = null;

  function ensureFocusBackdrop() {
    if (!focusBackdrop) {
      focusBackdrop = document.getElementById('galleryFocusBackdrop');
      if (!focusBackdrop) {
        focusBackdrop = document.createElement('div');
        focusBackdrop.id = 'galleryFocusBackdrop';
        focusBackdrop.className = 'gallery-focus-backdrop';
        document.body.appendChild(focusBackdrop);
      }
      focusBackdrop.addEventListener('click', () => {
        unfocusCurrentCard();
      });
    }
  }

  function toggleFocusCard(card, idx, photo) {
    if (activeFocusedCard === card) {
      unfocusCurrentCard();
    } else {
      focusCard(card, idx, photo);
    }
  }

  function focusCard(card, idx, photo) {
    ensureFocusBackdrop();

    if (activeFocusedCard && activeFocusedCard !== card) {
      activeFocusedCard.classList.remove('is-focused');
    }

    activeFocusedCard = card;
    activeFocusedIndex = idx;
    card.classList.add('is-focused');

    if (galleryGrid) {
      galleryGrid.classList.add('has-focused-card');
    }
    if (focusBackdrop) {
      focusBackdrop.classList.add('is-active');
    }

    // Gentle scroll adjustment if card is out of comfortable viewing bounds
    const rect = card.getBoundingClientRect();
    if (rect.top < 70 || rect.bottom > window.innerHeight - 30) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    playSound('click');
  }

  function unfocusCurrentCard() {
    if (activeFocusedCard) {
      activeFocusedCard.classList.remove('is-focused');
      activeFocusedCard = null;
      activeFocusedIndex = -1;
    }
    if (galleryGrid) {
      galleryGrid.classList.remove('has-focused-card');
    }
    if (focusBackdrop) {
      focusBackdrop.classList.remove('is-active');
    }
    playSound('click');
  }

  // Keyboard navigation & dismissal for in-place focus mode
  window.addEventListener('keydown', (e) => {
    if (!activeFocusedCard) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      unfocusCurrentCard();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const allCards = Array.from(galleryGrid.querySelectorAll('.gallery-card:not(.is-filtered-out)'));
      if (allCards.length > 0) {
        const curIdx = allCards.indexOf(activeFocusedCard);
        const nextIdx = (curIdx + 1) % allCards.length;
        const nextPhotoIdx = parseInt(allCards[nextIdx].dataset.index, 10);
        focusCard(allCards[nextIdx], nextIdx, allPhotos[nextPhotoIdx]);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const allCards = Array.from(galleryGrid.querySelectorAll('.gallery-card:not(.is-filtered-out)'));
      if (allCards.length > 0) {
        const curIdx = allCards.indexOf(activeFocusedCard);
        const prevIdx = (curIdx - 1 + allCards.length) % allCards.length;
        const prevPhotoIdx = parseInt(allCards[prevIdx].dataset.index, 10);
        focusCard(allCards[prevIdx], prevIdx, allPhotos[prevPhotoIdx]);
      }
    }
  });

  // Clicking outside any card closes in-place focus
  document.addEventListener('click', (e) => {
    if (activeFocusedCard && !activeFocusedCard.contains(e.target)) {
      unfocusCurrentCard();
    }
  });

  /* ==========================================================================
     8. CINEMATIC LIGHTBOX MODAL (FOLLOWS FILTERED SET & REAL EXIF)
     ========================================================================== */
  function openLightbox(index) {
    if (!activeFilteredPhotos || activeFilteredPhotos.length === 0) return;
    lastLbFocusedElement = document.activeElement;
    currentFilteredIndex = index;
    renderLightboxPhoto();
    if (typeof lightboxModal.showModal === 'function') {
      lightboxModal.showModal();
    } else {
      lightboxModal.setAttribute('open', '');
    }
    lbCloseBtn?.focus();
    playSound('shutter');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    if (typeof lightboxModal.close === 'function') {
      lightboxModal.close();
    } else {
      lightboxModal.removeAttribute('open');
    }
    if (lastLbFocusedElement && typeof lastLbFocusedElement.focus === 'function') {
      lastLbFocusedElement.focus();
    }
    playSound('click');
  }

  function renderLightboxPhoto() {
    const photo = activeFilteredPhotos[currentFilteredIndex];
    if (!photo) return;

    const lbIndexEl = document.getElementById('lbIndex');
    if (lbIndexEl) {
      lbIndexEl.textContent = `FRAME ${String(currentFilteredIndex + 1).padStart(2, '0')} // ${String(activeFilteredPhotos.length).padStart(2, '0')}`;
    }

    const lbAspectEl = document.getElementById('lbAspect');
    if (lbAspectEl) {
      lbAspectEl.textContent = photo.orientation === 'portrait' ? 'PORTRAIT 3:4' : 'LANDSCAPE 4:3';
    }

    const lbImage = document.getElementById('lbImage');
    if (lbImage) {
      lbImage.src = photo.srcset['1920'] || photo.srcset['1280'];
      lbImage.srcset = `${photo.srcset['640']} 640w, ${photo.srcset['1280']} 1280w, ${photo.srcset['1920']} 1920w`;
      lbImage.sizes = '(max-width: 900px) 100vw, 85vw';
      lbImage.alt = photo.alt;
      lbImage.width = photo.width;
      lbImage.height = photo.height;
    }

    const lbCategoryEl = document.getElementById('lbCategory');
    if (lbCategoryEl) lbCategoryEl.textContent = photo.category.toUpperCase();

    const lbTitleEl = document.getElementById('lbTitle');
    if (lbTitleEl) lbTitleEl.textContent = photo.title;

    const lbYearEl = document.getElementById('lbYear');
    if (lbYearEl) {
      lbYearEl.textContent = photo.dateTaken ? photo.dateTaken.slice(0, 4) : '2026';
    }

    const lbDescEl = document.getElementById('lbDesc');
    if (lbDescEl) {
      lbDescEl.textContent = photo.curationWhy || photo.alt;
    }

    const lbCameraEl = document.getElementById('lbCamera');
    if (lbCameraEl) {
      lbCameraEl.textContent = `${photo.exif.make || 'Samsung'} ${photo.exif.model || 'Galaxy S23'}`;
    }

    const lbLocationEl = document.getElementById('lbLocation');
    if (lbLocationEl) {
      const parts = [
        photo.exif.lens,
        photo.exif.focalLength,
        photo.exif.aperture,
        photo.exif.shutterSpeed,
        photo.exif.iso ? `ISO ${photo.exif.iso}` : ''
      ].filter(Boolean);
      lbLocationEl.textContent = parts.join(' • ');
    }
  }

  function setupLightboxListeners() {
    lbCloseBtn?.addEventListener('click', closeLightbox);
    lbBackdrop?.addEventListener('click', closeLightbox);
    const lbImg = document.getElementById('lbImage');
    lbImg?.addEventListener('click', closeLightbox);

    if (lbPrevBtn && lbNextBtn) {
      lbPrevBtn.addEventListener('click', () => {
        if (!activeFilteredPhotos.length) return;
        currentFilteredIndex = (currentFilteredIndex - 1 + activeFilteredPhotos.length) % activeFilteredPhotos.length;
        renderLightboxPhoto();
        playSound('click');
      });

      lbNextBtn.addEventListener('click', () => {
        if (!activeFilteredPhotos.length) return;
        currentFilteredIndex = (currentFilteredIndex + 1) % activeFilteredPhotos.length;
        renderLightboxPhoto();
        playSound('click');
      });
    }

    // Keyboard navigation: Left/Right arrows cycle filtered set, Escape closes
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal || !lightboxModal.open) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        lbPrevBtn?.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        lbNextBtn?.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      }
    });

    // Aspect ratio simulator buttons inside lightbox
    ratioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ratioBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const ratio = btn.dataset.ratio;
        if (lbMediaWrapper) {
          lbMediaWrapper.className = 'lightbox-media-wrapper';
          if (ratio === 'cinema') lbMediaWrapper.classList.add('ratio-cinema');
          else if (ratio === 'classic') lbMediaWrapper.classList.add('ratio-classic');
        }
        playSound('click');
      });
    });
  }

  // Fire gallery initialization
  initGallery();

  /* ==========================================================================
     9. SHOWREEL VIDEO MODAL
     ========================================================================== */
  const showreelModal = document.getElementById('showreelModal');
  const showreelBtn = document.getElementById('watchReelBtn');
  const showreelCloseBtn = document.getElementById('showreelCloseBtn');
  const showreelBackdrop = document.getElementById('showreelBackdrop');

  const inPageReelPlayBtn = document.getElementById('inPageReelPlayBtn');
  if (inPageReelPlayBtn && showreelModal) {
    inPageReelPlayBtn.addEventListener('click', () => {
      showreelModal.showModal();
      playSound('shutter');
    });
  }

  if (showreelBtn && showreelModal) {
    showreelBtn.addEventListener('click', () => {
      showreelModal.showModal();
      playSound('shutter');
    });

    showreelCloseBtn?.addEventListener('click', () => {
      showreelModal.close();
      playSound('click');
    });

    showreelBackdrop?.addEventListener('click', () => {
      showreelModal.close();
      playSound('click');
    });
  }

  /* ==========================================================================
     10. INTERACTIVE BOOKING CONCIERGE & SHOOT BUILDER
     ========================================================================== */
  const conciergeSummary = document.getElementById('conciergeSummary');
  const generateEmailBtn = document.getElementById('generateEmailBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailText = document.getElementById('copyEmailText');

  const selectedChips = {
    'project-type': 'Photography Idea',
    'timeline': 'Soon',
    'location': 'Pune'
  };

  document.querySelectorAll('.chip-group').forEach(group => {
    const groupName = group.dataset.group;
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        selectedChips[groupName] = chip.dataset.val;
        updateConcierge();
        playSound('click');
      });
    });
  });

  function updateConcierge() {
    if (!conciergeSummary || !generateEmailBtn) return;
    const type = selectedChips['project-type'];
    const time = selectedChips['timeline'];
    const loc = selectedChips['location'];

    conciergeSummary.innerHTML = `<span>MESSAGE: <b>${type}</b> // <b>${time}</b> // <b>${loc}</b></span>`;

    const subject = encodeURIComponent(`Hello Tanmay — ${type}`);
    const body = encodeURIComponent(
      `Hi Tanmay,\n\nI wanted to talk about: ${type}\n` +
      `• When: ${time}\n` +
      `• I'm based in: ${loc}\n\n` +
      `A little more about it:\n`
    );

    generateEmailBtn.href = `mailto:tchavan265@gmail.com?subject=${subject}&body=${body}`;
  }

  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText('tchavan265@gmail.com');
      const old = copyEmailText.textContent;
      copyEmailText.textContent = 'COPIED TO CLIPBOARD! ✓';
      playSound('click');
      setTimeout(() => { copyEmailText.textContent = old; }, 2000);
    });
  }

  /* ==========================================================================
     11. INTERSECTION OBSERVER ENTRANCE ANIMATIONS
     ========================================================================== */
  if ('IntersectionObserver' in window && !prefersReduced.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.service-card, .discipline-card, .laurel-item, .ig-card, .ig-profile-card, .stories-module').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 600ms cubic-bezier(0.19, 1, 0.22, 1), transform 600ms cubic-bezier(0.19, 1, 0.22, 1)';
      observer.observe(el);
    });
  }

  /* ==========================================================================
     12. INSTAGRAM INTEGRATION & IMMERSIVE STORY VIEWER (@io.tanmay)
     ========================================================================== */
  let instagramData = {
    profile: null,
    posts: [],
    stories: [],
    highlights: []
  };

  const instagramGrid = document.getElementById('instagramGrid');
  const filterButtons = [...document.querySelectorAll('.ig-filter-btn')];
  const storyViewerModal = document.getElementById('storyViewerModal');
  const storyBackdrop = document.getElementById('storyBackdrop');
  const storyCloseBtn = document.getElementById('storyCloseBtn');
  const storyProgressBarContainer = document.getElementById('storyProgressBarContainer');
  const storyPlayPauseBtn = document.getElementById('storyPlayPauseBtn');
  const storyPlayIcon = document.getElementById('storyPlayIcon');
  const storyMuteBtn = document.getElementById('storyMuteBtn');
  const storyMuteIcon = document.getElementById('storyMuteIcon');
  const storyImage = document.getElementById('storyImage');
  const storyVideo = document.getElementById('storyVideo');
  const storyCaptionTray = document.getElementById('storyCaptionTray');
  const storyCaptionText = document.getElementById('storyCaptionText');
  const storyTimestamp = document.getElementById('storyTimestamp');
  const storyGroupBadge = document.getElementById('storyGroupBadge');
  const storyIgLink = document.getElementById('storyIgLink');
  const storyTapLeft = document.getElementById('storyTapLeft');
  const storyTapRight = document.getElementById('storyTapRight');
  const storyActiveRing = document.getElementById('storyActiveRing');

  // Story Viewer Playback State
  let currentStoryGroup = [];
  let currentStoryIndex = 0;
  let storyTimer = null;
  let storyProgressInterval = null;
  let storyProgressStartTime = 0;
  let storyProgressDuration = 5000;
  let storyElapsedBeforePause = 0;
  let isStoryPaused = false;
  let isStoryMuted = true;

  // Fetch Instagram Data from Local Proxy or Fallback JSON
  async function loadInstagramFeed() {
    try {
      // First try local backend proxy endpoints
      const [resProfile, resPosts, resStories, resHighlights] = await Promise.allSettled([
        fetch('/api/instagram/profile').then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch('/api/instagram/posts').then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch('/api/instagram/stories').then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch('/api/instagram/highlights').then(r => r.ok ? r.json() : Promise.reject(r.status))
      ]);

      if (resProfile.status === 'fulfilled' && resPosts.status === 'fulfilled') {
        instagramData.profile = resProfile.value;
        instagramData.posts = resPosts.value.posts || [];
        instagramData.stories = resStories.status === 'fulfilled' ? (resStories.value.stories || []) : [];
        instagramData.highlights = resHighlights.status === 'fulfilled' ? (resHighlights.value.highlights || []) : [];
        updateProfileUI(instagramData.profile, resPosts.value.is_live_api);
      } else {
        // Fallback to static JSON
        await fetchFallbackData();
      }
    } catch (err) {
      console.warn('[FRAME] Proxy not detected, fetching static data source:', err);
      await fetchFallbackData();
    }

    renderPostsGrid('all');
    updateCounts();
  }

  async function fetchFallbackData() {
    try {
      const resp = await fetch('data/instagram-fallback.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      instagramData = data;
      updateProfileUI(data.profile, false);
    } catch (e) {
      console.error('[FRAME] Could not load instagram fallback data:', e);
    }
  }

  function updateProfileUI(profile, isLive) {
    if (!profile) return;
    const badgeText = document.getElementById('igApiStatusText');
    const badgeDot = document.querySelector('.status-pulse-dot');
    if (badgeText) {
      badgeText.textContent = isLive ? 'API: LIVE GRAPH FEED' : 'API: CURATED PROXY';
      if (!isLive && badgeDot) {
        badgeDot.style.background = '#e6a457';
        badgeDot.style.boxShadow = '0 0 10px rgba(230, 164, 87, 0.6)';
      }
    }

    const igAvatarImg = document.getElementById('igAvatarImg');
    if (igAvatarImg && profile.profile_picture_url) {
      igAvatarImg.src = profile.profile_picture_url;
    }

    const igHandle = document.getElementById('igHandle');
    if (igHandle && profile.username) {
      igHandle.textContent = profile.username;
    }

    const igProfileName = document.getElementById('igProfileName');
    if (igProfileName && profile.name) {
      igProfileName.textContent = profile.name;
    }

    const igFollowLink = document.getElementById('igFollowLink');
    if (igFollowLink && profile.profile_url) {
      igFollowLink.href = profile.profile_url;
    }

    const igMediaCount = document.getElementById('igMediaCount');
    if (igMediaCount) {
      igMediaCount.textContent = profile.posts_count || profile.media_count || 14;
    }

    const igFollowersCount = document.getElementById('igFollowersCount');
    if (igFollowersCount) {
      igFollowersCount.textContent = profile.followers_count || 529;
    }

    const igFollowingCount = document.getElementById('igFollowingCount');
    if (igFollowingCount) {
      igFollowingCount.textContent = profile.following_count || 722;
    }
  }

  function updateCounts() {
    const posts = instagramData.posts || [];
    const countAll = document.getElementById('countAll');
    const countReels = document.getElementById('countReels');
    const countCarousels = document.getElementById('countCarousels');
    const countStills = document.getElementById('countStills');

    if (countAll) countAll.textContent = posts.length;
    if (countReels) countReels.textContent = posts.filter(p => p.media_type === 'VIDEO').length;
    if (countCarousels) countCarousels.textContent = posts.filter(p => p.media_type === 'CAROUSEL_ALBUM').length;
    if (countStills) countStills.textContent = posts.filter(p => p.media_type === 'IMAGE').length;
  }

  function renderPostsGrid(filter = 'all') {
    if (!instagramGrid) return;
    const posts = instagramData.posts || [];
    const filtered = filter === 'all' 
      ? posts 
      : posts.filter(p => p.media_type === filter);

    instagramGrid.innerHTML = '';

    if (filtered.length === 0) {
      instagramGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-muted);" class="mono">
          NO POSTS FOUND FOR THIS CATEGORY.
        </div>
      `;
      return;
    }

    filtered.forEach((post, idx) => {
      const card = document.createElement('article');
      card.className = 'ig-card';
      card.tabIndex = 0;
      card.setAttribute('data-id', post.id);

      const typeLabel = post.media_type === 'VIDEO' ? 'REEL' : (post.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : 'STILL');
      const typeIcon = post.media_type === 'VIDEO' ? '▶' : (post.media_type === 'CAROUSEL_ALBUM' ? '❐' : '◻');
      const formattedDate = post.timestamp ? new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'RECENT';

      card.innerHTML = `
        <div class="ig-card-media-wrapper">
          <img src="${post.thumbnail_url || post.media_url}" 
               alt="${post.caption ? escapeHTML(post.caption.slice(0, 80)) : 'Instagram post by @io.tanmay'}" 
               loading="lazy" class="ig-card-img">
          <div class="ig-type-badge">
            <span class="ig-type-icon">${typeIcon}</span>
            <span>${typeLabel}</span>
          </div>
          <div class="ig-hover-overlay">
            <a href="${post.permalink || 'https://instagram.com/io.tanmay'}" target="_blank" rel="noopener noreferrer" class="ig-action-cta" title="Open directly in Instagram app/tab">
              <span>INSTAGRAM</span>
              <span>↗</span>
            </a>
          </div>
        </div>
        <div class="ig-card-info">
          <div class="ig-card-meta-top mono">
            <span class="ig-card-tag">${post.tag || typeLabel}</span>
            <span>${formattedDate}</span>
          </div>
          <p class="ig-card-caption">${post.caption ? escapeHTML(post.caption) : 'Post from @io.tanmay feed.'}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        playSound('shutter');
        window.open(post.permalink || 'https://instagram.com/io.tanmay', '_blank', 'noopener,noreferrer');
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playSound('shutter');
          window.open(post.permalink || 'https://instagram.com/io.tanmay', '_blank', 'noopener,noreferrer');
        }
      });

      instagramGrid.appendChild(card);
    });
  }

  // Instagram Post Lightbox & Embed Modal Elements
  const igPostModal = document.getElementById('igPostModal');
  const igPostBackdrop = document.getElementById('igPostBackdrop');
  const igPostCloseBtn = document.getElementById('igPostCloseBtn');
  const igModalIframe = document.getElementById('igModalIframe');
  const igModalTypeTag = document.getElementById('igModalTypeTag');
  const igModalDate = document.getElementById('igModalDate');
  const igModalHandle = document.getElementById('igModalHandle');
  const igModalAuthorCollab = document.getElementById('igModalAuthorCollab');
  const igModalTitle = document.getElementById('igModalTitle');
  const igModalCaption = document.getElementById('igModalCaption');
  const igModalAudio = document.getElementById('igModalAudio');
  const igModalLikes = document.getElementById('igModalLikes');
  const igModalComments = document.getElementById('igModalComments');
  const igModalDirectLink = document.getElementById('igModalDirectLink');
  const igModalPrevBtn = document.getElementById('igModalPrevBtn');
  const igModalNextBtn = document.getElementById('igModalNextBtn');

  let currentIgPostList = [];
  let currentIgPostIndex = 0;

  function openInstagramPostModal(post, list) {
    if (!igPostModal) return;
    currentIgPostList = list && list.length ? list : (instagramData.posts || []);
    currentIgPostIndex = currentIgPostList.findIndex(p => p.id === post.id);
    if (currentIgPostIndex === -1) currentIgPostIndex = 0;
    renderInstagramModalContent();
    igPostModal.showModal();
    playSound('shutter');
  }

  function closeInstagramPostModal() {
    if (igPostModal && igPostModal.open) {
      if (igModalIframe) igModalIframe.src = '';
      igPostModal.close();
      playSound('click');
    }
  }

  function renderInstagramModalContent() {
    const post = currentIgPostList[currentIgPostIndex];
    if (!post) return;

    const typeLabel = post.media_type === 'VIDEO' ? 'REEL' : (post.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : 'STILL');
    const formattedDate = post.timestamp ? new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'RECENT';

    if (igModalTypeTag) igModalTypeTag.textContent = `${typeLabel} // @IO.TANMAY`;
    if (igModalDate) igModalDate.textContent = formattedDate;
    if (igModalAuthorCollab) igModalAuthorCollab.textContent = post.author || 'TANMAY CHAVAN';
    if (igModalTitle) igModalTitle.textContent = post.title || (post.caption ? post.caption.slice(0, 40) + '...' : 'Instagram Post');
    if (igModalCaption) igModalCaption.textContent = post.caption || '';
    if (igModalAudio) igModalAudio.textContent = post.audio || 'Original Audio · io.tanmay';
    if (igModalDirectLink) igModalDirectLink.href = post.permalink || 'https://instagram.com/io.tanmay';

    // Embed URL
    if (igModalIframe) {
      const embedSrc = post.embed_url || `https://www.instagram.com/p/${post.shortcode || ''}/embed/captioned/`;
      igModalIframe.src = embedSrc;
    }
  }

  igPostCloseBtn?.addEventListener('click', closeInstagramPostModal);
  igPostBackdrop?.addEventListener('click', closeInstagramPostModal);

  igModalPrevBtn?.addEventListener('click', () => {
    if (!currentIgPostList.length) return;
    currentIgPostIndex = (currentIgPostIndex - 1 + currentIgPostList.length) % currentIgPostList.length;
    renderInstagramModalContent();
    playSound('click');
  });

  igModalNextBtn?.addEventListener('click', () => {
    if (!currentIgPostList.length) return;
    currentIgPostIndex = (currentIgPostIndex + 1) % currentIgPostList.length;
    renderInstagramModalContent();
    playSound('click');
  });

  document.addEventListener('keydown', (e) => {
    if (!igPostModal || !igPostModal.open) return;
    if (e.key === 'ArrowLeft') {
      igModalPrevBtn?.click();
    } else if (e.key === 'ArrowRight') {
      igModalNextBtn?.click();
    }
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }

  // Filter Button Interactions
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      renderPostsGrid(filter);
      playSound('click');
    });
  });

  // Story Trigger Setup (Active Stories & Highlights)
  function setupStoryTriggers() {
    document.querySelectorAll('.story-ring-item').forEach(item => {
      item.addEventListener('click', () => {
        const groupKey = item.dataset.storyGroup;
        openStoryViewer(groupKey);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const groupKey = item.dataset.storyGroup;
          openStoryViewer(groupKey);
        }
      });
    });
  }

  function openStoryViewer(groupKey) {
    let items = [];
    let groupTitle = 'STORIES';

    if (groupKey === 'active') {
      items = instagramData.stories || [];
      groupTitle = 'ACTIVE (24H)';
    } else {
      const hl = (instagramData.highlights || []).find(h => h.id === groupKey);
      if (hl) {
        items = hl.items || [];
        groupTitle = hl.title || 'HIGHLIGHT';
      }
    }

    if (!items || items.length === 0) {
      alert('No active stories found for this category.');
      return;
    }

    currentStoryGroup = items;
    currentStoryIndex = 0;
    if (storyGroupBadge) storyGroupBadge.textContent = groupTitle;

    buildProgressBars(items.length);
    showCurrentStory();

    if (storyViewerModal) {
      storyViewerModal.showModal();
      playSound('shutter');
    }
  }

  function buildProgressBars(count) {
    if (!storyProgressBarContainer) return;
    storyProgressBarContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const seg = document.createElement('div');
      seg.className = 'story-progress-bar-segment';
      seg.innerHTML = '<div class="story-progress-bar-fill"></div>';
      storyProgressBarContainer.appendChild(seg);
    }
  }

  function updateProgressBars() {
    const segments = storyProgressBarContainer.querySelectorAll('.story-progress-bar-segment');
    segments.forEach((seg, i) => {
      const fill = seg.querySelector('.story-progress-bar-fill');
      if (i < currentStoryIndex) {
        seg.classList.add('is-completed');
        if (fill) fill.style.width = '100%';
      } else if (i === currentStoryIndex) {
        seg.classList.remove('is-completed');
      } else {
        seg.classList.remove('is-completed');
        if (fill) fill.style.width = '0%';
      }
    });
  }

  function showCurrentStory() {
    if (currentStoryIndex < 0 || currentStoryIndex >= currentStoryGroup.length) {
      closeStoryViewer();
      return;
    }

    clearStoryTimers();
    updateProgressBars();

    const story = currentStoryGroup[currentStoryIndex];
    const isVideo = story.media_type === 'VIDEO';

    if (storyCaptionText && storyCaptionTray) {
      if (story.caption) {
        storyCaptionText.textContent = story.caption;
        storyCaptionTray.style.display = 'block';
      } else {
        storyCaptionTray.style.display = 'none';
      }
    }

    if (storyTimestamp) {
      storyTimestamp.textContent = story.timestamp 
        ? new Date(story.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : '2H AGO';
    }

    if (storyIgLink) {
      storyIgLink.href = story.permalink || 'https://instagram.com/io.tanmay';
    }

    storyProgressDuration = 5000;
    storyElapsedBeforePause = 0;
    isStoryPaused = false;
    if (storyPlayIcon) storyPlayIcon.textContent = '⏸';

    if (isVideo) {
      if (storyImage) storyImage.classList.add('is-hidden');
      if (storyVideo) {
        storyVideo.classList.remove('is-hidden');
        storyVideo.src = story.media_url;
        storyVideo.muted = isStoryMuted;
        storyVideo.currentTime = 0;

        const onLoaded = () => {
          if (storyVideo.duration && !isNaN(storyVideo.duration)) {
            storyProgressDuration = Math.min(Math.max(storyVideo.duration * 1000, 3000), 15000);
          }
          startStoryProgression();
          storyVideo.play().catch(() => {});
          storyVideo.removeEventListener('loadedmetadata', onLoaded);
        };

        storyVideo.addEventListener('loadedmetadata', onLoaded);
        storyVideo.load();
      }
    } else {
      if (storyVideo) {
        storyVideo.pause();
        storyVideo.classList.add('is-hidden');
      }
      if (storyImage) {
        storyImage.classList.remove('is-hidden');
        storyImage.src = story.media_url;
      }
      startStoryProgression();
    }
  }

  function startStoryProgression() {
    clearStoryTimers();
    storyProgressStartTime = Date.now() - storyElapsedBeforePause;
    const currentSeg = storyProgressBarContainer?.children[currentStoryIndex];
    const fill = currentSeg?.querySelector('.story-progress-bar-fill');

    storyProgressInterval = setInterval(() => {
      if (isStoryPaused) return;
      const elapsed = Date.now() - storyProgressStartTime;
      const percent = Math.min((elapsed / storyProgressDuration) * 100, 100);
      if (fill) fill.style.width = `${percent}%`;

      if (elapsed >= storyProgressDuration) {
        clearStoryTimers();
        advanceStory(1);
      }
    }, 50);
  }

  function advanceStory(direction) {
    currentStoryIndex += direction;
    if (currentStoryIndex >= currentStoryGroup.length) {
      closeStoryViewer();
    } else if (currentStoryIndex < 0) {
      currentStoryIndex = 0;
      showCurrentStory();
    } else {
      showCurrentStory();
    }
  }

  function pauseStory() {
    if (isStoryPaused) return;
    isStoryPaused = true;
    storyElapsedBeforePause = Date.now() - storyProgressStartTime;
    if (storyVideo && !storyVideo.paused) storyVideo.pause();
    if (storyPlayIcon) storyPlayIcon.textContent = '▶';
  }

  function resumeStory() {
    if (!isStoryPaused) return;
    isStoryPaused = false;
    storyProgressStartTime = Date.now() - storyElapsedBeforePause;
    if (storyVideo && storyVideo.paused && !storyVideo.classList.contains('is-hidden')) {
      storyVideo.play().catch(() => {});
    }
    if (storyPlayIcon) storyPlayIcon.textContent = '⏸';
  }

  function togglePlayPause() {
    if (isStoryPaused) resumeStory();
    else pauseStory();
    playSound('click');
  }

  function toggleMute() {
    isStoryMuted = !isStoryMuted;
    if (storyVideo) storyVideo.muted = isStoryMuted;
    if (storyMuteIcon) storyMuteIcon.textContent = isStoryMuted ? '🔇' : '🔊';
    playSound('click');
  }

  function clearStoryTimers() {
    if (storyProgressInterval) clearInterval(storyProgressInterval);
    storyProgressInterval = null;
  }

  function closeStoryViewer() {
    clearStoryTimers();
    if (storyVideo) {
      storyVideo.pause();
      storyVideo.src = '';
    }
    if (storyViewerModal && storyViewerModal.open) {
      storyViewerModal.close();
      playSound('click');
    }
  }

  // Modal Listeners
  storyCloseBtn?.addEventListener('click', closeStoryViewer);
  storyBackdrop?.addEventListener('click', closeStoryViewer);
  storyPlayPauseBtn?.addEventListener('click', togglePlayPause);
  storyMuteBtn?.addEventListener('click', toggleMute);

  storyTapLeft?.addEventListener('click', () => {
    playSound('click');
    advanceStory(-1);
  });

  storyTapRight?.addEventListener('click', () => {
    playSound('click');
    advanceStory(1);
  });

  // Hold to pause interaction
  let holdTimeout = null;
  const mediaStage = document.getElementById('storyMediaStage');

  if (mediaStage) {
    mediaStage.addEventListener('mousedown', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      holdTimeout = setTimeout(() => { pauseStory(); }, 180);
    });

    window.addEventListener('mouseup', () => {
      if (holdTimeout) clearTimeout(holdTimeout);
      if (isStoryPaused && storyViewerModal?.open) {
        resumeStory();
      }
    });

    mediaStage.addEventListener('touchstart', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      holdTimeout = setTimeout(() => { pauseStory(); }, 180);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (holdTimeout) clearTimeout(holdTimeout);
      if (isStoryPaused && storyViewerModal?.open) {
        resumeStory();
      }
    });
  }

  // Touch Swipe gestures for Story Viewer
  let touchStartX = 0;
  let touchStartY = 0;

  storyViewerModal?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  storyViewerModal?.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;

    // Swipe down to dismiss
    if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
      closeStoryViewer();
      return;
    }

    // Swipe left (next) / right (prev)
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) advanceStory(1);
      else advanceStory(-1);
    }
  }, { passive: true });

  // Keyboard navigation for stories
  window.addEventListener('keydown', (e) => {
    if (!storyViewerModal || !storyViewerModal.open) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      playSound('click');
      advanceStory(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      playSound('click');
      advanceStory(-1);
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key === 'Escape') {
      closeStoryViewer();
    }
  });

  /* ==========================================================================
     INNOVATIVE OPTIC SCROLLBAR HUD & LASER PROGRESS ENGINE
     ========================================================================== */
  const opticScrollHud = document.getElementById('opticScrollHud');
  const laserBeamFill = document.getElementById('laserBeamFill');
  const opticActiveBeam = document.getElementById('opticActiveBeam');
  const opticShutterThumb = document.getElementById('opticShutterThumb');
  const opticRailTrack = document.getElementById('opticRailTrack');
  const telemetryPercent = document.getElementById('telemetryPercent');
  const telemetrySection = document.getElementById('telemetrySection');
  const opticNodes = [...document.querySelectorAll('.optic-node')];
  const hudWarpTop = document.getElementById('hudWarpTop');
  const hudWarpBottom = document.getElementById('hudWarpBottom');

  const pageSections = [
    { id: 'top', label: 'HOME', elem: document.getElementById('top') || document.body },
    { id: 'work', label: 'WORK', elem: document.getElementById('work') },
    { id: 'instagram', label: 'FEED', elem: document.getElementById('instagram') },
    { id: 'experience', label: 'CAMPUS', elem: document.getElementById('experience') },
    { id: 'about', label: 'ABOUT', elem: document.getElementById('about') },
    { id: 'showreel', label: 'REEL', elem: document.getElementById('showreel') },
    { id: 'skills', label: 'CRAFT', elem: document.getElementById('skills') },
    { id: 'contact', label: 'CONTACT', elem: document.getElementById('contact') }
  ];

  let scrollTimeout = null;
  let isDraggingScrollHud = false;

  function updateScrollTelemetry() {
    if (!opticScrollHud) {
      if (laserBeamFill) {
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight) - window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        laserBeamFill.style.width = `${progress}%`;
      }
      return;
    }
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const docHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    ) - window.innerHeight;

    const progressRatio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
    const progressPercent = Math.round(progressRatio * 100);

    // Update Top Laser Progress
    if (laserBeamFill) {
      laserBeamFill.style.width = `${progressPercent}%`;
    }

    // Update Optic Rail Active Beam and Shutter Thumb
    if (opticActiveBeam) {
      opticActiveBeam.style.height = `${progressRatio * 100}%`;
    }

    if (opticShutterThumb) {
      opticShutterThumb.style.top = `${progressRatio * 100}%`;
      opticShutterThumb.setAttribute('aria-valuenow', progressPercent);
    }

    // Update Telemetry Badge
    if (telemetryPercent) {
      telemetryPercent.textContent = `${String(progressPercent).padStart(2, '0')}%`;
    }

    // Determine current active section
    const viewportMiddle = scrollTop + (window.innerHeight * 0.35);
    let activeSec = pageSections[0];

    for (let i = pageSections.length - 1; i >= 0; i--) {
      const sec = pageSections[i];
      if (sec.elem && sec.elem.offsetTop <= viewportMiddle) {
        activeSec = sec;
        break;
      }
    }

    if (telemetrySection && activeSec) {
      telemetrySection.textContent = activeSec.label;
    }

    // Update Waypoint Nodes active class
    if (activeSec) {
      opticNodes.forEach(node => {
        const isCurrent = node.dataset.section === activeSec.id;
        node.classList.toggle('is-active', isCurrent);
      });
    }

    // Visual scroll flare state
    if (opticScrollHud) {
      opticScrollHud.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isDraggingScrollHud) {
          opticScrollHud.classList.remove('is-scrolling');
        }
      }, 900);
    }
  }

  // Bind Scroll Listener with passive performance
  window.addEventListener('scroll', updateScrollTelemetry, { passive: true });
  window.addEventListener('resize', updateScrollTelemetry, { passive: true });
  updateScrollTelemetry();

  // Warp Buttons
  hudWarpTop?.addEventListener('click', () => {
    playSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  hudWarpBottom?.addEventListener('click', () => {
    playSound('click');
    const contactSec = document.getElementById('contact');
    if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });

  // Waypoint Node Click Smooth Scroll & Audio Feedback
  opticNodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const secId = node.dataset.section;
      const target = secId === 'top' ? document.body : document.getElementById(secId);
      if (target) {
        playSound('click');
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Dragging / Scrubbing on the Optical Rail Track
  if (opticRailTrack && opticShutterThumb) {
    function scrubToPoint(clientY) {
      const rect = opticRailTrack.getBoundingClientRect();
      const relativeY = Math.min(rect.height, Math.max(0, clientY - rect.top));
      const ratio = relativeY / rect.height;
      const docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight
      ) - window.innerHeight;

      window.scrollTo({
        top: ratio * docHeight,
        behavior: 'auto'
      });
    }

    opticRailTrack.addEventListener('mousedown', (e) => {
      if (e.target.closest('.optic-node') || e.target.closest('.optic-warp-btn')) return;
      isDraggingScrollHud = true;
      opticShutterThumb.classList.add('is-dragging');
      opticScrollHud?.classList.add('is-scrolling');
      scrubToPoint(e.clientY);
      playSound('click');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingScrollHud) return;
      e.preventDefault();
      scrubToPoint(e.clientY);
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingScrollHud) {
        isDraggingScrollHud = false;
        opticShutterThumb.classList.remove('is-dragging');
        opticScrollHud?.classList.remove('is-scrolling');
      }
    });

    // Touch Scrubbing for tablets
    opticRailTrack.addEventListener('touchstart', (e) => {
      if (e.target.closest('.optic-node') || e.target.closest('.optic-warp-btn')) return;
      isDraggingScrollHud = true;
      opticShutterThumb.classList.add('is-dragging');
      opticScrollHud?.classList.add('is-scrolling');
      scrubToPoint(e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDraggingScrollHud) return;
      scrubToPoint(e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDraggingScrollHud) {
        isDraggingScrollHud = false;
        opticShutterThumb.classList.remove('is-dragging');
        opticScrollHud?.classList.remove('is-scrolling');
      }
    });
  }

  // Initialize Instagram Feed
  loadInstagramFeed();

  // Remove initial loading state
  window.addEventListener('load', () => {
    document.body.classList.remove('loading-state');
  });


  /* ==========================================================================
     HERO SHOWREEL VIDEO CONTROLLER (PHASE 4)
     ========================================================================== */
  function initHeroVideoPlayer() {
    const video = document.getElementById('heroShowreelVideo');
    const wrapper = document.querySelector('.hero-video-wrapper');
    const playBtn = document.getElementById('heroVideoPlayBtn');
    const audioToggle = document.getElementById('heroAudioToggle');
    const fullscreenBtn = document.getElementById('heroFullscreenBtn');

    if (!video || !wrapper) return;

    // Continuous autoplay playback per user requirements
    video.muted = true;
    video.loop = true;
    video.play().catch(err => {
      console.log('Video autoplay waiting for interaction:', err);
    });

    function updatePlayState() {
      if (video.paused) {
        wrapper.classList.remove('is-playing');
        if (playBtn) playBtn.innerHTML = '<span class="play-icon">▶</span>';
      } else {
        wrapper.classList.add('is-playing');
        if (playBtn) playBtn.innerHTML = '<span class="play-icon">❚❚</span>';
      }
    }

    function togglePlay() {
      if (video.paused) {
        video.play().then(updatePlayState).catch(err => {
          console.log('Video play prevented:', err);
        });
      } else {
        video.pause();
        updatePlayState();
      }
      playSound('click');
    }

    playBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    video.addEventListener('click', () => {
      togglePlay();
    });

    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('ended', () => {
      wrapper.classList.remove('is-playing');
    });

    // Audio Toggle (Muted by default)
    if (audioToggle) {
      audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        const icon = audioToggle.querySelector('.audio-icon');
        const label = audioToggle.querySelector('.audio-label');
        if (video.muted) {
          if (icon) icon.textContent = '🔇';
          if (label) label.textContent = 'SOUND OFF';
        } else {
          if (icon) icon.textContent = '🔊';
          if (label) label.textContent = 'SOUND ON';
        }
        playSound('click');
      });
    }

    // Fullscreen Toggle
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
          if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
          } else if (video.requestFullscreen) {
            video.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
        playSound('click');
      });
    }

    // Continuous loop: re-trigger on ended
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }

  // Initialize hero video player on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideoPlayer);
  } else {
    initHeroVideoPlayer();
  }

})();
  /* ==========================================================================
     REELS FILTER FUNCTIONALITY (MATCHING GALLERY FORMAT)
     ========================================================================== */
  function initReelsFilter() {
    const reelTabs = document.querySelectorAll('.reels-filter-toolbar .filter-tab');
    const motionCards = document.querySelectorAll('.motion-card');
    if (!reelTabs.length || !motionCards.length) return;

    reelTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        reelTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.dataset.reelFilter;
        motionCards.forEach(card => {
          if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        playSound('click');
      });
    });
  }

  // Initialize reels filter on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReelsFilter);
  } else {
    initReelsFilter();
  }
