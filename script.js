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
  let lastFocusedElement = null;

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
        lastFocusedElement?.focus();
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
     7. SELECTED WORK: CAROUSEL, FILTERS & DRAG-SCROLL
     ========================================================================== */
  const filmstrip = document.getElementById('filmstrip');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectFrames = [...document.querySelectorAll('.project-frame')];
  const stripPrevBtn = document.getElementById('stripPrevBtn');
  const stripNextBtn = document.getElementById('stripNextBtn');
  const stripIndicator = document.getElementById('stripIndicator');
  const viewStripBtn = document.getElementById('viewStripBtn');
  const viewGridBtn = document.getElementById('viewGridBtn');

  // Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      let visibleCount = 0;

      projectFrames.forEach(frame => {
        const match = filter === 'all' || frame.dataset.category === filter;
        frame.classList.toggle('is-hidden', !match);
        if (match) visibleCount++;
      });

      updateIndicator();
      playSound('click');
    });
  });

  // View Switcher (Filmstrip vs Grid)
  if (viewStripBtn && viewGridBtn && filmstrip) {
    viewStripBtn.addEventListener('click', () => {
      viewStripBtn.classList.add('is-active');
      viewGridBtn.classList.remove('is-active');
      filmstrip.classList.remove('is-grid-layout');
      playSound('click');
    });

    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('is-active');
      viewStripBtn.classList.remove('is-active');
      filmstrip.classList.add('is-grid-layout');
      playSound('click');
    });
  }

  // Prev / Next Navigation Arrows
  if (stripPrevBtn && stripNextBtn && filmstrip) {
    stripPrevBtn.addEventListener('click', () => {
      filmstrip.scrollBy({ left: -360, behavior: 'smooth' });
      playSound('click');
    });
    stripNextBtn.addEventListener('click', () => {
      filmstrip.scrollBy({ left: 360, behavior: 'smooth' });
      playSound('click');
    });

    filmstrip.addEventListener('scroll', () => {
      updateIndicator();
    });
  }

  function updateIndicator() {
    if (!filmstrip || !stripIndicator) return;
    const visibleFrames = projectFrames.filter(f => !f.classList.contains('is-hidden'));
    const total = visibleFrames.length;
    if (total === 0) {
      stripIndicator.textContent = '00 / 00';
      return;
    }
    const scrollLeft = filmstrip.scrollLeft;
    const itemWidth = 360;
    const currentIndex = Math.min(total, Math.max(1, Math.round(scrollLeft / itemWidth) + 1));
    stripIndicator.textContent = `${String(currentIndex).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  }

  // Mouse Drag to Scroll for Filmstrip
  let isDown = false;
  let startX;
  let scrollLeftPos;

  if (filmstrip) {
    filmstrip.addEventListener('mousedown', (e) => {
      if (filmstrip.classList.contains('is-grid-layout')) return;
      isDown = true;
      startX = e.pageX - filmstrip.offsetLeft;
      scrollLeftPos = filmstrip.scrollLeft;
    });

    filmstrip.addEventListener('mouseleave', () => { isDown = false; });
    filmstrip.addEventListener('mouseup', () => { isDown = false; });
    filmstrip.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - filmstrip.offsetLeft;
      const walk = (x - startX) * 1.5;
      filmstrip.scrollLeft = scrollLeftPos - walk;
    });
  }

  /* ==========================================================================
     8. CINEMATIC LIGHTBOX MODAL & SHOT INSPECTOR
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lbBackdrop = document.getElementById('lightboxBackdrop');
  const lbCloseBtn = document.getElementById('lightboxCloseBtn');
  const lbPrevBtn = document.getElementById('lbPrevBtn');
  const lbNextBtn = document.getElementById('lbNextBtn');
  const lbMediaWrapper = document.getElementById('lbMediaWrapper');
  const ratioBtns = document.querySelectorAll('.ratio-btn');

  let currentProjectIndex = 0;

  function openLightbox(index) {
    currentProjectIndex = index;
    renderLightboxProject();
    lightboxModal.showModal();
    playSound('shutter');
  }

  function closeLightbox() {
    lightboxModal.close();
    playSound('click');
  }

  function renderLightboxProject() {
    const frame = projectFrames[currentProjectIndex];
    if (!frame) return;

    const data = frame.dataset;
    document.getElementById('lbIndex').textContent = `FRAME 00${currentProjectIndex + 1} // REEL 0${currentProjectIndex + 1}`;
    document.getElementById('lbAspect').textContent = data.aspect || '2.39:1 SCOPE';
    document.getElementById('lbImage').src = data.img;
    document.getElementById('lbImage').alt = data.title;
    document.getElementById('lbCategory').textContent = data.type || 'EDITORIAL';
    document.getElementById('lbTitle').textContent = data.title;
    document.getElementById('lbYear').textContent = data.year;
    document.getElementById('lbDesc').textContent = data.desc;
    document.getElementById('lbCamera').textContent = data.camera;
    document.getElementById('lbFilm').textContent = data.film;
    document.getElementById('lbLocation').textContent = data.location;

    // Color Swatches
    const paletteEl = document.getElementById('lbPalette');
    paletteEl.innerHTML = '';
    const colors = (data.colors || '#0b1013,#28444a,#8ca39f,#e6532d,#f1d9b5').split(',');
    colors.forEach(hex => {
      const chip = document.createElement('div');
      chip.className = 'color-swatch-chip';
      chip.style.backgroundColor = hex.trim();
      chip.setAttribute('title', `Copy ${hex.trim()}`);
      chip.addEventListener('click', () => {
        navigator.clipboard?.writeText(hex.trim());
        const originalTitle = chip.getAttribute('title');
        chip.setAttribute('title', 'COPIED! ✓');
        playSound('click');
        setTimeout(() => chip.setAttribute('title', originalTitle), 1500);
      });
      paletteEl.appendChild(chip);
    });
  }

  projectFrames.forEach((frame, idx) => {
    frame.addEventListener('click', () => openLightbox(idx));
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (lbCloseBtn && lbBackdrop) {
    lbCloseBtn.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);
  }

  if (lbPrevBtn && lbNextBtn) {
    lbPrevBtn.addEventListener('click', () => {
      currentProjectIndex = (currentProjectIndex - 1 + projectFrames.length) % projectFrames.length;
      renderLightboxProject();
      playSound('click');
    });

    lbNextBtn.addEventListener('click', () => {
      currentProjectIndex = (currentProjectIndex + 1) % projectFrames.length;
      renderLightboxProject();
      playSound('click');
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.open) return;
    if (e.key === 'ArrowLeft') {
      lbPrevBtn.click();
    } else if (e.key === 'ArrowRight') {
      lbNextBtn.click();
    }
  });

  // Aspect ratio simulator inside lightbox
  ratioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ratioBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const ratio = btn.dataset.ratio;
      lbMediaWrapper.className = 'lightbox-media-wrapper';
      if (ratio === 'cinema') lbMediaWrapper.classList.add('ratio-cinema');
      else if (ratio === 'classic') lbMediaWrapper.classList.add('ratio-classic');
      playSound('click');
    });
  });

  /* ==========================================================================
     9. SHOWREEL VIDEO MODAL
     ========================================================================== */
  const showreelModal = document.getElementById('showreelModal');
  const showreelBtn = document.getElementById('watchReelBtn');
  const showreelCloseBtn = document.getElementById('showreelCloseBtn');
  const showreelBackdrop = document.getElementById('showreelBackdrop');

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

    document.querySelectorAll('.gear-card, .discipline-card, .laurel-item, .ig-card, .ig-profile-card, .stories-module').forEach(el => {
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
    { id: 'gear', label: 'GEAR', elem: document.getElementById('gear') },
    { id: 'skills', label: 'CRAFT', elem: document.getElementById('skills') },
    { id: 'contact', label: 'CONTACT', elem: document.getElementById('contact') }
  ];

  let scrollTimeout = null;
  let isDraggingScrollHud = false;

  function updateScrollTelemetry() {
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

})();
