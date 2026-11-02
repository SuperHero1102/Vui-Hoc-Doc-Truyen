import https from 'https';
import fs from 'fs';
import path from 'path';

const songsToDownload = [
  {
    item: '02.-the-wheels-on-the-bus',
    file: '21. Alphabet Song.mp3',
    local: 'alphabet-song.mp3',
  },
  {
    item: '02.-the-wheels-on-the-bus',
    file: '23. Twinkle Twinkle Little Star.mp3',
    local: 'twinkle-twinkle.mp3',
  },
  {
    item: '02.-the-wheels-on-the-bus',
    file: '19. Old MacDonald Had A Farm.mp3',
    local: 'old-macdonald-had-a-farm.mp3',
  },
  {
    item: '02.-the-wheels-on-the-bus',
    file: '02. The Wheels On The Bus.mp3',
    local: 'the-wheels-on-the-bus.mp3',
  },
  {
    item: '02.-the-wheels-on-the-bus',
    file: '20. Baa, Baa Black Sheep.mp3',
    local: 'baa-baa-black-sheep.mp3',
  },
  {
    item: '02.-the-wheels-on-the-bus',
    file: "17. If You're Happy And You Know It.mp3",
    local: 'if-youre-happy-and-you-know-it.mp3',
  },
  {
    item: 'thebestnurseryrhymes1',
    file: '1-07 Row Row Your Boat.mp3',
    local: 'row-row-row-your-boat.mp3',
  },
  {
    item: '17.-listen-to-the-animals',
    file: '03. Head, Shoulders, Knees and Toes.mp3',
    local: 'head-shoulders-knees-and-toes.mp3',
  },
  {
    item: '17.-listen-to-the-animals',
    file: '07. Five Little Monkeys.mp3',
    local: 'five-little-monkeys.mp3',
  },
  {
    item: '12.-shakin-down-the-sugar',
    file: '04. Baby Shark.mp3',
    local: 'baby-shark.mp3',
  },
  {
    item: '12.-shakin-down-the-sugar',
    file: '15. Bingo Was His Name-O.mp3',
    local: 'bingo-dog-song.mp3',
  },
  {
    item: '02.-the-wheels-on-the-bus',
    file: '06. Mary Had A Little Lamb.mp3',
    local: 'mary-had-a-little-lamb.mp3',
  },
  {
    item: 'thebestnurseryrhymes1',
    file: '1-06 Rain Rain Go Away.mp3',
    local: 'rain-rain-go-away.mp3',
  },
  {
    item: 'thebestnurseryrhymes1',
    file: '1-08 Hickory Dickory Dock.mp3',
    local: 'hickory-dickory-dock.mp3',
  },
  {
    item: 'ElizabethMitchellYouAreMySunshine',
    file: 'Elizabeth Mitchell - You Are My Sunshine.mp3',
    local: 'you-are-my-sunshine.mp3',
  },
  {
    item: '17.-listen-to-the-animals',
    file: '11. Pop Goes the Weasel.mp3',
    local: 'pop-goes-the-weasel.mp3',
  },
];

const outDir = path.resolve('public/assets/music');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          const stats = fs.statSync(destPath);
          console.log(`Saved: ${path.basename(destPath)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          resolve();
        });
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Starting download of ${songsToDownload.length} English nursery rhymes...`);
  for (const item of songsToDownload) {
    const dest = path.join(outDir, item.local);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 150 * 1024) {
      console.log(`Already exists and valid: ${item.local} (${(fs.statSync(dest).size / 1024 / 1024).toFixed(2)} MB)`);
      continue;
    }
    const encFile = encodeURIComponent(item.file);
    const url = `https://archive.org/download/${item.item}/${encFile}`;
    console.log(`Downloading: [${item.item}] ${item.file} -> ${item.local}...`);
    try {
      await downloadFile(url, dest);
    } catch (e) {
      console.error(`Error downloading ${item.local}:`, e.message);
    }
  }
  console.log('Finished downloading all English songs!');
}

run();
