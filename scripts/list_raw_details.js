const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../raw_photos');
const files = fs.readdirSync(rawDir);
console.log('Total files in raw_photos:', files.length);

const stats = files.map(f => {
  const s = fs.statSync(path.join(rawDir, f));
  return { name: f, size: s.size, mtime: s.mtime };
});

const mp4s = stats.filter(f => f.name.endsWith('.mp4'));
console.log('MP4 files:', mp4s);

// Check if any files were added or modified recently (after 21:00 on 04-11-2026)
const recent = stats.filter(f => f.mtime > new Date('2026-11-04T18:00:00Z'));
console.log('Files with recent mtime (>18:00 UTC):', recent.length);
recent.forEach(r => console.log('Recent:', r.name, r.size, r.mtime));

