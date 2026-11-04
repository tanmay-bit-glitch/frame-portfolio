const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

let previewHtml = fs.readFileSync('preview-gallery.html', 'utf8');

// Helper to run headless chrome screenshot
function capture(htmlFile, outFile, width, height, waitMs = 500) {
  console.log(`Capturing ${outFile} (${width}x${height})...`);
  const fileUrl = `file:///${path.resolve(htmlFile).replace(/\\/g, '/')}`;
  cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=' + (waitMs + 1000),
    userData,
    `--screenshot=${path.join(screenshotsDir, outFile)}`,
    `--window-size=${width},${height}`,
    fileUrl
  ]);
  console.log(`Saved ${outFile}`);
}

async function main() {
  // 1. Regular Desktop Top View
  capture('preview-gallery.html', '01-desktop-gallery-top.png', 1440, 1100, 600);

  // 2. Bottom of Gallery (Check flush column alignment at the end)
  const bottomHtml = previewHtml.replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 500);
      });
    </script>
    </body>`
  );
  fs.writeFileSync('preview-bottom.html', bottomHtml, 'utf8');
  capture('preview-bottom.html', '02-desktop-gallery-bottom-alignment.png', 1440, 1200, 800);
  fs.unlinkSync('preview-bottom.html');

  // 3. Hover Ambient Background Spreading Across Whole Page
  // We simulate hovering Frame 1 (Shelby GT500)
  const hoverHtml = previewHtml.replace(
    '</head>',
    `<style>
      .gallery-card { opacity: 1 !important; transform: none !important; }
      #galleryAmbientViewport { opacity: 1 !important; }
      #ambientLayerA {
        background-image: url('assets/photos/mustang-shelby-gt500-cyberpunk-1280.webp') !important;
        opacity: 1 !important;
        transform: scale(1.15) !important;
      }
      #frame-1 {
        border-color: rgba(224, 93, 44, 0.85) !important;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.85), 0 0 25px rgba(224, 93, 44, 0.3) !important;
        z-index: 15 !important;
        transform: translateY(-4px) scale(1.02) !important;
      }
      #frame-1 .card-img {
        transform: scale(1.045) !important;
      }
      #frame-1 .card-overlay {
        opacity: 1 !important;
      }
      .gallery-masonry:has(.gallery-card:hover) .gallery-card:not(:hover),
      .gallery-masonry .gallery-card:not(#frame-1) {
        opacity: 0.35 !important;
        filter: saturate(0.8) brightness(0.8) !important;
        transform: scale(0.985) !important;
      }
    </style>
    </head>`
  ).replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          const card1 = document.getElementById('frame-1');
          if (card1) card1.classList.add('is-hovered');
        }, 300);
      });
    </script>
    </body>`
  );
  fs.writeFileSync('preview-hover-ambient.html', hoverHtml, 'utf8');
  capture('preview-hover-ambient.html', '03-hover-ambient-spread.png', 1440, 1100, 700);
  fs.unlinkSync('preview-hover-ambient.html');

  // 4. In-Place Click Zoom / Focused State
  // Frame 2 (Stance Culture // Slammed Tuner) focused
  const focusedHtml = previewHtml.replace(
    '</head>',
    `<style>
      .gallery-card { opacity: 1 !important; transform: none !important; }
      #galleryAmbientViewport { opacity: 1 !important; }
      #ambientLayerA {
        background-image: url('assets/photos/slammed-tuner-and-cafe-racer-1280.webp') !important;
        opacity: 1 !important;
        transform: scale(1.16) !important;
      }
      #galleryFocusBackdrop { opacity: 1 !important; }
      #frame-2 {
        z-index: 120 !important;
        transform: scale(1.08) !important;
        border-color: #e05d2c !important;
        box-shadow: 0 32px 85px rgba(0, 0, 0, 0.95), 0 0 40px rgba(224, 93, 44, 0.45) !important;
      }
      #frame-2 .card-img {
        transform: scale(1.05) !important;
      }
      #frame-2 .card-overlay {
        opacity: 1 !important;
      }
      .gallery-column .gallery-card:not(#frame-2) {
        opacity: 0.18 !important;
        filter: blur(6px) brightness(0.5) saturate(0.5) !important;
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
  fs.writeFileSync('preview-focused-zoom.html', focusedHtml, 'utf8');
  capture('preview-focused-zoom.html', '04-inplace-focused-zoom.png', 1440, 1100, 700);
  fs.unlinkSync('preview-focused-zoom.html');

  // 5. Tablet 768px View
  capture('preview-gallery.html', '05-tablet-768.png', 768, 1024, 600);

  // 6. Mobile 375px View
  capture('preview-gallery.html', '06-mobile-375.png', 375, 850, 600);

  console.log('All evidence screenshots captured successfully!');
}

main().catch(console.error);
