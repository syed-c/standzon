/**
 * Type-aware inline SVG placeholders (data URIs — no network, no layout shift).
 * Used wherever a real image URL is missing or fails to load.
 */

type PlaceholderKind = 'builder' | 'location' | 'gallery' | 'page' | 'avatar';

const SURFACE = '#F5F6F7';
const LINE = '#E4E6E8';
const ICON = '#B4B5B6';
const ACCENT = '#E03A3A';

function wrap(inner: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="${label}">
<rect width="800" height="600" fill="${SURFACE}"/>
<rect x="0.5" y="0.5" width="799" height="599" fill="none" stroke="${LINE}"/>
<g transform="translate(400 300)">${inner}</g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const BUILDER = wrap(
  `<g fill="none" stroke="${ICON}" stroke-width="10" stroke-linejoin="round" transform="translate(-90 -80)">
    <rect x="0" y="40" width="70" height="120"/>
    <rect x="70" y="0" width="110" height="160"/>
    <line x1="95" y1="30" x2="125" y2="30"/><line x1="150" y1="30" x2="160" y2="30"/>
    <line x1="95" y1="70" x2="125" y2="70"/><line x1="150" y1="70" x2="160" y2="70"/>
    <line x1="95" y1="110" x2="125" y2="110"/><line x1="150" y1="110" x2="160" y2="110"/>
  </g>
  <path d="M 70 90 l 14 -22 l 14 22 z" fill="${ACCENT}" stroke="none"/>`,
  'Exhibition stand builder',
);

const LOCATION = wrap(
  `<path d="M 0 -95 C -52 -95 -85 -58 -85 -12 C -85 45 0 110 0 110 C 0 110 85 45 85 -12 C 85 -58 52 -95 0 -95 Z"
     fill="none" stroke="${ICON}" stroke-width="10"/>
   <circle cx="0" cy="-15" r="26" fill="${ACCENT}"/>`,
  'Location',
);

const GALLERY = wrap(
  `<g fill="none" stroke="${ICON}" stroke-width="10" stroke-linejoin="round" transform="translate(-110 -85)">
     <rect x="0" y="0" width="220" height="170" rx="10"/>
     <circle cx="55" cy="52" r="20"/>
     <path d="M 10 160 L 80 90 L 130 140 L 175 100 L 210 135 L 210 160 Z" fill="${ICON}" stroke="none" opacity="0.5"/>
   </g>`,
  'Exhibition stand photo',
);

const AVATAR = wrap(
  `<circle cx="0" cy="-30" r="55" fill="none" stroke="${ICON}" stroke-width="10"/>
   <path d="M -95 120 C -95 40 95 40 95 120 Z" fill="none" stroke="${ICON}" stroke-width="10"/>`,
  'Profile',
);

const MAP: Record<PlaceholderKind, string> = {
  builder: BUILDER,
  location: LOCATION,
  gallery: GALLERY,
  page: GALLERY,
  avatar: AVATAR,
};

export function placeholderFor(kind: PlaceholderKind): string {
  return MAP[kind] || GALLERY;
}

/** True when a src is missing, blank, or a known "no image" default. */
export function isMissingImage(src?: string | null): boolean {
  if (!src || typeof src !== 'string') return true;
  const s = src.trim().toLowerCase();
  if (!s || s === 'null' || s === 'undefined' || s === '#') return true;
  return (
    s.includes('default-logo') ||
    s.includes('placeholder.jpg') ||
    s.includes('placeholder.png') ||
    s.endsWith('/placeholder') ||
    s.includes('via.placeholder.com')
  );
}

/** Resolve to a real src or a type-appropriate placeholder. */
export function imageSrcOr(src: string | null | undefined, kind: PlaceholderKind): string {
  return isMissingImage(src) ? placeholderFor(kind) : (src as string);
}
