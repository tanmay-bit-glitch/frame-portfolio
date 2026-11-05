const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

function capture(fileUrl, outFile, width, height, waitMs = 1500) {
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
    console.log(`Saved: ${outFile} (${fs.statSync(localTarget).size} bytes)`);
  } else {
    console.error(`Failed to capture: ${outFile}`);
  }
}

const fileUrl = `file:///${path.resolve('index.html').replace(/\\/g, '/')}`;

// Capture Hero top at 1440, 768, 375
capture(fileUrl, 'step3-hero-1440.png', 1440, 960);
capture(fileUrl, 'step3-hero-768.png', 768, 1024);
capture(fileUrl, 'step3-hero-375.png', 375, 812);

// Capture About landing slot at 1440, 768, 375
capture(`${fileUrl}#about`, 'step3-about-dock-1440.png', 1440, 900);
capture(`${fileUrl}#about`, 'step3-about-dock-768.png', 768, 900);
capture(`${fileUrl}#about`, 'step3-about-dock-375.png', 375, 900);

console.log('Step 3 captures completed.');

