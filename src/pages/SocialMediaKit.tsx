import React, { useState, useRef, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { LogoSVG } from '../LogoSVG';
import { Download, FolderDown, Upload, Image as ImageIcon, Film, Play, Pause } from 'lucide-react';
import { downloadImage, getDownloadOptions } from '../utils/download';

interface SocialMediaKitProps {
  themeColors: Record<string, string>;
  currentHex: string;
  currentTheme: string;
  handleCopy: (text: string, message: string) => void;
}

interface AssetFormat {
  id: string;
  platform: string;
  label: string;
  width: number;
  height: number;
  safeZone?: { top?: number; bottom?: number; left?: number; right?: number; label: string };
}

const formats: AssetFormat[] = [
  // YouTube
  { id: 'yt-icon', platform: 'youtube', label: 'Kanal-Icon', width: 800, height: 800 },
  { id: 'yt-banner', platform: 'youtube', label: 'Channel Banner', width: 2560, height: 1440, safeZone: { top: 509, bottom: 509, left: 507, right: 507, label: 'Desktop Safe Zone: 1546 × 423 px' } },
  { id: 'yt-thumb', platform: 'youtube', label: 'Video-Thumbnail', width: 1280, height: 720 },
  // Instagram
  { id: 'ig-profile', platform: 'instagram', label: 'Profilbild', width: 1080, height: 1080 },
  { id: 'ig-feed', platform: 'instagram', label: 'Feed-Post (4:5)', width: 1080, height: 1350 },
  { id: 'ig-story', platform: 'instagram', label: 'Story / Reels', width: 1080, height: 1920, safeZone: { top: 310, bottom: 310, left: 0, right: 0, label: 'Safe Zone: 310 px oben + unten' } },
  // TikTok
  { id: 'tt-profile', platform: 'tiktok', label: 'Profilbild', width: 1080, height: 1080 },
  { id: 'tt-video', platform: 'tiktok', label: 'Video-Cover', width: 1080, height: 1920, safeZone: { top: 130, bottom: 250, left: 0, right: 130, label: 'Safe Zone: 130 px oben, 250 px unten' } },
  // Pinterest
  { id: 'pin-profile', platform: 'pinterest', label: 'Profilbild', width: 1080, height: 1080 },
  { id: 'pin-standard', platform: 'pinterest', label: 'Standard-Pin (2:3)', width: 1000, height: 1500 },
];

const platformLabels: Record<string, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
};

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#111111' : '#FFFFFF';
}

// Proportional scaling: base px at 1080px width
function sc(width: number, base: number): number {
  return Math.round(base * width / 1080);
}

// Load LogoSVG as an HTMLImageElement with explicit fill color (for canvas drawing)
const LOGO_SVG_VIEWBOX = '0 0 614.7 308.13';
const LOGO_SVG_PATHS = [
  'M433.02,4.35c-.09.42.26.92.23,1.35-2.35,7.15-5.08,11.01-5.95,19.01,2.18-2.74,4.74-2.76,6.42-4.54l4.81-5.09c3.74-3.72-2.92,9.59-2.15,8.03-.64,1.29-3.06,3.42-2.19,4.88,2.22,1.67,2.41,4.04,1.54,6.56,4.44-.41,7.48-3.27,11.44-4.73,8.97-3.31,17.56-7.37,26.79-9.66,5.16-1.28,10.34-3.04,15.59-3.21,5.23-.16,17.92,1.27,22.22,4.82l4.41,3.63c.71.58,1.13,1.97,2.2,2.35,4.27,6.49,5.08,14.24,3.35,21.77-.22.95-1.15,2.12-1.02,3.12-9.32,18.03-30.43,28.68-50.16,32.63.54,2.82,2.26,4.28,3.53,6.43,8.54,14.4,17.51,28.35,28.11,41.56,3.38.2,4.91-4.08,5.71-6.78l3.73-12.68c2.53-8.62,4.77-16.97,8.2-25.33.25-.6.1-1.21.08-1.59s-.56-.67-.94-.56c-1.9.57-1.12,5.86-4.98,9.17.12-.89.45-2.03.02-2.91,4.42-7.84-.93-15.14,2.18-20.38,3.18-5.35,13.75-4.94,13.24-8.62-.03-.19-.02-.48.05-.65.74.39.75-.37.69-.84.25-.34.91-1.03.75-1.48.47,0,.91-.99,1.23-.79,1.01.61-.48,1.35.97,3.12,1.73-5.13,4.09-10,7.06-14.88.67-1.11.79-2.51-.84-3.11l-6.34,15.06c-1.64-2.37,1.03-3.73,1.31-5.62.34-2.36,1.53-4.93,2.04-7.18-1.13-1.45-4.51-1.87-5.12-4.13-.78-2.9-.27-5.67-.22-8.32,3.23-4.15,8.01-5.78,12.91-8.16l4.1-1.99c2.64-.29,5.9-.8,5.7-3.91.47-.23,1.54-.66,1.45-1.38,2.14-.66,4.28-1.41,6.2-2.6,1.03-.21,2.08-.24,3.12-.11.27.07.51.29.78.33.23.03.55.12.78.07.31.55.96.66,1.55.69.3.3,1.07.78,1.5.78.31.97.5,4.15,2.38,3.97,11.64-1.1,22.85-1.91,34.36-3.63,4.11-.62,8.42.72,8.85,5.06.19.76-.48,1.6-.37,2.32-4.46,1.75-1.15,11.15-9.52,11.27-3.61.05-6.98.92-10.6,1.27l-29.6,2.88c-2.16,2.24-9.01,16.56-8.77,19.66h21.91c3.35,0,6.44-.15,9.31.77.62,1.19.97,2.47.93,3.82-1.34,1.51-.36,3.77-.82,5.64l-.76.7c-2.58-.8-2.9,2.9-4.16,3.55-5.24,3.34-36.02,3.83-38.36,7.02s-3.47,7.1-5.02,10.81c-1.13,2.7-2.96,4.91-3.18,7.61-.02.21,0,.45.02.66-.78.19-1.2.96-1.49,1.94l-5.08,17.14,20.13-7.67,11.09-4.36,12.76-4.61c4.82-1.74,9.25-3.8,14.05-4.22.23-.02.49.16.72.21-.06.8-.07,1.61-.03,2.41-.32.15-.47.76-.78.86-2.39.65-3.9,3.04-6.27,4.18.86,1.58,2.44,4.09,1.12,5.2-4.04,3.38-8.65,5.57-13.46,7.8l-50.45,23.5c-1.99.92-4.15,1.81-5.1,3.77,3.54,4.62,9.09,8.34,10.5,14.25.22,2.59-4.77,2.07-7.57,1.38,3.88,7.99,3.29,16.21.19,23.9-2.27,5.64-6.29,16.79-15.03,13.67-1.36-.48-2.56-2.37-4.27-1.58-.25-.89-1.03-1.64-1.24-2.56-.9-4.18,7.23-16.5,4.1-16.97-10.58,5.38-19.99,12.57-29.14,19.86-3.14,2.5-5.21,5.75-8.47,7.96-1.5,1.02-2.36,2.12-2.34,3.72.03,2.17,1.91,2.66,4.1,2.65,10.55-.06,31.71-2.55,36.25,8.68s-1.3,20.33-9.04,27.98c-6,5.93-11.97,11.37-19.17,15.98-2.18,1.39-3.89,3.35-6.33,4.57l-20.2,10.07c-8.21,4.09-16.66,6.88-24.8,11.21-6.67,3.55-12.92,7.31-19.66,10.75l-5.7,2.91c-.27.01-.54-.06-.8-.03.13-.93-.48-3.06.65-3.91l6.14-4.6c1.72-1.29,2.88-2.19,4.54-3.57l6.67-5.54c-5.48-.35-17.59,10.59-22.55,10.56,0-1.46,1.7-1.48,2.69-2.44,2.68-2.6,5.27-4.78,8.13-6.71.9-.61,1.73-1.35,2.3-2.29.68.12,1.12-.6,1.63-.81,7.39-3.04,13.88-7.7,21.17-11.83,14.6-8.26,28.75-16.87,41.44-27.86,4.89-4.23,9.43-8.15,13.49-13.03.63-.76.31-2.35-.05-2.89s-1.59-1.01-2.69-1.01l-23.36.03c-5.26,0-10.48-2.43-12.87-6.23-9.04-14.37,4.44-24.32,13.97-32.93,2.44-2.2,4.7-3.65,7.42-5.44,3.24-2.14,5.81-4.98,9.44-6.9,17.58-9.29,7.85-8.86,12.29-11.3,4.91-2.7-1.46,2.71,9.38-2.9,4.76-2.47,9.05-3.66,14.7-4.25l-6.71-2.35c-9.34-3.28-16.73-8.24-21.57-16.85-1.29-2.29-2.16-3.75-2.28-6.82-.16-4.29-4.17-7.62-6.4-10.97l-6.31-9.51c-1.81-2.73-3.29-5.85-6.74-6.9l18.44,27.84c-7.04-3.71-10.12-10.8-14.26-16.59-3.74-5.24-7.98-9.42-10.92-16.09l-14.27,34.56c-1.19,2.89-2.89,5.38-3.91,8.41-.64,1.89-1.95,3.52-3.76,3.32l-.59-.63c-1.6-6.83,5.91-8.85,3.36-15.42-.95.16-1.89.74-2.26.42-.51-.45-.48-1.11-.82-2.17-1.46,1.44-3.11,3.1-3.32,5.55s-6.02,11.91-7.87,13.66c-.76-.07-1.48-.66-2.25-.69,2.56-11.18,6.65-12.71,9.03-26.33.19-1.11.94-2.74,1.45-4.24l16.68-49.5c.94-2.78,2.35-5.16,1.82-8.05l-2.5,2.17c-.54.46-1.58-.31-2.31-.55-.46-1.51.21-3.18.53-4.64,2.42-1.64,4.01-4.66,4.72-8.16l-19.6,7.79c-3.11,7.23-4.73,14.08-7.03,21.35l-11.04,34.88c-2.03,6.4-4.75,11.9-8.18,17.65-2,3.35-1.99,8.04-4.74,10.91-1.1,1.15-3.72.42-4.66,1.67-.72-.28-1.85-.31-2.41-1.04.43-8.47-1.99-4.97-2.41-7.1-1.1-5.56.15-10.73,1.39-16.79-3.38,1.91-5.58,4.95-7.87,8.05-8.22,11.13-24.12,23.15-38.44,13.28s-8.48-40.15-3.15-54.92c3.87-10.73,6.9-21.49,11.9-31.68,2.08-4.23,4.84-7.76,6.34-12.57-9.35,1.52-18,3.17-27.23,3.17-2.34,0-3.7,1.72-4.39,3.75-8.12,23.91-20.42,45.18-29.38,69.52-3.06,8.33-6.2,16.29-7.93,24.9l-4.22,21.01c8.88,6.02,11.65,16.36,7.31,25.77-6.61,14.34-18.99,20.36-32.88,25.83-3.52,1.39-6.63,2.05-10.94,2.56,12.26,20.45,25.03,39.08,39.52,57.04,2.58,3.2,5.62,5.52,6.27,9.47-.22,2.17-2.82,1.2-4.11,1.94l-21.05-8.34c-6.41-2.54-11.24-8.92-13.58-15.5-.71-1.98.04-3.96-1.46-6.06l-16.79-23.6c-1.38,4.54,14.45,20.88,16.28,27.58-5.81-3.75-8.5-9.86-12.25-15.21-2.74-3.91-5.74-7.6-8.24-11.57-2.91,2.39-2.76,5.53-3.99,8.34-2.44,5.61-4.81,10.98-6.82,16.72-1.37,3.91-3.8,7.16-4.59,10.94-.04.2-.11.51-.06.71-.9-.28-.73,1.03-.82,1.58-1.1.65-1.95-.07-3.02-.1-1.2-5.12,6.04-11.9,2.82-13.54-.41-.21-1.17.92-1.53.69-.58-.37-.82-1.17-1.61-1.95-1.97,1.89-2.43,4.65-3.69,7.17-1.35,2.71-3.35,4.93-3.77,7.71-.28.11-.51.62-.78.8-.64.08-1.25.33-1.66.83-.23-.14-.68-.12-.96-.15-.04-1.25.02-2.5.19-3.75,3.09-6.16,5.27-12.44,7.57-19.33l16.71-49.88c1.74-5.19,4.25-9.64,5.42-14.9-1.94-.4-1.2,1.65-1.88,2.52-4.41,5.7-2.77,9.26-5.45,10.62-.52.27-1.75.05-1.76-.77-.09-4.29,3.3-6.2,4.59-10.33-5.41,2.04-10.24,3.7-15.27,6.33-1.97,8.07-4.57,16.16-9.23,23.26-2.37,3.62-5.45,6.51-8.04,9.92-7.94,10.49-16.95,19.27-27.42,27.17l-15.58,11.77-16.92,12.73c-6.26,4.71-12.52,9.21-20.2,12.27l13.05-10.12-33.83,18.34c-1.09.59-3.07,1.01-3.78.28-.6-.62-2.06-2.02-1.47-2.93,1.93-2.9,5.65-3.21,8.06-5.3,3.05-2.64,6.33-4.56,9.48-6.99,2.29-1.76,3.69-4.49,6.74-5.69.61-.24.98-1.17,1.08-1.57.07-.27-.41-1.34-.83-1.11l-14.05,7.57c-4.16,2.24-8,4.21-11.89,6.99-.63.45-1.92.48-2.67.7-.5.15-.95-.67-1.07-1.37,0-.44.33-.91.26-1.35,6.19-2.15,14.05-9.79,20.36-13.66,2.32-1.42,3.71-2.92,5.55-4.81,2.25-2.31,6.43-2.83,8.13-5.84,1.22-2.16,1.72-5.4,2.36-7.89l4.92-19.12c-4.49,4.28-11,27.27-13.53,28.24-1.37.52-4.3.12-5.49-1.54-2.84-3.98-1.41-9.19.05-13.8,6.45-20.34,14.11-39.63,21.91-59.49l6.12-15.59c-7.23.76-11.68,5.05-17.43,7.26-2.77,1.06-5.88,1.01-8.09,3.32-1.72,0-3.88.27-5.15-1.35l.96-3.62,5.5-5.47c-3.62-.56-4.53,2.34-6.89,2.48-.47-.79-2.33-1.26-1.31-2.96s1.68-3.39,2.03-5.05c7.09-3.67,13.49-8.56,21.36-11.45,6.11-2.25,12.08-4.02,17.67-6.54.41.13,1.01-.07,1.45-.06.85.02,2.33.37,2.67-.65,1.37-.34,3-.8,4.42-.78.81-.07,2.03.32,2.44-.59l1.47-.2c14.1-1.91,38.25-1.65,48.28,11.79,7.83,10.5,6.04,18.84,10.88,15.46,5.62-3.93,11.84-5.47,17.94-8.28,11.05-5.09,22.15-8.7,34.85-9.48.85-5.86.7-11.29,1.96-16.93l2.28-10.2c.87-3.89,2.03-7.37,2.79-11.22.24-1.21,2.74-3.18,1.08-4.35-.93-.59-3.95.09-4.69.91-1.14,6.15-9.22,4.7-12.86,7.61,2.66,1.47,5.07-1.83,6.99.3-17.45,7.45-34.74,10.78-52.4,18.79-1.67,1.8-1.78,6.83-4.84,7.12s-9.88-1.94-13.52-4.16c-.89-.54-.56-2.59-1.65-2.57-1.72.03-4.84,1.35-6.41-.65-.81-1.03.91-2.5.72-3.36-.63-1.5-2.6-3.04-2.48-4.9.21-.41-.11-1.08.06-1.52,1.39-1.19,3.01-2.08,4.99-2.86l7.37-2.89c2.14-11.18,6.42-21.34,10.79-31.84,1.06-2.56,2.68-5.04,2.16-7.88-2.47,3.92-4.45,7.83-5.56,11.86-1.37,4.97-3.05,4.76-6.38,13.96-2.03-.93.27-3.06.08-4.46,1.76-2.23.66-5.61,1.78-8.24,1.33-3.13,6.07-12.13,7.48-15.21l14.52-31.51c1.5-3.26,2.97-5.95,4.92-8.9,3.62-5.5,4.75-12.61,9.25-17.49,1.8-1.95,2.14-3.76,3.54-6.01,2.67-4.29,10.45-4.97,14.77-2.79s-1.94,14.58-2.6,16.48c-3.78,10.91-8.3,20.91-12.98,31.49-6.2,13.99-11.49,27.71-16.73,41.9-1.4,3.78-3.04,7.05-3.83,11.55l24.74-6.15c3.21.12,6-1.11,9.02-1.77,8.75-1.9,17.29-1.96,26.68-2.44l21.89-52.06c1.15-2.73,3.03-4.31,3.46-8.13-7.67,1.94-16.03.98-23.95,3.51-5.92,1.89-12.35-.29-14.28-6.47-.64-2.05-.8-5.7-.31-7.84,1.34-5.77,23.68-8.55,30-9.75,14.62-2.78,28.84-5.63,43.74-6.68,3.94-.28,7.36-.92,11.14-1.21l29.58-2.32c1.85-.14,3.33.81,4.76,1.42,6.11-3.02,13.88-4.77,20.75-2.62,1.71.54,1.15,3.78.34,4.47l-1.68,1.44c-4.14.73-16.69-2.98-16.79,2.9-.05,2.7,6.27.02,9.61,1.85-.33.35-.47,1.15-.73,1.59-.5-.05-1.12.09-.74.75l-.68.12-8.58,1.07c-1.57.19-2.78,1.25-4.09,1.73,1.86.85,3.21-.57,4.86.7-4.99,1.54-10.02,2.07-15.47,3.22-1.31.28-1.23,3.62-.25,4.08,1.24.58,3.81-1.02,4.6.46,1.02,1.9.44,5.76-.65,8.18-8.24,18.42-14.85,36.93-18.7,56.92-.85,4.43-1.41,10.23,1.13,13.77,6.59,4.34,27.73-30.22,31.3-35.76,4.36-6.76,8.92-13.05,12.57-20.17l5.3-10.34,12.13-24.54c1.97-3.99,12.2-16.42,11-19.58-.06-.15,0-.35,0-.52.2,3.42,3.75-6.83,3.14-6.37.59.21,1.36-.22,1.97-.11ZM496.61,40.07l-.15-.51c-.95-3.27-5.49-3.37-9.01-2.7-4.07.77-21.44,2.84-22.58,5.4-1.84,4.1,4.64-.95,7.58,2.13,1.32,1.38.5,3.12-.38,4.92-1.32,2.69-1.19,5.72-2.12,8.59-1.18,3.64-2.86,7.03-3.3,10.91,10.2.15,44.35-15.61,32.48-28.26-.45-.48-1.98-.26-2.52-.49ZM459.05,106.18c0-.22-.17-.39-.39-.39s-.39.17-.39.39.17.39.39.39.39-.17.39-.39Z',
  'M279.19,161.63c-1.03-2.75-1.28-4.35-1.88-6.76-1.75,1.56-2.62,3.51-2.34,5.52.66.91,2.89.96,4.22,1.24Z',
  'M122.52,260.55c20.84-13.41,38.81-28.45,54.3-46.39,7.94-9.19,19.05-24.95,10.49-36.71-5.12-7.03-20.22-8.69-28.12-7.56-2.63.38-5.59-.45-7.75,1.41,1.78,2.51,4.2,6.21,2.89,9.23l-14.11,32.37c-.86,1.98-2.07,3.35-2.85,5.22l-13.18,31.51c-.67,3.75-2.88,7.2-1.67,10.92Z',
  'M270.27,179.39c-.54-.01-1.64,1.15-2.06.94-2.19-1.07-1.94-2.01-3.9-4.25-7.91.71-15.7,1.75-23.23,4.92.36,3.49,5.08-1.78,7.63.39.63.54.96,1.8.61,2.97l-5.66,18.87c7.14,2.2,39.28-14.77,26.6-23.85Z',
  'M351.87,295.53c-.08-.54-.33-1.04-.5-1.56.42-4.94,2.29-9.62,2.11-14.9l-4,3.53c-1.44-3.94.34-7.32,1.25-10.93,2.02-8.01,4.88-15.39,7.44-23.25.95-2.91,1.83-5.89.06-8.38-1.41-1.99-3.86-3.16-5.76-3.51-.75-6.77,10.7-3.21,12.17-7.14l5.95-16.01c.92-2.46.86-4.72,2.2-7.1,2.82-5.05,4.11-10.67,6.64-16.14-3.15-.75-14.14,7.63-15.6,1.59-.51-2.09.18-4.47-.65-6.25-1.18-2.55,1.94-2.71,2.39-3.77,1.08-2.56.83-4.99,3.74-6.54,16.06-8.54,41.63-15.54,59.08-7.96,2,.87,5.27,2.3,6.79,3.81,10.41,10.38,9.58,26.22.7,37.2-12.19,15.07-37.44,31.2-56.97,34.26-1.83,1.84-1.62,4.22-2.58,6.37l-14.25,31.65c-1.55,3.44-5.84,16.9-10.19,15.05ZM386.74,222.52c11.95-5.58,22.07-12.23,31.59-19.93,4.24-3.43,8.76-10.32,6.53-15.91-2.83-7.08-19.71-6.34-26.86-3.37,3.21,2.26,2.44,4.92,1.27,7.74l-5.26,12.65c-2.61,6.27-5.61,11.97-7.27,18.82Z',
  'M67.32,300.21c0-.29.07-.61,0-.89,1.31-1.48,3.28-1.97,5.01-3.29s3.57-3.29,5.89-1.46c.45.36.56,1.36,1.12,1.62.66.3,1.46.07,2.23-.5.92,3.35-1.49,4.47-3.77,5.74-2.69,1.49-4.54,1.89-7.23.42-.53-.29-2.11,1.29-2.72.36-.31-.47-.51-1.26-.53-1.99Z',
  'M388.51,301.04c.14,1.85,1.79,2.06,3.91,2.85-1.19,1.51-2.79,1.07-2.85,2.4-.34.5-1.44.88-1.59,1.63-2.4-.21-5.16.99-7.09-.74.21-1.02.31-2.16.86-3.08.23-.38,1.04-.66,1.07-1.23.59-.13,1.4-.07,2-.27.4-.13,1.13-.21.98-.79l2.7-.77Z',
  'M78.91,65.86c-.25-.18-.48-.38-.69-.61-1-3.68-1.88-7.9.03-11.55,2.33-4.47,12.29-25.83,9.13-28.79-2.31-2.18-13.81,6.93-16.45,9.2-13.87,11.93-24.34,26.73-32.61,43.03-7.35,14.49-14.15,27.88-13.54,45.15.11,3.25,1.28,8.73,4.83,9.75,14.8,4.25,37.76-16.34,48.37-25.54,4.55-3.94,9.09-7.72,12.52-12.2.19-.25.62-.62.9-.77,2.27-1.17,4.08-3.55,5.36-5.74,2.21-.3,3.7-4.02,6.09-2.28-.04.51-.03,1.03,0,1.55-.39.6-1.14,1.59-.86,2.38-3.25,4.41-5.96,9.01-10.7,12.51-1.31.97-1.16,3.33-2.33,4.49-1.85,1.84-4.17,4.2-4.23,6.61,3.83,2.84,5.13-3.12,8.06-4.9.36.65,1.14,1.12.94,2.02-.39.22-2.46,1.1-2.24,1.42l1.15,1.69c1.23,1.81-34.52,45.94-65.52,42.13-8.44-1.04-16.61-5.86-21.47-12.97-10.02-14.68-5.27-46,3.04-61.1l.16,5.02,8.51-16.31c7.21-13.83,12.59-24.37,23.81-35.45.92-.91,1.35-2.53,1.63-3.82-4.49,2.81-7.1,6.82-10.92,11.09-.87-1.48.69-2.64.83-3.86.33-.08.56-.61.82-.82,4.19-3.39,7.26-7.91,10.84-11.93.26-.29.51-.78.84-.97,3.22-1.83,6.88-4.73,9.27-7.39,1.16-.29,2.44-1.94,3.34-2.51l4.26-2.69c8.59-5.41,17.56-9.5,28.24-8.48,5,.48,10.41,3.37,13.71,6.99s4.87,8.83,5.61,13.47c1.01,6.31-1.29,12.01-2.88,17.7-2.42,8.66-6.06,16.07-11.39,23.07-2.38,3.12-4.15,5.53-9.03,4.55-6.48-1.3-1.53-6.74-7.43-3.15Z',
  'M203.05,12.84c-1.88,3.76-3.18,8.04-3.65,12.43,1.91-2.24,2.83-4.68,5.75-3.36,1.5-1.27,2.33-2.72,3.26-4.12.3-.44,1.09-.52,1.49-.84l.82.71c.11.43-.11.93.03,1.35-2.16,2.33-2.99,5.63-4.68,8.62,2.62,2.27,2.12,4.75,1.15,7.38l-7.54,20.45c-2.61,7.08-4.92,13.83-7.15,21.06l-10.52,34.05c-2.16,7-5.94,12.85-8.52,19.55l-3.92,10.21c-1.89,4.92-7.44,3.24-7.22,3.4-.83-.59-1.22-1.84-1.64-2.88.05-.45-.26-1.11-.23-1.58.04-.66-.03-1.4-.58-1.85-.39-.32-.94-.37-1.42-.42l-.67-.06c-.78-5.43.82-10.62,1.14-16.54-3.69,1.88-5.26,4.78-7.34,7.46-5.81,7.47-13.03,13.22-22.09,16.12-3.94,1.26-7.5.49-11.19-1.05-8.77-3.64-3.46-2.09-10.42-6.91.02-.21-.06-.43-.06-.64-2.42-2.63-2.43-6.05-2.88-9.74-1.85-15.31,1.39-22.38,1.17-26.88-.01-.26.04-.53.06-.78,1.29-.21,1.32-1.62,1.65-2.92,1.92-7.51,10.86-32.38,10.91-33.82l.03-.78c.59.21.67-.33.69-.75.01-.25.07-.54.02-.78,1.72-.8,1.81-3,2.31-4.67.24-.2.37-.58.63-.75.58-.38.83-.97.89-1.64.04-.53.75-1.2.62-1.73,1.91-.71,2.67-2.65,3.08-4.54.05-.21.23-.47.18-.67.88.27.7-1.04.91-1.56,2.94-4.49,7.87-6.67,13.16-5.44.14,1.5-.27,3.08.49,4.7,13.39-5.12-2.63,22.27-5.07,30.45-3.16,10.61-6.18,20.93-8.72,31.75-1.39,5.91-2.36,12.03.91,17.47,5.24-1.25,8.97-5.09,11.95-9.14l5.65-7.68c3.02-4.11,5.29-8.2,8.11-12.32,5.39-7.86,10.37-15.48,15.12-23.73l4.25-7.37,17.49-35.04c.2-.39,9.28-11.96,8.28-14.24,4.43-6.01,1.19-4.44,4.39-9.31,1.89,3.21.82,5.64-1.05,9.38Z',
  'M214.05,10.66c-2.46.32-3.66-1.88-3.2-4.16.55-2.7,3.38-5.44,6.05-6.19,1.31-.37,2.21.84,2.36,1.5.84,3.55-2.18,5.09-5.21,8.86Z',
  'M15.61,66.06l.06-.78c.3-.25.63-.52.81-.88.15-.29.15-.66.28-.96,1.2-.48,1.12-1.98,2.51-2.68-1.49,3.92-2.5,8.05-5.81,11.43.53-2.18,1.96-3.9,2.14-6.13Z',
  'M356.07,181.3c8.87,9.8.4,35.02-4.34,45.95-4.34,10.03-11.52,18.46-19.62,25.81-5.65,5.13-11.12,10.03-18.37,12.68-12.85,4.68-25.44-1.95-31.1-14.22-3.02-6.55-2.13-13.51-.88-20.75s2.18-13.66,5.03-20.14c4.92-11.16,11.01-20.78,19.68-29.42,6.68-6.66,30.04-27.72,38.03-14.74.88,1.42,2.29,2.4,2.47,3.95.21,1.76-.72,3.25-2.02,4.98,1.19,1.74,3.82,1.28,5,2.76,10.75,13.46,4.81,25.43,1.91,39.51,4.97-7.31,6-16.06,6.43-24.45.21-4.14-2.8-7.41-2.25-11.9ZM336.43,215.06c.17-.48.18-1.03.31-1.52.06-.22-.08-.49-.05-.72l2.13-3.13-.38,8.72c3.58-3.59,3.9-8.44,5.29-13.14,1.77-6.01,4.82-17.42-2.46-21.42-4.2-2.31-12.13.87-16.15,4.95-6.79,6.89-5.37,6.37-11.31,13.4-.71-.25-.94-.53-1.22-.51-2.53.19-19.17,31.8-12.38,45.93.94,1.95,3.17,3.15,5.38,2.09,2.92-1.4,6.4-2.25,9.01-4.38,9.84-8.04,17.64-18.62,21.83-30.28Z',
  'M438.1,5.92l.04-2.14c2.73.28,4.11-5.89,8.36-3.01,3.77,2.55-4.27,9.23-5.39,9.52-2.35.6-3.04-2.95-3.01-4.37Z',
  'M208.5,236.29c.23-1.04,1.43-1.86,1.51-3.04.04-.59.74-1.11.74-1.83,0-.99.56-2.03.28-3.04.53-.33.6-.99.63-1.57.72-.73.82-1.92.94-2.86,2.05-.72,1.15-3.17,1.42-4.95,1.44-3.07,2.25-6.55,4.32-9.23-.21,7.34-4.37,14.59-6.54,22.67l-2.97,11.09c-.86,3.2-1.43,6.24-4.15,8.27.7-6.07,2.16-8.03,3.83-15.53Z',
  'M439.74,72.77l-8.61,25.42c-1.41,4.17-1.96,8.29-3.77,12.51-1.69,3.94-2.82,8.27-3.37,12.15l-.86.9h-.78c.69-4.19,1.44-8.49,2.94-12.84l4.76-13.88c3.14-9.15,5.17-17.54,8.91-26.46.82.91.98,1.67.78,2.19Z',
  'M19.5,59.89c1.22-4.02,3.36-7.36,6.16-10.03-1.04,4.12-2.63,7.6-6.16,10.03Z',
];

async function loadLogoImage(fillColor: string): Promise<HTMLImageElement | null> {
  const paths = LOGO_SVG_PATHS.map(d => `<path fill="${fillColor}" d="${d}"/>`).join('');
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_SVG_VIEWBOX}">${paths}</svg>`;
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    return img;
  } catch (e) {
    console.warn('Failed to load logo image', e);
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

type BuilderLayout = 'fullbleed' | 'framed';

// ──────────────────────────────────────────────────────────
// Zone-based layout system: prevents overlap by assigning
// non-overlapping vertical zones to each element
// ──────────────────────────────────────────────────────────
interface ZoneLayout {
  logo: React.CSSProperties;
  headline: React.CSSProperties;
  bar: React.CSSProperties;
  photoFrame?: React.CSSProperties;
  logoBottom?: React.CSSProperties; // for framed: logo at bottom
  headlineFontSize: number;
  sublineFontSize: number;
}

function getZones(w: number, h: number, layout: BuilderLayout): ZoneLayout {
  const ratio = w / h;
  const isWide = ratio > 1.3;
  const isTall = ratio < 0.8;
  const minDim = Math.min(w, h);

  if (layout === 'fullbleed') {
    // Fullbleed zones (no overlap guaranteed):
    // Wide:   logo top-left 5-20%, headline bottom 55-85%, bar 88-100%
    // Tall:   logo top-center 3-18%, headline 68-86%, bar 88-100%
    // Square: logo top-left 4-22%, headline 62-85%, bar 88-100%
    if (isWide) {
      return {
        logo: { position: 'absolute', top: '5%', left: '4%', width: '15%', color: '#FFFFFF' },
        headline: { position: 'absolute', bottom: '15%', left: '4%', right: '35%', maxHeight: '28%', overflow: 'hidden' },
        bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '12%' },
        headlineFontSize: minDim * 0.12,
        sublineFontSize: minDim * 0.04,
      };
    } else if (isTall) {
      return {
        logo: { position: 'absolute', top: '4%', left: '50%', transform: 'translateX(-50%)', width: '40%', color: '#FFFFFF' },
        headline: { position: 'absolute', bottom: '14%', left: '6%', right: '6%', maxHeight: '18%', overflow: 'hidden' },
        bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '8%' },
        headlineFontSize: w * 0.08,
        sublineFontSize: w * 0.025,
      };
    } else {
      return {
        logo: { position: 'absolute', top: '5%', left: '5%', width: '28%', color: '#FFFFFF' },
        headline: { position: 'absolute', bottom: '15%', left: '5%', right: '5%', maxHeight: '22%', overflow: 'hidden' },
        bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '10%' },
        headlineFontSize: w * 0.07,
        sublineFontSize: w * 0.022,
      };
    }
  }

  // Framed zones (no overlap guaranteed):
  // Photo frame: top 6% to ~52%
  // Headline: 56% to 78%
  // Logo + Subline bar: bottom 4% height 14%
  if (isWide) {
    return {
      photoFrame: { position: 'absolute', top: '6%', left: '4%', right: '4%', bottom: '40%', overflow: 'hidden' },
      headline: { position: 'absolute', bottom: '18%', left: '4%', right: '35%', maxHeight: '18%', overflow: 'hidden' },
      bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '14%' },
      logo: { position: 'absolute', width: '18%' }, // used in bar
      logoBottom: { position: 'absolute', bottom: '3%', left: '4%', width: '15%' },
      headlineFontSize: minDim * 0.09,
      sublineFontSize: minDim * 0.03,
    };
  } else if (isTall) {
    return {
      photoFrame: { position: 'absolute', top: '5%', left: '6%', right: '6%', bottom: '38%', overflow: 'hidden' },
      headline: { position: 'absolute', bottom: '18%', left: '6%', right: '6%', maxHeight: '16%', overflow: 'hidden' },
      bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '12%' },
      logo: {},
      logoBottom: { position: 'absolute', bottom: '3%', left: '6%', width: '22%' },
      headlineFontSize: w * 0.065,
      sublineFontSize: w * 0.022,
    };
  } else {
    return {
      photoFrame: { position: 'absolute', top: '6%', left: '7%', right: '7%', bottom: '36%', overflow: 'hidden' },
      headline: { position: 'absolute', bottom: '16%', left: '7%', right: '7%', maxHeight: '16%', overflow: 'hidden' },
      bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '12%' },
      logo: {},
      logoBottom: { position: 'absolute', bottom: '2.5%', left: '7%', width: '22%' },
      headlineFontSize: w * 0.055,
      sublineFontSize: w * 0.02,
    };
  }
}

// ──────────────────────────────────────────────────────────
// Shared render function for builder assets
// mode: 'preview' uses small fixed fonts, 'full' uses calculated sizes
// ──────────────────────────────────────────────────────────
function renderBuilderContent(
  format: AssetFormat,
  layout: BuilderLayout,
  image: string | null,
  headline: string,
  subline: string,
  hex: string,
  txtColor: string,
  mode: 'preview' | 'full',
  videoSrc?: string | null
): React.ReactNode {
  const w = format.width;
  const h = format.height;
  const zones = getZones(w, h, layout);
  const shadowPx = sc(w, 3);
  const borderPx = sc(w, 1.5);

  // In preview mode, we scale font sizes down proportionally
  const previewScale = mode === 'preview' ? 0.015 : 1;
  const hFontSize = mode === 'preview' ? Math.max(8, zones.headlineFontSize * previewScale) : zones.headlineFontSize;
  const sFontSize = mode === 'preview' ? Math.max(4, zones.sublineFontSize * previewScale) : zones.sublineFontSize;
  const logoShadow = mode === 'full' ? `drop-shadow(${shadowPx}px ${shadowPx}px 0px ${hex})` : 'none';

  if (layout === 'fullbleed') {
    return (
      <>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#111111' }}>
          {mode === 'preview' && videoSrc ? (
            <video src={videoSrc} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            image && <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.5)' }} />

        {/* Logo — own zone, never overlaps headline */}
        <div style={{ ...zones.logo, filter: logoShadow }}>
          <LogoSVG />
        </div>

        {/* Headline — own zone with maxHeight + overflow:hidden */}
        <div style={zones.headline}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: hFontSize,
            color: '#FFFFFF',
            lineHeight: 1.1,
            textTransform: 'uppercase' as const,
          }}>{headline}</div>
        </div>

        {/* Brand bar — bottom strip */}
        <div style={{
          ...zones.bar,
          backgroundColor: hex,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: sFontSize,
            color: txtColor,
            letterSpacing: '0.25em',
            textTransform: 'uppercase' as const,
          }}>{subline}</span>
        </div>
      </>
    );
  }

  // Framed layout
  const frameBorder = mode === 'full' ? `${borderPx}px solid #111111` : '2px solid #111111';
  const frameShadow = mode === 'full' ? `${borderPx}px ${borderPx}px 0px 0px #111111` : '2px 2px 0px 0px #111111';

  return (
    <>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: hex }} />

      {/* Photo/Video frame — top zone */}
      <div style={{
        ...zones.photoFrame,
        border: frameBorder,
        boxShadow: frameShadow,
        backgroundColor: '#111111',
      }}>
        {mode === 'preview' && videoSrc ? (
          <video src={videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : image ? (
          <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={mode === 'preview' ? 16 : 60} color="rgba(255,255,255,0.1)" />
          </div>
        )}
      </div>

      {/* Headline — middle zone */}
      <div style={zones.headline}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: hFontSize,
          color: txtColor,
          lineHeight: 1.1,
          textTransform: 'uppercase' as const,
        }}>{headline}</div>
      </div>

      {/* Bottom bar: logo left, subline right */}
      <div style={{
        ...zones.bar,
        backgroundColor: '#111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '4%',
        paddingRight: '4%',
      }}>
        <div style={{ width: zones.logoBottom?.width || '22%', color: hex }}>
          <LogoSVG />
        </div>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: sFontSize,
          color: '#FFFFFF',
          letterSpacing: '0.25em',
          textTransform: 'uppercase' as const,
        }}>{subline}</span>
      </div>
    </>
  );
}


export function SocialMediaKit({ themeColors, currentHex, currentTheme, handleCopy }: SocialMediaKitProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [builderLayout, setBuilderLayout] = useState<BuilderLayout>('fullbleed');
  const [customHeadline, setCustomHeadline] = useState('');
  const [customSubline, setCustomSubline] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFormat, setPreviewFormat] = useState<AssetFormat | null>(null);

  // Video upload state
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null);

  // Extract frame from video at current time
  const extractVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setUploadedImage(dataUrl);
  }, []);

  // Auto-extract frame when video time changes
  useEffect(() => {
    if (videoSrc && videoRef.current && !isVideoPlaying) {
      // Small delay to ensure video has seeked
      const timer = setTimeout(extractVideoFrame, 50);
      return () => clearTimeout(timer);
    }
  }, [videoTime, videoSrc, extractVideoFrame, isVideoPlaying]);

  // Handle video playback for live frame extraction
  useEffect(() => {
    if (!isVideoPlaying || !videoRef.current) return;
    let animId: number;
    const tick = () => {
      if (videoRef.current) {
        setVideoTime(videoRef.current.currentTime);
        extractVideoFrame();
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isVideoPlaying, extractVideoFrame]);

  const handleFileUpload = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      // Clean up previous video
      if (videoSrc) { URL.revokeObjectURL(videoSrc); setVideoSrc(null); }
      setUploadType('image');
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setUploadType('video');
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoTime(0);
      setIsVideoPlaying(false);
    }
  }, [videoSrc]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleRemoveMedia = useCallback(() => {
    setUploadedImage(null);
    if (videoSrc) { URL.revokeObjectURL(videoSrc); setVideoSrc(null); }
    setUploadType(null);
    setVideoDuration(0);
    setVideoTime(0);
    setIsVideoPlaying(false);
  }, [videoSrc]);

  // Record video asset as MP4/WebM
  const recordAssetVideo = async (format: AssetFormat) => {
    if (!videoSrc) return;
    handleCopy(' ', `Recording ${format.label}...`);

    const w = format.width;
    const h = format.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Create offscreen video element
    const video = document.createElement('video');
    video.src = videoSrc;
    video.muted = true;
    video.playsInline = true;

    await new Promise<void>((resolve) => {
      video.onloadeddata = () => resolve();
      video.load();
    });

    const duration = Math.min(video.duration, 30); // cap at 30s
    video.currentTime = 0;

    // Load logo as image with explicit fill color (currentColor doesn't work in canvas)
    const logoColor = builderLayout === 'fullbleed' ? '#FFFFFF' : currentHex;
    const logoImg = await loadLogoImage(logoColor);

    // Start recording
    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' :
                     MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';

    const recordPromise = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    recorder.start();
    video.currentTime = 0;
    await video.play();

    const zones = getZones(w, h, builderLayout);
    const ratio = w / h;
    const isWide = ratio > 1.3;
    const isTall = ratio < 0.8;

    // Draw composited frames
    const drawFrame = () => {
      // Background
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, w, h);

      if (builderLayout === 'fullbleed') {
        // Video background
        const vRatio = video.videoWidth / video.videoHeight;
        const cRatio = w / h;
        let sx = 0, sy = 0, sw = video.videoWidth, sh2 = video.videoHeight;
        if (vRatio > cRatio) { sw = video.videoHeight * cRatio; sx = (video.videoWidth - sw) / 2; }
        else { sh2 = video.videoWidth / cRatio; sy = (video.videoHeight - sh2) / 2; }
        ctx.drawImage(video, sx, sy, sw, sh2, 0, 0, w, h);

        // Dark overlay
        ctx.fillStyle = 'rgba(17,17,17,0.5)';
        ctx.fillRect(0, 0, w, h);

        // Logo
        if (logoImg) {
          const logoW = w * (isWide ? 0.15 : isTall ? 0.4 : 0.28);
          const logoH = logoW * (logoImg.naturalHeight / logoImg.naturalWidth);
          const logoX = isTall ? (w - logoW) / 2 : w * 0.05;
          const logoY = w * 0.05;
          ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
        }

        // Headline
        const hFont = zones.headlineFontSize;
        ctx.font = `800 ${hFont}px 'Syne', sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'bottom';
        ctx.fillText(headline, w * 0.05, h * 0.85, w * 0.9);

        // Brand bar
        const barH = h * (isWide ? 0.12 : isTall ? 0.08 : 0.1);
        ctx.fillStyle = currentHex;
        ctx.fillRect(0, h - barH, w, barH);
        const sFont = zones.sublineFontSize;
        ctx.font = `700 ${sFont}px 'Space Mono', monospace`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(subline, w / 2, h - barH / 2);
        ctx.textAlign = 'start';
      } else {
        // Framed layout
        ctx.fillStyle = currentHex;
        ctx.fillRect(0, 0, w, h);

        // Photo frame
        const fx = w * 0.07, fy = h * 0.06;
        const fw = w * 0.86, fh = h * 0.56;
        ctx.fillStyle = '#111111';
        ctx.fillRect(fx, fy, fw, fh);
        const vRatio = video.videoWidth / video.videoHeight;
        const cRatio = fw / fh;
        let sx = 0, sy = 0, sw = video.videoWidth, sh2 = video.videoHeight;
        if (vRatio > cRatio) { sw = video.videoHeight * cRatio; sx = (video.videoWidth - sw) / 2; }
        else { sh2 = video.videoWidth / cRatio; sy = (video.videoHeight - sh2) / 2; }
        ctx.drawImage(video, sx, sy, sw, sh2, fx, fy, fw, fh);

        // Headline
        const hFont = zones.headlineFontSize;
        ctx.font = `800 ${hFont}px 'Syne', sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textBaseline = 'top';
        ctx.fillText(headline, w * 0.07, h * 0.66, w * 0.86);

        // Bottom bar
        const barH = h * 0.12;
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, h - barH, w, barH);
        if (logoImg) {
          const lw = w * 0.2;
          const lh = lw * (logoImg.naturalHeight / logoImg.naturalWidth);
          ctx.drawImage(logoImg, w * 0.04, h - barH / 2 - lh / 2, lw, lh);
        }
        const sFont = zones.sublineFontSize;
        ctx.font = `700 ${sFont}px 'Space Mono', monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(subline, w * 0.96, h - barH / 2);
        ctx.textAlign = 'start';
      }
    };

    // Animate for duration of video
    const startTime = performance.now();
    const animate = () => {
      if (video.ended || video.currentTime >= duration) {
        video.pause();
        recorder.stop();
        return;
      }
      drawFrame();
      requestAnimationFrame(animate);
    };
    animate();

    await recordPromise;

    // Download
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `culturedrops-custom-${format.id}-${currentTheme}.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    video.remove();
    handleCopy(' ', `${format.label} video downloaded!`);
  };

  const handleBuilderDownloadSingle = async (format: AssetFormat) => {
    const element = document.getElementById(`builder-${format.id}`);
    if (element) {
      await downloadImage(element, 'png', `culturedrops-custom-${format.id}-${currentTheme}`, { width: format.width, height: format.height });
    }
  };

  const handleBuilderDownloadAll = async () => {
    handleCopy(' ', 'Generating Custom Assets ZIP...');
    const zip = new JSZip();
    const opts = await getDownloadOptions();
    for (const format of formats) {
      const element = document.getElementById(`builder-${format.id}`);
      if (!element) continue;
      try {
        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(element, {
          ...opts, canvasWidth: format.width, canvasHeight: format.height,
        });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        zip.file(`${platformLabels[format.platform]}/${format.label.replace(/[^a-zA-Z0-9]/g, '-')}-${format.width}x${format.height}-${currentTheme}.png`, blob);
      } catch (e) { console.error(`Failed: ${format.id}`, e); }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a'); a.href = url; a.download = `culturedrops-custom-assets-${currentTheme}.zip`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    handleCopy(' ', 'Custom Assets downloaded!');
  };

  const handleDownload = async (format: AssetFormat) => {
    const element = document.getElementById(`social-${format.id}`);
    if (element) {
      await downloadImage(element, 'png', `culturedrops-${format.id}-${currentTheme}`, { width: format.width, height: format.height });
    }
  };

  const handleDownloadAll = async () => {
    handleCopy(' ', 'Generating Social Media Kit ZIP...');
    const zip = new JSZip();
    const opts = await getDownloadOptions();

    zip.file("README.txt", `Culture Drops — Social Media Kit\nTheme: ${currentTheme} (${currentHex})\n\nThis ZIP contains all social media assets for the active theme.\nGenerated from the Culture Drops Brandbook.\n\nFormats included:\n${formats.map(f => `- ${platformLabels[f.platform]}: ${f.label} (${f.width}×${f.height}px)`).join('\n')}`);

    for (const platform of Object.keys(platformLabels)) {
      const folder = zip.folder(platform);
      if (!folder) continue;
      const platformFormats = formats.filter(f => f.platform === platform);
      for (const format of platformFormats) {
        const element = document.getElementById(`social-${format.id}`);
        if (!element) continue;
        try {
          const { toPng } = await import('html-to-image');
          const dataUrl = await toPng(element, {
            ...opts, canvasWidth: format.width, canvasHeight: format.height,
          });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          folder.file(`culturedrops-${format.id}-${currentTheme}.png`, blob);
        } catch (e) { console.error(`Failed to generate ${format.id}`, e); }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url; a.download = `culturedrops-social-media-kit-${currentTheme}.zip`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    handleCopy(' ', 'Social Media Kit downloaded!');
  };

  const textColor = getTextColor(currentHex);
  const platforms = Object.keys(platformLabels);
  const headline = customHeadline || 'ONE WORD';
  const subline = customSubline || 'WEAR YOUR WORDS';

  return (
    <div className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-headline text-5xl md:text-6xl text-asphalt mb-8 uppercase">Social Media Kit</h1>
      <p className="font-mono text-lg text-asphalt/80 mb-16 max-w-3xl">
        Platform-ready assets in all required formats and dimensions. Each asset adapts to the active theme color and downloads at exact pixel dimensions.
      </p>

      {/* Bulk Download */}
      <div className="flex flex-col sm:flex-row gap-8 mb-24">
        <button
          onClick={handleDownloadAll}
          className="bg-brand text-asphalt font-headline tracking-widest text-lg px-10 py-6 font-bold uppercase border-4 border-asphalt shadow-brutal-black hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all flex items-center justify-center gap-3"
        >
          <FolderDown size={24} />
          Download Social Media Kit
        </button>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ASSET BUILDER                               */}
      {/* ═══════════════════════════════════════════ */}
      <section id="builder" className="mb-32">
        <h2 className="font-headline text-4xl text-asphalt mb-12 border-b-2 border-asphalt/10 pb-6">Asset Builder</h2>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Upload (Photo or Video) */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3">
              {uploadType === 'video' ? 'Video' : 'Photo / Video'}
            </h3>
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => !videoSrc && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-asphalt/30 hover:border-brand flex flex-col items-center justify-center gap-2 transition-colors ${videoSrc ? 'p-2' : 'p-4 cursor-pointer h-28'}`}>
              {videoSrc ? (
                <div className="w-full">
                  <div className="relative w-full aspect-video bg-asphalt/10 overflow-hidden mb-2">
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          setVideoDuration(videoRef.current.duration);
                          // Extract first frame
                          videoRef.current.currentTime = 0;
                        }
                      }}
                      onSeeked={extractVideoFrame}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => { setIsVideoPlaying(false); extractVideoFrame(); }}
                      onEnded={() => { setIsVideoPlaying(false); extractVideoFrame(); }}
                      muted
                      playsInline
                    />
                    <div className="absolute top-1 right-1">
                      <Film size={14} className="text-pure/60" />
                    </div>
                  </div>
                  {/* Playback controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const v = videoRef.current;
                        if (!v) return;
                        if (isVideoPlaying) { v.pause(); } else { v.play(); }
                      }}
                      className="text-asphalt hover:text-brand transition-colors flex-shrink-0"
                    >
                      {isVideoPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    {/* Frame scrubber */}
                    <input
                      type="range"
                      min={0}
                      max={videoDuration || 1}
                      step={0.01}
                      value={videoTime}
                      onChange={(e) => {
                        const t = parseFloat(e.target.value);
                        setVideoTime(t);
                        if (videoRef.current) {
                          videoRef.current.currentTime = t;
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 h-1 accent-brand cursor-pointer"
                    />
                    <span className="font-mono text-[8px] text-asphalt/50 flex-shrink-0 w-8 text-right">
                      {videoTime.toFixed(1)}s
                    </span>
                  </div>
                </div>
              ) : uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded" className="max-h-16 object-contain" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Upload size={20} className="text-asphalt/30" />
                    <Film size={20} className="text-asphalt/30" />
                  </div>
                  <p className="font-mono text-[10px] text-asphalt/50 text-center">Bild oder Video</p>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} />
            </div>
            {(uploadedImage || videoSrc) && (
              <button onClick={handleRemoveMedia} className="mt-1 text-asphalt/40 font-bold text-[10px] uppercase tracking-widest hover:text-brand transition-colors">
                Remove
              </button>
            )}
          </div>
          {/* Hidden canvas for video frame extraction */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Headline */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3">Headline (Syne)</h3>
            <input type="text" value={customHeadline} onChange={(e) => setCustomHeadline(e.target.value)} placeholder="z.B. DROP 01"
              className="w-full border-2 border-asphalt/20 px-4 py-3 font-headline text-lg text-asphalt placeholder:text-asphalt/20 focus:border-brand focus:outline-none transition-colors" />
          </div>

          {/* Subline */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3">Subline (Space Mono)</h3>
            <input type="text" value={customSubline} onChange={(e) => setCustomSubline(e.target.value)} placeholder="z.B. WEAR YOUR WORDS"
              className="w-full border-2 border-asphalt/20 px-4 py-3 font-mono text-sm text-asphalt placeholder:text-asphalt/20 focus:border-brand focus:outline-none transition-colors" />
          </div>

          {/* Layout + Download */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3">Layout</h3>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setBuilderLayout('fullbleed')}
                className={`flex-1 px-3 py-2 border-2 font-mono text-[10px] font-bold uppercase transition-colors ${builderLayout === 'fullbleed' ? 'border-brand bg-brand/10' : 'border-asphalt/20 text-asphalt/60 hover:border-asphalt/40'}`}>Fullbleed</button>
              <button onClick={() => setBuilderLayout('framed')}
                className={`flex-1 px-3 py-2 border-2 font-mono text-[10px] font-bold uppercase transition-colors ${builderLayout === 'framed' ? 'border-brand bg-brand/10' : 'border-asphalt/20 text-asphalt/60 hover:border-asphalt/40'}`}>Framed</button>
            </div>
            <button onClick={handleBuilderDownloadAll}
              className="w-full bg-brand text-asphalt font-headline tracking-widest text-sm px-4 py-3 font-bold uppercase border-2 border-asphalt shadow-brutal-black hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all flex items-center justify-center gap-2">
              <FolderDown size={16} /> Download All
            </button>
          </div>
        </div>

        {/* Asset Grid Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {formats.map(format => {
            const isWide = format.width / format.height > 1;
            return (
              <div key={format.id} className={`bg-pure border-2 border-asphalt p-3 shadow-brutal-black flex flex-col ${isWide ? 'col-span-2' : ''}`}>
                <div className="relative overflow-hidden border border-asphalt mb-2 cursor-pointer group"
                  style={{ aspectRatio: `${format.width} / ${format.height}` }}
                  onClick={() => setPreviewFormat(format)}>
                  {renderBuilderContent(format, builderLayout, uploadedImage, headline, subline, currentHex, textColor, 'preview', videoSrc)}
                  <div className="absolute inset-0 bg-asphalt/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-mono text-pure text-[10px] font-bold uppercase tracking-widest">Preview</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-headline text-xs text-asphalt leading-none">{format.label}</p>
                    <p className="font-mono text-[9px] text-asphalt/40">{platformLabels[format.platform]} · {format.width}×{format.height}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleBuilderDownloadSingle(format)} className="text-asphalt font-bold uppercase tracking-widest flex items-center gap-1 hover:text-brand transition-colors" style={{ fontSize: 10 }}>
                      <Download size={12} /> PNG
                    </button>
                    {videoSrc && (
                      <button onClick={() => recordAssetVideo(format)} className="text-asphalt font-bold uppercase tracking-widest flex items-center gap-1 hover:text-brand transition-colors" style={{ fontSize: 10 }}>
                        <Film size={12} /> MP4
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fullsize Preview Modal */}
      {previewFormat && (
        <div className="fixed inset-0 z-50 bg-asphalt/90 flex items-center justify-center p-8" onClick={() => setPreviewFormat(null)}>
          <div className="relative max-w-full max-h-full overflow-auto bg-pure border-4 border-asphalt shadow-brutal-black" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-asphalt text-pure px-4 py-2 flex justify-between items-center z-10">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">{previewFormat.label} — {previewFormat.width}×{previewFormat.height} px (Originalgröße)</span>
              <button onClick={() => setPreviewFormat(null)} className="font-bold text-pure hover:text-brand transition-colors text-lg">×</button>
            </div>
            <div style={{ width: previewFormat.width, height: previewFormat.height, position: 'relative', overflow: 'hidden' }}>
              {renderBuilderContent(previewFormat, builderLayout, uploadedImage, headline, subline, currentHex, textColor, 'full')}
            </div>
          </div>
        </div>
      )}

      {/* Hidden builder elements for download (full resolution) */}
      <div className="fixed left-[-9999px] top-0" aria-hidden="true">
        {formats.map(format => (
          <div key={`builder-${format.id}`} id={`builder-${format.id}`} style={{ width: format.width, height: format.height, position: 'relative', overflow: 'hidden' }}>
            {renderBuilderContent(format, builderLayout, uploadedImage, headline, subline, currentHex, textColor, 'full')}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* PLATFORM SECTIONS (branded templates)       */}
      {/* ═══════════════════════════════════════════ */}
      {platforms.map(platform => {
        const platformFormats = formats.filter(f => f.platform === platform);
        return (
          <section key={platform} id={platform} className="mb-32">
            <h2 className="font-headline text-4xl text-asphalt mb-12 border-b-2 border-asphalt/10 pb-6">
              {platformLabels[platform]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFormats.map(format => {
                const aspect = format.width / format.height;
                const isWide = aspect > 1;

                return (
                  <div key={format.id} className={`bg-pure border-2 border-asphalt p-6 shadow-brutal-black flex flex-col ${isWide ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                    {/* Preview */}
                    <div className="relative mb-4 border-2 border-asphalt overflow-hidden"
                      style={{ aspectRatio: `${format.width} / ${format.height}`, maxHeight: isWide ? '200px' : '300px' }}>
                      {renderBrandedPreview(format, currentHex, textColor, uploadedImage, videoSrc)}
                    </div>

                    {/* Info */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-headline text-lg text-asphalt">{format.label}</h3>
                        <p className="font-mono text-xs text-asphalt/50 uppercase">{format.width} × {format.height} px</p>
                        {format.safeZone && <p className="font-mono text-[10px] text-asphalt/40 mt-1">{format.safeZone.label}</p>}
                      </div>
                      <button onClick={() => handleDownload(format)}
                        className="text-asphalt font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand transition-colors">
                        <Download size={16} /> PNG
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Hidden full-size elements for branded template downloads */}
      <div className="fixed left-[-9999px] top-0" aria-hidden="true">
        {renderBrandedDownloads(currentHex, textColor, uploadedImage, videoSrc)}
      </div>
    </div>
  );
}


// ──────────────────────────────────────────────────────────
// Branded template previews (small, in-page)
// ──────────────────────────────────────────────────────────
function renderBrandedPreview(format: AssetFormat, hex: string, txtColor: string, image?: string | null, videoSrc?: string | null): React.ReactNode {
  const id = format.id;
  const hasMedia = !!(image || videoSrc);

  // Helper: media background (cover fit) for preview
  const mediaBg = (overlay?: string) => (
    <>
      {videoSrc ? (
        <video src={videoSrc} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : image ? (
        <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : null}
      {overlay && <div className="absolute inset-0" style={{ backgroundColor: overlay }} />}
    </>
  );

  // Profile icons: caution tape + centered logo (or media with caution tape overlay)
  if (['yt-icon', 'ig-profile', 'tt-profile', 'pin-profile'].includes(id)) {
    if (hasMedia) {
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
          {mediaBg()}
          <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 8%, transparent 8%, transparent 16%)` }} />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(17,17,17,0.25)' }} />
          <div className="absolute flex items-center justify-center" style={{ top: '18%', left: '18%', right: '18%', bottom: '18%', backgroundColor: 'rgba(17,17,17,0.75)', border: `2px solid ${hex}` }}>
            <div style={{ width: '60%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 8%, #111111 8%, #111111 16%)` }} />
        <div className="absolute flex items-center justify-center" style={{ top: '15%', left: '15%', right: '15%', bottom: '15%', backgroundColor: hex, border: '3px solid #111111' }}>
          <div style={{ width: '55%', color: txtColor }}><LogoSVG /></div>
        </div>
      </div>
    );
  }

  // YT Banner: notebook (or media with branded overlay + stripes)
  if (id === 'yt-banner') {
    if (hasMedia) {
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
          {mediaBg('rgba(17,17,17,0.3)')}
          <div className="absolute top-0 left-0 right-0" style={{ height: '12%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 6px, transparent 6px, transparent 12px)` }} />
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '12%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 6px, transparent 6px, transparent 12px)` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div style={{ width: '20%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
              <div style={{ backgroundColor: hex, padding: '3px 12px', border: '1px solid #111111' }}>
                <span className="font-mono font-bold text-[8px] tracking-widest uppercase" style={{ color: txtColor }}>WEAR YOUR WORDS</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#F4F4F0', backgroundImage: 'linear-gradient(rgba(17,17,17,0.15) 1px, transparent 1px)', backgroundSize: '100% 12px' }}>
        <div className="absolute top-0 bottom-0" style={{ left: '8%', width: 1, backgroundColor: '#D90429' }} />
        <div className="flex flex-col items-center gap-2">
          <div style={{ width: '20%', color: '#111111', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
          <div style={{ backgroundColor: hex, padding: '3px 12px', border: '1px solid #111111' }}>
            <span className="font-mono font-bold text-[8px] tracking-widest uppercase" style={{ color: '#111111' }}>WEAR YOUR WORDS</span>
          </div>
        </div>
      </div>
    );
  }

  // YT Thumbnail: bold split (or media with stripes + branded overlay)
  if (id === 'yt-thumb') {
    if (hasMedia) {
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
          {mediaBg('rgba(17,17,17,0.3)')}
          <div className="absolute top-0 right-0" style={{ width: '35%', height: '100%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 6px, transparent 6px, transparent 12px)` }} />
          <div className="absolute top-3 left-3" style={{ width: '25%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
          <div className="absolute bottom-3 left-3">
            <div className="font-headline text-xs text-pure uppercase leading-none">ONE WORD</div>
            <div className="font-headline text-xs uppercase leading-none" style={{ color: hex }}>SERIES</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, backgroundColor: hex }} />
        </div>
      );
    }
    return (
      <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
        <div className="absolute" style={{ top: -20, right: -20, width: '40%', height: '150%', backgroundColor: hex, transform: 'rotate(15deg)' }} />
        <div className="absolute top-3 left-3" style={{ width: '25%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
        <div className="absolute bottom-3 left-3">
          <div className="font-headline text-xs text-pure uppercase leading-none">ONE WORD</div>
          <div className="font-headline text-xs uppercase leading-none" style={{ color: hex }}>SERIES</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, backgroundColor: hex }} />
      </div>
    );
  }

  // IG Feed: checkerboard + center block (or media with stripes + branded frame)
  if (id === 'ig-feed') {
    if (hasMedia) {
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
          {mediaBg('rgba(17,17,17,0.2)')}
          <div className="absolute top-0 left-0 right-0" style={{ height: '12%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 5px, transparent 5px, transparent 10px)` }} />
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '12%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 5px, transparent 5px, transparent 10px)` }} />
          <div className="absolute flex items-center justify-center" style={{ top: '15%', left: '12%', right: '12%', bottom: '20%', backgroundColor: 'rgba(17,17,17,0.6)', border: `2px solid ${hex}`, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: '60%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
            <span className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: 6, color: hex }}>WEAR YOUR WORDS</span>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0" style={{ backgroundColor: '#F4F4F0' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '15%', backgroundImage: 'repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%), repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%)', backgroundPosition: '0 0, 5px 5px', backgroundSize: '10px 10px' }} />
        <div className="absolute flex flex-col items-center justify-center gap-2" style={{ top: '25%', left: '15%', right: '15%', bottom: '25%', backgroundColor: hex, border: '3px solid #111111', boxShadow: '1px 1px 0px 0px #111111', padding: '10px' }}>
          <div style={{ width: '65%', color: txtColor }}><LogoSVG /></div>
          <span className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: 7, color: txtColor }}>WEAR YOUR WORDS</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '15%', backgroundImage: 'repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%), repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%)', backgroundPosition: '0 0, 5px 5px', backgroundSize: '10px 10px' }} />
      </div>
    );
  }

  // IG Story: dark with caution tape (or media fullbleed)
  if (id === 'ig-story') {
    if (hasMedia) {
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
          {mediaBg('rgba(17,17,17,0.4)')}
          <div className="absolute top-0 left-0 right-0" style={{ height: '6%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 6px, #111111 6px, #111111 12px)` }} />
          <div className="absolute top-[8%] left-[5%]" style={{ width: '35%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
          <div className="absolute bottom-[12%] left-[5%] right-[5%]">
            <div className="font-headline text-sm text-pure uppercase leading-none mb-1">CULTURE DROPS</div>
            <div style={{ width: '40%', height: 1, backgroundColor: hex }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '6%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 6px, #111111 6px, #111111 12px)` }} />
        </div>
      );
    }
    return (
      <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '6%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 6px, #111111 6px, #111111 12px)` }} />
        <div className="absolute flex flex-col items-center justify-center gap-3" style={{ top: '20%', left: '10%', right: '10%', bottom: '20%' }}>
          <div style={{ width: '70%', color: hex, filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.15))' }}><LogoSVG /></div>
          <div style={{ width: '60%', height: 1, backgroundColor: hex }} />
          <span className="font-mono font-bold uppercase tracking-widest text-pure" style={{ fontSize: 7 }}>WEAR YOUR WORDS</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '6%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 6px, #111111 6px, #111111 12px)` }} />
      </div>
    );
  }

  // TT Video: split layout (or media with stripes + branded bar)
  if (id === 'tt-video') {
    if (hasMedia) {
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
          {mediaBg('rgba(17,17,17,0.25)')}
          <div className="absolute top-0 left-0 right-0" style={{ height: '8%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 5px, transparent 5px, transparent 10px)` }} />
          <div className="absolute top-[10%] left-[5%]" style={{ width: '35%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '18%', backgroundColor: hex, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <div className="font-headline text-xs uppercase leading-none" style={{ color: '#111111' }}>ONE WORD SERIES</div>
            <span className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: 5, color: txtColor }}>WEAR YOUR WORDS</span>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0" style={{ backgroundColor: hex }}>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center" style={{ height: '55%', backgroundColor: '#111111' }}>
          <div style={{ width: '55%', color: hex, filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.15))' }}><LogoSVG /></div>
        </div>
        <div className="absolute left-0 right-0" style={{ top: '55%', height: 2, backgroundColor: '#111111' }} />
        <div className="absolute flex flex-col items-center justify-center gap-1" style={{ top: '60%', left: '10%', right: '10%', bottom: '5%' }}>
          <div className="font-headline text-xs uppercase leading-none" style={{ color: '#111111' }}>ONE WORD</div>
          <div className="font-headline text-xs uppercase leading-none px-2" style={{ backgroundColor: '#111111', color: hex }}>SERIES</div>
          <span className="font-mono font-bold uppercase tracking-widest mt-1" style={{ fontSize: 5, color: '#111111' }}>WEAR YOUR WORDS</span>
        </div>
      </div>
    );
  }

  // Pin Standard: notebook editorial (or media with stripes + branded overlay)
  if (id === 'pin-standard') {
    if (hasMedia) {
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }}>
          {mediaBg('rgba(17,17,17,0.15)')}
          <div className="absolute top-0 left-0 right-0" style={{ height: '6%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} 5px, transparent 5px, transparent 10px)` }} />
          <div className="absolute top-[8%] left-[5%]" style={{ width: '35%', color: '#FFFFFF', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
          <div className="absolute left-0 right-0 flex flex-col items-center justify-center gap-1" style={{ bottom: 0, height: '22%', backgroundColor: hex }}>
            <div style={{ width: '45%', color: txtColor }}><LogoSVG /></div>
            <span className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: 5, color: txtColor }}>WEAR YOUR WORDS</span>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0" style={{ backgroundColor: '#F4F4F0', backgroundImage: 'linear-gradient(rgba(17,17,17,0.12) 1px, transparent 1px)', backgroundSize: '100% 10px' }}>
        <div className="absolute top-0 bottom-0" style={{ left: '8%', width: 1, backgroundColor: '#D90429' }} />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center" style={{ height: '5%', backgroundColor: '#111111' }}>
          <span className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: 4, color: hex }}>CULTURE DROPS</span>
        </div>
        <div className="absolute" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: '55%', color: '#111111', filter: `drop-shadow(1px 1px 0px ${hex})` }}><LogoSVG /></div>
        <div className="absolute flex items-center justify-center" style={{ bottom: '15%', left: '50%', transform: 'translateX(-50%)', backgroundColor: hex, padding: '4px 14px', border: '2px solid #111111', boxShadow: '1px 1px 0px 0px #111111' }}>
          <span className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: 6, color: txtColor }}>WEAR YOUR WORDS</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: '5%', backgroundColor: '#111111' }}>
          <span className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: 3, color: '#FFFFFF', opacity: 0.5 }}>CULTUREDROPS.COM</span>
        </div>
      </div>
    );
  }

  return null;
}


// ──────────────────────────────────────────────────────────
// Branded template download renders (full resolution)
// ──────────────────────────────────────────────────────────
function renderBrandedDownloads(hex: string, txtColor: string, image?: string | null, videoSrc?: string | null): React.ReactNode {
  const hasMedia = !!(image || videoSrc);

  // Helper: full-res media background (image only — video snapshots handled by html-to-image capturing the video element)
  const mediaImg = (style?: React.CSSProperties) => image ? (
    <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />
  ) : videoSrc ? (
    <video src={videoSrc} muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />
  ) : null;

  return (
    <>
      {/* Profile Icons */}
      {['yt-icon', 'ig-profile', 'tt-profile', 'pin-profile'].map(id => {
        const f = formats.find(fmt => fmt.id === id)!;
        const u = f.width / 10;
        if (hasMedia) {
          return (
            <div key={id} id={`social-${id}`} style={{ width: f.width, height: f.height, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
              {mediaImg()}
              <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${u * 0.8}px, transparent ${u * 0.8}px, transparent ${u * 1.6}px)` }} />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.25)' }} />
              <div style={{ position: 'absolute', top: u * 1.8, left: u * 1.8, right: u * 1.8, bottom: u * 1.8, backgroundColor: 'rgba(17,17,17,0.75)', border: `${sc(f.width, 2)}px solid ${hex}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '60%', color: '#FFFFFF', filter: `drop-shadow(${sc(f.width, 3)}px ${sc(f.width, 3)}px 0px ${hex})` }}><LogoSVG /></div>
              </div>
            </div>
          );
        }
        return (
          <div key={id} id={`social-${id}`} style={{ width: f.width, height: f.height, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${u * 0.8}px, #111111 ${u * 0.8}px, #111111 ${u * 1.6}px)` }} />
            <div style={{ position: 'absolute', top: u * 1.5, left: u * 1.5, right: u * 1.5, bottom: u * 1.5, backgroundColor: hex, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `${sc(f.width, 1)}px solid #111111` }}>
              <div style={{ width: '55%', color: txtColor }}><LogoSVG /></div>
            </div>
          </div>
        );
      })}

      {/* YT Banner */}
      {(() => { const w = 2560; const sh = sc(w, 1); const shd = sc(w, 3); return hasMedia ? (
        <div id="social-yt-banner" style={{ width: w, height: 1440, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          {mediaImg()}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.3)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 180), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 30)}px, transparent ${sc(w, 30)}px, transparent ${sc(w, 60)}px)` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 180), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 30)}px, transparent ${sc(w, 30)}px, transparent ${sc(w, 60)}px)` }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sc(w, 40) }}>
            <div style={{ width: sc(w, 600), color: '#FFFFFF', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
            <div style={{ backgroundColor: hex, padding: `${sc(w, 16)}px ${sc(w, 48)}px`, border: `${sh}px solid #111111` }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 28), color: txtColor, letterSpacing: '0.2em', textTransform: 'uppercase' }}>WEAR YOUR WORDS</span>
            </div>
          </div>
        </div>
      ) : (
        <div id="social-yt-banner" style={{ width: w, height: 1440, backgroundColor: '#F4F4F0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(17,17,17,0.15) 1px, transparent 1px)', backgroundSize: `100% ${sc(w, 48)}px` }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: sc(w, 200), width: sc(w, 3), backgroundColor: '#D90429' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sc(w, 40) }}>
            <div style={{ width: sc(w, 600), color: '#111111', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
            <div style={{ backgroundColor: hex, padding: `${sc(w, 16)}px ${sc(w, 48)}px`, border: `${sh}px solid #111111`, boxShadow: `${sh}px ${sh}px 0px 0px #111111` }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 28), color: '#111111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>WEAR YOUR WORDS</span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: sc(w, 60), right: sc(w, 80), fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 18), color: '#111111', opacity: 0.3, letterSpacing: '0.15em' }}>CULTUREDROPS.COM</div>
        </div>
      ); })()}

      {/* YT Thumbnail */}
      {(() => { const w = 1280; const shd = sc(w, 3); return hasMedia ? (
        <div id="social-yt-thumb" style={{ width: w, height: 720, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          {mediaImg()}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.3)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '35%', height: '100%', background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 14)}px, transparent ${sc(w, 14)}px, transparent ${sc(w, 28)}px)` }} />
          <div style={{ position: 'absolute', top: sc(w, 60), left: sc(w, 60), width: sc(w, 250), color: '#FFFFFF', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
          <div style={{ position: 'absolute', bottom: sc(w, 60), left: sc(w, 60), right: sc(w, 200) }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 72), color: '#FFFFFF', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>ONE WORD</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 72), color: hex, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>SERIES</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 6), backgroundColor: hex }} />
        </div>
      ) : (
        <div id="social-yt-thumb" style={{ width: w, height: 720, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: sc(w, 500), height: 1000, backgroundColor: hex, transform: 'rotate(15deg)' }} />
          <div style={{ position: 'absolute', top: sc(w, 60), left: sc(w, 60), width: sc(w, 250), color: '#FFFFFF', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
          <div style={{ position: 'absolute', bottom: sc(w, 60), left: sc(w, 60), right: sc(w, 200) }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 72), color: '#FFFFFF', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>ONE WORD</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 72), color: hex, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>SERIES</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 6), backgroundColor: hex }} />
        </div>
      ); })()}

      {/* IG Feed (4:5) */}
      {(() => { const w = 1080; const h = 1350; const sh = sc(w, 1); const shd = sc(w, 3); return hasMedia ? (
        <div id="social-ig-feed" style={{ width: w, height: h, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          {mediaImg()}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.2)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 160), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 20)}px, transparent ${sc(w, 20)}px, transparent ${sc(w, 40)}px)` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 160), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 20)}px, transparent ${sc(w, 20)}px, transparent ${sc(w, 40)}px)` }} />
          <div style={{ position: 'absolute', top: '18%', left: '12%', right: '12%', bottom: '22%', backgroundColor: 'rgba(17,17,17,0.6)', border: `${sh * 2}px solid ${hex}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: sc(w, 30) }}>
            <div style={{ width: sc(w, 400), color: '#FFFFFF', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 20), color: hex, letterSpacing: '0.25em', textTransform: 'uppercase' }}>WEAR YOUR WORDS</span>
          </div>
        </div>
      ) : (
        <div id="social-ig-feed" style={{ width: w, height: h, backgroundColor: '#F4F4F0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 200), backgroundImage: `repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%), repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%)`, backgroundPosition: `0 0, ${sc(w, 15)}px ${sc(w, 15)}px`, backgroundSize: `${sc(w, 30)}px ${sc(w, 30)}px` }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: hex, padding: `${sc(w, 80)}px ${sc(w, 60)}px`, border: `${sh}px solid #111111`, boxShadow: `${sh}px ${sh}px 0px 0px #111111`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sc(w, 40) }}>
            <div style={{ width: sc(w, 400), color: txtColor }}><LogoSVG /></div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 20), color: txtColor, letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center' }}>WEAR YOUR WORDS</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 200), backgroundImage: `repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%), repeating-linear-gradient(45deg, #111111 25%, #F4F4F0 25%, #F4F4F0 75%, #111111 75%)`, backgroundPosition: `0 0, ${sc(w, 15)}px ${sc(w, 15)}px`, backgroundSize: `${sc(w, 30)}px ${sc(w, 30)}px` }} />
        </div>
      ); })()}

      {/* IG Story (9:16) */}
      {(() => { const w = 1080; const sh = sc(w, 1); const shd = sc(w, 3); return hasMedia ? (
        <div id="social-ig-story" style={{ width: w, height: 1920, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          {mediaImg()}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.4)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 120), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 30)}px, #111111 ${sc(w, 30)}px, #111111 ${sc(w, 60)}px)` }} />
          <div style={{ position: 'absolute', top: sc(w, 160), left: sc(w, 54), width: sc(w, 380), color: '#FFFFFF', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
          <div style={{ position: 'absolute', bottom: sc(w, 240), left: sc(w, 54), right: sc(w, 54) }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 48), color: '#FFFFFF', textTransform: 'uppercase' }}>CULTURE DROPS</div>
            <div style={{ width: sc(w, 400), height: sh, backgroundColor: hex, marginTop: sc(w, 16) }} />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 120), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 30)}px, #111111 ${sc(w, 30)}px, #111111 ${sc(w, 60)}px)` }} />
        </div>
      ) : (
        <div id="social-ig-story" style={{ width: w, height: 1920, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 120), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 30)}px, #111111 ${sc(w, 30)}px, #111111 ${sc(w, 60)}px)` }} />
          <div style={{ position: 'absolute', top: sc(w, 120), left: 0, right: 0, bottom: sc(w, 120), backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: `100% ${sc(w, 40)}px` }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sc(w, 60), width: '80%' }}>
            <div style={{ width: '80%', color: hex, filter: `drop-shadow(${shd}px ${shd}px 0px rgba(255,255,255,0.15))` }}><LogoSVG /></div>
            <div style={{ width: '100%', height: sh, backgroundColor: hex }} />
            <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 32), color: '#FFFFFF', letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center' }}>WEAR YOUR WORDS</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 120), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 30)}px, #111111 ${sc(w, 30)}px, #111111 ${sc(w, 60)}px)` }} />
        </div>
      ); })()}

      {/* TT Video Cover (9:16) */}
      {(() => { const w = 1080; const sh = sc(w, 1); const shd = sc(w, 3); return hasMedia ? (
        <div id="social-tt-video" style={{ width: w, height: 1920, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          {mediaImg()}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.25)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 150), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 24)}px, transparent ${sc(w, 24)}px, transparent ${sc(w, 48)}px)` }} />
          <div style={{ position: 'absolute', top: sc(w, 180), left: sc(w, 54), width: sc(w, 380), color: '#FFFFFF', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 340), backgroundColor: hex, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: sc(w, 16) }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 60), color: '#111111', lineHeight: 1, textTransform: 'uppercase' }}>ONE WORD SERIES</div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 20), color: txtColor, letterSpacing: '0.3em', textTransform: 'uppercase' }}>WEAR YOUR WORDS</span>
          </div>
        </div>
      ) : (
        <div id="social-tt-video" style={{ width: w, height: 1920, backgroundColor: hex, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', backgroundColor: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '65%', color: hex, filter: `drop-shadow(${shd}px ${shd}px 0px rgba(255,255,255,0.15))` }}><LogoSVG /></div>
          </div>
          <div style={{ position: 'absolute', top: '55%', left: 0, right: 0, height: sh * 2, backgroundColor: '#111111' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: sc(w, 30) }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 80), color: '#111111', lineHeight: 1, textTransform: 'uppercase', textAlign: 'center', letterSpacing: '-0.02em' }}>ONE WORD</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sc(w, 80), color: hex, lineHeight: 1, textTransform: 'uppercase', textAlign: 'center', letterSpacing: '-0.02em', backgroundColor: '#111111', padding: `${sc(w, 10)}px ${sc(w, 30)}px` }}>SERIES</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 22), color: '#111111', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: sc(w, 20) }}>WEAR YOUR WORDS</div>
          </div>
        </div>
      ); })()}

      {/* Pin Standard (2:3) */}
      {(() => { const w = 1000; const sh = sc(w, 1); const shd = sc(w, 3); return hasMedia ? (
        <div id="social-pin-standard" style={{ width: w, height: 1500, backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}>
          {mediaImg()}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,17,17,0.15)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 100), background: `repeating-linear-gradient(-45deg, ${hex}, ${hex} ${sc(w, 18)}px, transparent ${sc(w, 18)}px, transparent ${sc(w, 36)}px)` }} />
          <div style={{ position: 'absolute', top: sc(w, 120), left: sc(w, 50), width: sc(w, 350), color: '#FFFFFF', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 300), backgroundColor: hex, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: sc(w, 20) }}>
            <div style={{ width: sc(w, 450), color: txtColor }}><LogoSVG /></div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 20), color: txtColor, letterSpacing: '0.2em', textTransform: 'uppercase' }}>WEAR YOUR WORDS</span>
          </div>
        </div>
      ) : (
        <div id="social-pin-standard" style={{ width: w, height: 1500, backgroundColor: '#F4F4F0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(17,17,17,0.12) 1px, transparent 1px)', backgroundSize: `100% ${sc(w, 36)}px` }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: sc(w, 80), width: sc(w, 2), backgroundColor: '#D90429' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sc(w, 80), backgroundColor: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 16), color: hex, letterSpacing: '0.3em', textTransform: 'uppercase' }}>CULTURE DROPS</span>
          </div>
          <div style={{ position: 'absolute', top: sc(w, 200), left: '50%', transform: 'translateX(-50%)', width: sc(w, 500), color: '#111111', filter: `drop-shadow(${shd}px ${shd}px 0px ${hex})` }}><LogoSVG /></div>
          <div style={{ position: 'absolute', bottom: sc(w, 250), left: '50%', transform: 'translateX(-50%)', backgroundColor: hex, padding: `${sc(w, 20)}px ${sc(w, 50)}px`, border: `${sh}px solid #111111`, boxShadow: `${sh}px ${sh}px 0px 0px #111111` }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 24), color: txtColor, letterSpacing: '0.2em', textTransform: 'uppercase' }}>WEAR YOUR WORDS</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sc(w, 80), backgroundColor: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: sc(w, 14), color: '#FFFFFF', letterSpacing: '0.2em', opacity: 0.5 }}>CULTUREDROPS.COM</span>
          </div>
        </div>
      ); })()}
    </>
  );
}
