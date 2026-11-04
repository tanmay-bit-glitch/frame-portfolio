const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

const indexHtml = fs.readFileSync('index.html', 'utf8');
const abStart = indexHtml.indexOf('<section class="about section-pad"');
const abEnd = indexHtml.indexOf('</section>', abStart) + 10;
const preview = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Archivo+Black&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>
    body { background: #070706 !important; color: #f5f2ea !important; margin: 0; padding: 24px; }
  </style>
</head>
<body>
  ${indexHtml.slice(abStart, abEnd)}
</body>
</html>`;

fs.writeFileSync('preview-about-compact.html', preview, 'utf8');

function capture(w, h, name) {
  const target = path.resolve(`curation/screenshots/${name}`);
  const fileUrl = 'file:///' + path.resolve('preview-about-compact.html').replace(/\\/g, '/');
  cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=2000',
    userData,
    '--screenshot=' + target,
    `--window-size=${w},${h}`,
    fileUrl
  ]);
  const artifactTarget = path.join(artifactDir, name);
  fs.copyFileSync(target, artifactTarget);
  console.log(`Captured ${name}: ${fs.statSync(target).size} bytes`);
}

capture(1440, 720, 'step2-about-compact-1440.png');
capture(768, 920, 'step2-about-compact-768.png');
capture(375, 960, 'step2-about-compact-375.png');

function captureFlow(w, h, name) {
  const target = path.resolve(`curation/screenshots/${name}`);
  const fileUrl = 'file:///' + path.resolve('preview-step2-flow.html').replace(/\\/g, '/');
  cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=2000',
    userData,
    '--screenshot=' + target,
    `--window-size=${w},${h}`,
    fileUrl
  ]);
  const artifactTarget = path.join(artifactDir, name);
  if (fs.existsSync(target)) {
    fs.copyFileSync(target, artifactTarget);
    console.log(`Captured ${name}: ${fs.statSync(target).size} bytes`);
  }
}

captureFlow(1440, 1400, 'step2-flow-1440.png');
captureFlow(768, 1600, 'step2-flow-768.png');
captureFlow(375, 1800, 'step2-flow-375.png');
