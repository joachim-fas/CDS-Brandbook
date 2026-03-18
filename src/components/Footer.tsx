import React from 'react';
import { LogoSVG } from '../LogoSVG';
import { Instagram, Linkedin, Twitter as TwitterIcon, Facebook, Youtube, Music } from 'lucide-react';

const XLogo = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" strokeWidth={0} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-brand text-asphalt py-12 text-center mt-20 border-t-8 border-asphalt transition-colors duration-300">
      <div className="w-48 mx-auto mb-6 text-asphalt drop-shadow-[2px_2px_0_#fff]">
        <LogoSVG />
      </div>
      <div className="flex justify-center gap-6 mb-6">
        <a href="#" className="hover:text-pure transition-colors"><Instagram size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><Linkedin size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><XLogo size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><Facebook size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><Youtube size={24} /></a>
        <a href="#" className="hover:text-pure transition-colors"><Music size={24} /></a>
      </div>
      <p className="font-mono font-bold text-sm uppercase tracking-widest mb-2">Culture Drops Brand System</p>
      <p className="font-mono text-xs font-bold">© 2026. WEAR YOUR WORDS.</p>
    </footer>
  );
}
