const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

function capture(fileUrl, outFile, width, height, waitMs = 1200) {
  console.log(`Capturing ${outFile} (${width}x${height})...`);
  const localTarget = path.join(screenshotsDir, outFile);
  cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=' + (waitMs + 1000),
    userData,
    `--screenshot=${localTarget}`,
    `--window-size=${width},${height}`,
    fileUrl
  ]);
  if (fs.existsSync(localTarget)) {
    const artifactTarget = path.join(artifactDir, outFile);
    fs.copyFileSync(localTarget, artifactTarget);
    console.log(`Saved and copied: ${outFile}`);
  } else {
    console.error(`Failed to capture: ${outFile}`);
  }
}

// 1. Capture Index menu opened
// Let's create preview of menu open
let indexHtml = fs.readFileSync('index.html', 'utf8');
const menuOpenHtml = indexHtml.replace(
  'class="menu-overlay"',
  'class="menu-overlay is-open" style="opacity:1 !important; visibility:visible !important; display:block !important;"'
);
fs.writeFileSync('preview-menu-open.html', menuOpenHtml, 'utf8');

const menuUrl = `file:///${path.resolve('preview-menu-open.html').replace(/\\/g, '/')}`;
capture(menuUrl, 'step3-menu-open-1440.png', 1440, 960);
capture(menuUrl, 'step3-menu-open-375.png', 375, 812);

// 2. Capture Top of Page at 1440, 768, 375
const fileUrl = `file:///${path.resolve('index.html').replace(/\\/g, '/')}`;
capture(fileUrl, 'step3-top-1440.png', 1440, 1000);
capture(fileUrl, 'step3-top-768.png', 768, 1024);
capture(fileUrl, 'step3-top-375.png', 375, 812);

// 3. Capture footer
const footerStart = indexHtml.indexOf('<footer class="site-footer');
const footerPreview = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="styles.css"><style>body{background:#070706;color:#f5f2ea;margin:0;padding:24px;}</style></head><body>${indexHtml.slice(footerStart)}</html>`;
fs.writeFileSync('preview-footer.html', footerPreview, 'utf8');
const footerUrl = `file:///${path.resolve('preview-footer.html').replace(/\\/g, '/')}`;
capture(footerUrl, 'step3-footer-1440.png', 1440, 500);

console.log('Step 3 captures completed.');

