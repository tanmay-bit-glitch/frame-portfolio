const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const screenshotsDir = path.resolve('curation/screenshots');
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

// Create preview files that scroll to specific scrollY positions upon load
let indexHtml = fs.readFileSync('index.html', 'utf8');

function createScrolledPreview(scrollY, name) {
  const injected = indexHtml.replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        window.scrollTo(0, ${scrollY});
        setTimeout(() => {
          window.scrollTo(0, ${scrollY});
          window.dispatchEvent(new Event('scroll'));
        }, 150);
      });
    </script>
    </body>`
  );
  fs.writeFileSync(`preview-scroll-${name}.html`, injected, 'utf8');
}

createScrolledPreview(0, 'hero');
createScrolledPreview(320, 'midflight');
createScrolledPreview(680, 'docked');

function capture(previewFile, outFile, width, height, waitMs = 1200) {
  console.log(`Capturing ${outFile} (${width}x${height})...`);
  const localTarget = path.join(screenshotsDir, outFile);
  const fileUrl = `file:///${path.resolve(previewFile).replace(/\\/g, '/')}`;
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
    console.log(`Saved ${outFile} (${fs.statSync(localTarget).size} bytes)`);
  }
}

// 1. Zoomed Hero at 1440, 768, 375
capture('preview-scroll-hero.html', 'step4-hero-zoomed-1440.png', 1440, 960);
capture('preview-scroll-hero.html', 'step4-hero-zoomed-768.png', 768, 1024);
capture('preview-scroll-hero.html', 'step4-hero-zoomed-375.png', 375, 812);

// 2. Mid-flight travel (desktop 1440px)
capture('preview-scroll-midflight.html', 'step4-travel-midflight-1440.png', 1440, 960);

// 3. Settled & docked in About section (desktop 1440px)
capture('preview-scroll-docked.html', 'step4-travel-docked-1440.png', 1440, 960);

console.log('Animation captures completed successfully.');
