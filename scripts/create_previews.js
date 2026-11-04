const fs = require('fs');
const html = fs.readFileSync('c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/index.html', 'utf8');

const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
const headContent = headMatch ? headMatch[1] : '<link rel="stylesheet" href="styles.css">';

// 1. Showreel Section
const showreelMatch = html.match(/(<section class="showreel-section[\s\S]*?<\/section>)/);
if (showreelMatch) {
  const showreelHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}
<style>
  body { background: #030407 !important; color: #f4f4f7 !important; padding: 24px; min-height: 100vh; }
  .showreel-section { padding-top: 10px !important; }
</style>
</head>
<body>
${showreelMatch[1]}
<script src="script.js"></script>
</body>
</html>`;
  fs.writeFileSync('c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-showreel.html', showreelHtml);
  console.log('Created preview-showreel.html');
}

// 2. Work Gallery Section
const workMatch = html.match(/(<section class="work[\s\S]*?<\/section>)/);
if (workMatch) {
  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}
<style>
  body { background: #030407 !important; color: #f4f4f7 !important; padding: 24px; min-height: 100vh; }
  .work { padding-top: 10px !important; }
  .photo-card { opacity: 1 !important; transform: none !important; }
</style>
</head>
<body>
${workMatch[1]}
<script src="script.js"></script>
</body>
</html>`;
  fs.writeFileSync('c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-gallery.html', galleryHtml);
  console.log('Created preview-gallery.html');
}

// 3. Reels Section
const reelsMatch = html.match(/(<section class="reels-section[\s\S]*?<\/section>)/);
if (reelsMatch) {
  const reelsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}
<style>
  body { background: #030407 !important; color: #f4f4f7 !important; padding: 24px; min-height: 100vh; }
  .reels-section { padding-top: 10px !important; }
</style>
</head>
<body>
${reelsMatch[1]}
</body>
</html>`;
  fs.writeFileSync('c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-reels.html', reelsHtml);
  console.log('Created preview-reels.html');
}
