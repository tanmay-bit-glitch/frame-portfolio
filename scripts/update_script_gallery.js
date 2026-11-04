const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// We want to replace the gallery rendering and focus code (lines ~422 to 685)
const targetStart = '  function renderGalleryWithFilter(filter = \'all\') {';
const targetEnd = '  // Clicking outside any card closes in-place focus';

const newGalleryCode = `  /* ==========================================================================
     FULL-PAGE AMBIENT SPREADING BACKGROUND (PHASE 4)
     ========================================================================== */
  const ambientViewport = document.getElementById('galleryAmbientViewport');
  const layerA = document.getElementById('ambientLayerA');
  const layerB = document.getElementById('ambientLayerB');
  let activeAmbientLayer = 'A';
  let currentAmbientPhotoId = null;

  function showAmbientPhoto(photo) {
    if (!ambientViewport || !layerA || !layerB || !photo) return;
    if (currentAmbientPhotoId === photo.id) return;
    currentAmbientPhotoId = photo.id;

    const imgUrl = (photo.srcset && (photo.srcset['1280'] || photo.srcset['640'])) || photo.placeholder;
    const nextLayer = activeAmbientLayer === 'A' ? layerB : layerA;
    const prevLayer = activeAmbientLayer === 'A' ? layerA : layerB;

    nextLayer.style.backgroundImage = 'url(' + imgUrl + ')';
    nextLayer.classList.remove('is-fading');
    nextLayer.classList.add('is-active');

    prevLayer.classList.remove('is-active');
    prevLayer.classList.add('is-fading');

    ambientViewport.classList.add('is-active');
    activeAmbientLayer = activeAmbientLayer === 'A' ? 'B' : 'A';
  }

  function hideAmbientPhoto() {
    if (!ambientViewport) return;
    if (activeFocusedCard) return; // Keep ambient background alive while a card is focused
    ambientViewport.classList.remove('is-active');
    currentAmbientPhotoId = null;
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

    // Distribute photos into columns to balance heights
    const colBuckets = Array.from({ length: numCols }, () => []);
    const colHeights = new Array(numCols).fill(0);

    activeFilteredPhotos.forEach((photo, idx) => {
      const relH = photo.height / photo.width;
      let minCol = 0;
      for (let c = 1; c < numCols; c++) {
        if (colHeights[c] < colHeights[minCol]) {
          minCol = c;
        }
      }
      colBuckets[minCol].push({ photo, idx });
      colHeights[minCol] += relH;
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

        card.innerHTML = \`
          <div class="card-media-wrapper" style="--card-aspect-ratio: \${scaledRatio};">
            <img src="\${photo.placeholder}" alt="" aria-hidden="true" class="card-placeholder">
            <img
              src="\${photo.srcset['1280'] || photo.srcset['640']}"
              srcset="\${photo.srcset['640']} 640w, \${photo.srcset['1280']} 1280w, \${photo.srcset['1920']} 1920w"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              alt="\${escapeHtml(photo.alt)}"
              width="\${photo.width}"
              height="\${photo.height}"
              loading="\${idx < 4 ? 'eager' : 'lazy'}"
              decoding="async"
              class="card-img"
            >
            <div class="card-overlay" aria-hidden="true">
              <div class="card-meta-top">
                <span class="card-num">\${numStr}</span>
                <span class="card-category">\${escapeHtml(photo.category)}</span>
              </div>
              <div class="card-meta-bottom">
                <h3 class="card-title">\${escapeHtml(photo.title)}</h3>
                <p class="card-exif">\${escapeHtml(exifStr)}</p>
              </div>
            </div>
          </div>
        \`;

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
          showAmbientPhoto(photo);
          card.classList.add('is-hovered');
        });

        card.addEventListener('mouseleave', () => {
          card.classList.remove('is-hovered');
          hideAmbientPhoto();
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

    // Keep ambient spreading photo active
    if (photo) {
      showAmbientPhoto(photo);
    } else if (allPhotos && allPhotos[idx]) {
      showAmbientPhoto(allPhotos[idx]);
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
    hideAmbientPhoto();
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
  });\n\n`;

const startIdx = script.indexOf(targetStart);
const endIdx = script.indexOf(targetEnd);

if (startIdx !== -1 && endIdx !== -1) {
  script = script.slice(0, startIdx) + newGalleryCode + script.slice(endIdx);
  fs.writeFileSync('script.js', script, 'utf8');
  console.log('Successfully updated script.js with aligned columns, scale normalization, and ambient spread!');
} else {
  console.error('Could not find slice markers:', { startIdx, endIdx });
}
