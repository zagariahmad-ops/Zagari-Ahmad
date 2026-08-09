import React from 'react';

export const SPORT_FALLBACK_IMAGES: Record<string, string> = {
  SEPAK_BOLA: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  BASKET: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  VOLI: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
  BADMINTON: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
  MENEMBAK: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=1200&q=80',
  ATLETIK: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  FUTSAL: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  MINI_SOCCER: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
  ROLLER_SPORT: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&w=1200&q=80',
  RENANG: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
  SQUASH: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
  SKATEPARK: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=1200&q=80',
  PADEL: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
  TENIS: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
};

export function getFallbackImageForUrl(urlOrName: string = '', sportHint?: string): string {
  const text = (urlOrName + ' ' + (sportHint || '')).toLowerCase();

  if (text.includes('stadion') || text.includes('sepak') || text.includes('bola')) return SPORT_FALLBACK_IMAGES.SEPAK_BOLA;
  if (text.includes('basket')) return SPORT_FALLBACK_IMAGES.BASKET;
  if (text.includes('voli')) return SPORT_FALLBACK_IMAGES.VOLI;
  if (text.includes('badminton')) return SPORT_FALLBACK_IMAGES.BADMINTON;
  if (text.includes('shooter') || text.includes('menembak')) return SPORT_FALLBACK_IMAGES.MENEMBAK;
  if (text.includes('atletik') || text.includes('track')) return SPORT_FALLBACK_IMAGES.ATLETIK;
  if (text.includes('futsal')) return SPORT_FALLBACK_IMAGES.FUTSAL;
  if (text.includes('minisoccer') || text.includes('mini_soccer') || text.includes('soccer')) return SPORT_FALLBACK_IMAGES.MINI_SOCCER;
  if (text.includes('roller') || text.includes('rollersport')) return SPORT_FALLBACK_IMAGES.ROLLER_SPORT;
  if (text.includes('renang') || text.includes('aquatik') || text.includes('aquatic')) return SPORT_FALLBACK_IMAGES.RENANG;
  if (text.includes('squash')) return SPORT_FALLBACK_IMAGES.SQUASH;
  if (text.includes('skate')) return SPORT_FALLBACK_IMAGES.SKATEPARK;

  if (sportHint && SPORT_FALLBACK_IMAGES[sportHint.toUpperCase()]) {
    return SPORT_FALLBACK_IMAGES[sportHint.toUpperCase()];
  }

  return SPORT_FALLBACK_IMAGES.default;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, sportHint?: string) {
  const target = e.currentTarget;
  
  // Prevent infinite retry loop if the fallback also fails
  if (target.dataset.fallbackAttempted === 'true') {
    target.style.display = 'none';
    return;
  }

  target.dataset.fallbackAttempted = 'true';
  const fallbackUrl = getFallbackImageForUrl(target.src || target.alt || '', sportHint);
  target.src = fallbackUrl;
}




