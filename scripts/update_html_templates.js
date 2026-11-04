const fs = require('fs');

function updateHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const isCrlf = html.includes('\r\n');
  if (isCrlf) html = html.replace(/\r\n/g, '\n');

  // Add focus backdrop if not present
  if (!html.includes('id="galleryFocusBackdrop"')) {
    html = html.replace(
      /(<div class="gallery-masonry" id="galleryGrid"[^>]*>[\s\S]*?<\/div>)/,
      `$1\n      <div class="gallery-focus-backdrop" id="galleryFocusBackdrop" aria-hidden="true"></div>`
    );
  }

  // If preview-gallery.html, ensure .gallery-card is visible in headless preview
  if (filePath.includes('preview-gallery.html')) {
    html = html.replace('.photo-card { opacity: 1 !important; transform: none !important; }', '.gallery-card { opacity: 1 !important; transform: none !important; }');
  }

  if (isCrlf) html = html.replace(/\n/g, '\r\n');
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateHtmlFile('index.html');
updateHtmlFile('preview-gallery.html');

