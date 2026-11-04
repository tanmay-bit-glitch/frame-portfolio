const fs = require('fs');
const html = fs.readFileSync('c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('<section') || l.includes('id="work"') || l.includes('id="reels"') || l.includes('id="showreel"')) {
    console.log(idx + 1, l.trim());
  }
});
