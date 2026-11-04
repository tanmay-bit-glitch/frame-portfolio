const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';
const artifactDir = 'C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962';

// HTML content for 200% zoom audit
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cutout Quality Inspection (200% Zoom)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #111110;
      color: #f5f2ea;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 32px 24px;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 8px;
      color: #e05d2c;
    }
    p.sub {
      color: #aaa;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .inspection-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      max-width: 1300px;
      margin: 0 auto;
    }
    .panel {
      border-radius: 8px;
      padding: 20px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .panel.dark-bg {
      background: #080807;
    }
    .panel.light-bg {
      background: #f5f2ea;
      color: #111;
    }
    .panel-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(128,128,128,0.2);
    }
    .full-preview {
      text-align: center;
      margin-bottom: 20px;
    }
    .full-preview img {
      height: 320px;
      width: auto;
      object-fit: contain;
    }
    .zoom-regions {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .zoom-box {
      border: 1px solid rgba(128,128,128,0.3);
      border-radius: 6px;
      overflow: hidden;
      background: inherit;
    }
    .zoom-box-title {
      font-size: 11px;
      font-weight: 600;
      padding: 6px 8px;
      background: rgba(128,128,128,0.15);
      border-bottom: 1px solid rgba(128,128,128,0.2);
    }
    .zoom-viewport {
      width: 100%;
      height: 160px;
      overflow: hidden;
      position: relative;
    }
    .zoom-viewport img {
      position: absolute;
      width: 250%; /* 250% zoom for extreme edge inspection */
      height: auto;
    }
    /* Positioning for zoom crops */
    .zoom-hair img {
      top: -2%;
      left: -65%;
    }
    .zoom-glasses img {
      top: -30%;
      left: -68%;
    }
    .zoom-arms img {
      top: -115%;
      left: -65%;
    }
  </style>
</head>
<body>
  <h1>Cutout Edge & Transparency Audit (rembg / u2net_human_seg)</h1>
  <p class="sub">200%+ zoom inspection across hair silhouette, sunglasses/ears, and crossed-arms torso gaps on both dark (#080807) and light (#f5f2ea) backgrounds.</p>

  <div class="inspection-grid">
    <!-- Dark Background Panel -->
    <div class="panel dark-bg">
      <div class="panel-title">Dark Theme Preview (#080807)</div>
      <div class="full-preview">
        <img src="portrait_cutout_master.png" alt="Full Cutout on Dark">
      </div>
      <div class="zoom-regions">
        <div class="zoom-box">
          <div class="zoom-box-title">200% HAIR &amp; HEAD</div>
          <div class="zoom-viewport zoom-hair">
            <img src="portrait_cutout_master.png">
          </div>
        </div>
        <div class="zoom-box">
          <div class="zoom-box-title">200% GLASSES &amp; TEMPLE</div>
          <div class="zoom-viewport zoom-glasses">
            <img src="portrait_cutout_master.png">
          </div>
        </div>
        <div class="zoom-box">
          <div class="zoom-box-title">200% CROSSED ARMS</div>
          <div class="zoom-viewport zoom-arms">
            <img src="portrait_cutout_master.png">
          </div>
        </div>
      </div>
    </div>

    <!-- Light Background Panel -->
    <div class="panel light-bg">
      <div class="panel-title">Light Theme Preview (#f5f2ea)</div>
      <div class="full-preview">
        <img src="portrait_cutout_master.png" alt="Full Cutout on Light">
      </div>
      <div class="zoom-regions">
        <div class="zoom-box">
          <div class="zoom-box-title">200% HAIR &amp; HEAD</div>
          <div class="zoom-viewport zoom-hair">
            <img src="portrait_cutout_master.png">
          </div>
        </div>
        <div class="zoom-box">
          <div class="zoom-box-title">200% GLASSES &amp; TEMPLE</div>
          <div class="zoom-viewport zoom-glasses">
            <img src="portrait_cutout_master.png">
          </div>
        </div>
        <div class="zoom-box">
          <div class="zoom-box-title">200% CROSSED ARMS</div>
          <div class="zoom-viewport zoom-arms">
            <img src="portrait_cutout_master.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('assets/cutout/inspect_cutout.html', htmlContent, 'utf8');

const target = path.resolve('curation/screenshots/step2-cutout-zoom-audit.png');
const fileUrl = 'file:///' + path.resolve('assets/cutout/inspect_cutout.html').replace(/\\/g, '/');

cp.spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--virtual-time-budget=2000',
  userData,
  '--screenshot=' + target,
  '--window-size=1400,850',
  fileUrl
]);

const artifactTarget = path.join(artifactDir, 'step2-cutout-zoom-audit.png');
if (fs.existsSync(target)) {
  fs.copyFileSync(target, artifactTarget);
  console.log('Saved step2-cutout-zoom-audit.png:', fs.statSync(target).size, 'bytes');
}
