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

// Let's create preview of hero + about to test top of page
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Also capture index.html directly scrolled to about or top
const fileUrl = `file:///${path.resolve('index.html').replace(/\\/g, '/')}`;

// Capture top at 375, 768, 1440
capture(fileUrl, 'step1-top-1440.png', 1440, 1200);
capture(fileUrl, 'step1-top-768.png', 768, 1024);
capture(fileUrl, 'step1-top-375.png', 375, 812);

// Also capture scrolled directly to #about
const aboutUrl = fileUrl + '#about';
capture(aboutUrl, 'step1-about-1440.png', 1440, 900);
capture(aboutUrl, 'step1-about-768.png', 768, 900);
capture(aboutUrl, 'step1-about-375.png', 375, 900);

console.log('Step 1 captures completed.');

