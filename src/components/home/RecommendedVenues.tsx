import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Venue } from '../../types';
import { handleImageError, getFallbackImageForUrl } from '../../utils/imageUtils';
import {
  MapPin,
  Star,
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const RecommendedVenues: React.FC = () => {
  const { venues, setSelectedVenue, setActiveView, handleSearchSubmit } = useApp();
  const [filterType, setFilterType] = useState<'POPULAR' | 'NEARBY' | 'PROMO'>('POPULAR');

  // Sort & filter venues
  const displayVenues = [...venues]
    .filter((v) => {
      if (filterType === 'PROMO') return v.isPromo;
      return true;
    })
    .sort((a, b) => {
      if (filterType === 'POPULAR') return b.reviewCount - a.reviewCount;
      if (filterType === 'NEARBY') return a.distanceKm - b.distanceKm;
      return b.rating - a.rating;
    })
    .slice(0, 6);

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setActiveView('VENUE_DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header & Tabs */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Flame className="h-4 w-4" />
              <span>Rekomendasi Terbaik</span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              Venue &amp; Lapangan Terpopuler
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pilihan lapangan favorit dengan fasilitas lengkap, lantai berstandar profesional, dan jadwal yang selalu ter-update.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setFilterType('POPULAR')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                filterType === 'POPULAR'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔥 Terpopuler
            </button>
            <button
              onClick={() => setFilterType('NEARBY')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                filterType === 'NEARBY'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📍 Terdekat
            </button>
            <button
              onClick={() => setFilterType('PROMO')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                filterType === 'PROMO'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏷️ Promo Spesial
            </button>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayVenues.map((venue) => (
            <div
              key={venue.id}
              onClick={() => handleVenueClick(venue)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-xl"
            >
              {/* Image & Badges Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 p-4 flex flex-col justify-between">
                {venue.images && venue.images.length > 0 ? (
                  <>
                    <img
                      src={venue.images[0]}
                      alt={venue.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-800/40 via-slate-900 to-slate-950" />
                )}

                {/* Top badges */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 w-full">
                  <div className="flex flex-wrap gap-1.5">
                    {venue.isPopular && (
                      <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/10">
                        🔥 Terpopuler
                      </span>
                    )}
                    {venue.isPromo && (
                      <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                        {venue.promoBadge || 'Diskon Aktif'}
                      </span>
                    )}
                  </div>
                  {/* Distance pill */}
                  <div className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 backdrop-blur-md">
                    📍 {venue.distanceKm} km
                  </div>
                </div>

                {/* Sport Type pills at bottom of banner if image exists */}
                {venue.images && venue.images.length > 0 && (
                  <div className="relative z-10 flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {venue.sportTypes.map((st) => (
                        <span
                          key={st}
                          className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-md"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-xs font-bold text-amber-400 backdrop-blur-md">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{venue.rating}</span>
                      <span className="text-[10px] text-slate-300">({venue.reviewCount})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 transition group-hover:text-emerald-700">
                    {venue.name}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="line-clamp-1">{venue.address}</span>
                  </div>

                  {/* Facility tags preview */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {venue.facilities.slice(0, 4).map((fac) => (
                      <span
                        key={fac}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {fac}
                      </span>
                    ))}
                    {venue.facilities.length > 4 && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                        +{venue.facilities.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and CTA bottom bar */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Mulai Dari
                    </span>
                    <div className="text-base font-black text-slate-900">
                      Rp {venue.minPrice.toLocaleString('id-ID')}{' '}
                      <span className="text-xs font-normal text-slate-500">/ jam</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVenueClick(venue);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition group-hover:bg-emerald-700 active:scale-95"
                  >
                    <span>Cek Jadwal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See all button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => handleSearchSubmit('ALL')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>Lihat Seluruh Venue &amp; Lapangan ({venues.length})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
