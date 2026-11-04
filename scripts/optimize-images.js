const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '..', 'assets', 'optimized');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// All project photos to optimize
const imagesToOptimize = [
  'assets/drive_photos/20260214_101223_1.jpg',
  'assets/drive_photos/20260306_190702.jpg',
  'assets/drive_photos/20260621_1009200_1.jpg',
  'assets/drive_photos/20260406_183233_3.jpg',
  'assets/drive_photos/1781209024838.jpg',
  'assets/drive_photos/1781371864984.jpg',
  'assets/drive_photos/20260412_214957_2.jpg',
  'assets/drive_photos/20260629_2020490_1.jpg',
  'assets/drive_photos/20260629_125939.jpg',
  'assets/drive_photos/20260717_125925_1.jpg',
  'assets/drive_photos/20260728_172218.jpg',
  'assets/drive_photos/20260805_190030_2.jpg',
  'assets/drive_photos/20260605_1354451.jpg',
  'assets/drive_photos/20260624_175504.jpg',
  'assets/drive_photos/IMG_20260829_165902633.jpg',
  'assets/drive_photos/IMG_20260513_025929_646.jpg',
  // Showreel preview frame
  'assets/drive_photos/17812038516661_2.jpg',
  // About portrait
  'assets/profile_tanmay_headphone_portrait.jpg'
];

async function run() {
  const metaReport = {};

  for (const relPath of imagesToOptimize) {
    const fullPath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    const baseName = path.basename(relPath, path.extname(relPath));
    const image = sharp(fullPath);
    const metadata = await image.metadata();
    const origWidth = metadata.width;
    const origHeight = metadata.height;
    const aspectRatio = origWidth / origHeight;

    console.log(`Processing: ${baseName} (${origWidth}x${origHeight})`);

    const widths = [640, 1280, 1920];
    const generated = {};

    for (const w of widths) {
      const targetWidth = Math.min(w, origWidth);
      const targetHeight = Math.round(targetWidth / aspectRatio);
      const outFilename = `${baseName}-${w}.webp`;
      const outFilePath = path.join(outputDir, outFilename);

      await sharp(fullPath)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 82, effort: 4 })
        .toFile(outFilePath);

      const stats = fs.statSync(outFilePath);
      console.log(`  -> ${outFilename} (${targetWidth}x${targetHeight}) ${(stats.size / 1024).toFixed(1)} KB`);
      generated[w] = {
        file: `assets/optimized/${outFilename}`,
        width: targetWidth,
        height: targetHeight,
        sizeKB: (stats.size / 1024).toFixed(1)
      };
    }

    metaReport[relPath] = {
      baseName,
      originalWidth: origWidth,
      originalHeight: origHeight,
      aspectRatio,
      variants: generated
    };
  }

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(metaReport, null, 2),
    'utf8'
  );
  console.log('\nAll images successfully optimized to WebP at 640 / 1280 / 1920 px!');
}

run().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
