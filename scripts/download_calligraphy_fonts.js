const fs = require('fs');
const https = require('https');
const path = require('path');

const fonts = [
  {
    name: 'herrvonmuellerhoff.ttf',
    url: 'https://fonts.gstatic.com/s/herrvonmuellerhoff/v23/WBL6rFjRZkREW8WqmCWYLgCkQKXb4CAft3c6.ttf'
  },
  {
    name: 'mrssaintdelafield.ttf',
    url: 'https://fonts.gstatic.com/s/mrssaintdelafield/v14/v6-IGZDIOVXH9xtmTZfRagunqBw5WC62cK4.ttf'
  },
  {
    name: 'monsieurladoulaise.ttf',
    url: 'https://fonts.gstatic.com/s/monsieurladoulaise/v20/_Xmz-GY4rjmCbQfc-aPRaa4pqV340p7EZl5e.ttf'
  },
  {
    name: 'pinyonscript.ttf',
    url: 'https://fonts.gstatic.com/s/pinyonscript/v24/6xKpdSJbL9-e9LuoeQiDRQR8aOI.ttf'
  }
];

const fontDir = path.resolve(__dirname, '../assets/fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(fontDir, item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${item.name}: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded ${item.name} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of fonts) {
    try {
      await download(item);
    } catch (e) {
      console.error(e);
    }
  }
  console.log('All font downloads completed.');
}

run();

