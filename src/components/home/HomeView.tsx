import React from 'react';
import { HeroSection } from './HeroSection';
import { CategoryGrid } from './CategoryGrid';
import { PromoBanner } from './PromoBanner';
import { RecommendedVenues } from './RecommendedVenues';

export const HomeView: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <CategoryGrid />
      <PromoBanner />
      <RecommendedVenues />
    </div>
  );
};
