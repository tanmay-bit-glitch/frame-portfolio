const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userData = '--user-data-dir=C:\\Users\\tchav\\Documents\\Workspace\\protfolio\\frame\\frame-portfolio\\curation\\chrome_user_data';

async function fetchThumbnail(shortcode, outFileName) {
  console.log(`Fetching thumbnail for ${shortcode}...`);
  const url = `https://www.instagram.com/p/${shortcode}/embed/`;
  
  // Dump DOM from embed
  const res = cp.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    userData,
    '--dump-dom',
    url
  ]);

  const html = res.stdout.toString('utf8');
  // Match EmbeddedMediaImage or cdninstagram
  const match = html.match(/class="[^"]*EmbeddedMediaImage[^"]*"[^>]*src="([^"]+)"/) ||
                html.match(/src="([^"]+cdninstagram[^"]+)"/);

  if (match) {
    const imgUrl = match[1].replace(/&amp;/g, '&');
    console.log(`Found image URL for ${shortcode}:`, imgUrl);
    // Fetch image
    const response = await fetch(imgUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    const outPath = path.join('assets/ig_covers', outFileName);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved ${outPath} (${buffer.length} bytes)`);
    return true;
  } else {
    console.log(`Could not find image in DOM for ${shortcode}. HTML length: ${html.length}`);
    fs.writeFileSync(`debug_${shortcode}.html`, html, 'utf8');
    return false;
  }
}

async function main() {
  await fetchThumbnail('Dbst6qIMOa_', 'Dbst6qIMOa_.jpg');
  await fetchThumbnail('DfBzMGPtoJJ', 'DfBzMGPtoJJ.jpg');
}

main().catch(console.error);

fetchThumbnail('DeH4FCFsSzH', 'DeH4FCFsSzH.jpg').then(() => console.log('Done DeH4FCFsSzH'));
