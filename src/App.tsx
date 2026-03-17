/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Brandbook } from './pages/Brandbook';
import { AssetLibrary } from './pages/AssetLibrary';
import { ShopifyTemplate } from './pages/ShopifyTemplate';
import { SocialMediaAssets } from './pages/SocialMediaAssets';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  const [theme, setTheme] = useState('acid');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('theme-acid', 'theme-hyper', 'theme-synth', 'theme-volt');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const themeColors = {
    acid: '#00FF00',
    hyper: '#00E5FF',
    synth: '#B200FF',
    volt: '#CCFF00'
  };

  const currentHex = themeColors[theme as keyof typeof themeColors];

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Navigation themeColors={themeColors} setTheme={setTheme} />

        <main className="flex-grow">
          <Routes>
            <Route path="/brandbook" element={<Brandbook themeColors={themeColors} currentHex={currentHex} handleCopy={handleCopy} />} />
            <Route path="/assets" element={<AssetLibrary themeColors={themeColors} currentHex={currentHex} handleCopy={handleCopy} />} />
            <Route path="/shopify" element={<ShopifyTemplate />} />
            <Route path="/social-media" element={<SocialMediaAssets themeColors={themeColors} currentHex={currentHex} handleCopy={handleCopy} />} />
          </Routes>
        </main>

        <Footer />

        {/* Toast Notification */}
        <div id="toast" className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-brand text-asphalt font-bold px-6 py-3 border-2 border-asphalt shadow-[4px_4px_0_0_#111111] z-50 transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {toastMessage}
        </div>
      </div>
    </Router>
  );
}
