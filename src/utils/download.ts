import { toPng, toJpeg, toSvg } from 'html-to-image';

// Cache for embedded font CSS (fetched once, reused)
let fontEmbedCSSCache: string | null = null;

/**
 * Fetch Google Fonts CSS, download each font file as base64,
 * and return a CSS string with inline @font-face declarations.
 */
async function getEmbeddedFontCSS(): Promise<string> {
  if (fontEmbedCSSCache) return fontEmbedCSSCache;

  try {
    // Fetch the Google Fonts CSS (use a browser-like User-Agent to get woff2 URLs)
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Syne:wght@700;800&display=swap';
    const res = await fetch(fontUrl, {
      headers: {
        // Google Fonts returns different formats based on User-Agent
        // Use a modern browser UA to get woff2
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    let css = await res.text();

    // Find all url(...) references to font files
    const urlRegex = /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g;
    const urls = new Set<string>();
    let match;
    while ((match = urlRegex.exec(css)) !== null) {
      urls.add(match[1]);
    }

    // Fetch each font file and convert to base64 data URL
    for (const fontFileUrl of urls) {
      try {
        const fontRes = await fetch(fontFileUrl);
        const blob = await fontRes.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        css = css.split(fontFileUrl).join(base64);
      } catch (e) {
        console.warn(`Failed to embed font: ${fontFileUrl}`, e);
      }
    }

    fontEmbedCSSCache = css;
    return css;
  } catch (e) {
    console.warn('Failed to fetch Google Fonts CSS, falling back to skipFonts', e);
    return '';
  }
}

async function getOptions() {
  const fontEmbedCSS = await getEmbeddedFontCSS();

  if (fontEmbedCSS) {
    // We have embedded fonts — don't skip fonts, don't filter font links
    return {
      skipFonts: true, // skip auto-detection (we provide our own)
      fontEmbedCSS, // inject our manually embedded fonts
      filter: (node: HTMLElement) => {
        // Still filter out Google Fonts <link> tags to avoid CORS errors during auto-embed
        if (node.tagName === 'LINK' && node.getAttribute('href')?.includes('fonts.googleapis.com')) {
          return false;
        }
        return true;
      }
    };
  }

  // Fallback: skip fonts entirely
  return {
    skipFonts: true,
    filter: (node: HTMLElement) => {
      if (node.tagName === 'LINK' && node.getAttribute('href')?.includes('fonts.googleapis.com')) {
        return false;
      }
      return true;
    }
  };
}

export const downloadSvg = async (element: HTMLElement, filename: string) => {
  const opts = await getOptions();
  const dataUrl = await toSvg(element, opts);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.svg`;
  link.click();
};

export const downloadImage = async (element: HTMLElement, format: 'png' | 'jpg', filename: string, size?: { width: number; height: number }) => {
  const opts = await getOptions();
  const sizeOptions = size ? {
    canvasWidth: size.width,
    canvasHeight: size.height,
  } : {};

  let dataUrl: string;
  if (format === 'png') {
    dataUrl = await toPng(element, { ...opts, ...sizeOptions });
  } else {
    dataUrl = await toJpeg(element, { ...opts, ...sizeOptions, backgroundColor: '#ffffff' });
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.${format}`;
  link.click();
};

// Export getOptions for use in SocialMediaKit ZIP generation
export { getOptions as getDownloadOptions };
