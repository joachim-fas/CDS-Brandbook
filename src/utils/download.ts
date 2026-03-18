import { toPng, toJpeg, toSvg } from 'html-to-image';

const options = {
  skipFonts: true,
  filter: (node: HTMLElement) => {
    // Exclude Google Fonts links to avoid CORS errors
    if (node.tagName === 'LINK' && node.getAttribute('href')?.includes('fonts.googleapis.com')) {
      return false;
    }
    return true;
  }
};

export const downloadSvg = async (element: HTMLElement, filename: string) => {
  const dataUrl = await toSvg(element, options);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.svg`;
  link.click();
};

export const downloadImage = async (element: HTMLElement, format: 'png' | 'jpg', filename: string) => {
  let dataUrl: string;
  if (format === 'png') {
    dataUrl = await toPng(element, options);
  } else {
    dataUrl = await toJpeg(element, { ...options, backgroundColor: '#ffffff' });
  }
  
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.${format}`;
  link.click();
};
