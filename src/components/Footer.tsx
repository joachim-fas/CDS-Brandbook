import React from 'react';
import { LogoSVG } from '../LogoSVG';
import { Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { XLogo, TikTokLogo } from './Icons';

export function Footer() {
  return (
    <footer className="bg-brand text-asphalt py-12 text-center mt-20 border-t-8 border-asphalt transition-colors duration-300">
      <div className="w-48 mx-auto mb-6 text-asphalt drop-shadow-[3px_3px_0_#111111]">
        <LogoSVG />
      </div>
      <div className="flex justify-center gap-6 mb-6">
        <a href="#" className="hover:text-pure transition-colors"><Instagram size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><Linkedin size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><XLogo className="w-6 h-6" /></a>
        <a href="#" className="hover:text-pure transition-colors"><Facebook size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><Youtube size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><TikTokLogo className="w-6 h-6" /></a>
      </div>
      <p className="font-mono font-bold text-sm uppercase tracking-widest mb-2">Culture Drops Brand System</p>
      <p className="font-mono text-xs font-bold">© 2026. WEAR YOUR WORDS.</p>
    </footer>
  );
}
