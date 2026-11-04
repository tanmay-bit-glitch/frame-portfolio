const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

function capture(file, out, w, h) {
  const url = 'file:///' + path.resolve(file).replace(/\\/g, '/');
  const target = path.join(artifactDir, out);
  cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=2000',
    userData,
    '--screenshot=' + target,
    '--window-size=' + w + ',' + h,
    url
  ]);
  console.log('Saved', target);
}

capture('preview-reels.html', '15-work-reels-desktop.png', 1440, 960);
capture('preview-reels.html', '16-work-reels-tablet.png', 768, 1100);
capture('preview-reels.html', '17-work-reels-mobile.png', 375, 800);
capture('index.html', '18-index-work-reels.png', 1440, 1100);

