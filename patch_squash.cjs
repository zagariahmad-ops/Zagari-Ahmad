const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/venuesSeed.json', 'utf8'));

// The last one is currently Tenis. Let's change it to Squash.
const lastIndex = data.length - 1;
const venue = data[lastIndex];

venue.id = "venue-squash-1";
venue.name = "Lapangan Squash";
venue.slug = "lapangan-squash-wibawa-mukti";
venue.sportTypes = ["SQUASH"];
venue.description = "Fasilitas lapangan squash dengan dinding dan lantai standar, cocok untuk latihan dan pertandingan.";

// Change pricing tiers
venue.pricingTiers[0].id = "squash-klub";
venue.pricingTiers[1].id = "squash-sekolah";

// Change fields
venue.fields[0].id = "field-squash-1";
venue.fields[0].venueId = "venue-squash-1";
venue.fields[0].name = "Squash Court 1";
venue.fields[0].sportType = "SQUASH";
venue.fields[0].type = "Indoor";
venue.fields[0].floorType = "Parket Kayu";

venue.fields[1].id = "field-squash-2";
venue.fields[1].venueId = "venue-squash-1";
venue.fields[1].name = "Squash Court 2";
venue.fields[1].sportType = "SQUASH";
venue.fields[1].type = "Indoor";
venue.fields[1].floorType = "Parket Kayu";

// Images (keep it empty since we don't have squash images, or let it be what it was)
venue.images = []; 

fs.writeFileSync('src/data/venuesSeed.json', JSON.stringify(data, null, 2));
