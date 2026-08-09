import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Venue,
  VenueField,
  FieldSlot,
} from '../../types';
import {
  generateDaySlotsForField,
} from '../../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  Lock,
  Unlock,
  Plus,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Star,
} from 'lucide-react';

const REVENUE_DATA = [
  { day: 'Sen', online: 1250000, offline: 450000 },
  { day: 'Sel', online: 1600000, offline: 300000 },
  { day: 'Rab', online: 1850000, offline: 600000 },
  { day: 'Kam', online: 2100000, offline: 500000 },
  { day: 'Jum', online: 3400000, offline: 900000 },
  { day: 'Sab', online: 4800000, offline: 1200000 },
  { day: 'Min', online: 4500000, offline: 1100000 },
];

export const MitraDashboard: React.FC = () => {
  const { venues, bookings, toggleFieldMaintenanceSlot } = useApp();

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'SCHEDULE_BLOCK' | 'VENUE_PROFILE'>('ANALYTICS');
  const [selectedVenueId, setSelectedVenueId] = useState<string>(
    venues[0]?.id || 'venue-futsal-1'
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [blockedHours, setBlockedHours] = useState<number[]>([13, 14]);

  const venue = venues.find((v) => v.id === selectedVenueId) || venues[0];
  const activeField = venue?.fields[0];

  const fieldSlots = activeField
    ? generateDaySlotsForField(
        activeField.id,
        selectedDate,
        activeField.priceNonPeak,
        activeField.pricePeak,
        [18, 19, 20],
        blockedHours
      )
    : [];

  const handleToggleBlockHour = (hour: number) => {
    if (blockedHours.includes(hour)) {
      setBlockedHours((prev) => prev.filter((h) => h !== hour));
    } else {
      setBlockedHours((prev) => [...prev, hour]);
    }
    if (venue && activeField) {
      toggleFieldMaintenanceSlot(venue.id, activeField.id, selectedDate, hour);
    }
  };

  const mitraBookings = bookings;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Mitra Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">
                    Wibawa Mukti Mitra Pro
                  </span>
                  <span className="text-xs text-slate-300">Partner Owner Dashboard</span>
                </div>
                <h1 className="mt-1 text-2xl font-black">{venue?.name || 'Venue Olahraga Saya'}</h1>
                <p className="text-xs text-slate-400">
                  Kelola okupansi lapangan, blokir jadwal maintenance, dan pantau pendapatan real-time
                </p>
              </div>
            </div>

            {/* Venue Selector */}
            <div className="w-full sm:w-auto">
              <label className="mb-1 block text-[10px] uppercase text-emerald-400">
                Pilih Venue Kelolaan:
              </label>
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-slate-800/90 px-4 py-2 text-xs font-bold text-white shadow-sm sm:w-64"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex border-b border-slate-200 bg-white rounded-xl px-4 shadow-sm">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 border-b-2 py-4 text-xs font-bold transition ${
              activeTab === 'ANALYTICS'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Laporan Pendapatan &amp; Pesanan Masuk</span>
          </button>
          <button
            onClick={() => setActiveTab('SCHEDULE_BLOCK')}
            className={`flex items-center gap-2 border-b-2 py-4 text-xs font-bold transition ${
              activeTab === 'SCHEDULE_BLOCK'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Blokir Jadwal / Maintenance Lapangan</span>
          </button>
          <button
            onClick={() => setActiveTab('VENUE_PROFILE')}
            className={`flex items-center gap-2 border-b-2 py-4 text-xs font-bold transition ${
              activeTab === 'VENUE_PROFILE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Manajemen Profil &amp; Fasilitas ({venue?.fields.length} Lapangan)</span>
          </button>
        </div>

        {/* TAB 1: ANALYTICS & REVENUE */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Pendapatan Minggu Ini</span>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">Rp 19.500.000</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span>+14.2% dibanding minggu lalu</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Okupansi Lapangan</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">84%</div>
                <div className="mt-1 text-[11px] text-slate-400">118 dari 140 slot jam terisi</div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Pesanan Masuk</span>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {mitraBookings.length + 42} Booking
                </div>
                <div className="mt-1 text-[11px] text-slate-400">QRIS &amp; Virtual Account</div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Rating &amp; Reputasi</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">{venue?.rating || 4.9}⭐</div>
                <div className="mt-1 text-[11px] text-slate-400">
                  {venue?.reviewCount || 142} ulasan positif
                </div>
              </div>
            </div>

            {/* Recharts Revenue Graph */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Statistik Pendapatan Booking Online vs Walk-in (7 Hari Terakhir)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Visualisasi okupansi harian dalam Rupiah
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Live Sync
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(val) => `Rp${val / 1000000}M`}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        `Rp ${Number(value).toLocaleString('id-ID')}`,
                        '',
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="online"
                      name="Booking Online Wibawa Mukti Sport"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="offline"
                      name="Walk-in / Offline"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Incoming Bookings Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                Daftar Pesanan Masuk ({mitraBookings.length})
              </h3>
              <p className="text-xs text-slate-500">
                Pesanan dari user yang sudah terverifikasi lunas
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <tr>
                      <th className="p-3 font-bold">KODE BOOKING</th>
                      <th className="p-3 font-bold">TANGGAL &amp; JAM</th>
                      <th className="p-3 font-bold">LAPANGAN</th>
                      <th className="p-3 font-bold">METODE BAYAR</th>
                      <th className="p-3 font-bold">TOTAL</th>
                      <th className="p-3 font-bold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mitraBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          Belum ada pesanan baru saat ini.
                        </td>
                      </tr>
                    ) : (
                      mitraBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-900">#{b.id}</td>
                          <td className="p-3">
                            <div>{b.items[0]?.date}</div>
                            <div className="font-bold text-slate-900">
                              {b.items.map((i) => i.timeStart).join(', ')} WIB
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-emerald-700">
                            {b.items[0]?.fieldName || 'Lapangan Utama'}
                          </td>
                          <td className="p-3 text-slate-600">{b.paymentMethod}</td>
                          <td className="p-3 font-black text-slate-900">
                            Rp {b.grandTotal.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3">
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-bold text-emerald-800">
                              Lunas (Verified)
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE & MAINTENANCE BLOCK */}
        {activeTab === 'SCHEDULE_BLOCK' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Manajemen Jadwal &amp; Blokir Slot Lapangan
                </h2>
                <p className="text-xs text-slate-500">
                  Klik pada slot jam untuk memblokir jadwal (contoh: untuk Maintenance lantai atau Turnamen Pribadi) sehingga tidak bisa di-book oleh pengguna
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-slate-300 p-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-emerald-100 border border-emerald-400" />
                <span className="text-slate-700">Tersedia untuk disewa (Available)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-amber-500" />
                <span className="text-slate-900 font-bold">
                  Diblokir / Maintenance ({blockedHours.length} Jam)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-slate-200" />
                <span className="text-slate-400">Sudah Dipesan User (Booked)</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {fieldSlots.map((slot) => {
                const isBlockedByMitra = blockedHours.includes(slot.hour);
                const isBooked = slot.status === 'BOOKED';

                return (
                  <button
                    key={slot.id}
                    disabled={isBooked}
                    onClick={() => handleToggleBlockHour(slot.hour)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      isBlockedByMitra
                        ? 'border-amber-600 bg-amber-500 text-white shadow-sm'
                        : isBooked
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'border-emerald-200 bg-emerald-50/60 text-slate-800 hover:bg-emerald-100'
                    }`}
                  >
                    <div className="text-sm font-black">
                      {slot.timeStart} - {slot.timeEnd}
                    </div>
                    {isBlockedByMitra ? (
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase">
                        <Lock className="h-3 w-3" />
                        <span>Maintenance</span>
                      </span>
                    ) : isBooked ? (
                      <span className="mt-1 text-[10px] font-semibold text-slate-400">
                        Booked
                      </span>
                    ) : (
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <Unlock className="h-3 w-3" />
                        <span>Aktif</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-200">
              <span className="font-bold">Info Mitra:</span> Perubahan status jadwal akan otomatis
              tersinkronisasi secara real-time ke aplikasi pengguna di halaman Cari Lapangan.
            </div>
          </div>
        )}

        {/* TAB 3: VENUE PROFILE & COURTS */}
        {activeTab === 'VENUE_PROFILE' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">
                Informasi Venue &amp; Fasilitas: {venue?.name}
              </h2>
              <p className="mt-1 text-xs text-slate-500">{venue?.address}</p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500">Jam Operasional</label>
                  <div className="mt-1 font-semibold text-slate-900">{venue?.openingHours}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500">
                    Daftar Fasilitas Tersedia
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {venue?.facilities.map((f) => (
                      <span
                        key={f}
                        className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fields list */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Lapangan / Court ({venue?.fields.length})
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {venue?.fields.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        {f.sportType}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{f.type}</span>
                    </div>
                    <h4 className="mt-2 text-base font-black text-slate-900">{f.name}</h4>
                    <p className="text-xs text-slate-500">Jenis Lantai: {f.floorType}</p>
                    <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400">Non-Peak</span>
                        <div className="font-bold text-slate-900">
                          Rp {f.priceNonPeak.toLocaleString('id-ID')}/jam
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Peak Hour</span>
                        <div className="font-bold text-emerald-700">
                          Rp {f.pricePeak.toLocaleString('id-ID')}/jam
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
