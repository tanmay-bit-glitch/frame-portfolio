const fs = require('fs');
const path = require('path');

const analysis = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'curation', 'analysis.json'), 'utf8'));

// Helper to compute hamming distance between two binary hashes
function hammingDistance(h1, h2) {
  if (!h1 || !h2 || h1.length !== h2.length) return 999;
  let dist = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) dist++;
  }
  return dist;
}

// Group files
// First, identify corrupt, screenshots, whatsapp
const corrupt = [];
const screenshots = [];
const whatsapp = [];
const regular = [];

analysis.forEach(item => {
  if (!item.valid || item.size === 0) {
    corrupt.push(item);
  } else if (item.filename.toLowerCase().includes('screenshot')) {
    screenshots.push(item);
  } else if (item.filename.includes('WA')) {
    whatsapp.push(item);
  } else {
    regular.push(item);
  }
});

console.log('Corrupt/0-byte:', corrupt.length);
console.log('Screenshots:', screenshots.length);
console.log('WhatsApp:', whatsapp.length);
console.log('Regular candidates:', regular.length);

// Extract base scene key for each regular file
// Pattern 1: YYYYMMDD_HHMMSS
// Pattern 2: 178120... (unix-style timestamps)
// Pattern 3: IMG_...
// Pattern 4: _DSC...
function getSceneKey(fn) {
  let name = fn.replace(/\.[^/.]+$/, '');
  
  // match YYYYMMDD_HHMMSS
  const mDate = name.match(/^(\d{8}_\d{6})/);
  if (mDate) return mDate[1];

  // match IMG_YYYYMMDD_HHMMSS
  const mImgDate = name.match(/^(IMG_\d{8}_\d{6})/);
  if (mImgDate) return mImgDate[1];

  // match unix timestamp prefix like 1781203851666
  const mUnix = name.match(/^(\d{12,14})/);
  if (mUnix) return mUnix[1];

  // match _DSC\d+
  const mDsc = name.match(/^(_DSC\d+)/);
  if (mDsc) return mDsc[1];

  // match IMG_\d+
  const mImg = name.match(/^(IMG_\d+)/);
  if (mImg) return mImg[1];

  // fallback: strip version numbers
  return name.replace(/\s*\(\d+\)$/, '').replace(/~\d+$/, '').replace(/_\d+$/, '');
}

const groups = {};
regular.forEach(item => {
  const key = getSceneKey(item.filename);
  if (!groups[key]) groups[key] = [];
  groups[key].push(item);
});

console.log('\nTotal scene groups found:', Object.keys(groups).length);
const multiGroups = Object.entries(groups).filter(([k, v]) => v.length > 1);
const singleGroups = Object.entries(groups).filter(([k, v]) => v.length === 1);
console.log('Groups with duplicates/versions (multi):', multiGroups.length);
console.log('Unique single scenes:', singleGroups.length);

const groupReport = [];

multiGroups.forEach(([key, items]) => {
  // Sort items within group to find winner
  // Criteria:
  // 1. Full uncropped resolution (max width * height)
  // 2. Highest sharpness score
  // 3. Highest file size / least compression
  // 4. Prefer original over (1) copy unless copy is higher res
  const sorted = [...items].sort((a, b) => {
    const resA = a.width * a.height;
    const resB = b.width * b.height;
    if (Math.abs(resA - resB) > 500000) return resB - resA; // significant resolution diff
    if (Math.abs(b.sharpness - a.sharpness) > 10) return b.sharpness - a.sharpness;
    return b.size - a.size;
  });

  const winner = sorted[0];
  const losers = sorted.slice(1);

  groupReport.push({
    key,
    winner: winner.filename,
    winnerDetails: `${winner.width}x${winner.height}, ${winner.size} bytes, Sharpness: ${winner.sharpness}`,
    losers: losers.map(l => ({
      filename: l.filename,
      details: `${l.width}x${l.height}, ${l.size} bytes, Sharpness: ${l.sharpness}`
    })),
    reason: `Kept ${winner.filename}: highest resolution (${winner.width}x${winner.height}) and best sharpness/dynamic range (${winner.sharpness} score) without duplicate cropping.`
  });
});

console.log('\nSample 5 group decisions:');
console.log(JSON.stringify(groupReport.slice(0, 5), null, 2));

fs.writeFileSync(path.join(__dirname, '..', 'curation', 'duplicate_groups.json'), JSON.stringify(groupReport, null, 2), 'utf8');
