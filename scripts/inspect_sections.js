const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
console.log('--- SECTIONS FOUND IN index.html ---');
lines.forEach((line, i) => {
  if (line.includes('<section') || line.includes('<footer') || line.includes('<header')) {
    const idMatch = line.match(/id=["']([^"']+)["']/);
    const tagMatch = line.match(/<(section|footer|header)/);
    const classMatch = line.match(/class=["']([^"']+)["']/);
    console.log(`Line ${i + 1}: <${tagMatch ? tagMatch[1] : 'elem'} id="${idMatch ? idMatch[1] : 'NONE'}" class="${classMatch ? classMatch[1] : ''}">`);
  }
});

