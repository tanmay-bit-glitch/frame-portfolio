const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');

let previewHtml = fs.readFileSync('preview-gallery.html', 'utf8');

// Ensure all cards are revealed immediately
const fullHtml = previewHtml.replace(
  '</head>',
  `<style>
    .gallery-card { opacity: 1 !important; transform: none !important; }
  </style>
  </head>`
);

fs.writeFileSync('preview-tall.html', fullHtml, 'utf8');

cp.spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  userData,
  `--screenshot=${path.join(screenshotsDir, 'phase4-gallery-full-grid.png')}`,
  '--window-size=1440,5500',
  `file:///${path.resolve('preview-tall.html').replace(/\\/g, '/')}`
]);

fs.unlinkSync('preview-tall.html');

console.log('Full grid screenshot captured, size:', fs.statSync(path.join(screenshotsDir, 'phase4-gallery-full-grid.png')).size);
