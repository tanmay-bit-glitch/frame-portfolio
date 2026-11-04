const fs = require('fs');

// 1. Remove ambient viewport markup from index.html and preview-gallery.html
function cleanHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const targetPattern = /\s*<!-- Full-Page Ambient Spreading Background on Hover \(Phase 4\) -->\s*<div class="gallery-ambient-viewport" id="galleryAmbientViewport"[\s\S]*?<\/div>\s*<\/div>/g;
  if (targetPattern.test(html)) {
    html = html.replace(targetPattern, '');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Removed galleryAmbientViewport from ${filePath}`);
  } else {
    // Alternate search
    const idx = html.indexOf('<div class="gallery-ambient-viewport"');
    if (idx !== -1) {
      const endIdx = html.indexOf('</div>\n      </div>', idx);
      if (endIdx !== -1) {
        html = html.slice(0, idx) + html.slice(endIdx + '</div>\n      </div>'.length);
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`Cleaned galleryAmbientViewport from ${filePath}`);
      }
    }
  }
}

cleanHtml('index.html');
cleanHtml('preview-gallery.html');

// 2. Clean up styles.css
let styles = fs.readFileSync('styles.css', 'utf8');

// Replace the entire gallery section in styles.css to eliminate all heavy blur
const oldGalleryStart = styles.indexOf('/* Full-Page Ambient Spreading Background on Hover */');
const oldGalleryEnd = styles.indexOf('/* Aligned Column Flex Layout */');

if (oldGalleryStart !== -1 && oldGalleryEnd !== -1) {
  styles = styles.slice(0, oldGalleryStart) + styles.slice(oldGalleryEnd);
  console.log('Removed .gallery-ambient-viewport CSS from styles.css');
}

// Clean surrounding card hover dimming and focus dimming to eliminate blur
styles = styles.replace(
  /\/\* Hover Spotlight: Dim surrounding cards[\s\S]*?transform: scale\(0\.985\);\s*\}/,
  `/* Hover Spotlight: Gently dim surrounding cards when any card is hovered (clean opacity, zero blur) */
.gallery-masonry:has(.gallery-card:hover) .gallery-card:not(:hover):not(.is-focused),
.gallery-grid:has(.gallery-card:hover) .gallery-card:not(:hover):not(.is-focused),
.gallery-masonry.is-card-hovered .gallery-card:not(.is-hovered):not(.is-focused) {
  opacity: 0.55;
  transform: scale(0.99);
}`
);

styles = styles.replace(
  /\/\* When a card is focused, all other cards in all columns dim and blur \*\/[\s\S]*?transition: all 450ms[^\}]*?\}/,
  `/* When a card is focused, surrounding cards dim cleanly with zero blur */
.gallery-masonry.has-focused-card .gallery-card:not(.is-focused),
.gallery-grid.has-focused-card .gallery-card:not(.is-focused) {
  opacity: 0.28 !important;
  transform: scale(0.98) !important;
  pointer-events: none !important;
  transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}`
);

// Clean focus backdrop blur
styles = styles.replace(
  /\.gallery-focus-backdrop\s*\{[\s\S]*?transition: opacity 350ms[^\}]*?\}/,
  `.gallery-focus-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 5, 8, 0.75);
  z-index: 85;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
}`
);

fs.writeFileSync('styles.css', styles, 'utf8');
console.log('Updated styles.css with crisp, clean styling and no heavy blur.');

// 3. Clean up script.js
let script = fs.readFileSync('script.js', 'utf8');

// Remove showAmbientPhoto & hideAmbientPhoto block
const ambStart = script.indexOf('  /* ==========================================================================\n     FULL-PAGE AMBIENT SPREADING BACKGROUND');
const ambEnd = script.indexOf('  function getColumnCount() {');

if (ambStart !== -1 && ambEnd !== -1) {
  script = script.slice(0, ambStart) + script.slice(ambEnd);
  console.log('Removed ambient background functions from script.js');
}

// Remove showAmbientPhoto and hideAmbientPhoto calls from event listeners
script = script.replace(/showAmbientPhoto\(photo\);\s*/g, '');
script = script.replace(/hideAmbientPhoto\(\);\s*/g, '');
script = script.replace(/\s*\/\/ Keep ambient spreading photo active[\s\S]*?showAmbientPhoto\(allPhotos\[idx\]\);\s*\}/g, '');

fs.writeFileSync('script.js', script, 'utf8');
console.log('Cleaned script.js successfully.');
