const fs = require('fs');
let content = fs.readFileSync('src/components/navbar/Navbar.tsx', 'utf8');

content = content.replace(
  '<span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">Stadion Wibawa Mukti</span>',
  '<span className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-none sm:leading-normal">Stadion Wibawa Mukti</span>'
);

content = content.replace(
  '<span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 leading-none whitespace-nowrap hidden sm:inline-block">',
  '<span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 leading-none sm:leading-normal whitespace-nowrap">'
);

fs.writeFileSync('src/components/navbar/Navbar.tsx', content);
