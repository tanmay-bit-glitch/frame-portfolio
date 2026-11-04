const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rawDir = path.join(rootDir, 'raw_photos');
const rejectsDir = path.join(rootDir, 'rejects');

const analysis = JSON.parse(fs.readFileSync(path.join(rootDir, 'curation', 'analysis.json'), 'utf8'));
const dupGroups = JSON.parse(fs.readFileSync(path.join(rootDir, 'curation', 'duplicate_groups.json'), 'utf8'));

// 1. Corrupt
const corruptFiles = analysis.filter(x => !x.valid || x.size === 0).map(x => x.filename);

// 2. Screenshots
const screenshotFiles = analysis.filter(x => x.filename.toLowerCase().includes('screenshot')).map(x => x.filename);

// 3. WhatsApp
const whatsappFiles = analysis.filter(x => x.filename.includes('WA')).map(x => x.filename);

// 4. Duplicate losers
const duplicateFiles = [];
dupGroups.forEach(g => {
  g.losers.forEach(l => duplicateFiles.push(l.filename));
});

// 5. Quality rejects (blurry, test shots, corrupted frames)
const qualityFiles = [
  '20260815_142638 (1).jpg', // Sharpness 3, washed out
  '20260629_181945.jpg',      // Sharpness 8, severe camera motion blur
  '20260624_183116.jpg',      // Sharpness 14, motion blur
  '20260406_191816.jpg',      // Sharpness 23, lum 14 (pitch dark test frame)
  '20260326_231355.jpg',      // Lum 17, dark accidental pocket shot
  '20260518_090412.jpg'       // Lum 22, severely underexposed test frame
];

function moveFiles(fileList, subfolder) {
  const destDir = path.join(rejectsDir, subfolder);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  
  let count = 0;
  for (const fn of fileList) {
    const src = path.join(rawDir, fn);
    const dest = path.join(destDir, fn);
    if (fs.existsSync(src)) {
      fs.renameSync(src, dest);
      count++;
    }
  }
  console.log(`Moved ${count} files to rejects/${subfolder}/`);
}

console.log('Moving rejects safely (no files deleted):');
moveFiles(corruptFiles, 'corrupt');
moveFiles(screenshotFiles, 'screenshots');
moveFiles(whatsappFiles, 'whatsapp');
moveFiles(duplicateFiles, 'duplicates');
moveFiles(qualityFiles, 'quality');

const remaining = fs.readdirSync(rawDir);
console.log(`\nRemaining unique quality originals in raw_photos/: ${remaining.length}`);
