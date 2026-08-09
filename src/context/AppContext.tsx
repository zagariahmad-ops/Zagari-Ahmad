import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Venue,
  Booking,
  UserProfile,
  VenueReview,
  SearchFilters,
  SportCategory,
  CityLocation,
  TimeOfDayFilter,
  BookingItem,
  PaymentMethodType,
} from '../types';
import {
  INITIAL_VENUES,
  INITIAL_REVIEWS,
  DEFAULT_USERS,
} from '../data/mockData';

interface AppContextType {
  venues: Venue[];
  activeUser: UserProfile;
  bookings: Booking[];
  reviews: VenueReview[];
  searchFilters: SearchFilters;
  selectedVenue: Venue | null;
  activeView: 'HOME' | 'EXPLORE' | 'VENUE_DETAIL' | 'USER_DASHBOARD' | 'MITRA_DASHBOARD';
  isSchemaModalOpen: boolean;
  isCheckoutModalOpen: boolean;
  activeBookingDraft: {
    venueId: string;
    sportCategory: SportCategory;
    items: BookingItem[];
  } | null;

  // Actions
  setActiveUser: (user: UserProfile) => void;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  setSelectedVenue: (venue: Venue | null) => void;
  setActiveView: (view: 'HOME' | 'EXPLORE' | 'VENUE_DETAIL' | 'USER_DASHBOARD' | 'MITRA_DASHBOARD') => void;
  setIsSchemaModalOpen: (open: boolean) => void;
  setIsCheckoutModalOpen: (open: boolean) => void;
  
  // Search actions
  handleSearchSubmit: (sport?: SportCategory, city?: CityLocation, date?: string) => void;
  
  // Booking lifecycle
  startBookingCheckout: (venueId: string, sportCategory: SportCategory, items: BookingItem[]) => void;
  completePayment: (bookingId: string, method: PaymentMethodType) => void;
  cancelBooking: (bookingId: string) => void;
  addReview: (venueId: string, rating: number, comment: string, sportType: string) => void;
  
  // Mitra actions
  toggleFieldMaintenanceSlot: (venueId: string, fieldId: string, date: string, hour: number) => void;
  addNewVenue: (venue: Venue) => void;
}

const defaultSearchFilters: SearchFilters = {
  sport: 'ALL',
  city: 'ALL',
  date: new Date().toISOString().split('T')[0],
  maxPrice: 800000,
  maxDistanceKm: 20,
  facilities: [],
  timeOfDay: 'ALL',
  sortBy: 'POPULARITY',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BOOKINGS: 'gelora_bookings_v3',
  REVIEWS: 'gelora_reviews_v3',
  VENUES: 'gelora_venues_all_images_v400',
  MAINTENANCE_SLOTS: 'gelora_maintenance_v3',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [venues, setVenues] = useState<Venue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VENUES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_VENUES.length) {
          return parsed.map((pv: Venue) => {
            const seed = INITIAL_VENUES.find((iv) => iv.id === pv.id);
            if (seed) {
              return {
                ...pv,
                name: seed.name,
                images: seed.images,
                address: seed.address,
                description: seed.description,
                mapsUrl: seed.mapsUrl,
              };
            }
            return pv;
          });
        }
      }
      return INITIAL_VENUES;
    } catch {
      return INITIAL_VENUES;
    }
  });

  const [activeUser, setActiveUser] = useState<UserProfile>(DEFAULT_USERS[0]);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<VenueReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [selectedVenueState, setSelectedVenueState] = useState<Venue | null>(null);
  const selectedVenue = selectedVenueState;
  const setSelectedVenue = (venue: Venue | null) => {
    if (venue) {
      const fresh = venues.find((v) => v.id === venue.id) || venue;
      setSelectedVenueState(fresh);
    } else {
      setSelectedVenueState(null);
    }
  };
  const [activeView, setActiveView] = useState<'HOME' | 'EXPLORE' | 'VENUE_DETAIL' | 'USER_DASHBOARD' | 'MITRA_DASHBOARD'>('HOME');
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [activeBookingDraft, setActiveBookingDraft] = useState<{
    venueId: string;
    sportCategory: SportCategory;
    items: BookingItem[];
  } | null>(null);

  // Clean up legacy localStorage venue keys to prevent stale images
  useEffect(() => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gelora_venues_') && key !== STORAGE_KEYS.VENUES) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VENUES, JSON.stringify(venues));
    } catch (e) {
      console.error('Failed to save venues:', e);
    }
  }, [venues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings:', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews:', e);
    }
  }, [reviews]);

  const handleSearchSubmit = (sport?: SportCategory, city?: CityLocation, date?: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      sport: sport ?? prev.sport,
      city: city ?? prev.city,
      date: date ?? prev.date,
    }));
    setActiveView('EXPLORE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBookingCheckout = (venueId: string, sportCategory: SportCategory, items: BookingItem[]) => {
    setActiveBookingDraft({ venueId, sportCategory, items });
    setIsCheckoutModalOpen(true);
  };

  const completePayment = (bookingId: string, method: PaymentMethodType) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'PAID_SUCCESS',
              paymentMethod: method,
            }
          : b
      )
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'CANCELLED',
            }
          : b
      )
    );
  };

  const addReview = (venueId: string, rating: number, comment: string, sportType: string) => {
    const newReview: VenueReview = {
      id: `rev-${Date.now()}`,
      venueId,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      rating,
      comment,
      createdAt: 'Baru saja',
      sportType,
    };
    setReviews((prev) => [newReview, ...prev]);

    // Mark user booking as reviewed
    setBookings((prev) =>
      prev.map((b) =>
        b.venueId === venueId && b.userId === activeUser.id && b.status === 'COMPLETED'
          ? { ...b, hasReviewed: true }
          : b
      )
    );
  };

  const toggleFieldMaintenanceSlot = (venueId: string, _fieldId: string, _date: string, _hour: number) => {
    // We can simulate maintenance toggle
    setVenues((prev) =>
      prev.map((v) =>
        v.id === venueId
          ? {
              ...v,
              updatedAt: new Date().toISOString(),
            }
          : v
      )
    );
  };

  const addNewVenue = (newVenue: Venue) => {
    setVenues((prev) => [newVenue, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        venues,
        activeUser,
        bookings,
        reviews,
        searchFilters,
        selectedVenue,
        activeView,
        isSchemaModalOpen,
        isCheckoutModalOpen,
        activeBookingDraft,
        setActiveUser,
        setSearchFilters,
        setSelectedVenue,
        setActiveView,
        setIsSchemaModalOpen,
        setIsCheckoutModalOpen,
        handleSearchSubmit,
        startBookingCheckout,
        completePayment,
        cancelBooking,
        addReview,
        toggleFieldMaintenanceSlot,
        addNewVenue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
