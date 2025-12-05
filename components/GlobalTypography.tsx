'use client';

import { useEffect } from 'react';

// Reads homepage CMS typography and applies a heading font class to body
export default function GlobalTypography() {
  useEffect(() => {
    let isMounted = true;
    const apply = async () => {
      try {
        const res = await fetch('/api/admin/pages-editor?action=get-content&path=%2F', { cache: 'no-store' });
        const data = await res.json();
        const font = data?.data?.sections?.typography?.headingFont || '';
        const map: Record<string,string|undefined> = {
          arial: 'heading-font-arial',
          helvetica: 'heading-font-helvetica',
          trebuchet: 'heading-font-trebuchet',
          poppins: 'heading-font-poppins',
        };
        const cls = map[font];
        if (!isMounted) return;
        const body = document.body;
        // remove previous
        body.classList.remove('heading-font-arial','heading-font-helvetica','heading-font-trebuchet','heading-font-poppins');
        if (cls) body.classList.add(cls);
      } catch {}
    };
    apply();
    return () => { isMounted = false; };
  }, []);
  return null;
}


