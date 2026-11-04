const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

function capture(htmlFile, outFile, width, height, waitMs = 1000) {
  console.log(`Capturing ${outFile} (${width}x${height})...`);
  const fileUrl = `file:///${path.resolve(htmlFile).replace(/\\/g, '/')}`;
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
  console.log(`Saved ${outFile}`);
  
  if (fs.existsSync(localTarget)) {
    const artifactTarget = path.join(artifactDir, outFile);
    fs.copyFileSync(localTarget, artifactTarget);
    console.log(`Copied to artifact directory: ${artifactTarget}`);
  }
}

async function main() {
  capture('preview-reels.html', '11-reels-exact-card-desktop.png', 1440, 960, 1000);
  capture('preview-reels.html', '12-reels-exact-card-tablet.png', 768, 1100, 1000);
  capture('preview-reels.html', '13-reels-exact-card-mobile.png', 375, 800, 1000);
  capture('index.html', '14-index-reels-exact.png', 1440, 1100, 1200);
  console.log('All reels evidence captured!');
}

main().catch(console.error);

