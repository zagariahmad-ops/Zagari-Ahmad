import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Search,
  Calendar,
  Building2,
  Database,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { DEFAULT_USERS } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeUser,
    setActiveUser,
    setIsSchemaModalOpen,
    bookings,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const activeBookingsCount = bookings.filter(
    (b) => b.userId === activeUser.id && (b.status === 'PENDING_PAYMENT' || b.status === 'PAID_SUCCESS')
  ).length;

  const handleNavClick = (view: 'HOME' | 'EXPLORE' | 'USER_DASHBOARD' | 'MITRA_DASHBOARD') => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('HOME')}
          className="flex cursor-pointer items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-none sm:leading-normal">Stadion Wibawa Mukti</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 leading-none sm:leading-normal whitespace-nowrap">
                SPORT BEKASI
              </span>
            </div>
            <p className="hidden text-[10px] font-medium text-slate-500 sm:block">
              Booking Venue &amp; Lapangan Olahraga #1
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => handleNavClick('HOME')}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              activeView === 'HOME'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => handleNavClick('EXPLORE')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              activeView === 'EXPLORE' || activeView === 'VENUE_DETAIL'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="h-4 w-4 text-emerald-600" />
            <span>Cari Lapangan</span>
          </button>

          <button
            onClick={() => handleNavClick('USER_DASHBOARD')}
            className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              activeView === 'USER_DASHBOARD'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>Pemesanan Saya</span>
            {activeBookingsCount > 0 && (
              <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                {activeBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('MITRA_DASHBOARD')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              activeView === 'MITRA_DASHBOARD'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span>Wibawa Mukti Mitra (Owner)</span>
          </button>
        </nav>

        {/* Right side buttons: Schema Viewer & User Profile Switcher */}
        <div className="hidden items-center gap-2.5 sm:flex">
          {/* Schema Viewer button */}
          <button
            onClick={() => setIsSchemaModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100 hover:shadow"
            title="Lihat Struktur Database (Schema PRISMA & SQL)"
          >
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>Schema &amp; ERD</span>
          </button>

          {/* User Account Dropdown / Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {activeUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] font-semibold text-emerald-600">
                  {activeUser.role === 'MITRA_OWNER' ? 'Mitra Owner' : 'Penyewa'}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ganti Akun Demo (Simulasi Login)
                </div>
                {DEFAULT_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setActiveUser(user);
                      setIsUserDropdownOpen(false);
                      if (user.role === 'MITRA_OWNER') {
                        setActiveView('MITRA_DASHBOARD');
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                      activeUser.id === user.id
                        ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-xs font-bold">{user.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {user.role === 'MITRA_OWNER' ? 'Kelola Lapangan & Pendapatan' : 'Penyewa / Atlet'}
                      </div>
                    </div>
                    {activeUser.id === user.id && (
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsSchemaModalOpen(true)}
            className="rounded-lg bg-emerald-50 p-2 text-emerald-700"
            title="Lihat Schema Database"
          >
            <Database className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('HOME')}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                activeView === 'HOME' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('EXPLORE')}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                activeView === 'EXPLORE' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              Cari Lapangan &amp; Venue
            </button>
            <button
              onClick={() => handleNavClick('USER_DASHBOARD')}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                activeView === 'USER_DASHBOARD' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              Pemesanan Saya ({activeBookingsCount})
            </button>
            <button
              onClick={() => handleNavClick('MITRA_DASHBOARD')}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                activeView === 'MITRA_DASHBOARD' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              Wibawa Mukti Mitra (Owner Portal)
            </button>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3">
            <div className="mb-2 text-xs font-semibold text-slate-400">GANTI AKUN DEMO:</div>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setActiveUser(user);
                    setIsMobileMenuOpen(false);
                    if (user.role === 'MITRA_OWNER') {
                      setActiveView('MITRA_DASHBOARD');
                    }
                  }}
                  className={`flex items-center gap-2 rounded-lg p-2 text-left text-xs ${
                    activeUser.id === user.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <img src={user.avatar} className="h-6 w-6 rounded-full object-cover" alt="" />
                  <span className="truncate">{user.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
