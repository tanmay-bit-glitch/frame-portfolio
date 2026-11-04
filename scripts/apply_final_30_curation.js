const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { final30Definitions } = require('./curate_final_30_photos.js');

async function run() {
  console.log('=== STARTING FINAL 30 PHOTO CURATION & PIPELINE ===');

  const reviewDir = path.resolve('curated_photos_review');
  const rootReviewDir = path.resolve('../curated_photos_review');
  const rejectsDir = path.resolve('rejects/curation_batch2');
  const webpDir = path.resolve('assets/photos');

  if (!fs.existsSync(rejectsDir)) fs.mkdirSync(rejectsDir, { recursive: true });
  if (!fs.existsSync(webpDir)) fs.mkdirSync(webpDir, { recursive: true });

  // 1. Move old review files to rejects/curation_batch2 to preserve them
  const existingReviewFiles = fs.readdirSync(reviewDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  console.log(`Archiving ${existingReviewFiles.length} existing review files into rejects/curation_batch2/...`);
  for (const rf of existingReviewFiles) {
    fs.copyFileSync(path.join(reviewDir, rf), path.join(rejectsDir, rf));
    fs.unlinkSync(path.join(reviewDir, rf));
  }
  // Clear root review dir images
  if (fs.existsSync(rootReviewDir)) {
    const rootFiles = fs.readdirSync(rootReviewDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
    for (const rf of rootFiles) {
      fs.unlinkSync(path.join(rootReviewDir, rf));
    }
  }

  // 2. Process each of the final 30 photos
  const finalPhotosData = [];
  const reviewIndex = [];

  for (const def of final30Definitions) {
    const srcPath = path.resolve(def.orig_src);
    if (!fs.existsSync(srcPath)) {
      console.error(`ERROR: Source file not found: ${srcPath}`);
      continue;
    }

    const destReviewPath = path.join(reviewDir, def.new_filename);
    const destRootReviewPath = path.join(rootReviewDir, def.new_filename);
    fs.copyFileSync(srcPath, destReviewPath);
    fs.copyFileSync(srcPath, destRootReviewPath);

    // Get metadata and dimensions
    const meta = await sharp(srcPath).metadata();
    const width = meta.width;
    const height = meta.height;
    const orientation = width >= height ? 'landscape' : 'portrait';
    const aspectRatio = parseFloat((width / height).toFixed(3));

    // Generate responsive WebP variants (640, 1280, 1920)
    const baseSlug = def.slug;
    const sizes = [640, 1280, 1920];
    const srcset = {};

    for (const size of sizes) {
      const outName = `${baseSlug}-${size}.webp`;
      const outPath = path.join(webpDir, outName);
      
      let transform = sharp(srcPath).rotate(); // auto-orient from EXIF
      if (width >= height) {
        transform = transform.resize({ width: size, withoutEnlargement: true });
      } else {
        transform = transform.resize({ width: size, withoutEnlargement: true });
      }

      await transform
        .webp({ quality: size === 1920 ? 82 : size === 1280 ? 80 : 75 })
        .toFile(outPath);

      srcset[size.toString()] = `assets/photos/${outName}`;
    }

    // Generate ultra-light base64 blur placeholder (20px width)
    const placeholderBuf = await sharp(srcPath)
      .rotate()
      .resize(20, Math.round(20 * (height / width)), { fit: 'fill' })
      .webp({ quality: 20 })
      .toBuffer();
    const placeholder = `data:image/webp;base64,${placeholderBuf.toString('base64')}`;

    // Format final photo item
    const photoItem = {
      id: def.id,
      slug: def.slug,
      title: def.title,
      category: def.category,
      orientation: orientation,
      width: width,
      height: height,
      aspectRatio: aspectRatio,
      dateTaken: def.exif.dateTaken || '2026',
      exif: {
        make: def.exif.make,
        model: def.exif.model,
        lens: def.exif.lens,
        focalLength: def.exif.focalLength,
        focalLength35mm: def.exif.focalLength35mm,
        aperture: def.exif.aperture,
        shutterSpeed: def.exif.shutterSpeed,
        iso: def.exif.iso
      },
      placeholder: placeholder,
      srcset: srcset,
      alt: def.alt,
      featured: def.featured
    };

    finalPhotosData.push(photoItem);

    reviewIndex.push({
      num: def.num,
      filename: def.new_filename,
      title: def.title,
      category: def.category,
      aspectRatio: `${width}x${height} (${aspectRatio})`,
      camera: `${def.exif.make} ${def.exif.model} • ${def.exif.focalLength} • ${def.exif.aperture}`,
      date: def.exif.dateTaken
    });

    console.log(`[${def.num}/30] Processed ${def.new_filename} (${width}x${height}, ${def.category})`);
  }

  // 3. Save data/photos.json
  fs.writeFileSync('data/photos.json', JSON.stringify(finalPhotosData, null, 2), 'utf8');
  console.log('Saved data/photos.json with 30 items.');

  // 4. Save REVIEW_INDEX.json in both review folders
  fs.writeFileSync(path.join(reviewDir, 'REVIEW_INDEX.json'), JSON.stringify(reviewIndex, null, 2), 'utf8');
  fs.writeFileSync(path.join(rootReviewDir, 'REVIEW_INDEX.json'), JSON.stringify(reviewIndex, null, 2), 'utf8');

  // 5. Generate interactive review_catalog.html
  const catalogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FRAME // Curated Portfolio Review (Final 30 Frames)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #07090e; color: #e6e8ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 24px; line-height: 1.5; }
    header { max-width: 1400px; margin: 0 auto 36px; display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 24px; }
    h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; color: #fff; }
    h1 span { color: #ff3b30; }
    .subtitle { font-size: 14px; color: #88909d; margin-top: 4px; }
    .badge-count { background: rgba(255,59,48,0.12); color: #ff3b30; border: 1px solid rgba(255,59,48,0.25); font-family: monospace; font-size: 13px; padding: 6px 14px; border-radius: 4px; }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 24px; max-width: 1400px; margin: 0 auto; }
    .card { background: #0c0f17; border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.16); }
    .img-wrap { width: 100%; aspect-ratio: 4/5; background: #040508; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; }
    .img-wrap img { width: 100%; height: 100%; object-fit: contain; }
    .card-meta { padding: 16px 18px 18px; }
    .top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .frame-num { font-family: monospace; font-size: 11px; color: #ff3b30; font-weight: 600; letter-spacing: 0.05em; }
    .category-tag { font-family: monospace; font-size: 10px; color: #a0a6b5; text-transform: uppercase; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 3px; letter-spacing: 0.06em; }
    .title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 6px; }
    .specs { font-size: 11px; color: #727a8a; font-family: monospace; margin-bottom: 4px; }
    .filename { font-size: 10px; color: #4e5564; font-family: monospace; word-break: break-all; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 8px; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>FRAME <span>//</span> CURATED PORTFOLIO REVIEW</h1>
      <p class="subtitle">Complete archive of final 30 curated frames with authentic Samsung Galaxy S23 EXIF metadata.</p>
    </div>
    <div class="badge-count">TOTAL FRAMES: 30</div>
  </header>

  <div class="grid">
    ${reviewIndex.map(item => `
      <div class="card" id="frame-${item.num}">
        <div class="img-wrap">
          <img src="${item.filename}" alt="${item.title}" loading="lazy">
        </div>
        <div class="card-meta">
          <div class="top-row">
            <span class="frame-num">FRAME ${String(item.num).padStart(2, '0')}</span>
            <span class="category-tag">${item.category}</span>
          </div>
          <h2 class="title">${item.title}</h2>
          <p class="specs">${item.camera}</p>
          <p class="specs">Dimensions: ${item.aspectRatio} • Date: ${item.date}</p>
          <p class="filename">${item.filename}</p>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reviewDir, 'review_catalog.html'), catalogHtml, 'utf8');
  fs.writeFileSync(path.join(rootReviewDir, 'review_catalog.html'), catalogHtml, 'utf8');
  console.log('Saved review_catalog.html in both review folders.');

  // 6. Update index.html
  let indexHtml = fs.readFileSync('index.html', 'utf8');

  // Count categories
  const catCounts = {
    all: finalPhotosData.length,
    machines: finalPhotosData.filter(p => p.category === 'Machines').length,
    street: finalPhotosData.filter(p => p.category === 'Street').length,
    heritage: finalPhotosData.filter(p => p.category === 'Heritage').length,
    culture: finalPhotosData.filter(p => p.category === 'Culture').length,
    people: finalPhotosData.filter(p => p.category === 'People').length,
    night: finalPhotosData.filter(p => p.category === 'Night').length,
    wildlife: finalPhotosData.filter(p => p.category === 'Wildlife').length,
    details: finalPhotosData.filter(p => p.category === 'Details').length
  };

  // Replace category filter toolbar in index.html
  const filterToolbarRegex = /<div class="category-filter" role="tablist"[\s\S]*?<\/div>/;
  const newFilterToolbar = `<div class="category-filter" role="tablist" aria-label="Photo categories">
            <button class="filter-btn is-active" type="button" role="tab" aria-selected="true" data-category="all">
              <span class="filter-label">ALL</span>
              <span class="filter-count">[${String(catCounts.all).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="Machines">
              <span class="filter-label">MACHINES</span>
              <span class="filter-count">[${String(catCounts.machines).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="Street">
              <span class="filter-label">STREET</span>
              <span class="filter-count">[${String(catCounts.street).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="Heritage">
              <span class="filter-label">HERITAGE</span>
              <span class="filter-count">[${String(catCounts.heritage).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="Culture">
              <span class="filter-label">CULTURE</span>
              <span class="filter-count">[${String(catCounts.culture).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="People">
              <span class="filter-label">PEOPLE</span>
              <span class="filter-count">[${String(catCounts.people).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="Night">
              <span class="filter-label">NIGHT</span>
              <span class="filter-count">[${String(catCounts.night).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="Wildlife">
              <span class="filter-label">WILDLIFE</span>
              <span class="filter-count">[${String(catCounts.wildlife).padStart(2, '0')}]</span>
            </button>
            <button class="filter-btn" type="button" role="tab" aria-selected="false" data-category="Details">
              <span class="filter-label">DETAILS</span>
              <span class="filter-count">[${String(catCounts.details).padStart(2, '0')}]</span>
            </button>
          </div>`;

  indexHtml = indexHtml.replace(filterToolbarRegex, newFilterToolbar);

  // Replace gallery grid cards
  const newGridCards = finalPhotosData.map((p, idx) => {
    const isEager = idx < 3;
    const frameIndexStr = String(idx + 1).padStart(2, '0');
    return `            <!-- Frame ${frameIndexStr} / ${p.category} -->
            <article class="photo-card ${p.featured ? 'is-featured' : ''}" data-category="${p.category}" data-photo-id="${p.id}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${p.title}, ${p.category}">
              <div class="photo-card-inner" style="aspect-ratio: ${p.width} / ${p.height};">
                <img class="photo-placeholder" src="${p.placeholder}" alt="" aria-hidden="true">
                <img class="photo-img" 
                     src="${p.srcset['1280']}" 
                     srcset="${p.srcset['640']} 640w, ${p.srcset['1280']} 1280w, ${p.srcset['1920']} 1920w"
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33.33vw"
                     width="${p.width}" 
                     height="${p.height}" 
                     alt="${p.alt}" 
                     loading="${isEager ? 'eager' : 'lazy'}" 
                     decoding="async">
                <div class="card-overlay" aria-hidden="true">
                  <span class="card-category">${p.category}</span>
                  <p class="card-title">${p.title}</p>
                </div>
              </div>
            </article>`;
  }).join('\n');

  const galleryGridRegex = /<div class="gallery-grid" id="galleryGrid"[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
  const newGalleryGrid = `<div class="gallery-grid" id="galleryGrid" role="region" aria-label="Photography collection">\n${newGridCards}\n          </div>\n        </div>\n      </section>`;
  indexHtml = indexHtml.replace(galleryGridRegex, newGalleryGrid);

  // Replace photosData script tag
  const photosDataRegex = /<script id="photosData" type="application\/json">[\s\S]*?<\/script>/;
  const newPhotosDataScript = `<script id="photosData" type="application/json">\n${JSON.stringify(finalPhotosData, null, 2)}\n</script>`;
  indexHtml = indexHtml.replace(photosDataRegex, newPhotosDataScript);

  fs.writeFileSync('index.html', indexHtml, 'utf8');
  console.log('Updated index.html successfully.');

  console.log('=== FINAL 30 CURATION COMPLETED SUCCESSFULLY ===');
}

run().catch(console.error);

