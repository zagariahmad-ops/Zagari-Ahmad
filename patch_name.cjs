const fs = require('fs');

const replaceInFile = (file, search, replace) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
  }
}

replaceInFile('src/components/footer/Footer.tsx', "Zagari Sport Center", "Stadion Wibawa Mukti Sport Bekasi");
replaceInFile('src/components/footer/Footer.tsx', "Zagari Sport Center", "Stadion Wibawa Mukti Sport Bekasi");
replaceInFile('src/components/checkout/CheckoutModal.tsx', "Zagari Sport Center", "Stadion Wibawa Mukti Sport Bekasi");
replaceInFile('src/components/schema/DatabaseSchemaModal.tsx', "Zagari Sport Center", "Stadion Wibawa Mukti Sport Bekasi");
replaceInFile('src/schema/databaseSchema.ts', "Zagari Sport Center", "Stadion Wibawa Mukti Sport Bekasi");

replaceInFile('src/components/navbar/Navbar.tsx', `<span className="text-xl font-black tracking-tight text-slate-900">Zagari</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                SPORT CENTER
              </span>`, `<span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">Stadion Wibawa Mukti</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 leading-none whitespace-nowrap hidden sm:inline-block">
                SPORT BEKASI
              </span>`);

replaceInFile('src/components/footer/Footer.tsx', `<span className="text-xl font-black tracking-tight">Stadion Wibawa Mukti Sport Bekasi</span>`, `<span className="text-lg font-black tracking-tight">Stadion Wibawa Mukti Sport Bekasi</span>`);

