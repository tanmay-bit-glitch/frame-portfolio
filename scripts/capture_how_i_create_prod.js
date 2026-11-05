const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data_prod_' + Date.now();
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract head from index.html
const headMatch = indexHtml.match(/<head[\s\S]*?<\/head>/i);
const head = headMatch ? headMatch[0] : '';

// Extract skills section from index.html
const skillsStart = indexHtml.indexOf('<section class="skills-section');
const skillsEnd = indexHtml.indexOf('</section>', skillsStart) + '</section>'.length;
const skillsSection = indexHtml.slice(skillsStart, skillsEnd);

function makeHtml(wrapperStyle) {
  return `<!DOCTYPE html>
<html lang="en">
${head}
<style>
  body {
    background: #070706 !important;
    color: #f5f2ea !important;
    padding: 24px 0 !important;
    margin: 0 !important;
    min-height: 100vh;
  }
  .skills-section {
    padding: 0 !important;
  }
  .stage-wrapper {
    ${wrapperStyle}
    box-sizing: border-box;
    padding: 0 16px;
  }
</style>
<body>
  <div class="stage-wrapper">
    ${skillsSection}
  </div>
</body>
</html>`;
}

function capture(fileHtml, outFile, width, height) {
  const previewPath = path.resolve('temp_' + outFile.replace('.png', '.html'));
  fs.writeFileSync(previewPath, fileHtml);

  const localTarget = path.resolve('curation/screenshots', outFile);
  const artifactTarget = path.join(artifactDir, outFile);
  const fileUrl = `file:///${previewPath.replace(/\\/g, '/')}`;
  cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=2000',
    userData,
    `--screenshot=${localTarget}`,
    `--window-size=${width},${height}`,
    fileUrl
  ]);
  if (fs.existsSync(localTarget)) {
    fs.copyFileSync(localTarget, artifactTarget);
    console.log(`Saved: ${outFile}`);
  } else {
    console.error(`Failed to capture: ${outFile}`);
  }
  try { fs.unlinkSync(previewPath); } catch(e){}
}

capture(makeHtml('max-width: 1240px; margin: 0 auto;'), 'how-i-create-1440.png', 1440, 960);
capture(makeHtml('max-width: 740px; margin: 0 auto;'), 'how-i-create-768.png', 768, 1200);
capture(makeHtml('width: 375px; max-width: 375px; margin: 0 !important;'), 'how-i-create-375.png', 375, 1300);
