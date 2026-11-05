const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data_fonts_' + Date.now();
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Calligraphic Font Options for Tanmay</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #070706;
      color: #f5f2ea;
      font-family: 'Archivo', sans-serif;
      padding: 30px 20px;
    }
    h1.page-heading {
      text-align: center;
      font-size: 20px;
      color: #e05d2c;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 24px;
      font-family: 'JetBrains Mono', monospace;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .option-card {
      background: #0d0d0c;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .option-header {
      padding: 10px 16px;
      background: #141413;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
    }
    .option-title {
      color: #e05d2c;
      font-weight: 600;
    }
    .option-desc {
      color: #8e8b83;
    }
    .option-stage {
      position: relative;
      height: 380px;
      background: radial-gradient(ellipse at center 50%, rgba(224, 93, 44, 0.16) 0%, rgba(7, 7, 6, 0.98) 72%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .stage-hud-tl {
      position: absolute;
      top: 14px;
      left: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: rgba(245, 242, 234, 0.6);
      letter-spacing: 0.08em;
    }
    .stage-hud-tr {
      position: absolute;
      top: 14px;
      right: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: #e05d2c;
      letter-spacing: 0.1em;
    }
    .stage-title {
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #e05d2c;
      font-size: 180px;
      line-height: 0.8;
      white-space: nowrap;
      filter: drop-shadow(0 0 35px rgba(224, 93, 44, 0.45));
      pointer-events: none;
      user-select: none;
    }
    .f-herrvon { font-family: 'Herr Von Muellerhoff', cursive; font-size: 210px; }
    .f-delafield { font-family: 'Mrs Saint Delafield', cursive; font-size: 180px; }
    .f-monsieur { font-family: 'Monsieur La Doulaise', cursive; font-size: 190px; }
    .f-pinyon { font-family: 'Pinyon Script', cursive; font-size: 160px; }
    
    .stage-portrait {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 75%;
      z-index: 2;
      filter: drop-shadow(0 -8px 25px rgba(0, 0, 0, 0.7));
    }
    .stage-pill {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
      background: rgba(14, 14, 12, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.14);
      padding: 3px 12px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      letter-spacing: 0.12em;
      color: #f5f2ea;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <h1 class="page-heading">Abstract Calligraphic Font Options for "Tanmay"</h1>
  <div class="options-grid">
    
    <!-- Option 1 -->
    <div class="option-card">
      <div class="option-header">
        <span class="option-title">OPTION 1: HERR VON MUELLERHOFF</span>
        <span class="option-desc">Sweeping Abstract Flourishes</span>
      </div>
      <div class="option-stage">
        <span class="stage-hud-tl">Photographer · Videographer · Editor</span>
        <span class="stage-hud-tr">SCROLL ↓</span>
        <div class="stage-title f-herrvon">Tanmay</div>
        <img src="assets/cutout/portrait_cutout_600.webp" class="stage-portrait" alt="Tanmay">
        <div class="stage-pill">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

    <!-- Option 2 -->
    <div class="option-card">
      <div class="option-header">
        <span class="option-title">OPTION 2: MRS SAINT DELAFIELD</span>
        <span class="option-desc">High-Flourish Signature Flow</span>
      </div>
      <div class="option-stage">
        <span class="stage-hud-tl">Photographer · Videographer · Editor</span>
        <span class="stage-hud-tr">SCROLL ↓</span>
        <div class="stage-title f-delafield">Tanmay</div>
        <img src="assets/cutout/portrait_cutout_600.webp" class="stage-portrait" alt="Tanmay">
        <div class="stage-pill">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

    <!-- Option 3 -->
    <div class="option-card">
      <div class="option-header">
        <span class="option-title">OPTION 3: MONSIEUR LA DOULAISE</span>
        <span class="option-desc">Ornate Dramatic Loops</span>
      </div>
      <div class="option-stage">
        <span class="stage-hud-tl">Photographer · Videographer · Editor</span>
        <span class="stage-hud-tr">SCROLL ↓</span>
        <div class="stage-title f-monsieur">Tanmay</div>
        <img src="assets/cutout/portrait_cutout_600.webp" class="stage-portrait" alt="Tanmay">
        <div class="stage-pill">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

    <!-- Option 4 -->
    <div class="option-card">
      <div class="option-header">
        <span class="option-title">OPTION 4: PINYON SCRIPT</span>
        <span class="option-desc">Classic Aristocratic Ribbon</span>
      </div>
      <div class="option-stage">
        <span class="stage-hud-tl">Photographer · Videographer · Editor</span>
        <span class="stage-hud-tr">SCROLL ↓</span>
        <div class="stage-title f-pinyon">Tanmay</div>
        <img src="assets/cutout/portrait_cutout_600.webp" class="stage-portrait" alt="Tanmay">
        <div class="stage-pill">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync('preview-calligraphy-options.html', previewHtml);

const localTarget = path.resolve('curation/screenshots/calligraphy-font-options.png');
const artifactTarget = path.join(artifactDir, 'calligraphy-font-options.png');
const fileUrl = `file:///${path.resolve('preview-calligraphy-options.html').replace(/\\/g, '/')}`;

cp.spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--virtual-time-budget=2500',
  userData,
  `--screenshot=${localTarget}`,
  '--window-size=1440,950',
  fileUrl
]);

if (fs.existsSync(localTarget)) {
  fs.copyFileSync(localTarget, artifactTarget);
  console.log('Saved calligraphy-font-options.png successfully!');
} else {
  console.error('Failed to capture calligraphy-font-options.png');
}

