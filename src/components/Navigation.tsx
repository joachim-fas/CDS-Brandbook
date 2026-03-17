import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoSVG } from '../LogoSVG';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  themeColors: Record<string, string>;
  setTheme: (theme: string) => void;
}

export function Navigation({ themeColors, setTheme }: NavigationProps) {
  const location = useLocation();
  const isBrandbook = location.pathname === '/brandbook';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-bglight/90 backdrop-blur-md border-b-2 border-asphalt/10 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0 flex items-center gap-4" onClick={closeMobileMenu}>
            <div className="w-24 h-8 text-asphalt transition-colors flex items-center">
              <LogoSVG />
            </div>
            <span className="font-headline text-xl tracking-widest text-asphalt mt-1 hidden sm:block">BRANDBOOK 2026</span>
          </Link>
          
          <div className="hidden md:flex space-x-2 lg:space-x-4 items-center">
            <Link to="/brandbook" className={`text-sm font-bold hover:text-brand hover:bg-asphalt px-2 py-1 transition-colors border-b-2 ${location.pathname === '/brandbook' ? 'border-brand' : 'border-transparent'} hover:border-brand`}>BRANDBOOK</Link>
            <Link to="/assets" className={`text-sm font-bold hover:text-brand hover:bg-asphalt px-2 py-1 transition-colors border-b-2 ${location.pathname === '/assets' ? 'border-brand' : 'border-transparent'} hover:border-brand`}>ASSETS</Link>
            <Link to="/social-media" className={`text-sm font-bold hover:text-brand hover:bg-asphalt px-2 py-1 transition-colors border-b-2 ${location.pathname === '/social-media' ? 'border-brand' : 'border-transparent'} hover:border-brand`}>SOCIAL MEDIA</Link>
            <Link to="/shopify" className={`text-sm font-bold hover:text-brand hover:bg-asphalt px-2 py-1 transition-colors border-b-2 ${location.pathname === '/shopify' ? 'border-brand' : 'border-transparent'} hover:border-brand`}>SHOPIFY TEMPLATE</Link>
            
            <div className="w-px h-6 bg-asphalt/20 mx-2"></div>
            
            <div className="flex gap-3 items-center" title="Test Drop Variations">
              {Object.entries(themeColors).map(([name, color]) => (
                <button 
                  key={name}
                  onClick={() => setTheme(name)} 
                  className={`w-5 h-5 rounded-full border-2 border-asphalt hover:scale-125 transition-transform shadow-[0_0_8px_${color}]`} 
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-asphalt hover:text-brand focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-pure border-b-4 border-asphalt absolute w-full left-0 shadow-[0_10px_0_0_#111111]">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            <Link to="/brandbook" onClick={closeMobileMenu} className={`text-lg font-bold hover:text-brand hover:bg-asphalt px-4 py-3 transition-colors border-l-4 ${location.pathname === '/brandbook' ? 'border-brand bg-asphalt/5' : 'border-transparent'} hover:border-brand block`}>BRANDBOOK</Link>
            <Link to="/assets" onClick={closeMobileMenu} className={`text-lg font-bold hover:text-brand hover:bg-asphalt px-4 py-3 transition-colors border-l-4 ${location.pathname === '/assets' ? 'border-brand bg-asphalt/5' : 'border-transparent'} hover:border-brand block`}>ASSETS</Link>
            <Link to="/social-media" onClick={closeMobileMenu} className={`text-lg font-bold hover:text-brand hover:bg-asphalt px-4 py-3 transition-colors border-l-4 ${location.pathname === '/social-media' ? 'border-brand bg-asphalt/5' : 'border-transparent'} hover:border-brand block`}>SOCIAL MEDIA</Link>
            <Link to="/shopify" onClick={closeMobileMenu} className={`text-lg font-bold hover:text-brand hover:bg-asphalt px-4 py-3 transition-colors border-l-4 ${location.pathname === '/shopify' ? 'border-brand bg-asphalt/5' : 'border-transparent'} hover:border-brand block`}>SHOPIFY TEMPLATE</Link>
            
            <div className="h-px bg-asphalt/10 my-4 mx-4"></div>
            
            <div className="px-4">
              <p className="text-xs font-bold text-asphalt/50 mb-3 uppercase tracking-widest">Theme Variations</p>
              <div className="flex gap-4 items-center">
                {Object.entries(themeColors).map(([name, color]) => (
                  <button 
                    key={name}
                    onClick={() => { setTheme(name); closeMobileMenu(); }} 
                    className={`w-8 h-8 rounded-full border-2 border-asphalt hover:scale-110 transition-transform shadow-[0_0_8px_${color}]`} 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sub-navigation for Brandbook */}
      {isBrandbook && (
        <div className="w-full bg-asphalt text-pure py-2 border-b-2 border-brand overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-4 md:space-x-6">
            <a href="#dna" onClick={closeMobileMenu} className="text-xs font-bold hover:text-asphalt hover:bg-brand px-2 py-1 transition-colors">DNA</a>
            <a href="#logo" onClick={closeMobileMenu} className="text-xs font-bold hover:text-asphalt hover:bg-brand px-2 py-1 transition-colors">LOGO</a>
            <a href="#colors" onClick={closeMobileMenu} className="text-xs font-bold hover:text-asphalt hover:bg-brand px-2 py-1 transition-colors">COLORS</a>
            <a href="#uiux" onClick={closeMobileMenu} className="text-xs font-bold hover:text-asphalt hover:bg-brand px-2 py-1 transition-colors">UI / UX</a>
            <a href="#icons" onClick={closeMobileMenu} className="text-xs font-bold hover:text-asphalt hover:bg-brand px-2 py-1 transition-colors">ICONS</a>
            <a href="#typography" onClick={closeMobileMenu} className="text-xs font-bold hover:text-asphalt hover:bg-brand px-2 py-1 transition-colors">TYPO</a>
            <a href="#patterns" onClick={closeMobileMenu} className="text-xs font-bold hover:text-asphalt hover:bg-brand px-2 py-1 transition-colors">PATTERNS</a>
          </div>
        </div>
      )}
    </nav>
  );
}
