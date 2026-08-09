import React from 'react';
import { Trophy, ShieldCheck, Heart, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 pt-12 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div
              onClick={() => {
                setActiveView('HOME');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight">Stadion Wibawa Mukti Sport Bekasi</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Marketplace &amp; platform booking lapangan olahraga terlengkap (Stadion Wibawa Mukti, Futsal, Badminton, Basket, Mini Soccer) dengan jadwal real-time.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Cabang Olahraga
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>⚽ Futsal &amp; Mini Soccer</li>
              <li>🏸 Badminton / Bulutangkis</li>
              <li>🏀 Bola Basket FIBA</li>
              <li>🎾 Padel &amp; Squash</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Layanan Wibawa Mukti Sport
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => setActiveView('EXPLORE')}
                  className="hover:text-emerald-400"
                >
                  Cari Lapangan &amp; Venue
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('USER_DASHBOARD')}
                  className="hover:text-emerald-400"
                >
                  Riwayat Pemesanan &amp; e-Ticket
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('MITRA_DASHBOARD')}
                  className="hover:text-emerald-400"
                >
                  Daftarkan Venue Olahraga (Mitra)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Keamanan Pembayaran
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Dukung transfer bank (BCA, Mandiri, BRI), QRIS instan, serta e-Wallet lokal (GoPay, OVO, Dana).
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-300">
              <span className="rounded bg-slate-800 px-2 py-1">QRIS</span>
              <span className="rounded bg-slate-800 px-2 py-1">Virtual Account</span>
              <span className="rounded bg-slate-800 px-2 py-1">GoPay</span>
              <span className="rounded bg-slate-800 px-2 py-1">OVO</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © 2026 Stadion Wibawa Mukti Sport Bekasi. Bangga berolahraga di seluruh Indonesia 🇮🇩
        </div>
      </div>
    </footer>
  );
};
