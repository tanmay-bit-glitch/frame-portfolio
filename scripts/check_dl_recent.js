const fs = require('fs');
const path = require('path');

const dlDir = 'C:\\Users\\tchav\\Downloads\\drive-download-20261104T113528Z-1-001';
if (fs.existsSync(dlDir)) {
  const files = fs.readdirSync(dlDir);
  console.log('Total files in drive-download folder:', files.length);
  const recent = [];
  for (const f of files) {
    const s = fs.statSync(path.join(dlDir, f));
    if (s.mtime > new Date('2026-11-04T16:00:00Z')) {
      recent.push({ name: f, time: s.mtime, size: s.size });
    }
  }
  console.log('Recent files in drive-download:', recent.length);
  recent.forEach(r => console.log(r.name, r.time));
} else {
  console.log('dlDir does not exist');
}

