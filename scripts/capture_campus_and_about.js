const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

function capture(targetUrl, outFile, width, height) {
  const localTarget = path.join(artifactDir, outFile);
  cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=2000',
    userData,
    '--screenshot=' + localTarget,
    '--window-size=' + width + ',' + height,
    targetUrl
  ]);
  console.log('Saved', localTarget);
}

const fileBase = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

capture(fileBase + '#experience', '19-campus-frame-updated-1440.png', 1440, 1100);
capture(fileBase + '#about', '20-about-profile-placed-properly-1440.png', 1440, 1000);
capture(fileBase + '#about', '21-about-profile-mobile-375.png', 375, 950);
console.log('Captured all visual evidence!');

