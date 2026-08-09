import {
  Venue,
  VenueFacility,
  VenueReview,
  UserProfile,
  FieldSlot,
} from '../types';
import venuesSeedData from './venuesSeed.json';

export const VENUE_FACILITIES: VenueFacility[] = [
  { id: 'parkir', name: 'Parkir Luas', iconName: 'Car' },
  { id: 'toilet', name: 'Toilet & Shower', iconName: 'Droplets' },
  { id: 'kantin', name: 'Kantin / Cafe', iconName: 'Coffee' },
  { id: 'tribun', name: 'Tribun Penonton', iconName: 'Users' },
  { id: 'loker', name: 'Loker Pakaian', iconName: 'Lock' },
  { id: 'mushola', name: 'Mushola', iconName: 'Moon' },
  { id: 'wifi', name: 'Free Wi-Fi', iconName: 'Wifi' },
];

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Ahmad Zagar',
    email: 'ahmad.zagar@gmail.com',
    phone: '0812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'USER',
  },
  {
    id: 'mitra-1',
    name: 'Budi Hartono (Mitra Owner)',
    email: 'budi.owner@gelora.id',
    phone: '0811-9988-7766',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'MITRA_OWNER',
    venueId: 'venue-futsal-1',
  },
];

export const INITIAL_VENUES: Venue[] = venuesSeedData as unknown as Venue[];

export const INITIAL_REVIEWS: VenueReview[] = [
  {
    id: 'rev-1',
    venueId: 'venue-futsal-1',
    userId: 'usr-1',
    userName: 'Dimas Pratama',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Rumputnya masih sangat bagus dan empuk, lampu terang nggak bikin silau. Parkiran juga aman.',
    createdAt: '2 hari lalu',
    sportType: 'FUTSAL',
  },
  {
    id: 'rev-2',
    venueId: 'venue-futsal-1',
    userId: 'usr-2',
    userName: 'Rendy Kurniawan',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Kamar ganti bersih banget, air shower deras dan ada kantin yang jual kopi enak abis main.',
    createdAt: '5 hari lalu',
    sportType: 'MINI_SOCCER',
  },
  {
    id: 'rev-3',
    venueId: 'venue-badminton-1',
    userId: 'usr-3',
    userName: 'Nadia Saphira',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Lantai karpet Yonex asli nggak licin sama sekali. Pencahayaannya merata pas main ganda.',
    createdAt: '1 minggu lalu',
    sportType: 'BADMINTON',
  },
  {
    id: 'rev-4',
    venueId: 'venue-basket-1',
    userId: 'usr-4',
    userName: 'Michael Tanujaya',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Ring hidrolik dan lantai maple berasa main di DBL/FIBA sungguhan! Sangat recommended untuk sparing.',
    createdAt: '3 hari lalu',
    sportType: 'BASKET',
  },
];

/**
 * Helper untuk menghasilkan jadwal slot waktu per jam dari pukul 06:00 sampai 23:00.
 * Harga akan bervariasi:
 * - 06:00 - 16:00 -> Non-Peak (lebih murah)
 * - 16:00 - 23:00 -> Peak Hour / Malam (lebih mahal)
 */
export function generateDaySlotsForField(
  fieldId: string,
  date: string,
  priceNonPeak: number,
  pricePeak: number,
  customBookedHours: number[] = [],
  customMaintenanceHours: number[] = []
): FieldSlot[] {
  const slots: FieldSlot[] = [];

  for (let hour = 6; hour < 23; hour++) {
    const isPeak = hour >= 16;
    const timeStart = `${hour.toString().padStart(2, '0')}:00`;
    const timeEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
    const price = isPeak ? pricePeak : priceNonPeak;

    let status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' = 'AVAILABLE';
    if (customMaintenanceHours.includes(hour)) {
      status = 'MAINTENANCE';
    } else if (customBookedHours.includes(hour)) {
      status = 'BOOKED';
    }

    slots.push({
      id: `${fieldId}-${date}-${hour}`,
      fieldId,
      date,
      timeStart,
      timeEnd,
      hour,
      price,
      isPeakHour: isPeak,
      status,
    });
  }

  return slots;
}
