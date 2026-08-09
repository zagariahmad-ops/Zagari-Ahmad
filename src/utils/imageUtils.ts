import React from 'react';

export const SPORT_LOCAL_IMAGES: Record<string, string> = {
  stadion: '/images/stadion-1.jpg',
  basket: '/images/gor-basket-1.png',
  voli: '/images/gor-voli-1.jpeg',
  badminton: '/images/badminton-1.jpeg',
  shooter: '/images/shooter-1.jpg',
  atletik: '/images/atletik-1.jpeg',
  futsal: '/images/gor-futsal-1.jpg',
  minisoccer: '/images/minisoccer-1.jpeg',
  rollersport: '/images/rollersport-1.jpeg',
  renang: '/images/renang-1.jpeg',
  squash: '/images/squash-1.jpeg',
  skatepark: '/images/skatepark-1.jpeg',
  default: '/images/stadion-1.jpg',
};

export const SPORT_UNSPLASH_MAP: Record<string, string> = {
  futsal: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  basket: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  minisoccer: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  voli: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
  renang: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
  atletik: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  skatepark: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&w=800&q=80',
  squash: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
  padel: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
  shooter: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=800&q=80',
  rollersport: 'https://images.unsplash.com/photo-1517649763962-0c6232662000?auto=format&fit=crop&w=800&q=80',
  stadion: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
};

export const SPORT_FALLBACK_IMAGES = SPORT_LOCAL_IMAGES;

export function getFallbackImageForUrl(url: string = '', sportHint?: string): string {
  const lower = (url + ' ' + (sportHint || '')).toLowerCase();
  for (const key of Object.keys(SPORT_UNSPLASH_MAP)) {
    if (key !== 'default' && lower.includes(key)) {
      return SPORT_UNSPLASH_MAP[key];
    }
  }
  return SPORT_UNSPLASH_MAP.default;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (!target.dataset.triedUnsplash) {
    target.dataset.triedUnsplash = '1';
    target.src = getFallbackImageForUrl(target.src);
    return;
  }
  if (!target.dataset.triedDefault) {
    target.dataset.triedDefault = '1';
    target.src = SPORT_UNSPLASH_MAP.default;
  }
}

