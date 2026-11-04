const cp = require('child_process');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outPath = path.resolve('curation/screenshots/gallery-full.png');
const url = 'file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-gallery.html';

cp.spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--screenshot=${outPath}`,
  '--window-size=1440,6500',
  url
]);
console.log('Done, size:', require('fs').statSync(outPath).size);
