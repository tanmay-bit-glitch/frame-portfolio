const fs = require('fs');
const path = require('path');

// 1. UPDATE index.html and preview-gallery.html with ambient background container
function updateHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const ambientMarkup = `      <!-- Full-Page Ambient Spreading Background on Hover (Phase 4) -->
      <div class="gallery-ambient-viewport" id="galleryAmbientViewport" aria-hidden="true">
        <div class="ambient-spread-layer ambient-layer-a" id="ambientLayerA"></div>
        <div class="ambient-spread-layer ambient-layer-b" id="ambientLayerB"></div>
        <div class="ambient-viewport-vignette"></div>
      </div>\n`;

  // Check if already present
  if (!html.includes('id="galleryAmbientViewport"')) {
    html = html.replace(
      /(<div class="gallery-focus-backdrop" id="galleryFocusBackdrop"[^>]*><\/div>)/,
      `$1\n${ambientMarkup}`
    );
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Added galleryAmbientViewport to ${filePath}`);
  } else {
    console.log(`galleryAmbientViewport already present in ${filePath}`);
  }
}

updateHtmlFile('index.html');
updateHtmlFile('preview-gallery.html');

// 2. UPDATE styles.css with enhanced column alignment, full-bleed images, ambient spread, in-place zoom
let styles = fs.readFileSync('styles.css', 'utf8');

const newGalleryCSS = `/* ==========================================================================
   CURATED GALLERY: COLUMN SCALE ALIGNMENT, FULL-BLEED & AMBIENT SPREAD (PHASE 4)
   ========================================================================== */

/* Full-Page Ambient Spreading Background on Hover */
.gallery-ambient-viewport {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  opacity: 0;
  transition: opacity 650ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-ambient-viewport.is-active {
  opacity: 1;
}

.ambient-spread-layer {
  position: absolute;
  inset: -18vw -18vh;
  width: 136vw;
  height: 136vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: blur(60px) saturate(1.5) brightness(0.38);
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 1400ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.ambient-spread-layer.is-active {
  opacity: 1;
  transform: scale(1.15);
}

.ambient-spread-layer.is-fading {
  opacity: 0;
  transform: scale(1.08);
}

.ambient-viewport-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(10, 11, 16, 0.2) 0%, rgba(5, 6, 9, 0.88) 100%);
}

/* Aligned Column Flex Layout */
.gallery-masonry,
.gallery-grid {
  display: flex;
  gap: 24px;
  width: 100%;
  margin-top: 10px;
  position: relative;
  align-items: stretch;
}

@media (max-width: 1023px) {
  .gallery-masonry,
  .gallery-grid {
    gap: 20px;
  }
}

@media (max-width: 639px) {
  .gallery-masonry,
  .gallery-grid {
    flex-direction: column;
    gap: 16px;
  }
}

.gallery-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

@media (max-width: 1023px) {
  .gallery-column {
    gap: 20px;
  }
}

@media (max-width: 639px) {
  .gallery-column {
    gap: 16px;
  }
}

/* Individual Gallery Card */
.gallery-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-surface, #0d0d11);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  outline: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  opacity: 0;
  transform: translateY(32px);
  will-change: opacity, transform, filter;
  transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 300ms ease,
              box-shadow 300ms ease,
              filter 350ms ease;
}

.gallery-card.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.gallery-card:hover,
.gallery-card:focus-visible {
  border-color: rgba(224, 93, 44, 0.85);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.85), 0 0 25px rgba(224, 93, 44, 0.25);
  z-index: 10;
  transform: translateY(-4px) scale(1.015);
}

.gallery-card:focus-visible {
  outline: 2px solid var(--accent, #e05d2c);
  outline-offset: 3px;
}

/* Hover Spotlight: Dim surrounding cards when any card is hovered */
.gallery-masonry:has(.gallery-card:hover) .gallery-card:not(:hover):not(.is-focused),
.gallery-grid:has(.gallery-card:hover) .gallery-card:not(:hover):not(.is-focused),
.gallery-masonry.is-card-hovered .gallery-card:not(.is-hovered):not(.is-focused) {
  opacity: 0.38;
  filter: saturate(0.8) brightness(0.8);
  transform: scale(0.985);
}

/* Card Media Wrapper - Natural aspect ratio with column scale adjustment so columns align flush at the bottom */
.card-media-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: var(--card-aspect-ratio, 4 / 5);
  overflow: hidden;
  background: #08090e;
}

/* Blur placeholder image */
.card-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(12px);
  transform: scale(1.04);
  transition: opacity 400ms ease-out;
  pointer-events: none;
  z-index: 1;
}

.card-placeholder.is-hidden {
  opacity: 0;
}

/* Real High-Resolution WebP Image: fills the frame naturally (no letterbox bars!) */
.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  z-index: 2;
  transition: opacity 450ms ease-in-out, transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.card-img.is-loaded {
  opacity: 1;
}

.gallery-card:hover .card-img {
  transform: scale(1.045);
}

/* Card Overlay with metadata */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0) 35%,
    rgba(0, 0, 0, 0.25) 55%,
    rgba(0, 0, 0, 0.94) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  opacity: 0;
  z-index: 4;
  transition: opacity 300ms ease;
  pointer-events: none;
}

.gallery-card:hover .card-overlay,
.gallery-card.is-focused .card-overlay {
  opacity: 1;
  pointer-events: auto;
}

.card-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.card-num {
  color: var(--accent, #e05d2c);
  font-weight: 600;
  background: rgba(0, 0, 0, 0.65);
  padding: 3px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(224, 93, 44, 0.3);
}

.card-category {
  color: var(--text-muted, #a0a0b0);
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.65);
  padding: 3px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-meta-bottom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

.card-exif {
  color: var(--text-muted, #a0a0b0);
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  margin: 0;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

/* In-Place Click Zoom / Focused State */
.gallery-card.is-focused {
  z-index: 120 !important;
  transform: scale(1.08) !important;
  border-color: var(--accent, #e05d2c) !important;
  box-shadow: 0 32px 85px rgba(0, 0, 0, 0.95), 0 0 40px rgba(224, 93, 44, 0.4) !important;
  cursor: zoom-out !important;
}

.gallery-card.is-focused .card-img {
  transform: scale(1.05) !important;
}

.gallery-card.is-focused .card-overlay {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* When a card is focused, all other cards in all columns dim and blur */
.gallery-masonry.has-focused-card .gallery-card:not(.is-focused),
.gallery-grid.has-focused-card .gallery-card:not(.is-focused) {
  opacity: 0.18 !important;
  filter: blur(6px) brightness(0.5) saturate(0.5) !important;
  transform: scale(0.97) !important;
  pointer-events: none !important;
  transition: all 450ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Fixed focus backdrop overlay */
.gallery-focus-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 5, 8, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 85;
  opacity: 0;
  pointer-events: none;
  transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-focus-backdrop.is-active {
  opacity: 1;
  pointer-events: auto;
  cursor: zoom-out;
}
`;

// Replace from `.gallery-masonry` to `.gallery-focus-backdrop.is-active` in styles.css
const startIdx = styles.indexOf('.gallery-masonry,');
const endMarker = '.gallery-focus-backdrop.is-active {';
const endIdx = styles.indexOf(endMarker);
if (startIdx !== -1 && endIdx !== -1) {
  const closingBrace = styles.indexOf('}', endIdx);
  styles = styles.slice(0, startIdx) + newGalleryCSS + styles.slice(closingBrace + 1);
  fs.writeFileSync('styles.css', styles, 'utf8');
  console.log('Successfully updated styles.css with column alignment, full bleed, and ambient spread!');
} else {
  console.error('Could not find markers in styles.css:', { startIdx, endIdx });
}
