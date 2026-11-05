const fs = require('fs');
const path = require('path');

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Find about section
const aboutMarker = '    <!-- ABOUT / PHILOSOPHY SECTION -->\n';
const aboutStart = html.indexOf(aboutMarker);
if (aboutStart === -1) {
  throw new Error('Could not find aboutMarker');
}
const aboutEnd = html.indexOf('</section>', aboutStart) + '</section>'.length;
// Include trailing newline
const fullAboutBlock = html.slice(aboutStart, aboutEnd) + '\n\n';

// Remove about block from its current location
html = html.slice(0, aboutStart) + html.slice(aboutEnd).replace(/^\n+/, '');

// Target insertion: right before showreel section
const showreelMarker = '    <!-- SHOWREEL SECTION (VERY TOP) -->';
const showreelStart = html.indexOf(showreelMarker);
if (showreelStart === -1) {
  throw new Error('Could not find showreelMarker');
}

html = html.slice(0, showreelStart) + fullAboutBlock + html.slice(showreelStart);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Step 1: Successfully reordered sections in index.html');

