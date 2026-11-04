const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

const isCrlf = script.includes('\r\n');
if (isCrlf) script = script.replace(/\r\n/g, '\n');

// 1. Locate the card creation and click handler block in renderGalleryWithFilter
const cardBuildSearch = `      card.innerHTML = \`
        <div class="card-media-wrapper" style="aspect-ratio: \${photo.width} / \${photo.height};">
          <img src="\${photo.placeholder}" alt="" aria-hidden="true" class="card-placeholder">
          <img
            src="\${photo.srcset['1280'] || photo.srcset['640']}"
            srcset="\${photo.srcset['640']} 640w, \${photo.srcset['1280']} 1280w, \${photo.srcset['1920']} 1920w"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            alt="\${escapeHtml(photo.alt)}"
            width="\${photo.width}"
            height="\${photo.height}"
            loading="\${idx < 3 ? 'eager' : 'lazy'}"
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

      // Handle progressive image loading transition
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

      // Lightbox open event
      card.addEventListener('click', () => openLightbox(idx));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });`;

const cardBuildReplace = `      card.innerHTML = \`
        <div class="card-media-wrapper">
          <img src="\${photo.srcset['640'] || photo.placeholder}" alt="" aria-hidden="true" class="card-ambient-backdrop">
          <img src="\${photo.placeholder}" alt="" aria-hidden="true" class="card-placeholder">
          <img
            src="\${photo.srcset['1280'] || photo.srcset['640']}"
            srcset="\${photo.srcset['640']} 640w, \${photo.srcset['1280']} 1280w, \${photo.srcset['1920']} 1920w"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            alt="\${escapeHtml(photo.alt)}"
            width="\${photo.width}"
            height="\${photo.height}"
            loading="\${idx < 3 ? 'eager' : 'lazy'}"
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

      // Handle progressive image loading transition
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

      // Dynamic ambient background color shifts when hovering image
      const workSection = document.getElementById('work');
      card.addEventListener('mouseenter', () => {
        if (workSection) {
          workSection.dataset.hoverCategory = photo.category;
          workSection.classList.add('is-card-hovered');
        }
        card.classList.add('is-hovered');
      });

      card.addEventListener('mouseleave', () => {
        if (workSection && !document.querySelector('.gallery-card:hover')) {
          delete workSection.dataset.hoverCategory;
          workSection.classList.remove('is-card-hovered');
        }
        card.classList.remove('is-hovered');
      });

      // In-place Click to Zoom / Focus event
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFocusCard(card, idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFocusCard(card, idx);
        }
      });`;

if (!script.includes(cardBuildSearch)) {
  console.error('Could not find cardBuildSearch in script.js');
  process.exit(1);
}
script = script.replace(cardBuildSearch, cardBuildReplace);

// 2. Add in-place focus mode controller functions
const focusFunctions = `
  /* ==========================================================================
     IN-PLACE CLICK ZOOM / FOCUS CONTROLLER (PHASE 3 ENHANCEMENT)
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
        focusBackdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(focusBackdrop);
      }
      focusBackdrop.addEventListener('click', () => {
        unfocusCurrentCard();
      });
    }
  }

  function toggleFocusCard(card, idx) {
    if (activeFocusedCard === card) {
      unfocusCurrentCard();
    } else {
      focusCard(card, idx);
    }
  }

  function focusCard(card, idx) {
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
        focusCard(allCards[nextIdx], nextIdx);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const allCards = Array.from(galleryGrid.querySelectorAll('.gallery-card:not(.is-filtered-out)'));
      if (allCards.length > 0) {
        const curIdx = allCards.indexOf(activeFocusedCard);
        const prevIdx = (curIdx - 1 + allCards.length) % allCards.length;
        focusCard(allCards[prevIdx], prevIdx);
      }
    }
  });

  // Clicking outside any card closes in-place focus
  document.addEventListener('click', (e) => {
    if (activeFocusedCard && !activeFocusedCard.contains(e.target)) {
      unfocusCurrentCard();
    }
  });
`;

// Insert focus controller before section 8
const section8Marker = `  /* ==========================================================================
     8. CINEMATIC LIGHTBOX MODAL (FOLLOWS FILTERED SET & REAL EXIF)`;

if (!script.includes(section8Marker)) {
  console.error('Could not find section8Marker in script.js');
  process.exit(1);
}

script = script.replace(section8Marker, `${focusFunctions}\n${section8Marker}`);

if (isCrlf) script = script.replace(/\n/g, '\r\n');

fs.writeFileSync('script.js', script, 'utf8');
console.log('Successfully updated script.js with in-place click zoom, hover ambient shifts, and keyboard controls!');

