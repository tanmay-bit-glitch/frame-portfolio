const fs = require('fs');

// 1. Remove .work-toolbar (Attachment 1) and .work-featured-video-block (Attachment 3) from index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Remove .work-toolbar
const toolbarStart = indexHtml.indexOf('      <!-- Work Filters Toolbar -->');
const galleryGridStart = indexHtml.indexOf('      <!-- MASONRY SCROLL GALLERY');
if (toolbarStart !== -1 && galleryGridStart !== -1) {
  indexHtml = indexHtml.slice(0, toolbarStart) + indexHtml.slice(galleryGridStart);
  console.log('Removed .work-toolbar from index.html');
} else {
  console.log('Could not find .work-toolbar markers in index.html');
}

// Remove .work-featured-video-block (#aftermovie)
const aftermovieStart = indexHtml.indexOf('      <!-- EMBEDDED AFTERMOVIE (MAIN WORK SECTION) -->');
const reelsSectionStart = indexHtml.indexOf('    <!-- REELS & VIDEO SHOWCASE SECTION');
if (aftermovieStart !== -1 && reelsSectionStart !== -1) {
  indexHtml = indexHtml.slice(0, aftermovieStart) + '    </section>\n\n    ' + indexHtml.slice(reelsSectionStart);
  console.log('Removed .work-featured-video-block from index.html');
} else {
  console.log('Could not find .work-featured-video-block markers in index.html');
}

fs.writeFileSync('index.html', indexHtml, 'utf8');

// Also remove .work-toolbar from preview-gallery.html if present
let previewGallery = fs.readFileSync('preview-gallery.html', 'utf8');
const pgToolbarStart = previewGallery.indexOf('      <!-- Work Filters Toolbar -->');
const pgGridStart = previewGallery.indexOf('      <!-- MASONRY SCROLL GALLERY');
if (pgToolbarStart !== -1 && pgGridStart !== -1) {
  previewGallery = previewGallery.slice(0, pgToolbarStart) + previewGallery.slice(pgGridStart);
  fs.writeFileSync('preview-gallery.html', previewGallery, 'utf8');
  console.log('Removed .work-toolbar from preview-gallery.html');
}

// 2. Remove .work-featured-video-block styles from styles.css
let styles = fs.readFileSync('styles.css', 'utf8');
const wvbStart = styles.indexOf('.work-featured-video-block {');
const wvbEnd = styles.indexOf('/* ==========================================================================\n   REELS & MOTION ARCHIVE');

if (wvbStart !== -1 && wvbEnd !== -1) {
  styles = styles.slice(0, wvbStart) + styles.slice(wvbEnd);
  console.log('Removed .work-featured-video-block CSS from styles.css');
}

// 3. Fix Attachment 2: Clip out the white Instagram footer bar inside .motion-card .card-media-wrapper iframe
styles = styles.replace(
  /\.motion-card \.card-media-wrapper iframe\s*\{[\s\S]*?\}/,
  `.motion-card .card-media-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% + 78px);
  border: none;
  display: block;
  background: #000;
}`
);

fs.writeFileSync('styles.css', styles, 'utf8');
console.log('Updated styles.css with Instagram footer clipping!');

