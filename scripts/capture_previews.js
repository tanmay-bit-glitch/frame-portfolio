const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

// Let's create an isolated preview file preview-campus.html to preview the campus section directly
const indexHtml = fs.readFileSync('index.html', 'utf8');
const expStart = indexHtml.indexOf('<section class="campus-section');
const expEnd = indexHtml.indexOf('</section>', expStart) + 10;
const campusHtml = indexHtml.slice(expStart, expEnd);

const previewCampus = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Campus Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Archivo+Black&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>
    body { background: #070706 !important; color: #f5f2ea !important; padding: 24px; min-height: 100vh; }
    .campus-section { padding-top: 10px !important; }
  </style>
</head>
<body>
${campusHtml}
</body>
</html>`;

fs.writeFileSync('preview-campus.html', previewCampus, 'utf8');

// Also create preview-about.html to preview About section directly
const abStart = indexHtml.indexOf('<section class="about section-pad"');
const abEnd = indexHtml.indexOf('</section>', abStart) + 10;
const aboutHtml = indexHtml.slice(abStart, abEnd);

const previewAbout = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>About Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Archivo+Black&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>
    body { background: #070706 !important; color: #f5f2ea !important; padding: 24px; min-height: 100vh; }
    .about { padding-top: 10px !important; }
  </style>
</head>
<body>
${aboutHtml}
</body>
</html>`;

fs.writeFileSync('preview-about.html', previewAbout, 'utf8');

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

capture('preview-campus.html', '19-campus-frame-updated-1440.png', 1440, 1150);
capture('preview-about.html', '20-about-profile-placed-properly-1440.png', 1440, 900);
capture('preview-about.html', '21-about-profile-mobile-375.png', 375, 950);
console.log('Done captures!');

