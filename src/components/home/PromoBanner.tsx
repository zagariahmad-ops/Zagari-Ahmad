import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Gift, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const { handleSearchSubmit } = useApp();

  return (
    <section className="bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Promo Card 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white shadow-lg">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-xl" />
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
              <Gift className="h-4 w-4" />
              <span>Promo Spesial Siang</span>
            </div>
            <h3 className="mt-2 text-xl font-black">Diskon 20% Booking Siang (09:00 - 15:00)</h3>
            <p className="mt-1 text-xs text-emerald-100">
              Main futsal atau badminton sebelum jam pulang kantor dengan harga hemat!
            </p>
            <button
              onClick={() => handleSearchSubmit('FUTSAL')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-50"
            >
              <span>Gunakan Promo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Promo Card 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-lg">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/15 blur-xl" />
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Clock className="h-4 w-4" />
              <span>Jadwal Real-Time</span>
            </div>
            <h3 className="mt-2 text-xl font-black">Cashback QRIS Rp 15.000 / Booking</h3>
            <p className="mt-1 text-xs text-slate-300">
              Bayar langsung menggunakan scan QRIS (GoPay, OVO, Dana, BCA) konfirmasi instan detik itu juga.
            </p>
            <button
              onClick={() => handleSearchSubmit('BADMINTON')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-600"
            >
              <span>Cari Badminton</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Promo Card 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-slate-900 p-6 text-white shadow-lg">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-500/20 blur-xl" />
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Wibawa Mukti Mitra Owner</span>
            </div>
            <h3 className="mt-2 text-xl font-black">Kelola Venue &amp; Lapangan Anda</h3>
            <p className="mt-1 text-xs text-blue-100">
              Punya lapangan olahraga? Bergabung dengan Wibawa Mukti Mitra untuk kelola kalender &amp; tingkatkan okupansi.
            </p>
            <button
              onClick={() => handleSearchSubmit('MINI_SOCCER')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-white/20"
            >
              <span>Cek Mini Soccer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
