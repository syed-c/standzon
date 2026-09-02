import React from 'react';

/**
 * Renders one or more schema.org JSON-LD blocks as <script type="application/ld+json">.
 * Server-safe. Pass a single schema object or an array.
 */
export default function JsonLd({ data }: { data: any | any[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.filter(Boolean).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to inline; escape closing-script edge case.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
