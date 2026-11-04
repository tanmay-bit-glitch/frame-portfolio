const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');

function capture(htmlFile, outFile, width, height, waitMs = 600) {
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
  capture('preview-reels.html', 'reels-gallery-matched-desktop.png', 1440, 1100, 700);
  capture('preview-reels.html', 'reels-gallery-matched-tablet.png', 768, 1024, 700);
  capture('preview-reels.html', 'reels-gallery-matched-mobile.png', 375, 850, 700);
  console.log('All reels evidence captured!');
}

main().catch(console.error);

