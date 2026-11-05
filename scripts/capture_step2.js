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

const fileUrl = `file:///${path.resolve('index.html').replace(/\\/g, '/')}`;

// Scrolled to #about
capture(`${fileUrl}#about`, 'step2-about-1440.png', 1440, 960);
capture(`${fileUrl}#about`, 'step2-about-768.png', 768, 1024);
capture(`${fileUrl}#about`, 'step2-about-375.png', 375, 812);

// Also capture top of page with one scroll to see showreel visibility
// Let's create an isolated preview of Hero + About + Showreel header to demonstrate visible showreel title
const indexHtml = fs.readFileSync('index.html', 'utf8');
const heroStart = indexHtml.indexOf('<section class="hero');
const showreelHeaderEnd = indexHtml.indexOf('</div>', indexHtml.indexOf('class="section-header-split"')) + 6;
// That gives hero + about + showreel header!
const previewSnippet = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="styles.css">
  <style>body { background: #070706; color: #f5f2ea; margin: 0; }</style>
</head>
<body>
  ${indexHtml.slice(heroStart, showreelHeaderEnd)}
  </div>
  </section>
</body>
</html>`;
fs.writeFileSync('preview-step2-flow.html', previewSnippet, 'utf8');

const previewUrl = `file:///${path.resolve('preview-step2-flow.html').replace(/\\/g, '/')}`;
capture(previewUrl, 'step2-flow-1440.png', 1440, 1100);

console.log('Step 2 captures completed.');

