const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotsDir = path.join(rootDir, 'curation', 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(rootDir, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Handle video streaming range requests
  if (ext === '.mp4') {
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType
      });
      file.pipe(res);
      return;
    }
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  console.log(`Local test server running at http://127.0.0.1:${port}`);

  const userDataDir = path.join(rootDir, 'curation', 'chrome_test_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const viewports = [
    { name: '375', w: 375, h: 812 },
    { name: '768', w: 768, h: 1024 },
    { name: '1440', w: 1440, h: 900 }
  ];

  try {
    for (const vp of viewports) {
      const shotPath = path.join(screenshotsDir, `phase4-showreel-${vp.name}.png`);
      const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir="${userDataDir}" --window-size=${vp.w},${vp.h} --screenshot="${shotPath}" "http://127.0.0.1:${port}/index.html#showreel"`;
      execSync(cmd, { stdio: 'ignore' });
      console.log(`Captured: phase4-showreel-${vp.name}.png (${(fs.statSync(shotPath).size / 1024).toFixed(1)} KB)`);

      const reelsShot = path.join(screenshotsDir, `phase4-reels-${vp.name}.png`);
      const cmdReels = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir="${userDataDir}" --window-size=${vp.w},${vp.h} --screenshot="${reelsShot}" "http://127.0.0.1:${port}/index.html#reels"`;
      execSync(cmdReels, { stdio: 'ignore' });
      console.log(`Captured: phase4-reels-${vp.name}.png (${(fs.statSync(reelsShot).size / 1024).toFixed(1)} KB)`);

      const galleryShot = path.join(screenshotsDir, `phase4-gallery-${vp.name}.png`);
      const cmdGallery = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir="${userDataDir}" --window-size=${vp.w},${vp.h} --screenshot="${galleryShot}" "http://127.0.0.1:${port}/index.html#work"`;
      execSync(cmdGallery, { stdio: 'ignore' });
      console.log(`Captured: phase4-gallery-${vp.name}.png (${(fs.statSync(galleryShot).size / 1024).toFixed(1)} KB)`);
    }

    console.log('\nAll Phase 4 screenshots successfully captured across 375px, 768px, and 1440px viewports!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    server.close();
  }
});
