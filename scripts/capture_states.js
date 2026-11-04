const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');

// Base preview HTML
let previewHtml = fs.readFileSync('preview-gallery.html', 'utf8');

// 1. Focused state preview (Clicked image zoomed at its place, background blurred)
const focusedHtml = previewHtml.replace(
  '</head>',
  `<style>
    .gallery-card { opacity: 1 !important; }
    #frame-2 {
      transform: scale(1.07) !important;
      z-index: 120 !important;
      border-color: #e05d2c !important;
      box-shadow: 0 28px 75px rgba(0, 0, 0, 0.95), 0 0 35px rgba(224, 93, 44, 0.4) !important;
    }
    #frame-2 .card-img {
      transform: scale(1.05) !important;
    }
    #frame-2 .card-overlay {
      opacity: 1 !important;
    }
    .gallery-masonry.has-focused-card .gallery-card:not(#frame-2) {
      opacity: 0.22 !important;
      filter: blur(5px) brightness(0.55) saturate(0.6) !important;
      transform: scale(0.97) !important;
    }
  </style>
  </head>`
).replace(
  '</body>',
  `<script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        const grid = document.getElementById('galleryGrid');
        const backdrop = document.getElementById('galleryFocusBackdrop');
        const card2 = document.getElementById('frame-2');
        if (grid) grid.classList.add('has-focused-card');
        if (backdrop) backdrop.classList.add('is-active');
        if (card2) card2.classList.add('is-focused');
      }, 300);
    });
  </script>
  </body>`
);
fs.writeFileSync('preview-focused.html', focusedHtml, 'utf8');

// 2. Hover state preview (Hovered image with overlay, section background shifted)
const hoverHtml = previewHtml.replace(
  '</head>',
  `<style>
    .gallery-card { opacity: 1 !important; }
    #frame-1 {
      border-color: rgba(224, 93, 44, 0.8) !important;
      box-shadow: 0 18px 44px rgba(0, 0, 0, 0.75), 0 0 25px rgba(224, 93, 44, 0.3) !important;
      z-index: 15 !important;
    }
    #frame-1 .card-img {
      transform: scale(1.04) !important;
    }
    #frame-1 .card-overlay {
      opacity: 1 !important;
    }
    .work.is-card-hovered {
      background: radial-gradient(circle at 25% 45%, rgba(45, 20, 55, 0.5) 0%, rgba(5, 6, 9, 0.98) 75%) !important;
    }
    .gallery-masonry.is-card-hovered .gallery-card:not(#frame-1) {
      opacity: 0.42 !important;
      filter: saturate(0.8) brightness(0.85) !important;
      transform: scale(0.985) !important;
    }
  </style>
  </head>`
).replace(
  '</body>',
  `<script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        const work = document.getElementById('work');
        const grid = document.getElementById('galleryGrid');
        const card1 = document.getElementById('frame-1');
        if (work) {
          work.classList.add('is-card-hovered');
          work.dataset.hoverCategory = 'Machines';
        }
        if (grid) grid.classList.add('is-card-hovered');
        if (card1) card1.classList.add('is-hovered');
      }, 300);
    });
  </script>
  </body>`
);
fs.writeFileSync('preview-hover.html', hoverHtml, 'utf8');

console.log('Capturing focused screenshot...');
cp.spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  userData,
  `--screenshot=${path.join(screenshotsDir, 'phase4-gallery-focused-zoom.png')}`,
  '--window-size=1440,1100',
  `file:///${path.resolve('preview-focused.html').replace(/\\/g, '/')}`
]);

console.log('Capturing hover screenshot...');
cp.spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  userData,
  `--screenshot=${path.join(screenshotsDir, 'phase4-gallery-hover-bg.png')}`,
  '--window-size=1440,1100',
  `file:///${path.resolve('preview-hover.html').replace(/\\/g, '/')}`
]);

fs.unlinkSync('preview-focused.html');
fs.unlinkSync('preview-hover.html');
console.log('Done!');
