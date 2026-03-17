import React, { useState, useRef } from 'react';
import { LogoSVG } from '../LogoSVG';
import { downloadSvg, downloadImage } from '../utils/download';
import { Download } from 'lucide-react';

interface Asset {
  platform: string;
  title: string;
  ratio: string; // Tailwind aspect ratio class
  size: string;
  description: string;
  notes: string;
}

export function SocialMediaAssets({ themeColors, currentHex, handleCopy }: { themeColors: Record<string, string>, currentHex: string, handleCopy: (text: string, message: string) => void }) {
  const assetRefs = useRef<(HTMLDivElement | null)[]>([]);

  const assets: Asset[] = [
    // TikTok
    { platform: 'TikTok', title: 'Video (Feed)', ratio: 'aspect-[9/16]', size: '1080 x 1920 px', description: 'Primär mobil · Vollbild vertikal', notes: 'H.264/H.265 · 30–60 fps · min. 720p' },
    { platform: 'TikTok', title: 'Thumbnail', ratio: 'aspect-[9/16]', size: '1080 x 1920 px', description: 'Wählt sich aus dem Video oder manuell hochladen', notes: 'Pflichtformat' },
    
    // Instagram
    { platform: 'Instagram', title: 'Feed-Post (Quadrat)', ratio: 'aspect-square', size: '1080 x 1080 px', description: 'Standard-Format · erscheint im Grid ungekürzt', notes: 'Pflichtformat' },
    { platform: 'Instagram', title: 'Story', ratio: 'aspect-[9/16]', size: '1080 x 1920 px', description: 'Safe Zone: 250 px oben + 400 px unten frei', notes: 'Pflichtformat' },
    { platform: 'Instagram', title: 'Reels', ratio: 'aspect-[9/16]', size: '1080 x 1920 px', description: 'H.264 · min. 30 fps · Ton empfohlen', notes: 'Pflichtformat' },
    
    // YouTube
    { platform: 'YouTube', title: 'Kanal-Banner', ratio: 'aspect-[16/9]', size: '2560 x 1440 px', description: 'Safe Zone (Desktop): 1546 x 423 px (Mitte)', notes: 'Pflichtformat' },
    { platform: 'YouTube', title: 'Video-Thumbnail', ratio: 'aspect-[16/9]', size: '1280 x 720 px', description: 'Wichtigstes Click-Element', notes: 'Pflichtformat' },
    
    // Pinterest
    { platform: 'Pinterest', title: 'Standard-Pin', ratio: 'aspect-[2/3]', size: '1000 x 1500 px', description: 'Optimales Format · wird im Feed am wenigsten zugeschnitten', notes: 'Pflichtformat' },
  ];

  const [selected, setSelected] = useState<Asset>(assets[0]);
  const platforms = Array.from(new Set(assets.map(a => a.platform)));

  const handleDownload = (index: number, title: string, format: 'svg' | 'png' | 'jpg') => {
    const container = assetRefs.current[index];
    if (container) {
      const svg = container.querySelector('svg');
      if (svg) {
        if (format === 'svg') {
          downloadSvg(svg, title.replace(/\s+/g, '-').toLowerCase());
        } else {
          downloadImage(svg, format, title.replace(/\s+/g, '-').toLowerCase());
        }
      }
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-headline text-5xl md:text-6xl text-asphalt mb-6 uppercase">Social Media Design System</h1>
      <p className="font-mono text-lg text-asphalt/80 mb-12 max-w-3xl">
        Alle Pflichtformate für TikTok, Instagram, Facebook, YouTube, LinkedIn und Pinterest. Stand 2025.
      </p>

      {platforms.map(platform => (
        <section key={platform} className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b-2 border-asphalt/10 pb-4 gap-4">
            <h2 className="font-headline text-3xl text-asphalt uppercase">{platform}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.filter(a => a.platform === platform).map((asset, index) => {
              const globalIndex = assets.findIndex(a => a === asset);
              return (
                <div key={asset.title} className="bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col relative group">
                  <div 
                    ref={(el) => (assetRefs.current[globalIndex] = el)}
                    className={`${asset.ratio} w-full bg-asphalt/5 border-2 border-asphalt mb-6 flex items-center justify-center p-4`}
                  >
                    <LogoSVG className="w-1/2 h-auto text-asphalt" />
                  </div>
                  <h3 className="font-headline text-3xl uppercase mb-2">{asset.title}</h3>
                  <p className="font-mono text-sm font-bold text-asphalt/60 mb-4">{asset.size}</p>
                  <p className="text-asphalt/80 text-sm mb-6 flex-grow">{asset.description}</p>
                  
                  <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => handleDownload(globalIndex, asset.title, 'svg')} className="bg-brand text-asphalt font-bold px-4 py-2 border-2 border-asphalt mb-2 hover:scale-105 transition-transform flex items-center gap-2">
                      <Download size={16} /> SVG
                    </button>
                    <button onClick={() => handleDownload(globalIndex, asset.title, 'png')} className="bg-pure text-asphalt font-bold px-4 py-2 border-2 border-asphalt mb-2 hover:scale-105 transition-transform flex items-center gap-2">
                      <Download size={16} /> PNG
                    </button>
                    <button onClick={() => handleDownload(globalIndex, asset.title, 'jpg')} className="bg-pure text-asphalt font-bold px-4 py-2 border-2 border-asphalt hover:scale-105 transition-transform flex items-center gap-2">
                      <Download size={16} /> JPG
                    </button>
                  </div>
                  <button 
                    onClick={() => setSelected(asset)}
                    className="w-full bg-asphalt text-pure font-bold py-3 hover:bg-brand hover:text-asphalt transition-colors uppercase mt-auto"
                  >
                    View Specs
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mt-24 border-2 border-asphalt p-12 bg-asphalt/5">
        <div className="border-b-2 border-asphalt/10 pb-4 mb-8">
          <h2 className="font-headline text-3xl text-asphalt uppercase">Specs: {selected.title} ({selected.platform})</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-2xl font-bold text-asphalt">Dimensions: <span className="font-mono bg-asphalt text-pure px-2">{selected.size}</span></p>
            <p className="text-xl text-asphalt/70">{selected.description}</p>
            <p className="text-sm font-mono text-asphalt/50">{selected.notes}</p>
          </div>
          <button 
            onClick={() => handleCopy(selected.size, `Copied dimensions for ${selected.title}!`)}
            className="bg-brand text-asphalt font-bold py-6 text-2xl hover:bg-asphalt hover:text-brand transition-all uppercase border-2 border-asphalt"
          >
            Copy Dimensions
          </button>
        </div>
      </section>
    </div>
  );
}
