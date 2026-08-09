/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';
import { HomeView } from './components/home/HomeView';
import { ExplorePage } from './components/explore/ExplorePage';
import { VenueDetailPage } from './components/venue/VenueDetailPage';
import { UserDashboard } from './components/user/UserDashboard';
import { MitraDashboard } from './components/mitra/MitraDashboard';
import { DatabaseSchemaModal } from './components/schema/DatabaseSchemaModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="flex-1">
        {activeView === 'HOME' && <HomeView />}
        {activeView === 'EXPLORE' && <ExplorePage />}
        {activeView === 'VENUE_DETAIL' && <VenueDetailPage />}
        {activeView === 'USER_DASHBOARD' && <UserDashboard />}
        {activeView === 'MITRA_DASHBOARD' && <MitraDashboard />}
      </main>

      <Footer />

      {/* Modals */}
      <DatabaseSchemaModal />
      <CheckoutModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
