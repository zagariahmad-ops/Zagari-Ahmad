export type SportCategory = 
  | 'ALL'
  | 'FUTSAL'
  | 'BADMINTON'
  | 'BASKET'
  | 'MINI_SOCCER'
  | 'PADEL'
  | 'TENIS'
  | 'SQUASH'
  | 'SEPAK_BOLA'
  | 'VOLI'
  | 'MENEMBAK'
  | 'ATLETIK'
  | 'ROLLER_SPORT'
  | 'RENANG';

export type CityLocation =
  | 'ALL'
  | 'Jakarta Selatan'
  | 'Jakarta Pusat'
  | 'Jakarta Barat'
  | 'Bandung'
  | 'Surabaya'
  | 'Tangerang'
  | 'Depok'
  | 'Bekasi'
  | 'Cikarang';

export type TenantCategory = 
  | 'UMUM_KLUB'          // Umum / Klub
  | 'SEKOLAH_PT'         // Sekolah / Institusi / PT
  | 'EVENT_KOMPETISI'    // Event / Pertandingan / Kompetisi
  | 'INDIVIDU'           // Individu / Perorangan
  | 'STADION_SOSIAL'     // Stadion - Sosial
  | 'STADION_LOKAL'      // Stadion - Lokal
  | 'STADION_AMATIR'     // Stadion - Amatir
  | 'STADION_PROFESIONAL';// Stadion - Profesional

export interface PricingTier {
  id: string;
  categoryLabel: string; // e.g. "Umum / Klub", "Sekolah / PT", "Event / Kompetisi", "Profesional (Tanpa Penonton)", dll
  categoryType: TenantCategory;
  priceSiang: number;    // Siang (08:00 - 17:00) atau tarif flat per sesi
  priceMalam: number;    // Malam (18:00 - 20:00+) atau tarif malam
  unit: 'PER_JAM' | 'PER_HARI' | 'PER_PERTANDINGAN' | 'PER_ORANG_JAM' | 'PER_LAPANGAN_JAM';
  description?: string;  // Info misal "+15% Hari Libur" atau "Dengan Penonton"
  isDefault?: boolean;
}

export type TimeOfDayFilter = 'ALL' | 'PAGI' | 'SIANG' | 'MALAM';

export interface VenueFacility {
  id: string;
  name: string;
  iconName: string;
}

export interface FieldSlot {
  id: string; // e.g. "field1-2026-08-03-08:00"
  fieldId: string;
  date: string; // YYYY-MM-DD
  timeStart: string; // "08:00"
  timeEnd: string; // "09:00"
  hour: number; // 8
  price: number;
  isPeakHour: boolean;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
  bookedByUserId?: string;
  bookingId?: string;
}

export interface VenueField {
  id: string;
  venueId: string;
  name: string; // e.g. "Lapangan 1 - Sintetis" or "Court A - Vinyl"
  sportType: SportCategory;
  type: string; // "Indoor" | "Outdoor" | "Semi-Indoor"
  floorType: string; // "Rumput Sintetis" | "Vinyl" | "Kayu Jati" | "Interlock"
  priceNonPeak: number; // e.g. 150000 (Siang 08:00-17:00)
  pricePeak: number; // e.g. 225000 (Malam 18:00-20:00+)
  pricingTiers?: PricingTier[];
}

export interface VenueReview {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
  sportType: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  sportTypes: SportCategory[];
  city: CityLocation;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  description: string;
  openingHours: string; // e.g. "08:00 - 20:00 WIB"
  images: string[];
  rating: number;
  reviewCount: number;
  facilities: string[]; // ['Parkir', 'Toilet', 'Kantin', 'Shower', 'Tribun', 'Loker', 'Mushola']
  fields: VenueField[];
  minPrice: number;
  maxPrice: number;
  isPromo?: boolean;
  promoBadge?: string;
  isPopular?: boolean;
  ownerId: string;
  mapsUrl?: string;
  pricingTiers?: PricingTier[];
}

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'PAID_SUCCESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethodType =
  | 'QRIS'
  | 'VA_BCA'
  | 'VA_MANDIRI'
  | 'VA_BNI'
  | 'VA_BRI'
  | 'EWALLET_GOPAY'
  | 'EWALLET_OVO'
  | 'EWALLET_DANA'
  | 'EWALLET_SHOPEEPAY';

export interface BookingItem {
  slotId: string;
  fieldId: string;
  fieldName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  price: number;
  isPeakHour: boolean;
}

export interface Booking {
  id: string; // e.g. "GLR-89234"
  userId: string;
  venueId: string;
  venueName: string;
  venueAddress: string;
  venueImage: string;
  sportCategory: SportCategory;
  items: BookingItem[];
  totalPrice: number;
  serviceFee: number;
  grandTotal: number;
  status: BookingStatus;
  paymentMethod: PaymentMethodType;
  createdAt: string;
  expiresAt: string; // 15 mins after creation if PENDING
  qrCodeToken: string;
  hasReviewed?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'USER' | 'MITRA_OWNER';
  venueId?: string; // If MITRA_OWNER
}

export interface SearchFilters {
  sport: SportCategory;
  city: CityLocation;
  date: string; // YYYY-MM-DD
  maxPrice: number;
  maxDistanceKm: number;
  facilities: string[];
  timeOfDay: TimeOfDayFilter;
  sortBy: 'POPULARITY' | 'PRICE_ASC' | 'PRICE_DESC' | 'DISTANCE_ASC' | 'RATING_DESC';
}
