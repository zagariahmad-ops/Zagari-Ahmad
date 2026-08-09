import React from 'react';

export const SPORT_FALLBACK_IMAGES: Record<string, string> = {
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

export function getFallbackImageForUrl(url: string): string {
  const lower = url.toLowerCase();
  for (const key of Object.keys(SPORT_FALLBACK_IMAGES)) {
    if (key !== 'default' && lower.includes(key)) {
      return SPORT_FALLBACK_IMAGES[key];
    }
  }
  return SPORT_FALLBACK_IMAGES.default;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (!target.dataset.triedFallback) {
    target.dataset.triedFallback = '1';
    target.src = getFallbackImageForUrl(target.src);
  } else if (!target.dataset.triedDefault) {
    target.dataset.triedDefault = '1';
    target.src = SPORT_FALLBACK_IMAGES.default;
  }
}
