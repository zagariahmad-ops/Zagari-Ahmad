import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PaymentMethodType,
  Booking,
} from '../../types';
import {
  X,
  Clock,
  QrCode,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    activeBookingDraft,
    activeUser,
    completePayment,
    setActiveView,
    venues,
  } = useApp();

  // 15 Minutes countdown timer in seconds (15 * 60 = 900)
  const [secondsLeft, setSecondsLeft] = useState<number>(900);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('QRIS');
  const [copiedVA, setCopiedVA] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isCheckoutModalOpen) {
      setSecondsLeft(900);
      setCompletedBooking(null);
      setIsProcessing(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCheckoutModalOpen]);

  if (!isCheckoutModalOpen || !activeBookingDraft) return null;

  const venue = venues.find((v) => v.id === activeBookingDraft.venueId);
  const subtotal = activeBookingDraft.items.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = 5000;
  const grandTotal = subtotal + serviceFee;

  // Format MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerString = `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newBookingId = `GLR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: Booking = {
        id: newBookingId,
        userId: activeUser.id,
        venueId: activeBookingDraft.venueId,
        venueName: venue?.name || 'Venue Olahraga',
        venueAddress: venue?.address || 'Jakarta',
        venueImage: venue?.images[0] || '',
        sportCategory: activeBookingDraft.sportCategory,
        items: activeBookingDraft.items,
        totalPrice: subtotal,
        serviceFee,
        grandTotal,
        status: 'PAID_SUCCESS',
        paymentMethod: selectedMethod,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
        qrCodeToken: `QR-TOKEN-${newBookingId}`,
      };

      // Save to global context/localStorage via completePayment
      completePayment(newBookingId, selectedMethod);
      // We also push directly to bookings list in state
      setCompletedBooking(newBooking);
      setIsProcessing(false);
    }, 1200);
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText('8801234567890012');
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">Checkout &amp; Pembayaran</h3>
              <p className="text-[11px] text-slate-400">
                Secured by Midtrans / Xendit Payment Gateway
              </p>
            </div>
          </div>

          {!completedBooking && (
            <div className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300 ring-1 ring-red-500/40">
              <Clock className="h-3.5 w-3.5" />
              <span>Batas Bayar: {timerString}</span>
            </div>
          )}

          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {completedBooking ? (
            /* CELEBRATION E-TICKET VIEW */
            <div className="text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-slate-900">
                Pembayaran Berhasil!
              </h2>
              <p className="text-xs text-slate-500">
                E-Ticket kamu sudah terbit dan siap digunakan saat tiba di venue.
              </p>

              {/* E-Ticket preview box */}
              <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-5 text-left">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                  <span className="text-xs font-bold uppercase text-emerald-800">
                    KODE BOOKING
                  </span>
                  <span className="font-mono text-sm font-black text-slate-900">
                    {completedBooking.id}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900">{completedBooking.venueName}</div>
                  <div className="text-slate-600">{completedBooking.items[0]?.fieldName}</div>
                  <div className="text-slate-600">
                    📅 {completedBooking.items[0]?.date} •{' '}
                    {completedBooking.items.map((i) => i.timeStart).join(', ')} WIB
                  </div>
                  <div className="font-bold text-emerald-700">
                    Total: Rp {completedBooking.grandTotal.toLocaleString('id-ID')} ({selectedMethod})
                  </div>
                </div>

                {/* Simulated QR Code for entry */}
                <div className="mt-4 flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-slate-200 bg-slate-900 text-white font-mono text-[10px] text-center p-2">
                    {/* Simulated visual QR pattern */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            (i * 7) % 3 === 0 ? 'bg-white' : 'bg-emerald-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="mt-2 text-[10px] font-bold uppercase text-slate-500">
                    Scan saat check-in di kasir
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setActiveView('USER_DASHBOARD');
                  }}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  Lihat di Pemesanan Saya
                </button>
                <button
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT SELECTION & BOOKING SUMMARY VIEW */
            <div className="space-y-6">
              {/* Summary card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ringkasan Pesanan
                </div>
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{venue?.name}</h4>
                    <p className="text-xs font-semibold text-emerald-700">
                      {activeBookingDraft.items[0]?.fieldName}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      📅 {activeBookingDraft.items[0]?.date} •{' '}
                      <span className="font-bold">
                        {activeBookingDraft.items.map((i) => `${i.timeStart}-${i.timeEnd}`).join(', ')} WIB
                      </span>{' '}
                      ({activeBookingDraft.items.length} Jam)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Bayar</div>
                    <div className="text-lg font-black text-emerald-600">
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHODS TABS */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMethod('QRIS')}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      selectedMethod === 'QRIS'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="mb-1 h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-bold">QRIS</span>
                    <span className="text-[10px] text-slate-400">GoPay, OVO, Dana</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('VA_BCA')}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      selectedMethod.startsWith('VA_')
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="mb-1 h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-bold">Virtual Account</span>
                    <span className="text-[10px] text-slate-400">BCA, Mandiri, BRI</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('EWALLET_GOPAY')}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      selectedMethod.startsWith('EWALLET_')
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="mb-1 h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-bold">e-Wallet</span>
                    <span className="text-[10px] text-slate-400">ShopeePay, OVO</span>
                  </button>
                </div>
              </div>

              {/* PAYMENT METHOD DETAILED CONTENT */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                {selectedMethod === 'QRIS' && (
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 text-xs font-bold text-slate-800">
                      Scan QRIS Menggunakan e-Wallet atau Mobile Banking Apa Saja
                    </div>
                    {/* Simulated QR Code Graphic */}
                    <div className="my-3 flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white p-3 shadow-md">
                      <div className="grid h-full w-full grid-cols-7 gap-1">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              [0, 1, 2, 6, 7, 8, 40, 41, 42, 46, 47, 48].includes(i) ||
                              (i * 3) % 4 === 0
                                ? 'bg-slate-900'
                                : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      NMID: ID1020030040050 • Stadion Wibawa Mukti Sport Bekasi Official Merchant
                    </span>
                  </div>
                )}

                {selectedMethod.startsWith('VA_') && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-800">
                      Transfer ke Virtual Account Bank:
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(['VA_BCA', 'VA_MANDIRI', 'VA_BNI', 'VA_BRI'] as PaymentMethodType[]).map(
                        (va) => (
                          <button
                            key={va}
                            type="button"
                            onClick={() => setSelectedMethod(va)}
                            className={`rounded-lg border py-2 text-xs font-bold uppercase transition ${
                              selectedMethod === va
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {va.replace('VA_', '')}
                          </button>
                        )
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400">
                          Nomor Virtual Account
                        </div>
                        <div className="font-mono text-sm font-black text-slate-900">
                          8801 2345 6789 0012
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyVA}
                        className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        {copiedVA ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod.startsWith('EWALLET_') && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800">
                      Pilih Aplikasi e-Wallet Favoritmu:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          'EWALLET_GOPAY',
                          'EWALLET_OVO',
                          'EWALLET_DANA',
                          'EWALLET_SHOPEEPAY',
                        ] as PaymentMethodType[]
                      ).map((ew) => (
                        <button
                          key={ew}
                          type="button"
                          onClick={() => setSelectedMethod(ew)}
                          className={`rounded-xl border p-3 text-left text-xs font-bold transition ${
                            selectedMethod === ew
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {ew.replace('EWALLET_', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SIMULATE INSTANT PAYMENT BUTTON */}
              <button
                disabled={isProcessing}
                onClick={handleSimulatePaymentSuccess}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-700 hover:to-emerald-800 active:scale-98"
              >
                {isProcessing ? (
                  <span>Memverifikasi Pembayaran...</span>
                ) : (
                  <>
                    <span>Bayar Sekarang (Simulasi Sukses)</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-slate-400">
                🔒 Pembayaran akan langsung dikonfirmasi &amp; e-Ticket otomatis terbit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
