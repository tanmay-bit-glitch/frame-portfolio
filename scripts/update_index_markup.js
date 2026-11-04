const fs = require('fs');
const { final30Definitions } = require('./curate_final_30_photos.js');
const photosData = JSON.parse(fs.readFileSync('data/photos.json', 'utf8'));

let html = fs.readFileSync('index.html', 'utf8');

// Category counts
const counts = {
  all: photosData.length,
  Machines: photosData.filter(p => p.category === 'Machines').length,
  Street: photosData.filter(p => p.category === 'Street').length,
  Heritage: photosData.filter(p => p.category === 'Heritage').length,
  Culture: photosData.filter(p => p.category === 'Culture').length,
  People: photosData.filter(p => p.category === 'People').length,
  Night: photosData.filter(p => p.category === 'Night').length,
  Wildlife: photosData.filter(p => p.category === 'Wildlife').length,
  Details: photosData.filter(p => p.category === 'Details').length
};

console.log('Category Counts:', counts);

// Build new filter tabs
const newFilterTabs = `<div class="filter-tabs" role="tablist" aria-label="Filter photography archive">
            <button class="filter-tab is-active" type="button" role="tab" aria-selected="true" data-filter="all">ALL [${String(counts.all).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Machines">MACHINES [${String(counts.Machines).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Street">STREET [${String(counts.Street).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Heritage">HERITAGE [${String(counts.Heritage).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Culture">CULTURE [${String(counts.Culture).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="People">PEOPLE [${String(counts.People).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Night">NIGHT [${String(counts.Night).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Wildlife">WILDLIFE [${String(counts.Wildlife).padStart(2, '0')}]</button>
            <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Details">DETAILS [${String(counts.Details).padStart(2, '0')}]</button>
          </div>`;

// Replace filter tabs
html = html.replace(/<div class="filter-tabs"[\s\S]*?<\/div>/, newFilterTabs);

// Build new photo cards
const cards = photosData.map((p, idx) => {
  const isEager = idx < 3;
  const numStr = String(idx + 1).padStart(2, '0');
  return `            <!-- Frame ${numStr} / ${p.category} -->
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

// Replace galleryGrid content
const gridRegex = /(<div class="gallery-grid" id="galleryGrid"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/;
html = html.replace(gridRegex, `$1\n${cards}\n          $2`);

// Replace photosData
const scriptRegex = /<script id="photosData" type="application\/json">[\s\S]*?<\/script>/;
html = html.replace(scriptRegex, `<script id="photosData" type="application/json">\n${JSON.stringify(photosData, null, 2)}\n</script>`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html with all 30 cards and matching tabs.');

