import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SportCategory,
  CityLocation,
} from '../../types';
import {
  Search,
  MapPin,
  Calendar,
  Trophy,
  Zap,
} from 'lucide-react';

const SPORTS_OPTIONS: { label: string; value: SportCategory }[] = [
  { label: 'Semua Olahraga', value: 'ALL' },
  { label: '⚽ Futsal', value: 'FUTSAL' },
  { label: '🏸 Badminton', value: 'BADMINTON' },
  { label: '🏀 Basket', value: 'BASKET' },
  { label: '🥅 Mini Soccer', value: 'MINI_SOCCER' },
  { label: '🎾 Padel', value: 'PADEL' },
  { label: '🎾 Squash', value: 'SQUASH' },
];

const CITIES_OPTIONS: { label: string; value: CityLocation }[] = [
  { label: 'Semua Kota / Area', value: 'ALL' },
  { label: 'Jakarta Selatan', value: 'Jakarta Selatan' },
  { label: 'Jakarta Pusat', value: 'Jakarta Pusat' },
  { label: 'Jakarta Barat', value: 'Jakarta Barat' },
  { label: 'Bandung', value: 'Bandung' },
  { label: 'Surabaya', value: 'Surabaya' },
  { label: 'Tangerang', value: 'Tangerang' },
  { label: 'Depok', value: 'Depok' },
];

export const HeroSection: React.FC = () => {
  const { handleSearchSubmit, searchFilters } = useApp();

  const [selectedSport, setSelectedSport] = useState<SportCategory>(searchFilters.sport);
  const [selectedCity, setSelectedCity] = useState<CityLocation>(searchFilters.city);
  const [selectedDate, setSelectedDate] = useState<string>(
    searchFilters.date || new Date().toISOString().split('T')[0]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(selectedSport, selectedCity, selectedDate);
  };

  return (
    <section className="col-span-12 lg:col-span-8 row-span-2 relative flex flex-col justify-center overflow-hidden rounded-3xl bg-blue-700 p-6 shadow-xl sm:p-8">
      {/* Decorative circle from Bento Grid theme */}
      <div className="pointer-events-none absolute -right-4 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-400 opacity-20" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-blue-500 opacity-15" />

      <div className="relative z-10">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-600/60 px-3 py-1 text-[11px] font-bold tracking-wider text-blue-100 backdrop-blur">
          <Zap className="h-3.5 w-3.5 text-lime-300" />
          <span>Bento Grid • Booking Real-Time</span>
        </div>

        <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Cari Lapangan Terdekat,
          <br />
          Mainkan Game Terbaikmu.
        </h1>

        {/* Bento White Floating Search Form */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-2 rounded-2xl border-2 border-blue-400 bg-white p-2 shadow-lg sm:flex-row sm:items-center"
        >
          {/* Olahraga selector */}
          <div className="flex flex-1 flex-col px-3 py-1 sm:border-r sm:border-slate-100">
            <label className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Olahraga
            </label>
            <div className="flex items-center">
              <Trophy className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value as SportCategory)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              >
                {SPORTS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-slate-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lokasi selector */}
          <div className="flex flex-1 flex-col px-3 py-1 sm:border-r sm:border-slate-100">
            <label className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Lokasi
            </label>
            <div className="flex items-center">
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as CityLocation)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              >
                {CITIES_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-slate-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal selector */}
          <div className="flex flex-1 flex-col px-3 py-1">
            <label className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Tanggal
            </label>
            <div className="flex items-center">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Cari Submit button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-800 active:scale-95"
          >
            <Search className="h-4 w-4" />
            <span>Cari</span>
          </button>
        </form>

        {/* Quick Filter Tags below search bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-blue-100">
          <span className="font-bold text-blue-200">Pencarian Cepat:</span>
          <button
            onClick={() => handleSearchSubmit('FUTSAL', 'Jakarta Selatan')}
            className="rounded-full bg-blue-600/50 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-800"
          >
            ⚽ Futsal Jakarta Selatan
          </button>
          <button
            onClick={() => handleNavClickToCategory('BADMINTON', handleSearchSubmit)}
            className="rounded-full bg-blue-600/50 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-800"
          >
            🏸 Badminton Senayan
          </button>
          <button
            onClick={() => handleNavClickToCategory('MINI_SOCCER', handleSearchSubmit)}
            className="rounded-full bg-blue-600/50 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-800"
          >
            🥅 Mini Soccer Kemang
          </button>
          <button
            onClick={() => handleNavClickToCategory('PADEL', handleSearchSubmit)}
            className="rounded-full bg-blue-600/50 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-800"
          >
            🎾 Padel Menteng
          </button>
        </div>
      </div>
    </section>
  );
};

function handleNavClickToCategory(
  sport: SportCategory,
  handleSearchSubmit: (sport?: SportCategory) => void
) {
  handleSearchSubmit(sport);
}

