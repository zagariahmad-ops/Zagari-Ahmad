const fs = require('fs');

const replaceInFile = (file, search, replace) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(file, content);
}

replaceInFile('src/components/home/CategoryGrid.tsx', "id: 'TENIS',", "id: 'SQUASH',");
replaceInFile('src/components/home/CategoryGrid.tsx', "name: 'Tenis',", "name: 'Squash',");
replaceInFile('src/components/home/HeroSection.tsx', "{ label: '🎾 Tenis', value: 'TENIS' }", "{ label: '🎾 Squash', value: 'SQUASH' }");
replaceInFile('src/components/explore/ExplorePage.tsx', "<option value=\"TENIS\">🎾 Tenis</option>", "<option value=\"SQUASH\">🎾 Squash</option>");
replaceInFile('src/components/footer/Footer.tsx', "<li>🎾 Padel &amp; Tenis Lapangan</li>", "<li>🎾 Padel &amp; Squash</li>");

