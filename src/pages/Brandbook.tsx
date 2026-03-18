import React from 'react';
import { LogoSVG } from '../LogoSVG';
import { XLogo, TikTokLogo } from '../components/Icons';
import { User, ShoppingBag, Search, Menu, X as CloseIcon, ArrowRight, Heart, Tag, Share2, Filter, ArrowUpDown, Star, Check, Truck, Instagram, Facebook, Youtube, Linkedin, Music } from 'lucide-react';

interface BrandbookProps {
  themeColors: Record<string, string>;
  currentHex: string;
  handleCopy: (text: string, message: string) => void;
}

export function Brandbook({ themeColors, currentHex, handleCopy }: BrandbookProps) {
  return (
    <div className="pt-32">
      {/* Marquee Divider */}
      <div className="bg-brand text-asphalt py-3 border-y-4 border-asphalt transform -rotate-1 scale-105 overflow-hidden transition-colors duration-300">
        <div className="marquee font-headline text-xl tracking-wide">
          <span>CULTURE DROPS // ONE WORD SERIES // WEAR YOUR WORDS // BRAND GUIDELINES // MINIMAL DESIGN // CLEAR ATTITUDE // CULTURE DROPS // ONE WORD SERIES // WEAR YOUR WORDS // BRAND GUIDELINES // MINIMAL DESIGN // CLEAR ATTITUDE //</span>
        </div>
      </div>

      {/* 01. Brand DNA */}
      <section id="dna" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-headline text-4xl md:text-5xl text-asphalt mb-12 border-b-2 border-brand pb-4 transition-colors duration-300">
          <span className="bg-brand text-asphalt px-2 inline-block border-2 border-asphalt transition-colors duration-300">01.</span> Brand DNA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-pure border-2 border-asphalt shadow-[6px_6px_0_0_#111] hover:shadow-[6px_6px_0_0_var(--color-brand)] p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">⬛</div>
            <h3 className="font-headline text-xl sm:text-2xl mb-4 tracking-wide text-asphalt break-words hyphens-auto" lang="en">UNCOMPROMISING AESTHETICS</h3>
            <p className="text-asphalt/80 text-sm leading-relaxed">
              Stripped back to the essentials. We reject visual clutter in favor of bold, intentional typography and stark contrasts that command attention.
            </p>
          </div>
          <div className="bg-pure border-2 border-asphalt shadow-[6px_6px_0_0_#111] hover:shadow-[6px_6px_0_0_var(--color-brand)] p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="font-headline text-xl sm:text-2xl mb-4 tracking-wide text-asphalt break-words hyphens-auto" lang="en">COLLECTIVE IDENTITY</h3>
            <p className="text-asphalt/80 text-sm leading-relaxed">
              Garments designed to be worn together. Our pieces create a shared narrative, transforming individual expression into a unified group statement.
            </p>
          </div>
          <div className="bg-pure border-2 border-asphalt shadow-[6px_6px_0_0_#111] hover:shadow-[6px_6px_0_0_var(--color-brand)] p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">🪩</div>
            <h3 className="font-headline text-xl sm:text-2xl mb-4 tracking-wide text-asphalt break-words hyphens-auto" lang="en">ZEITGEIST CAPTURED</h3>
            <p className="text-asphalt/80 text-sm leading-relaxed">
              Distilling the essence of contemporary movements. We take fleeting moments of cultural significance and immortalize them in heavy cotton.
            </p>
          </div>
        </div>
      </section>

      {/* 02. Logo Showroom */}
      <section id="logo" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-asphalt/20">
        <h2 className="font-headline text-4xl md:text-5xl text-asphalt mb-12 border-b-2 border-brand pb-4 transition-colors duration-300">
          <span className="bg-brand text-asphalt px-2 inline-block border-2 border-asphalt transition-colors duration-300">02.</span> The Logo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8 items-center border-2 border-asphalt/10 p-8 bg-pure shadow-brutal-black">
          <div className="p-8 flex flex-col items-center justify-center relative transition-transform hover:scale-105">
            <div className="w-full max-w-md text-brand drop-shadow-[3px_3px_0_#111111] transition-all duration-300">
              <LogoSVG />
            </div>
            <span className="absolute bottom-0 left-0 text-[10px] text-asphalt/50 font-bold px-1 uppercase border-b border-asphalt/20">Brand Drop Shadow</span>
          </div>
          <div className="p-8 flex flex-col items-center justify-center relative transition-transform hover:scale-105">
            <div className="w-full max-w-md text-asphalt">
              <LogoSVG />
            </div>
            <span className="absolute bottom-0 left-0 text-[10px] text-asphalt/50 font-bold px-1 uppercase border-b border-asphalt/20">Pure Asphalt</span>
          </div>
        </div>
      </section>

      {/* 03. Colors */}
      <section id="colors" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-asphalt/20">
        <h2 className="font-headline text-4xl md:text-5xl text-asphalt mb-12 border-b-4 border-asphalt pb-4">
          <span className="bg-brand text-asphalt px-2 inline-block border-2 border-asphalt transition-colors duration-300">03.</span> Color System
        </h2>
        
        <p className="mb-8 max-w-3xl text-sm font-bold border-l-4 border-brand pl-4 py-2 bg-pure border-y-2 border-r-2 border-asphalt/10 transition-colors duration-300">
          The 4 core neon colors shine maximally on a white background. 
          The variable <code className="bg-brand text-asphalt border border-asphalt px-1">--color-brand</code> controls the global accent color in the Shopify theme.
        </p>

        <div className="mb-12">
          <h3 className="font-bold text-sm mb-2 uppercase tracking-widest">Global CSS Variables (base.css)</h3>
          <div className="code-block group">
            <pre><code>{`:root {
  /* Core Neon Palette */
  --color-acid:  #00FF00;
  --color-hyper: #00E5FF;
  --color-synth: #B200FF;
  --color-volt:  #CCFF00;

  /* Dynamic Brand Color (Shopify Settings) */
  --color-brand: ${currentHex};

  /* Base Colors */
  --color-asphalt: #111111;
  --color-pure:    #FFFFFF;
  --color-bg:      #F4F4F0;
}`}</code></pre>
            <button 
              onClick={() => handleCopy(`:root {\n  --color-acid: #00FF00;\n  --color-hyper: #00E5FF;\n  --color-synth: #B200FF;\n  --color-volt: #CCFF00;\n  --color-brand: ${currentHex};\n  --color-asphalt: #111111;\n  --color-pure: #FFFFFF;\n  --color-bg: #F4F4F0;\n}`, 'CSS Code copied!')} 
              className="absolute top-2 right-2 bg-brand text-asphalt px-2 py-1 text-xs font-bold border border-asphalt hover:bg-asphalt hover:text-brand transition-colors"
            >
              COPY
            </button>
          </div>
        </div>

        <h3 className="font-bold text-xl mb-6 uppercase tracking-wider">The Neon Core (Click to Copy Hex)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {Object.entries(themeColors).map(([name, color]) => (
            <div key={name} className="group cursor-pointer" onClick={() => handleCopy(color, `${color} copied!`)}>
              <div className={`h-32 border-2 border-asphalt mb-4 shadow-[4px_4px_0_0_#111111] transition-all flex items-center justify-center hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111111]`} style={{ backgroundColor: color }}>
                <span className="opacity-0 group-hover:opacity-100 font-bold text-sm text-asphalt bg-pure px-2 border-2 border-asphalt">COPY HEX</span>
              </div>
              <h4 className="font-headline text-lg uppercase">{name}</h4>
              <p className="text-xs opacity-70 font-bold">{color}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 04. UI / UX Elements */}
      <section id="uiux" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-asphalt/20">
        <h2 className="font-headline text-4xl md:text-5xl text-asphalt mb-12 border-b-2 border-brand pb-4 transition-colors duration-300">
          <span className="bg-brand text-asphalt px-2 inline-block border-2 border-asphalt transition-colors duration-300">04.</span> UI & UX Elements
        </h2>
        
        <p className="mb-8 max-w-3xl text-sm font-bold opacity-80">Brutalist form fields, custom checkboxes and a button sandbox with 5 radical hover effects for Shopify.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-pure p-8 border-2 border-asphalt shadow-brutal-black flex flex-col justify-between">
            <div>
              <h3 className="font-headline text-2xl mb-6 text-asphalt border-b-2 border-asphalt/10 pb-2">Forms & Inputs</h3>
              <div className="space-y-6">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" placeholder="you@streetwear.com" className="w-full bg-bglight border-2 border-asphalt p-3 font-mono text-asphalt placeholder-asphalt/40 focus:outline-none focus:bg-pure focus:border-brand focus:shadow-[4px_4px_0_0_var(--color-brand)] transition-all duration-200" />
                </div>
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest mb-2">Select Variant</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-bglight border-2 border-asphalt p-3 font-mono text-asphalt focus:outline-none focus:bg-pure focus:border-brand focus:shadow-[4px_4px_0_0_var(--color-brand)] transition-all duration-200 cursor-pointer">
                      <option>SIZE M // OVERSIZED</option>
                      <option>SIZE L // OVERSIZED</option>
                      <option>SIZE XL // OVERSIZED</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-asphalt">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="pt-2 grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="terms" className="custom-checkbox shrink-0" />
                    <label htmlFor="terms" className="font-mono text-xs cursor-pointer select-none">I agree to the terms.</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" id="ship1" className="custom-radio shrink-0" defaultChecked />
                    <label htmlFor="ship1" className="font-mono text-xs cursor-pointer select-none">Standard Shipping</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" id="ship2" className="custom-radio shrink-0" />
                    <label htmlFor="ship2" className="font-mono text-xs cursor-pointer select-none">Express (Next Drop)</label>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="checkbox" id="newsletter" className="custom-toggle shrink-0" />
                    <label htmlFor="newsletter" className="font-mono text-xs cursor-pointer select-none font-bold">Subscribe to Secret Drops</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-pure p-8 border-2 border-asphalt shadow-brutal-black">
            <h3 className="font-headline text-2xl mb-6 text-asphalt border-b-2 border-asphalt/10 pb-2">Button Animation Sandbox</h3>
            <div className="space-y-6 flex flex-col items-start">
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-50">1. Solid Push (Classic Checkout)</p>
                <button className="w-full bg-brand text-asphalt font-headline tracking-widest text-lg px-6 py-4 font-bold uppercase btn-hover-push">Add to Cart</button>
              </div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-50">2. Cyber Fill (Secondary Action)</p>
                <button className="w-full bg-pure text-asphalt font-headline tracking-widest text-lg px-6 py-4 font-bold uppercase btn-hover-fill border-2 border-asphalt">View Lookbook</button>
              </div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-50">3. Neon Glow (High Attention)</p>
                <button className="w-full bg-asphalt text-pure font-headline tracking-widest text-lg px-6 py-4 font-bold uppercase btn-hover-glow border-2 border-asphalt">Join the Waitlist</button>
              </div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-50">4. Brutal Invert (Pop-out)</p>
                <button className="w-full bg-pure border-2 border-asphalt text-asphalt font-headline tracking-widest text-lg px-6 py-4 font-bold uppercase btn-hover-invert">Read Manifesto</button>
              </div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-50">5. Punk Glitch (The Disruptor)</p>
                <button className="w-full bg-brand border-2 border-asphalt text-asphalt shadow-[4px_4px_0_0_#111111] font-headline tracking-widest text-lg px-6 py-4 font-bold uppercase btn-hover-glitch">Cop the Drop</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05. Iconography */}
      <section id="icons" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-asphalt/20">
        <h2 className="font-headline text-4xl md:text-5xl text-asphalt mb-12 border-b-2 border-brand pb-4 transition-colors duration-300">
          <span className="bg-brand text-asphalt px-2 inline-block border-2 border-asphalt transition-colors duration-300">05.</span> Shop Icons
        </h2>
        
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
            <div key={label} className="bg-pure border-2 border-asphalt p-4 group hover:bg-brand hover:-translate-y-1 shadow-[2px_2px_0_0_#111111] hover:shadow-[4px_4px_0_0_#111111] transition-all cursor-pointer">
              <Icon className="w-8 h-8 mx-auto mb-2 text-asphalt group-hover:scale-110 transition-transform" strokeWidth={2} />
              <p className="font-mono text-[10px] font-bold uppercase text-asphalt">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 06. Typography */}
      <section id="typography" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-asphalt/20">
        <h2 className="font-headline text-4xl md:text-5xl text-asphalt mb-12 border-b-2 border-brand pb-4 transition-colors duration-300">
          <span className="bg-brand text-asphalt px-2 inline-block border-2 border-asphalt transition-colors duration-300">06.</span> Typography
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div className="space-y-8">
            <div>
              <p className="text-asphalt text-sm mb-2 font-bold uppercase tracking-widest">Headline Font (Campaigns)</p>
              <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl mb-2 text-asphalt uppercase">Syne Extra Bold</h3>
              <p className="text-asphalt/70 text-sm font-mono mt-4 break-words">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>abcdefghijklmnopqrstuvwxyz<br/>0123456789</p>
            </div>
            <div>
              <p className="text-asphalt text-sm mb-2 font-bold uppercase tracking-widest">Quote & Body Font</p>
              <h3 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold mb-2 uppercase text-asphalt bg-white p-2 border-2 border-asphalt inline-block transform -rotate-1">Space Mono</h3>
              <p className="text-asphalt/70 text-sm font-mono mt-4 break-words">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>abcdefghijklmnopqrstuvwxyz<br/>0123456789</p>
            </div>
          </div>
          
          <div className="space-y-10 border-l-0 lg:border-l-2 border-asphalt/10 pl-0 lg:pl-12">
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-1 uppercase tracking-widest">H1 / Hero Headline</p>
              <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl text-asphalt uppercase leading-none">Loud & Clear</h1>
            </div>
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-1 uppercase tracking-widest">H2 / Section Title</p>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl text-asphalt uppercase">Culture Drops</h2>
            </div>
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-1 uppercase tracking-widest">H3 / Card Title</p>
              <h3 className="font-headline text-2xl md:text-3xl text-asphalt uppercase">Wear Your Words</h3>
            </div>
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-1 uppercase tracking-widest">H4 / Small Heading</p>
              <h4 className="font-headline text-xl text-asphalt uppercase tracking-wide">Minimal Design</h4>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t-2 border-asphalt/10 pt-16">
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-2 uppercase tracking-widest">Body Large / Intro</p>
              <p className="font-mono text-lg md:text-xl text-asphalt leading-relaxed">
                We are redefining the intersection of streetwear and typography. Every collection is a deliberate exploration of context and form.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-2 uppercase tracking-widest">Body Regular / Default Text</p>
              <p className="font-mono text-base text-asphalt leading-relaxed">
                By isolating single words from broader cultural contexts, we force the viewer to re-evaluate their meaning. The garment becomes a canvas for dialogue, challenging preconceived notions of fashion as mere decoration.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-2 uppercase tracking-widest">Body Small / Meta & Captions</p>
              <p className="font-mono text-sm text-asphalt leading-relaxed opacity-80">
                Heavyweight 300gsm jersey. Boxy fit. Screen printed by hand. Limited to 100 pieces worldwide.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-asphalt/50 mb-2 uppercase tracking-widest">Quote Style</p>
              <blockquote className="font-mono text-xl md:text-2xl text-asphalt border-l-4 border-brand pl-6 italic bg-pure p-6 shadow-brutal-black border-y-2 border-r-2 border-asphalt transition-colors duration-300">
                "Fashion fades, but a strong statement is permanently etched into the cultural memory."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* 07. Patterns & Animations */}
      <section id="patterns" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-asphalt/20">
        <h2 className="font-headline text-4xl md:text-5xl text-asphalt mb-12 border-b-2 border-brand pb-4 transition-colors duration-300">
          <span className="bg-brand text-asphalt px-2 inline-block border-2 border-asphalt transition-colors duration-300">07.</span> Patterns & Animations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-asphalt">Background: Lined Notepad</h3>
            <div className="h-48 border-4 border-asphalt shadow-brutal-black flex items-center justify-center p-8 transition-colors pattern-notebook">
              <div className="bg-brand text-asphalt p-2 font-headline text-xl border-2 border-asphalt transition-colors duration-300 transform -rotate-2">STREET LYRICS</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-asphalt">Background: Street Checker</h3>
            <div className="h-48 border-4 border-asphalt shadow-brutal-black flex items-center justify-center p-8 transition-colors" 
                 style={{ backgroundColor: '#F4F4F0', backgroundImage: 'repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%, #111111), repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%, #111111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
              <div className="bg-pure text-asphalt p-2 font-headline text-xl border-2 border-asphalt transform rotate-1">VANS VIBE</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-asphalt">Background: Caution Tape</h3>
            <div className="h-48 border-4 border-asphalt shadow-brutal-black flex items-center justify-center p-8 transition-colors" 
                 style={{ background: 'repeating-linear-gradient(-45deg, var(--color-brand), var(--color-brand) 20px, #111111 20px, #111111 40px)' }}>
              <div className="bg-pure text-asphalt p-2 font-headline text-xl border-2 border-asphalt">WARNING</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-asphalt">Animation: Core Glitch</h3>
            <div className="h-48 bg-pure border-4 border-asphalt shadow-[4px_4px_0_0_var(--color-brand)] transition-shadow duration-300 flex items-center justify-center p-8 relative overflow-hidden">
              <div className="glitch-wrapper font-headline text-5xl tracking-widest transition-colors duration-300">
                <div className="glitch-text" data-text="CULTURE">CULTURE</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
