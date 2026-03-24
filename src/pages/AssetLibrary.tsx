import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import JSZip from 'jszip';
import { LogoSVG } from '../LogoSVG';
import { XLogo, TikTokLogo } from '../components/Icons';
import { User, ShoppingBag, Search, Menu, X as CloseIcon, ArrowRight, Heart, Tag, Download, FolderDown, Share2, Filter, ArrowUpDown, Star, Check, Truck, Instagram, Facebook, Youtube, Linkedin, Music } from 'lucide-react';
import { downloadImage } from '../utils/download';

interface AssetLibraryProps {
  themeColors: Record<string, string>;
  currentHex: string;
  currentTheme: string;
  handleCopy: (text: string, message: string) => void;
}

export function AssetLibrary({ themeColors, currentHex, currentTheme, handleCopy }: AssetLibraryProps) {
  const [showShadow, setShowShadow] = useState(true);

  const generatePngBlob = (svgString: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!svgString.includes('width=')) {
        svgString = svgString.replace('<svg', '<svg width="1200" height="600"');
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        if (ctx) {
          canvas.width = img.width || 1200;
          canvas.height = img.height || 600;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const downloadPatternPng = async (svgString: string, name: string) => {
    try {
      const blob = await generatePngBlob(svgString);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(`Failed to generate PNG for ${name}`, e);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadZip = async (filename: string) => {
    handleCopy(' ', `Generating ${filename}...`);
    
    const zip = new JSZip();
    
    // Add a README file
    zip.file("README.txt", "Culturedrops Brand Assets\n\nThis is a generated ZIP archive containing your brand assets.\n\nIncluded:\n- Logos (SVG & PNG)\n- Icons (SVG)\n\nEnjoy!");
    
    // Add Logos
    const logosFolder = zip.folder("logos");
    if (logosFolder) {
      const getSvg = (hex: string, withShadow: boolean = false) => {
        let svg = renderToStaticMarkup(<LogoSVG />);
        if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        svg = svg.replace(/className="[^"]*"/g, '');
        
        if (withShadow) {
          const innerContentMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
          const svgTagMatch = svg.match(/<svg[^>]*>/);
          if (innerContentMatch && svgTagMatch) {
            const innerContent = innerContentMatch[1];
            const svgTag = svgTagMatch[0];
            return `${svgTag}
              <g transform="translate(3, 3)" color="#111111">${innerContent}</g>
              <g color="${hex}">${innerContent}</g>
            </svg>`;
          }
        }
        return svg.replace(/currentColor/g, hex);
      };
      
      const colors = [
        { name: 'black', hex: '#111111' },
        { name: 'white', hex: '#FFFFFF' },
        { name: 'acid', hex: '#00FF00' },
        { name: 'hyper', hex: '#00E5FF' },
        { name: 'synth', hex: '#FF0092' },
        { name: 'volt', hex: '#CCFF00' }
      ];

      for (const { name, hex } of colors) {
        const flatSvg = getSvg(hex, false);
        
        logosFolder.file(`culturedrops-logo-${name}-flat.svg`, flatSvg);

        try {
          logosFolder.file(`culturedrops-logo-${name}-flat.png`, await generatePngBlob(flatSvg));
        } catch (e) {
          console.error(`Failed to generate PNGs for ${name}`, e);
        }

        if (name !== 'black') {
          const shadowSvg = getSvg(hex, true);
          logosFolder.file(`culturedrops-logo-${name}-shadow.svg`, shadowSvg);
          try {
            logosFolder.file(`culturedrops-logo-${name}-shadow.png`, await generatePngBlob(shadowSvg));
          } catch (e) {
            console.error(`Failed to generate PNGs for ${name}`, e);
          }
        }
      }
    }

    // Add Icons
    const iconsFolder = zip.folder("icons");
    if (iconsFolder) {
      const icons = [
        { icon: User, label: 'account' },
        { icon: ShoppingBag, label: 'cart' },
        { icon: Search, label: 'search' },
        { icon: Menu, label: 'menu' },
        { icon: CloseIcon, label: 'close' },
        { icon: ArrowRight, label: 'arrow' },
        { icon: Heart, label: 'wishlist' },
        { icon: Tag, label: 'label' },
        { icon: Share2, label: 'share' },
        { icon: Filter, label: 'filter' },
        { icon: ArrowUpDown, label: 'sort' },
        { icon: Star, label: 'rating' },
        { icon: Check, label: 'check' },
        { icon: Truck, label: 'shipping' },
        { icon: TikTokLogo, label: 'tiktok' },
        { icon: Instagram, label: 'instagram' },
        { icon: Facebook, label: 'facebook' },
        { icon: Youtube, label: 'youtube' },
        { icon: XLogo, label: 'twitter' },
        { icon: Linkedin, label: 'linkedin' }
      ];
      
      icons.forEach(({ icon: Icon, label }) => {
        let svg = renderToStaticMarkup(<Icon size={24} strokeWidth={2} />);
        if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        svg = svg.replace(/currentColor/g, '#111111').replace(/className="[^"]*"/g, '');
        iconsFolder.file(`icon-${label}.svg`, svg);
      });
    }

    // Generate and download
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    triggerDownload(url, filename);
  };

  const downloadAsset = (Component: any, filename: string, format: 'svg' | 'png', colorHex: string = '#111111', withShadow: boolean = false, shadowColorOverride?: string) => {
    let svgString = renderToStaticMarkup(<Component />);
    if (!svgString.includes('xmlns=')) {
      svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Remove className to avoid confusion in raw SVG
    svgString = svgString.replace(/className="[^"]*"/g, '');

    if (withShadow) {
      const innerContentMatch = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      const svgTagMatch = svgString.match(/<svg[^>]*>/);
      if (innerContentMatch && svgTagMatch) {
        const innerContent = innerContentMatch[1];
        const svgTag = svgTagMatch[0];
        const mainColor = colorHex;
        const shColor = shadowColorOverride || '#111111';
        svgString = `${svgTag}
          <g transform="translate(3, 3)" color="${shColor}">${innerContent}</g>
          <g color="${mainColor}">${innerContent}</g>
        </svg>`;
      } else {
        svgString = svgString.replace(/currentColor/g, colorHex);
      }
    } else {
      svgString = svgString.replace(/currentColor/g, colorHex);
    }

    if (format === 'svg') {
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${filename}.svg`);
      handleCopy(' ', `Downloading ${filename}.svg...`);
      return;
    }

    if (format === 'png') {
      if (!svgString.includes('width=')) {
        svgString = svgString.replace('<svg', '<svg width="1200" height="600"');
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        if (ctx) {
          canvas.width = img.width || 1200;
          canvas.height = img.height || 600;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = URL.createObjectURL(blob);
              triggerDownload(pngUrl, `${filename}.png`);
              handleCopy(' ', `Downloading ${filename}.png...`);
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const handleProfileDownload = async (name: string) => {
    const element = document.getElementById(`profile-${name}`);
    if (element) {
      await downloadImage(element, 'png', `culturedrops-profile-${name}`, { width: 1080, height: 1080 });
    }
  };

  return (
    <div className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-headline text-5xl md:text-6xl text-asphalt mb-8 uppercase">Asset Library</h1>
      <p className="font-mono text-lg text-asphalt/80 mb-16 max-w-3xl">
        All brand assets, design tokens, and templates in one place. Ready to be used across different platforms and applications.
      </p>

      {/* Bulk Download */}
      <div className="flex flex-col sm:flex-row gap-8 mb-24">
        <button 
          onClick={() => downloadZip('culturedrops-brand-kit.zip')}
          className="bg-brand text-asphalt font-headline tracking-widest text-lg px-10 py-6 font-bold uppercase border-4 border-asphalt shadow-[6px_6px_0_0_#111111] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all flex items-center justify-center gap-3"
        >
          <FolderDown size={24} />
          Download Full Brand Kit
        </button>
      </div>

      {/* Logos */}
      <section id="logos" className="mb-32">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b-2 border-asphalt/10 pb-6 gap-4">
          <h2 className="font-headline text-4xl text-asphalt">Logos</h2>
          <button 
            onClick={() => setShowShadow(!showShadow)}
            className="text-sm font-bold uppercase tracking-widest bg-asphalt text-pure px-6 py-3 hover:bg-brand hover:text-asphalt transition-colors"
          >
            {showShadow ? 'Show Flat Versions' : 'Show Shadow Versions'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* ... existing logo cards ... */}
          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col items-center justify-center relative group">
            <div className={`w-full max-w-[200px] text-asphalt mb-6 transition-all duration-300`}>
              <LogoSVG />
            </div>
            <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-black-flat`, 'svg', '#111111', false)} className="text-pure font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors mb-2">
                <Download size={16} /> SVG
              </button>
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-black-flat`, 'png', '#111111', false)} className="bg-asphalt text-pure font-bold uppercase tracking-widest text-sm px-5 py-2 border-2 border-pure hover:bg-brand hover:text-asphalt transition-colors flex items-center gap-2">
                <Download size={16} /> PNG
              </button>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-asphalt/50">Primary Black</span>
          </div>

          <div className="bg-asphalt border-2 border-asphalt p-6 shadow-brutal-black flex flex-col items-center justify-center relative group">
            <div className={`w-full max-w-[200px] text-pure mb-6 transition-all duration-300 ${showShadow ? 'drop-shadow-[3px_3px_0_#111111]' : ''}`}>
              <LogoSVG />
            </div>
            <div className="absolute inset-0 bg-pure/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-white-${showShadow ? 'shadow' : 'flat'}`, 'svg', '#FFFFFF', showShadow)} className="text-pure font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors mb-2">
                <Download size={16} /> SVG
              </button>
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-white-${showShadow ? 'shadow' : 'flat'}`, 'png', '#FFFFFF', showShadow)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-pure/50">Primary White</span>
          </div>

          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col items-center justify-center relative group">
            <div className={`w-full max-w-[200px] text-[#00FF00] mb-6 transition-all duration-300 ${showShadow ? 'drop-shadow-[3px_3px_0_#111111]' : ''}`}>
              <LogoSVG />
            </div>
            <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-acid-${showShadow ? 'shadow' : 'flat'}`, 'svg', '#00FF00', showShadow)} className="text-pure font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors mb-2">
                <Download size={16} /> SVG
              </button>
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-acid-${showShadow ? 'shadow' : 'flat'}`, 'png', '#00FF00', showShadow)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-asphalt/50">Acid (Green)</span>
          </div>

          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col items-center justify-center relative group">
            <div className={`w-full max-w-[200px] text-[#00E5FF] mb-6 transition-all duration-300 ${showShadow ? 'drop-shadow-[3px_3px_0_#111111]' : ''}`}>
              <LogoSVG />
            </div>
            <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-hyper-${showShadow ? 'shadow' : 'flat'}`, 'svg', '#00E5FF', showShadow)} className="text-pure font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors mb-2">
                <Download size={16} /> SVG
              </button>
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-hyper-${showShadow ? 'shadow' : 'flat'}`, 'png', '#00E5FF', showShadow)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-asphalt/50">Hyper (Cyan)</span>
          </div>

          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col items-center justify-center relative group">
            <div className={`w-full max-w-[200px] text-[#FF0092] mb-6 transition-all duration-300 ${showShadow ? 'drop-shadow-[3px_3px_0_#111111]' : ''}`}>
              <LogoSVG />
            </div>
            <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-synth-${showShadow ? 'shadow' : 'flat'}`, 'svg', '#FF0092', showShadow)} className="text-pure font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors mb-2">
                <Download size={16} /> SVG
              </button>
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-synth-${showShadow ? 'shadow' : 'flat'}`, 'png', '#FF0092', showShadow)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-asphalt/50">Synth (Purple)</span>
          </div>

          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col items-center justify-center relative group">
            <div className={`w-full max-w-[200px] text-[#CCFF00] mb-6 transition-all duration-300 ${showShadow ? 'drop-shadow-[3px_3px_0_#111111]' : ''}`}>
              <LogoSVG />
            </div>
            <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-volt-${showShadow ? 'shadow' : 'flat'}`, 'svg', '#CCFF00', showShadow)} className="text-pure font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors mb-2">
                <Download size={16} /> SVG
              </button>
              <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-volt-${showShadow ? 'shadow' : 'flat'}`, 'png', '#CCFF00', showShadow)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-asphalt/50">Volt (Yellow)</span>
          </div>
        </div>

        {/* Inverted: Black logo with neon shadow */}
        {showShadow && (
          <>
            <h3 className="font-headline text-2xl text-asphalt mt-16 mb-8 border-b-2 border-asphalt/10 pb-4">Inverted — Black with Neon Shadow</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { name: 'acid', hex: '#00FF00', label: 'Acid (Green)' },
                { name: 'hyper', hex: '#00E5FF', label: 'Hyper (Cyan)' },
                { name: 'synth', hex: '#FF0092', label: 'Synth (Purple)' },
                { name: 'volt', hex: '#CCFF00', label: 'Volt (Yellow)' },
              ].map(({ name, hex, label }) => (
                <div key={`inv-${name}`} className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col items-center justify-center relative group">
                  <div className={`w-full max-w-[200px] text-asphalt mb-6 transition-all duration-300`} style={{ filter: `drop-shadow(3px 3px 0 ${hex})` }}>
                    <LogoSVG />
                  </div>
                  <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-black-${name}-shadow`, 'svg', '#111111', true, hex)} className="text-pure font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors mb-2">
                      <Download size={16} /> SVG
                    </button>
                    <button onClick={() => downloadAsset(LogoSVG, `culturedrops-logo-black-${name}-shadow`, 'png', '#111111', true, hex)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                      <Download size={16} /> PNG
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-asphalt/50">Black + {label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Social Profile Images */}
      <section id="social-profile-images" className="mb-32">
        <h2 className="font-headline text-4xl text-asphalt mb-12 border-b-2 border-asphalt/10 pb-6">Social Profile Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[
            { name: 'black', hex: '#111111', textColor: '#FFFFFF' },
            { name: 'white', hex: '#FFFFFF', textColor: '#111111' },
            { name: 'acid', hex: '#00FF00', textColor: '#111111' },
            { name: 'hyper', hex: '#00E5FF', textColor: '#111111' },
            { name: 'synth', hex: '#FF0092', textColor: '#FFFFFF' },
            { name: 'volt', hex: '#CCFF00', textColor: '#111111' }
          ].map(({ name, hex, textColor }) => (
            <div key={name} className="bg-pure border-2 border-asphalt p-4 shadow-brutal-black flex flex-col items-center justify-center relative group">
              <div id={`profile-${name}`} className="w-full aspect-square flex items-center justify-center mb-4" style={{ backgroundColor: hex }}>
                <div className="w-3/4 text-center" style={{ color: textColor }}>
                  <LogoSVG />
                </div>
              </div>
              <button onClick={() => handleProfileDownload(name)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
              <span className="mt-2 text-[10px] font-bold uppercase text-asphalt/50">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Icons */}
      <section id="icons" className="mb-32">
        <h2 className="font-headline text-4xl text-asphalt mb-12 border-b-2 border-asphalt/10 pb-6">Icon Set (SVG)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
          {[
            { icon: User, label: 'Account' },
            { icon: ShoppingBag, label: 'Cart' },
            { icon: Search, label: 'Search' },
            { icon: Menu, label: 'Menu' },
            { icon: CloseIcon, label: 'Close' },
            { icon: ArrowRight, label: 'Arrow' },
            { icon: Heart, label: 'Wishlist' },
            { icon: Tag, label: 'Label' },
            { icon: Share2, label: 'Share' },
            { icon: Filter, label: 'Filter' },
            { icon: ArrowUpDown, label: 'Sort' },
            { icon: Star, label: 'Rating' },
            { icon: Check, label: 'Check' },
            { icon: Truck, label: 'Shipping' },
            { icon: TikTokLogo, label: 'TikTok' },
            { icon: Instagram, label: 'Instagram' },
            { icon: Facebook, label: 'Facebook' },
            { icon: Youtube, label: 'YouTube' },
            { icon: XLogo, label: 'X' },
            { icon: Linkedin, label: 'LinkedIn' }
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-pure border-2 border-asphalt p-4 group hover:bg-brand hover:-translate-y-1 shadow-[2px_2px_0_0_#111111] hover:shadow-[4px_4px_0_0_#111111] transition-all cursor-pointer relative">
              <Icon className="w-8 h-8 mx-auto mb-2 text-asphalt group-hover:scale-110 transition-transform" strokeWidth={2} />
              <p className="font-mono text-[10px] font-bold uppercase text-asphalt">{label}</p>
              <div className="absolute inset-0 bg-asphalt/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={(e) => { e.stopPropagation(); downloadAsset(Icon, `icon-${label.toLowerCase()}`, 'svg', '#111111', false, { size: 24, strokeWidth: 2 }); }} 
                  className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors"
                >
                  <Download size={16} /> SVG
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography / Fonts */}
      <section id="typography" className="mb-32">
        <h2 className="font-headline text-4xl text-asphalt mb-12 border-b-2 border-asphalt/10 pb-6">Typography</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Syne */}
          <div className="bg-pure border-2 border-asphalt p-6 sm:p-8 shadow-brutal-black flex flex-col relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="font-headline text-4xl text-asphalt mb-1">Syne</h3>
                <p className="font-mono text-sm text-asphalt/60 uppercase font-bold">Primary / Headline</p>
              </div>
              <a 
                href="https://fonts.google.com/specimen/Syne" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand text-asphalt px-4 py-2 font-bold text-sm border-2 border-asphalt hover:bg-asphalt hover:text-brand transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Google Fonts <ArrowRight size={16} />
              </a>
            </div>
            <div className="font-headline text-6xl sm:text-7xl text-asphalt break-words leading-none mb-6">
              Aa Bb Cc
            </div>
            <p className="font-headline text-xl text-asphalt/80">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          {/* Space Mono */}
          <div className="bg-pure border-2 border-asphalt p-6 sm:p-8 shadow-brutal-black flex flex-col relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="font-mono text-4xl text-asphalt mb-1 font-bold">Space Mono</h3>
                <p className="font-mono text-sm text-asphalt/60 uppercase font-bold">Secondary / Monospace</p>
              </div>
              <a 
                href="https://fonts.google.com/specimen/Space+Mono" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand text-asphalt px-4 py-2 font-bold text-sm border-2 border-asphalt hover:bg-asphalt hover:text-brand transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Google Fonts <ArrowRight size={16} />
              </a>
            </div>
            <div className="font-mono text-5xl sm:text-6xl text-asphalt break-words leading-none mb-6 font-bold">
              Aa Bb Cc
            </div>
            <p className="font-mono text-lg text-asphalt/80">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
      </section>

      {/* Design Tokens */}
      <section id="tokens" className="mb-32">
        <h2 className="font-headline text-4xl text-asphalt mb-12 border-b-2 border-asphalt/10 pb-6">Design Tokens</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Color Tokens (JSON)</h3>
            <div className="code-block group">
              <pre><code>{`{
  "colors": {
    "brand": {
      "acid": "#00FF00",
      "hyper": "#00E5FF",
      "synth": "#FF0092",
      "volt": "#CCFF00"
    },
    "base": {
      "asphalt": "#111111",
      "pure": "#FFFFFF",
      "bglight": "#F4F4F0"
    }
  }
}`}</code></pre>
              <button 
                onClick={() => handleCopy(`{\n  "colors": {\n    "brand": {\n      "acid": "#00FF00",\n      "hyper": "#00E5FF",\n      "synth": "#FF0092",\n      "volt": "#CCFF00"\n    },\n    "base": {\n      "asphalt": "#111111",\n      "pure": "#FFFFFF",\n      "bglight": "#F4F4F0"\n    }\n  }\n}`, 'JSON copied!')} 
                className="absolute top-2 right-2 bg-brand text-asphalt px-2 py-1 text-xs font-bold border border-asphalt hover:bg-asphalt hover:text-brand transition-colors"
              >
                COPY
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Typography Tokens (JSON)</h3>
            <div className="code-block group">
              <pre><code>{`{
  "typography": {
    "fonts": {
      "headline": "'Syne', sans-serif",
      "mono": "'Space Mono', monospace"
    },
    "weights": {
      "regular": 400,
      "bold": 700,
      "extrabold": 800
    }
  }
}`}</code></pre>
              <button 
                onClick={() => handleCopy(`{\n  "typography": {\n    "fonts": {\n      "headline": "'Syne', sans-serif",\n      "mono": "'Space Mono', monospace"\n    },\n    "weights": {\n      "regular": 400,\n      "bold": 700,\n      "extrabold": 800\n    }\n  }\n}`, 'JSON copied!')} 
                className="absolute top-2 right-2 bg-brand text-asphalt px-2 py-1 text-xs font-bold border border-asphalt hover:bg-asphalt hover:text-brand transition-colors"
              >
                COPY
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Patterns & Animations Snippets */}
      <section id="patterns" className="mb-32">
        <h2 className="font-headline text-4xl text-asphalt mb-12 border-b-2 border-asphalt/10 pb-6">Patterns & Animations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lined Notepad */}
          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black">
            <h3 className="font-headline text-xl text-asphalt mb-4">Lined Notepad Pattern</h3>
            <div className="h-32 mb-6 border-2 border-asphalt pattern-notebook flex items-center justify-center">
              <span className="bg-brand px-2 border-2 border-asphalt font-headline transform -rotate-2">Preview</span>
            </div>
            <div className="bg-asphalt p-4 overflow-x-auto">
              <pre className="text-pure font-mono text-sm">
{`.pattern-notebook {
  background-color: #F4F4F0;
  background-image: linear-gradient(#111111 1px, transparent 1px);
  background-size: 100% 24px;
}`}
              </pre>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={() => handleCopy(`.pattern-notebook {\n  background-color: #F4F4F0;\n  background-image: linear-gradient(#111111 1px, transparent 1px);\n  background-size: 100% 24px;\n}`, 'Copied CSS!')} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> Copy CSS
              </button>
              <button onClick={() => downloadPatternPng(`
<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="1000" fill="#F4F4F0" />
  <pattern id="notebook" width="1000" height="32" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="1000" y2="0" stroke="#111111" stroke-width="1" stroke-opacity="0.2" />
    <line x1="60" y1="0" x2="60" y2="32" stroke="#D90429" stroke-width="2" />
  </pattern>
  <rect width="1000" height="1000" fill="url(#notebook)" />
</svg>
`, `lined-notepad-pattern-${currentTheme}`)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
          </div>

          {/* Street Checker */}
          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black">
            <h3 className="font-headline text-xl text-asphalt mb-4">Street Checker Pattern</h3>
            <div className="h-32 mb-6 border-2 border-asphalt flex items-center justify-center" style={{ backgroundColor: '#F4F4F0', backgroundImage: 'repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%, #111111), repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%, #111111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
              <span className="bg-pure px-2 border-2 border-asphalt font-headline transform rotate-1">Preview</span>
            </div>
            <div className="bg-asphalt p-4 overflow-x-auto">
              <pre className="text-pure font-mono text-sm">
{`.pattern-checker {
  background-color: #F4F4F0;
  background-image: 
    repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%, #111111), 
    repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%, #111111);
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
}`}
              </pre>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={() => handleCopy(`.pattern-checker {\n  background-color: #F4F4F0;\n  background-image: \n    repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%, #111111), \n    repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%, #111111);\n  background-position: 0 0, 10px 10px;\n  background-size: 20px 20px;\n}`, 'Copied CSS!')} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> COPY CSS
              </button>
              <button onClick={() => downloadPatternPng(`
<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="1000" fill="#F4F4F0" />
  <pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse">
    <rect width="10" height="10" fill="#111111" />
    <rect x="10" y="10" width="10" height="10" fill="#111111" />
  </pattern>
  <rect width="1000" height="1000" fill="url(#checker)" />
</svg>
`, `street-checker-pattern-${currentTheme}`)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
          </div>

          {/* Caution Tape */}
          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black">
            <h3 className="font-headline text-xl text-asphalt mb-4">Caution Tape Pattern</h3>
            <div className="h-32 mb-6 border-2 border-asphalt flex items-center justify-center" style={{ background: 'repeating-linear-gradient(-45deg, var(--color-brand), var(--color-brand) 20px, #111111 20px, #111111 40px)' }}>
              <span className="bg-pure px-2 border-2 border-asphalt font-headline">Preview</span>
            </div>
            <div className="bg-asphalt p-4 overflow-x-auto">
              <pre className="text-pure font-mono text-sm">
{`.pattern-caution {
  background: repeating-linear-gradient(
    -45deg, 
    var(--color-brand), 
    var(--color-brand) 20px, 
    #111111 20px, 
    #111111 40px
  );
}`}
              </pre>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={() => handleCopy(`.pattern-caution {\n  background: repeating-linear-gradient(\n    -45deg, \n    var(--color-brand), \n    var(--color-brand) 20px, \n    #111111 20px, \n    #111111 40px\n  );\n}`, 'Copied CSS!')} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> COPY CSS
              </button>
              <button onClick={() => downloadPatternPng(`
<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="caution" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <rect width="20" height="40" fill="${currentHex}" />
      <rect x="20" width="20" height="40" fill="#111111" />
    </pattern>
  </defs>
  <rect width="1000" height="1000" fill="url(#caution)" />
</svg>
`, `caution-tape-pattern-${currentTheme}`)} className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                <Download size={16} /> PNG
              </button>
            </div>
          </div>

          {/* Core Glitch */}
          <div className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black">
            <h3 className="font-headline text-xl text-asphalt mb-4">Core Glitch Animation</h3>
            <div className="h-32 mb-6 border-2 border-asphalt flex items-center justify-center relative overflow-hidden">
              <div className="glitch-wrapper font-headline text-3xl tracking-widest">
                <div className="glitch-text" data-text="GLITCH">GLITCH</div>
              </div>
            </div>
            <div className="bg-asphalt p-4 overflow-x-auto">
              <pre className="text-pure font-mono text-sm">
{`.glitch-wrapper {
  position: relative;
}
.glitch-text {
  position: relative;
  color: #111111;
}
.glitch-text::before, .glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.glitch-text::before {
  left: 2px;
  text-shadow: -2px 0 var(--color-brand);
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-anim 3s infinite linear alternate-reverse;
}
.glitch-text::after {
  left: -2px;
  text-shadow: -2px 0 #F4F4F0;
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-anim 2.5s infinite linear alternate-reverse;
}
@keyframes glitch-anim {
  0% { clip: rect(10px, 9999px, 44px, 0); }
  /* ... more keyframes ... */
}`}
              </pre>
            </div>
            <button onClick={() => handleCopy(`.glitch-wrapper {\n  position: relative;\n}\n.glitch-text {\n  position: relative;\n  color: #111111;\n}\n.glitch-text::before, .glitch-text::after {\n  content: attr(data-text);\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n.glitch-text::before {\n  left: 2px;\n  text-shadow: -2px 0 var(--color-brand);\n  clip: rect(24px, 550px, 90px, 0);\n  animation: glitch-anim 3s infinite linear alternate-reverse;\n}\n.glitch-text::after {\n  left: -2px;\n  text-shadow: -2px 0 #F4F4F0;\n  clip: rect(85px, 550px, 140px, 0);\n  animation: glitch-anim 2.5s infinite linear alternate-reverse;\n}`, 'Copied CSS!')} className="mt-4 text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
              <Download size={16} /> Copy CSS
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
