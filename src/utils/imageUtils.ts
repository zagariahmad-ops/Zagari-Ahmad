import React from 'react';

export const SPORT_LOCAL_IMAGES: Record<string, string> = {
  default: '',
};

export const SPORT_FALLBACK_IMAGES = SPORT_LOCAL_IMAGES;

export function getFallbackImageForUrl(_url: string = '', _sportHint?: string): string {
  return '';
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  target.style.display = 'none';
}



