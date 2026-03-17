import React from 'react';
import { LogoSVG } from '../LogoSVG';

export function Home() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="w-full max-w-3xl mb-12 text-asphalt drop-shadow-[3px_3px_0_var(--color-brand)] transition-all duration-300 hover:translate-y-1 hover:drop-shadow-[2px_2px_0_var(--color-brand)] cursor-pointer">
        <LogoSVG />
      </div>

      <p className="text-lg md:text-xl text-asphalt max-w-3xl mt-4 border-l-4 border-brand pl-6 text-left font-mono font-medium transition-colors duration-300 bg-pure/80 backdrop-blur-sm p-6 border-y-2 border-r-2 border-asphalt shadow-brutal-black leading-relaxed">
        Culture Drops doesn’t turn pop culture into merch, but into markers. We curate iconic lines and translate them into a <span className="bg-brand px-1 border border-asphalt font-bold">One Word Series</span>: one shirt carries one word, and the full quote emerges either over days, or collectively when a crew wears the line together. This turns a reference into a ritual, and a statement into a moment that lasts. <span className="underline decoration-brand decoration-4 underline-offset-4">Minimal in design, clear in attitude: curated instead of random, meaning instead of noise.</span>
      </p>
    </div>
  );
}
