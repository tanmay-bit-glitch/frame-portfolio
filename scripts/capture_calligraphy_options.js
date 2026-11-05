const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Calligraphic Font Options for Tanmay</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Herr+Von+Muellerhoff&family=Mrs+Saint+Delafield&family=Monsieur+La+Doulaise&family=Pinyon+Script&family=Alex+Brush&family=Archivo:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
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
      font-size: 22px;
      color: #e05d2c;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 24px;
      font-family: 'JetBrains Mono', monospace;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
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
      padding: 12px 18px;
      background: #141413;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #e05d2c;
      display: flex;
      justify-content: space-between;
    }
    .option-header span.tag {
      color: #888;
    }
    
    .hero-stage-mock {
      position: relative;
      height: 440px;
      background: #070706;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }
    
    .calligraphic-title {
      position: absolute;
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      color: #e05d2c;
      z-index: 1;
      user-select: none;
      white-space: nowrap;
      pointer-events: none;
      text-shadow: 0 0 35px rgba(224, 93, 44, 0.35);
    }

    .font-muellerhoff {
      font-family: 'Herr Von Muellerhoff', cursive;
      font-size: 180px;
      line-height: 0.8;
      letter-spacing: 0.02em;
    }

    .font-delafield {
      font-family: 'Mrs Saint Delafield', cursive;
      font-size: 190px;
      line-height: 0.8;
      letter-spacing: 0.02em;
    }

    .font-doulase {
      font-family: 'Monsieur La Doulaise', cursive;
      font-size: 175px;
      line-height: 0.8;
    }

    .font-pinyon {
      font-family: 'Pinyon Script', cursive;
      font-size: 155px;
      line-height: 0.85;
      letter-spacing: 0.04em;
    }

    .portrait-wrap {
      position: relative;
      z-index: 2;
      height: 380px;
      display: flex;
      align-items: flex-end;
    }
    .portrait-img {
      height: 100%;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 20px 45px rgba(0,0,0,0.95));
      transform: scale(1.15);
      transform-origin: bottom center;
    }

    /* Small HUD overlay */
    .hud-tl {
      position: absolute;
      top: 16px;
      left: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: rgba(245,242,234,0.5);
      z-index: 5;
    }
    .hud-tr {
      position: absolute;
      top: 16px;
      right: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #e05d2c;
      z-index: 5;
    }
    .hud-bottom {
      position: absolute;
      bottom: 14px;
      z-index: 5;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background: rgba(8,8,7,0.85);
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.1);
    }
  </style>
</head>
<body>
  <h1 class="page-heading">Abstract Calligraphic Font Options for "Tanmay"</h1>
  <div class="options-grid">

    <!-- Option 1: Herr Von Muellerhoff -->
    <div class="option-card">
      <div class="option-header">
        <span>OPTION 1: HERR VON MUELLERHOFF</span>
        <span class="tag">Sweeping Abstract Flourishes</span>
      </div>
      <div class="hero-stage-mock">
        <div class="hud-tl">Photographer · Videographer · Editor</div>
        <div class="hud-tr">SCROLL ↓</div>
        <div class="calligraphic-title font-muellerhoff">Tanmay</div>
        <div class="portrait-wrap">
          <img src="assets/cutout/portrait_cutout_1000.png" class="portrait-img">
        </div>
        <div class="hud-bottom">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

    <!-- Option 2: Mrs Saint Delafield -->
    <div class="option-card">
      <div class="option-header">
        <span>OPTION 2: MRS SAINT DELAFIELD</span>
        <span class="tag">High-Flourish Signature Flow</span>
      </div>
      <div class="hero-stage-mock">
        <div class="hud-tl">Photographer · Videographer · Editor</div>
        <div class="hud-tr">SCROLL ↓</div>
        <div class="calligraphic-title font-delafield">Tanmay</div>
        <div class="portrait-wrap">
          <img src="assets/cutout/portrait_cutout_1000.png" class="portrait-img">
        </div>
        <div class="hud-bottom">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

    <!-- Option 3: Monsieur La Doulaise -->
    <div class="option-card">
      <div class="option-header">
        <span>OPTION 3: MONSIEUR LA DOULAISE</span>
        <span class="tag">Ornate Dramatic Loops</span>
      </div>
      <div class="hero-stage-mock">
        <div class="hud-tl">Photographer · Videographer · Editor</div>
        <div class="hud-tr">SCROLL ↓</div>
        <div class="calligraphic-title font-doulase">Tanmay</div>
        <div class="portrait-wrap">
          <img src="assets/cutout/portrait_cutout_1000.png" class="portrait-img">
        </div>
        <div class="hud-bottom">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

    <!-- Option 4: Pinyon Script -->
    <div class="option-card">
      <div class="option-header">
        <span>OPTION 4: PINYON SCRIPT</span>
        <span class="tag">Classic Aristocratic Ribbon</span>
      </div>
      <div class="hero-stage-mock">
        <div class="hud-tl">Photographer · Videographer · Editor</div>
        <div class="hud-tr">SCROLL ↓</div>
        <div class="calligraphic-title font-pinyon">Tanmay</div>
        <div class="portrait-wrap">
          <img src="assets/cutout/portrait_cutout_1000.png" class="portrait-img">
        </div>
        <div class="hud-bottom">I STOP WHEN A FRAME FEELS RIGHT.</div>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync('preview-calligraphy-options.html', previewHtml, 'utf8');

const target = path.resolve('curation/screenshots/calligraphy-font-options.png');
const fileUrl = 'file:///' + path.resolve('preview-calligraphy-options.html').replace(/\\/g, '/');

cp.spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--virtual-time-budget=2500',
  userData,
  '--screenshot=' + target,
  '--window-size=1440,1050',
  fileUrl
]);

const artifactTarget = path.join(artifactDir, 'calligraphy-font-options.png');
if (fs.existsSync(target)) {
  fs.copyFileSync(target, artifactTarget);
  console.log('Saved calligraphy options screenshot:', fs.statSync(target).size, 'bytes');
}
