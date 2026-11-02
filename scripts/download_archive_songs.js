import https from 'https';
import fs from 'fs';
import path from 'path';

const songsToDownload = [
  { remote: 'Chau Di Mau Giao.mp3', local: 'chau-len-ba.mp3' },
  { remote: 'Rua Mat Nhu Meo.mp3', local: 'rua-mat-nhu-meo.mp3' },
  { remote: 'Ca Nha Thuong Nhau.mp3', local: 'ca-nha-thuong-nhau.mp3' },
  { remote: 'Ca Vang Boi.mp3', local: 'ca-vang-boi.mp3' },
  { remote: 'Kìa Con Bướm Vàng.mp3', local: 'kia-con-buom-vang.mp3' },
  { remote: '3 Ngọn Nến Lung Linh.mp3', local: 'ba-ngon-nen-lung-linh.mp3' },
  { remote: 'Bo La Tat Ca.mp3', local: 'bo-la-tat-ca.mp3' },
  { remote: 'Cô Và Mẹ.mp3', local: 'co-va-me.mp3' },
  { remote: 'Con Heo Dat.mp3', local: 'con-heo-dat.mp3' },
  { remote: 'Dan Ga Trong San.mp3', local: 'dan-ga-con.mp3' },
  { remote: 'Chu Voi Con O Ban Don.mp3', local: 'chu-voi-con.mp3' },
  { remote: 'Em Đi Mẫu Giáo.mp3', local: 'em-di-mau-giao.mp3' },
  { remote: 'Tam Biet Bup Be Than Yeu.mp3', local: 'tam-biet-bup-be.mp3' },
  { remote: 'Tap The Duc Buoi Sang.mp3', local: 'tap-the-duc-buoi-sang.mp3' },
  { remote: 'Trái Đất Này Là Của Chúng Mình.mp3', local: 'trai-dat-nay-la-cua-chung-minh.mp3' },
  { remote: 'Hong Dam Dau.mp3', local: 'hong-dam-dau.mp3' },
  { remote: 'Con Có Bé Bé.mp3', local: 'con-co-be-be.mp3' },
  { remote: 'Trường Của Chúng Cháu Là Trường Mầm Non.mp3', local: 'truong-chung-chau-la-truong-mam-non.mp3' },
  { remote: 'Chi Ong Nau Va Em Be.mp3', local: 'chi-ong-nau.mp3' },
  { remote: 'Five Little Ducks.mp3', local: 'five-little-ducks.mp3' },
  { remote: 'Happy Birthday.mp3', local: 'happy-birthday.mp3' },
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
  for (const item of songsToDownload) {
    const dest = path.join(outDir, item.local);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 200 * 1024) {
      console.log(`Already valid: ${item.local} (${(fs.statSync(dest).size / 1024 / 1024).toFixed(2)} MB)`);
      continue;
    }
    const enc = encodeURIComponent(item.remote);
    // Direct server host
    const url = `https://ia600607.us.archive.org/1/items/rua-mat-nhu-meo/${enc}`;
    console.log(`Downloading direct: ${item.remote} -> ${item.local}...`);
    try {
      await downloadFile(url, dest);
    } catch (e) {
      console.error(`Error downloading ${item.remote}:`, e.message);
    }
  }
  console.log('All direct downloads finished!');
}

run();
