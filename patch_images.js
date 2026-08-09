const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/venuesSeed.json', 'utf8'));

data[0].images = ["/images/stadion-1.jpg", "/images/stadion-2.jpg"]; // Stadion
data[1].images = ["/images/gor-basket-1.jpg", "/images/gor-basket-2.jpg"]; // Basket
data[2].images = ["/images/gor-voli-1.jpg", "/images/gor-voli-2.jpg"]; // Voli
data[3].images = ["/images/badminton-1.jpg", "/images/badminton-2.jpg"]; // Badminton
data[4].images = ["/images/menembak-1.jpg", "/images/menembak-2.jpg"]; // Menembak
data[5].images = ["/images/atletik-1.jpg", "/images/atletik-2.jpg"]; // Atletik
data[6].images = ["/images/gor-futsal-1.jpg", "/images/gor-futsal-2.jpg", "/images/gor-futsal-3.jpg", "/images/gor-futsal-4.jpg"]; // Futsal
data[7].images = ["/images/minisoccer-1.jpg", "/images/minisoccer-2.jpg"]; // Mini soccer
data[8].images = ["/images/rollersport-1.jpg", "/images/rollersport-2.jpg"]; // Roller sport
data[9].images = ["/images/renang-1.jpg", "/images/renang-2.jpg"]; // Renang
data[10].images = ["/images/tenis-1.jpg", "/images/tenis-2.jpg"]; // Tenis

fs.writeFileSync('src/data/venuesSeed.json', JSON.stringify(data, null, 2));
