const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

// 1. Update .work with dynamic background transitions
const workSearch = `/* ==========================================================================
   SELECTED WORK / FILMSTRIP SECTION
   ========================================================================== */
.work {
  position: relative;
  overflow: hidden;
}`;

const workReplace = `/* ==========================================================================
   SELECTED WORK / FILMSTRIP SECTION
   ========================================================================== */
.work {
  position: relative;
  overflow: hidden;
  transition: background-color 500ms ease, background 500ms ease;
}

/* Dynamic ambient background color shifts when hovering cards in gallery */
.work.is-card-hovered,
.work:has(.gallery-card:hover) {
  background-color: #060504 !important;
}

.work[data-hover-category="Machines"] {
  background: radial-gradient(circle at 50% 35%, rgba(42, 22, 54, 0.42) 0%, rgba(5, 6, 9, 0.98) 75%) !important;
}
.work[data-hover-category="Street"] {
  background: radial-gradient(circle at 50% 35%, rgba(54, 28, 14, 0.45) 0%, rgba(6, 6, 6, 0.98) 75%) !important;
}
.work[data-hover-category="Heritage"] {
  background: radial-gradient(circle at 50% 35%, rgba(48, 36, 20, 0.45) 0%, rgba(7, 7, 7, 0.98) 75%) !important;
}
.work[data-hover-category="Culture"] {
  background: radial-gradient(circle at 50% 35%, rgba(60, 38, 14, 0.48) 0%, rgba(8, 7, 5, 0.98) 75%) !important;
}
.work[data-hover-category="People"] {
  background: radial-gradient(circle at 50% 35%, rgba(50, 26, 18, 0.45) 0%, rgba(7, 6, 6, 0.98) 75%) !important;
}
.work[data-hover-category="Night"] {
  background: radial-gradient(circle at 50% 35%, rgba(18, 30, 62, 0.48) 0%, rgba(4, 5, 8, 0.98) 75%) !important;
}
.work[data-hover-category="Wildlife"] {
  background: radial-gradient(circle at 50% 35%, rgba(22, 48, 28, 0.42) 0%, rgba(5, 7, 5, 0.98) 75%) !important;
}
.work[data-hover-category="Details"] {
  background: radial-gradient(circle at 50% 35%, rgba(55, 36, 16, 0.45) 0%, rgba(7, 6, 5, 0.98) 75%) !important;
}`;

// Normalize CRLF to LF for search and replacement
const isCrlf = css.includes('\r\n');
if (isCrlf) {
  css = css.replace(/\r\n/g, '\n');
}

if (!css.includes(workSearch)) {
  console.error('Could not find workSearch in styles.css');
  process.exit(1);
}
css = css.replace(workSearch, workReplace);

// 2. Replace gallery masonry and card styles
const galleryBlockRegex = /\.gallery-masonry \{[\s\S]*?(?=\/\* Touch screen adjustments \*\/)/;

const newGalleryBlock = `.gallery-masonry,
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  margin-top: 10px;
  position: relative;
}

@media (max-width: 1023px) {
  .gallery-masonry,
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 639px) {
  .gallery-masonry,
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Individual Gallery Card with Scroll Reveal */
.gallery-card {
  margin-bottom: 0;
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
  /* Scroll reveal starting state */
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
  border-color: rgba(224, 93, 44, 0.7);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.75), 0 0 20px rgba(224, 93, 44, 0.2);
  z-index: 10;
}

.gallery-card:focus-visible {
  outline: 2px solid var(--accent, #e05d2c);
  outline-offset: 3px;
}

/* Hover Spotlight: Dim surrounding cards when any card is hovered */
.gallery-masonry:has(.gallery-card:hover) .gallery-card:not(:hover):not(.is-focused),
.gallery-grid:has(.gallery-card:hover) .gallery-card:not(:hover):not(.is-focused),
.gallery-masonry.is-card-hovered .gallery-card:not(.is-hovered):not(.is-focused) {
  opacity: 0.42;
  filter: saturate(0.8) brightness(0.85);
  transform: scale(0.985);
}

/* Card Media Wrapper - Consistent 4:5 aspect ratio so all frames align across rows & columns */
.card-media-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #050609;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ambient blurred background inside letterboxed areas */
.card-ambient-backdrop {
  position: absolute;
  inset: -15%;
  width: 130%;
  height: 130%;
  object-fit: cover;
  filter: blur(28px) brightness(0.6) saturate(1.2);
  opacity: 0.32;
  transform: scale(1.1);
  pointer-events: none;
  z-index: 1;
  transition: opacity 400ms ease, transform 500ms ease;
}

/* Blur placeholder image */
.card-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: blur(14px);
  transform: scale(1.04);
  transition: opacity 400ms ease-out;
  pointer-events: none;
  z-index: 2;
}

.card-placeholder.is-hidden {
  opacity: 0;
}

/* Real High-Resolution WebP Image (contain mode: zero cropping, true aspect ratio preserved) */
.card-img {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  opacity: 0;
  z-index: 3;
  transition: opacity 450ms ease-in-out, transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.card-img.is-loaded {
  opacity: 1;
}

.gallery-card:hover .card-img {
  transform: scale(1.038);
}

.gallery-card:hover .card-ambient-backdrop {
  opacity: 0.48;
  transform: scale(1.15);
}

/* In-Place Click Zoom / Focused State */
.gallery-card.is-focused {
  z-index: 120 !important;
  transform: scale(1.065) !important;
  border-color: var(--accent, #e05d2c) !important;
  box-shadow: 0 28px 75px rgba(0, 0, 0, 0.95), 0 0 35px rgba(224, 93, 44, 0.35) !important;
  cursor: zoom-out !important;
}

.gallery-card.is-focused .card-img {
  transform: scale(1.045) !important;
}

.gallery-card.is-focused .card-ambient-backdrop {
  opacity: 0.55 !important;
  transform: scale(1.2) !important;
}

.gallery-card.is-focused .card-overlay {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* When a card is focused, all other cards blur & dim */
.gallery-masonry.has-focused-card .gallery-card:not(.is-focused),
.gallery-grid.has-focused-card .gallery-card:not(.is-focused) {
  opacity: 0.2 !important;
  filter: blur(5px) brightness(0.55) saturate(0.6) !important;
  transform: scale(0.97) !important;
  pointer-events: none !important;
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1) !important;
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

/* Hover Caption Overlay (Desktop) */
.card-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(
    to bottom,
    rgba(5, 6, 9, 0.88) 0%,
    rgba(5, 6, 9, 0) 30%,
    rgba(5, 6, 9, 0) 50%,
    rgba(5, 6, 9, 0.95) 100%
  );
  opacity: 0;
  pointer-events: none;
  transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-card:hover .card-overlay,
.gallery-card:focus-visible .card-overlay {
  opacity: 1;
}

.card-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
}

.card-num {
  color: var(--accent, #e05d2c);
  font-weight: 600;
}

.card-category {
  background: rgba(255, 255, 255, 0.12);
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 0.08em;
}

.card-meta-bottom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  line-height: 1.25;
  margin: 0;
}

.card-exif {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.72);
  letter-spacing: 0.04em;
  margin: 0;
}

`;

if (!galleryBlockRegex.test(css)) {
  console.error('Could not match galleryBlockRegex in styles.css');
  process.exit(1);
}

css = css.replace(galleryBlockRegex, newGalleryBlock);

if (isCrlf) {
  css = css.replace(/\n/g, '\r\n');
}

fs.writeFileSync('styles.css', css, 'utf8');
console.log('Successfully updated styles.css with grid alignment, in-place zoom, and ambient hover effects!');
