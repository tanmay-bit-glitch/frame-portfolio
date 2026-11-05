const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data_hero_' + Date.now();
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

function capture(fileUrl, outFile, width, height, waitMs = 2000) {
  const localTarget = path.resolve('curation/screenshots', outFile);
  const artifactTarget = path.join(artifactDir, outFile);
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
    fs.copyFileSync(localTarget, artifactTarget);
    console.log(`Saved: ${outFile}`);
  } else {
    console.error(`Failed: ${outFile}`);
  }
}

const fileUrl = `file:///${path.resolve('index.html').replace(/\\/g, '/')}`;
capture(fileUrl, 'calligraphic-hero-1440.png', 1440, 950);
capture(fileUrl, 'calligraphic-hero-768.png', 768, 1024);
capture(fileUrl, 'calligraphic-hero-375.png', 375, 812);

