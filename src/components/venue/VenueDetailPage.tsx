import React, { useState, useMemo, useEffect } from 'react';
import { handleImageError, getFallbackImageForUrl } from '../../utils/imageUtils';
import { useApp } from '../../context/AppContext';
import {
  Venue,
  VenueField,
  FieldSlot,
  BookingItem,
} from '../../types';
import {
  generateDaySlotsForField,
} from '../../data/mockData';
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart,
  DollarSign,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';

export const VenueDetailPage: React.FC = () => {
  const {
    selectedVenue,
    setActiveView,
    startBookingCheckout,
    reviews,
  } = useApp();

  if (!selectedVenue) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="mb-3 h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-800">Venue Tidak Ditemukan</h2>
        <button
          onClick={() => setActiveView('EXPLORE')}
          className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white"
        >
          Kembali ke Daftar Venue
        </button>
      </div>
    );
  }

  // Active field selection
  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    selectedVenue.fields[0]?.id || ''
  );

  // Main Image Selection
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  useEffect(() => {
    setMainImageIndex(0);
  }, [selectedVenue.id]);

  // Selected date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Multi-slot selection state: Array of selected FieldSlot objects
  const [selectedSlots, setSelectedSlots] = useState<FieldSlot[]>([]);

  // Active field object
  const activeField = useMemo(() => {
    return (
      selectedVenue.fields.find((f) => f.id === selectedFieldId) ||
      selectedVenue.fields[0]
    );
  }, [selectedVenue, selectedFieldId]);

  // Generate slots for the day
  const daySlots = useMemo(() => {
    if (!activeField) return [];
    // We simulate some booked slots dynamically so the user sees real green vs grey booked slots
    // For example, 10:00 and 17:00 are booked on even dates
    const isEvenDay = Number(selectedDate.split('-')[2] || '1') % 2 === 0;
    const bookedHours = isEvenDay ? [10, 11, 18, 19] : [14, 15, 20];
    const maintenanceHours = selectedVenue.id === 'venue-futsal-1' ? [13] : [];

    return generateDaySlotsForField(
      activeField.id,
      selectedDate,
      activeField.priceNonPeak,
      activeField.pricePeak,
      bookedHours,
      maintenanceHours
    );
  }, [activeField, selectedDate, selectedVenue.id]);

  const handleSlotToggle = (slot: FieldSlot) => {
    if (slot.status !== 'AVAILABLE') return;

    const exists = selectedSlots.some((s) => s.id === slot.id);
    if (exists) {
      setSelectedSlots((prev) => prev.filter((s) => s.id !== slot.id));
    } else {
      setSelectedSlots((prev) => [...prev, slot]);
    }
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setSelectedSlots([]); // reset selection when date changes
  };

  const handleFieldChange = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setSelectedSlots([]); // reset selection when field changes
  };

  // Calculate total price of selected slots
  const selectedTotalPrice = useMemo(() => {
    return selectedSlots.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSlots]);

  const handleProceedToCheckout = () => {
    if (selectedSlots.length === 0 || !activeField) return;

    const items: BookingItem[] = selectedSlots.map((s) => ({
      slotId: s.id,
      fieldId: activeField.id,
      fieldName: activeField.name,
      date: s.date,
      timeStart: s.timeStart,
      timeEnd: s.timeEnd,
      price: s.price,
      isPeakHour: s.isPeakHour,
    }));

    startBookingCheckout(selectedVenue.id, activeField.sportType, items);
  };

  const venueReviews = reviews.filter((r) => r.venueId === selectedVenue.id);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Back Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => setActiveView('EXPLORE')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Hasil Pencarian</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: selectedVenue.name,
                    text: selectedVenue.description,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tautan venue disalin!');
                }
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 gap-3 overflow-hidden rounded-2xl md:grid-cols-3">
          <div className="relative h-72 w-full md:col-span-2 md:h-96 bg-slate-100">
            <img
              src={
                selectedVenue.images && selectedVenue.images.length > 0
                  ? selectedVenue.images[mainImageIndex] || selectedVenue.images[0]
                  : getFallbackImageForUrl(selectedVenue.id, selectedVenue.sportCategories?.[0])
              }
              alt={selectedVenue.name}
              className="h-full w-full object-cover object-center transition-opacity duration-300"
              onError={handleImageError}
            />
            {selectedVenue.isPromo && (
              <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
                {selectedVenue.promoBadge || 'Diskon Aktif'}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:grid-rows-2 md:h-96">
            {selectedVenue.images
              .map((img, idx) => ({ img, idx }))
              .filter((item) => item.idx !== mainImageIndex)
              .slice(0, 2)
              .map((item) => (
              <button
                key={item.idx}
                onClick={() => setMainImageIndex(item.idx)}
                className="h-36 overflow-hidden rounded-xl bg-slate-200 md:h-full w-full transition focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:opacity-90 relative group"
              >
                <img
                  src={item.img}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Left Info & Calendar, Right Quick Summary */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT: Venue Info, Field Selector, & Booking Calendar */}
          <div className="space-y-8 lg:col-span-2">
            {/* Header Title & Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {selectedVenue.sportTypes.map((st) => (
                  <span
                    key={st}
                    className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold uppercase text-emerald-800"
                  >
                    {st}
                  </span>
                ))}
                <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-300">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedVenue.rating}</span>
                  <span className="text-slate-500">({selectedVenue.reviewCount} ulasan)</span>
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                {selectedVenue.name}
              </h1>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{selectedVenue.address}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {selectedVenue.description}
              </p>

              {/* Facilities Checklist */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fasilitas &amp; Layanan Venue
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {selectedVenue.facilities.map((fac) => (
                    <div
                      key={fac}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DYNAMIC PRICING TIERS (SIANG/MALAM, UMUM/SEKOLAH, EVENT/KOMPETISI, STADION) */}
            {selectedVenue.pricingTiers && selectedVenue.pricingTiers.length > 0 && (
              <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Tarif Dinamis &amp; Kategori
                    </span>
                    <h3 className="mt-1 text-base font-black text-slate-900">
                      Daftar Harga &amp; Kategori Sewa Resmi
                    </h3>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Harga dibedakan berdasarkan waktu (Siang 08:00–17:00 / Malam 18:00–22:00) serta tipe penyewa (Umum, Sekolah, atau Event).
                </p>

                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {selectedVenue.pricingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`flex flex-col justify-between rounded-xl border p-3.5 ${
                        tier.isDefault
                          ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {tier.categoryLabel}
                        </span>
                        {tier.isDefault && (
                          <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2">
                        <div>
                          <span className="text-[10px] text-slate-400">Siang (08-17)</span>
                          <div className="font-bold text-slate-900">
                            Rp {tier.priceSiang.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">Malam / Peak</span>
                          <div className="font-bold text-emerald-700">
                            Rp {tier.priceMalam.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      {tier.description && (
                        <p className="mt-2 text-[11px] leading-snug text-slate-500">
                          {tier.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FIELD SELECTOR */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900">
                1. Pilih Lapangan / Court
              </h3>
              <p className="text-xs text-slate-500">
                Setiap lapangan memiliki jenis lantai dan tarif sewa yang berbeda
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedVenue.fields.map((f) => {
                  const isSelected = f.id === selectedFieldId;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleFieldChange(f.id)}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs font-bold uppercase text-emerald-700">
                          {f.sportType}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Terpilih
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 font-black text-slate-900">{f.name}</h4>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Lantai: {f.floorType} • {f.type}
                      </p>
                      <div className="mt-3 flex items-center justify-between w-full border-t border-slate-200/60 pt-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400">Siang (06-16)</span>
                          <div className="font-bold text-slate-900">
                            Rp {f.priceNonPeak.toLocaleString('id-ID')}/jam
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">Malam/Peak (16-23)</span>
                          <div className="font-bold text-emerald-700">
                            Rp {f.pricePeak.toLocaleString('id-ID')}/jam
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SISTEM KALENDER & JADWAL (CORE FEATURE) */}
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-white p-6 shadow-md">
              <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Calendar className="h-4 w-4" />
                    <span>Core Feature Kalender &amp; Jadwal</span>
                  </div>
                  <h3 className="mt-0.5 text-lg font-black text-slate-900">
                    2. Pilih Tanggal &amp; Slot Jam Bermain
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bisa pilih lebih dari 1 jam sekaligus (multi-slot booking)
                  </p>
                </div>

                {/* Date Picker Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Status Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-emerald-100 border border-emerald-400" />
                  <span className="text-slate-600">Tersedia (Klik pilih)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-emerald-600" />
                  <span className="text-slate-900 font-bold">Terpilih ({selectedSlots.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-slate-200" />
                  <span className="text-slate-400">Booked / Penuh</span>
                </div>
              </div>

              {/* Hourly Grid (06:00 - 23:00) */}
              <div className="mt-6">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pagi - Siang (06:00 - 16:00 WIB • Tarif Non-Peak)
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {daySlots
                    .filter((s) => !s.isPeakHour)
                    .map((slot) => {
                      const isSelected = selectedSlots.some((s) => s.id === slot.id);
                      const isBooked = slot.status === 'BOOKED';
                      const isMaintenance = slot.status === 'MAINTENANCE';

                      return (
                        <button
                          key={slot.id}
                          disabled={isBooked || isMaintenance}
                          onClick={() => handleSlotToggle(slot)}
                          className={`relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-md scale-[1.02]'
                              : isBooked
                              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                              : isMaintenance
                              ? 'border-amber-200 bg-amber-50 text-amber-700 cursor-not-allowed'
                              : 'border-emerald-200 bg-emerald-50/50 text-slate-800 hover:bg-emerald-100'
                          }`}
                        >
                          <div className="text-sm font-black">
                            {slot.timeStart} - {slot.timeEnd}
                          </div>
                          <div
                            className={`mt-0.5 text-[11px] font-bold ${
                              isSelected ? 'text-emerald-100' : 'text-emerald-700'
                            }`}
                          >
                            Rp {(slot.price / 1000).toFixed(0)}k
                          </div>
                          {isBooked && (
                            <span className="mt-0.5 text-[10px] font-semibold uppercase text-slate-400">
                              Booked
                            </span>
                          )}
                          {isMaintenance && (
                            <span className="mt-0.5 text-[10px] font-semibold uppercase text-amber-600">
                              Turnamen
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>

                <div className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Malam / Peak Hour (16:00 - 23:00 WIB • Tarif Prime)
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {daySlots
                    .filter((s) => s.isPeakHour)
                    .map((slot) => {
                      const isSelected = selectedSlots.some((s) => s.id === slot.id);
                      const isBooked = slot.status === 'BOOKED';
                      const isMaintenance = slot.status === 'MAINTENANCE';

                      return (
                        <button
                          key={slot.id}
                          disabled={isBooked || isMaintenance}
                          onClick={() => handleSlotToggle(slot)}
                          className={`relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-md scale-[1.02]'
                              : isBooked
                              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                              : isMaintenance
                              ? 'border-amber-200 bg-amber-50 text-amber-700 cursor-not-allowed'
                              : 'border-emerald-200 bg-emerald-50/50 text-slate-800 hover:bg-emerald-100'
                          }`}
                        >
                          <div className="text-sm font-black">
                            {slot.timeStart} - {slot.timeEnd}
                          </div>
                          <div
                            className={`mt-0.5 text-[11px] font-bold ${
                              isSelected ? 'text-emerald-100' : 'text-emerald-700'
                            }`}
                          >
                            Rp {(slot.price / 1000).toFixed(0)}k
                          </div>
                          {isBooked && (
                            <span className="mt-0.5 text-[10px] font-semibold uppercase text-slate-400">
                              Booked
                            </span>
                          )}
                          {isMaintenance && (
                            <span className="mt-0.5 text-[10px] font-semibold uppercase text-amber-600">
                              Turnamen
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* User Reviews Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                Ulasan &amp; Rating dari Pemain ({selectedVenue.reviewCount})
              </h3>
              <div className="mt-4 space-y-4">
                {venueReviews.length === 0 ? (
                  <p className="text-xs text-slate-400">Belum ada ulasan untuk venue ini.</p>
                ) : (
                  venueReviews.map((rev) => (
                    <div key={rev.id} className="border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={handleImageError}
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{rev.userName}</div>
                            <div className="text-[10px] text-slate-400">{rev.createdAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Order Summary Floating Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="text-base font-black text-slate-900">Ringkasan Pesanan</h3>
              <p className="text-xs text-slate-500">
                Periksa tanggal, lapangan, &amp; jam bermainmu
              </p>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Venue:</span>
                  <span className="font-bold text-slate-900">{selectedVenue.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lapangan:</span>
                  <span className="font-bold text-emerald-700">{activeField?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal:</span>
                  <span className="font-bold text-slate-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Slot Jam Dipilih:</span>
                  <span className="font-bold text-slate-900">
                    {selectedSlots.length} Jam
                  </span>
                </div>
              </div>

              {/* Selected Slots Pills */}
              {selectedSlots.length > 0 && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-3">
                  <div className="text-[11px] font-bold uppercase text-emerald-800">
                    Daftar Jam Terpilih:
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedSlots
                      .sort((a, b) => a.hour - b.hour)
                      .map((s) => (
                        <span
                          key={s.id}
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white shadow-sm"
                        >
                          {s.timeStart} - {s.timeEnd}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Price Calculation */}
              <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Subtotal Sewa ({selectedSlots.length} jam)</span>
                  <span>Rp {selectedTotalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
                  <span>Biaya Layanan Wibawa Mukti</span>
                  <span>Rp {selectedSlots.length > 0 ? '5.000' : '0'}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
                  <span>Total Bayar</span>
                  <span className="text-emerald-600">
                    Rp{' '}
                    {(selectedSlots.length > 0 ? selectedTotalPrice + 5000 : 0).toLocaleString(
                      'id-ID'
                    )}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                disabled={selectedSlots.length === 0}
                onClick={handleProceedToCheckout}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-lg transition ${
                  selectedSlots.length > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Lanjut ke Pembayaran</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Pembayaran aman dengan QRIS &amp; Virtual Account Bank</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
