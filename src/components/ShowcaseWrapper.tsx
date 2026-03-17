import React, { useState } from 'react';
import { Code, Copy, Download } from 'lucide-react';

interface ShowcaseWrapperProps {
  children: React.ReactNode;
  codeString: string;
  svgString?: string;
  downloadName?: string;
  onCopy: (text: string, msg: string) => void;
  className?: string;
  title?: string;
}

export const ShowcaseWrapper: React.FC<ShowcaseWrapperProps> = ({ children, codeString, svgString, downloadName = 'asset.svg', onCopy, className = '', title }) => {
  const [showCode, setShowCode] = useState(false);

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`group relative border-2 border-asphalt bg-pure flex flex-col shadow-[4px_4px_0_0_#111111] hover:shadow-[6px_6px_0_0_var(--color-brand)] transition-all duration-300 ${className}`}>
      {title && (
        <div className="border-b-2 border-asphalt bg-bglight px-3 py-2 font-mono text-xs font-bold uppercase flex justify-between items-center text-asphalt">
          {title}
        </div>
      )}
      <div className="relative p-6 flex-grow flex items-center justify-center w-full">
        {children}
      </div>
      
      {/* Toolbar */}
      <div className="border-t-2 border-asphalt bg-bglight p-2 flex justify-between items-center flex-wrap gap-2">
        <button 
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs font-bold font-mono uppercase bg-pure text-asphalt border-2 border-asphalt hover:bg-asphalt hover:text-pure transition-colors"
        >
          <Code size={14} /> {showCode ? 'Hide' : 'Code'}
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => onCopy(codeString, 'Code copied!')}
            className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs font-bold font-mono uppercase bg-brand text-asphalt border-2 border-asphalt hover:bg-asphalt hover:text-brand transition-colors"
          >
            <Copy size={14} /> Copy
          </button>
          {svgString && (
            <button 
              onClick={handleDownloadSvg}
              className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs font-bold font-mono uppercase bg-pure text-asphalt border-2 border-asphalt hover:bg-asphalt hover:text-pure transition-colors"
              title="Download SVG"
            >
              <Download size={14} /> SVG
            </button>
          )}
        </div>
      </div>

      {/* Code View */}
      {showCode && (
        <div className="border-t-2 border-asphalt bg-asphalt text-pure p-4 overflow-x-auto text-xs font-mono text-left">
          <pre><code>{codeString}</code></pre>
        </div>
      )}
    </div>
  );
}
