const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/venuesSeed.json', 'utf8'));

const imagesDir = fs.readdirSync('public/images');
const getImages = (prefix) => {
  return imagesDir
    .filter(f => f.startsWith(prefix))
    .sort()
    .map(f => "/images/" + f);
};

data[0].images = getImages('stadion');
data[1].images = getImages('gor-basket');
data[2].images = getImages('gor-voli');
data[3].images = getImages('badminton');
data[4].images = getImages('menembak');
data[5].images = getImages('atletik');
data[6].images = getImages('gor-futsal');
data[7].images = getImages('minisoccer');
data[8].images = getImages('rollersport');
data[9].images = getImages('renang');
data[10].images = getImages('tenis');

fs.writeFileSync('src/data/venuesSeed.json', JSON.stringify(data, null, 2));
