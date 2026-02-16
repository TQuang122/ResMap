import type { jsPDF } from 'jspdf';

import notoSansRegularUrl from '../../assets/fonts/NotoSans-Regular.ttf?url';
import notoSansBoldUrl from '../../assets/fonts/NotoSans-Bold.ttf?url';

const FONT_FAMILY = 'NotoSansVN';

let regularBase64: string | null = null;
let boldBase64: string | null = null;
let fontLoadPromise: Promise<void> | null = null;

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  let binary = '';

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
};

const loadFontBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load font file: ${url}`);
  }

  const buffer = await response.arrayBuffer();
  return arrayBufferToBase64(buffer);
};

const ensureFontData = async (): Promise<void> => {
  if (regularBase64 && boldBase64) {
    return;
  }

  if (!fontLoadPromise) {
    fontLoadPromise = (async () => {
      const [regular, bold] = await Promise.all([
        loadFontBase64(notoSansRegularUrl),
        loadFontBase64(notoSansBoldUrl),
      ]);

      regularBase64 = regular;
      boldBase64 = bold;
    })();
  }

  await fontLoadPromise;
};

export const ensureVietnameseFont = async (doc: jsPDF): Promise<void> => {
  await ensureFontData();

  if (!regularBase64 || !boldBase64) {
    throw new Error('Vietnamese fonts are unavailable for PDF export.');
  }

  doc.addFileToVFS('NotoSans-Regular.ttf', regularBase64);
  doc.addFont('NotoSans-Regular.ttf', FONT_FAMILY, 'normal');

  doc.addFileToVFS('NotoSans-Bold.ttf', boldBase64);
  doc.addFont('NotoSans-Bold.ttf', FONT_FAMILY, 'bold');

  doc.setFont(FONT_FAMILY, 'normal');
};

export { FONT_FAMILY };
