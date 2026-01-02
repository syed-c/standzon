# Content Cache & Block Renderer - Quick Reference Guide

## Architecture Overview

```
Page Request → Server-Side Fetch → Cached Data → Content Parser → Block Extractor → Block Renderer
                      ↓                    ↓                  ↓                ↓                    ↓
                 React cache()        Memoized         extractContentBlocks()   Registry Lookup
                (6-hour ISR)       parsePageContent()                         ↓
                                                                             Component
                                                                              Render
```

---

## File Structure

### Server-Side Content Layer
```
lib/server/content/
├── types.ts              # Type definitions
├── parse-content.ts      # Memoized content parsing
├── fetch-country.ts      # Cached country data fetching
├── fetch-city.ts        # Cached city data fetching
└── index.ts            # Centralized exports
```

### Block Rendering System
```
components/blocks/
├── types.ts             # Block type definitions
├── registry.ts          # Block type → component mapping
├── index.tsx            # Block renderer (server)
├── HeroBlock.tsx        # Hero section (server)
├── StatsBlock.tsx       # Statistics display (server)
├── TextBlock.tsx        # Generic text content (server)
├── WhyChooseBlock.tsx   # Why choose section (server)
├── BuildersListBlock.tsx # Builders with search/filter (client, lazy)
├── CitiesListBlock.tsx   # Cities in country (server)
└── CtaBlock.tsx        # Call-to-action (server)
```

---

## Usage Examples

### Fetching Country Content
```typescript
import { fetchCountryContent } from '@/lib/server/content';

const contentData = await fetchCountryContent(
  'united-kingdom',  // countrySlug
  'United Kingdom',    // countryName
  'GB'               // countryCode
);

// Returns: { content, builders, cities, stats }
```

### Fetching City Content
```typescript
import { fetchCityContent } from '@/lib/server/content';

const contentData = await fetchCityContent(
  'united-kingdom',  // countrySlug
  'United Kingdom',    // countryName
  'london',          // citySlug
  'London'           // cityName
);

// Returns: { content, builders, cities, stats }
```

### Parsing Content
```typescript
import { parsePageContent, extractContentBlocks } from '@/lib/server/content';

const parsedContent = parsePageContent(
  cmsContent,
  defaultContent,
  countrySlug,
  citySlug
);

const blocks = extractContentBlocks(parsedContent);
// Returns: Array of { id, type, data, order }
```

### Rendering Blocks
```typescript
import { BlockRenderer } from '@/components/blocks';

<BlockRenderer blocks={blocks} />

// Or render specific block
import { BlockById } from '@/components/blocks';

<BlockById blocks={blocks} blockId="hero" />
```

---

## Caching Configuration

### Time-Based Revalidation
```typescript
export const COUNTRY_REVALIDATE_TIME = 21600; // 6 hours
export const CITY_REVALIDATE_TIME = 21600;    // 6 hours

// In page files:
export const revalidate = COUNTRY_REVALIDATE_TIME;
```

### Tag-Based Revalidation
```typescript
import { revalidateCountryPage } from '@/lib/server/content/fetch-country';

// Trigger revalidation when CMS updates
await revalidateCountryPage('united-kingdom');
```

### React cache() Usage
```typescript
// Automatic request deduplication within same render
export const fetchCountryContent = cache(async (...) => {
  // Fetching logic here
});
```

---

## Block Types

| Block Type | Component | Server/Client | Interactive | Lazy Load |
|------------|-----------|----------------|-------------|-------------|
| `hero` | HeroBlock | Server | No | No |
| `stats` | StatsBlock | Server | No | No |
| `text` | TextBlock | Server | No | No |
| `why-choose` | WhyChooseBlock | Server | No | No |
| `services` | TextBlock | Server | No | No |
| `venue` | TextBlock | Server | No | No |
| `gallery` | TextBlock (placeholder) | Server | No | No |
| `builder-advantages` | TextBlock | Server | No | No |
| `builders-list` | BuildersListBlock | Client | Yes | Yes |
| `cities-list` | CitiesListBlock | Server | No | No |
| `conclusion` | TextBlock | Server | No | No |
| `cta` | CtaBlock | Server | No | No |
| `map` | TextBlock (placeholder) | Server | No | No |

---

## Creating New Blocks

### 1. Create Block Component
```typescript
// components/blocks/MyCustomBlock.tsx
import { BaseBlockProps } from './types';

interface MyCustomData {
  title: string;
  content: string;
}

export default function MyCustomBlock({ data, className = '' }: BaseBlockProps) {
  const customData = data as MyCustomData;
  
  return (
    <div className={className}>
      <h2>{customData.title}</h2>
      <p>{customData.content}</p>
    </div>
  );
}
```

### 2. Add to Registry
```typescript
// components/blocks/registry.ts
import MyCustomBlock from './MyCustomBlock';

export const BLOCK_REGISTRY: Record<BlockType, BlockConfig> = {
  // ... existing blocks
  'my-custom': {
    component: MyCustomBlock,
    isServerComponent: true, // or false for client components
    lazyLoad: false, // or true for lazy-loaded client components
  },
};
```

### 3. Add Type Definition
```typescript
// components/blocks/types.ts
export type BlockType = 
  | 'hero'
  | 'stats'
  // ... existing types
  | 'my-custom'; // Add your type
```

---

## Page Integration Pattern

### Country Page Template
```typescript
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCountryContent, COUNTRY_REVALIDATE_TIME } from "@/lib/server/content/fetch-country";
import { extractContentBlocks } from "@/lib/server/content/parse-content";
import { BlockRenderer } from "@/components/blocks";

export const revalidate = COUNTRY_REVALIDATE_TIME;

export async function generateMetadata({ params }): Promise<Metadata> {
  const { country } = await params;
  const contentData = await fetchCountryContent(/* ... */);
  // Use contentData for metadata
}

export default async function CountryPage({ params }) {
  const { country } = await params;
  const contentData = await fetchCountryContent(/* ... */);
  const blocks = extractContentBlocks(contentData.content);
  
  // Inject dynamic data into blocks
  const blocksWithData = blocks.map(block => {
    if (block.id === 'stats') {
      return { ...block, data: contentData.stats };
    }
    // ... handle other blocks
    return block;
  });
  
  return (
    <div>
      <BlockRenderer blocks={blocksWithData} />
    </div>
  );
}
```

---

## Performance Benefits

### Before Refactoring
- `force-dynamic` disables all caching
- Every request hits the database
- Content parsed on every request
- All components hydrate eagerly
- TTFB scales linearly with city count

### After Refactoring
- ISR with 6-hour revalidation
- Database queries cached via `cache()`
- Content parsing memoized
- Only interactive blocks hydrate lazily
- TTFB remains constant regardless of city count

---

## Cache Invalidation

### Automatic (Time-Based)
- Country pages: Revalidate every 6 hours
- City pages: Revalidate every 6 hours
- No manual intervention required

### Manual (Tag-Based)
```typescript
// Revalidate single country page
await revalidateCountryPage('united-kingdom');

// Revalidate all country pages (via tag reimplementation)
// Current implementation: revalidateTag('country-pages-{slug}')
```

---

## Error Handling

### Missing Content
```typescript
if (!contentData) {
  notFound(); // Returns 404 page
}
```

### Malformed JSON
```typescript
// parse-content.ts handles gracefully
// Returns default content if parsing fails
// Logs warnings to console
```

### Fallback Data
```typescript
// Cities fallback to global database if DB empty
if (allCities.length === 0) {
  const globalCities = getGlobalCitiesByCountry(countrySlug);
  // Use global cities as fallback
}
```

---

## Best Practices

### 1. Always Use Cached Fetch Functions
```typescript
// ✅ Good
import { fetchCountryContent } from '@/lib/server/content';
const data = await fetchCountryContent(...);

// ❌ Bad - Direct DB fetch without caching
const sb = createServerClient();
const { data } = await sb.from('page_contents').select('*');
```

### 2. Share Cache Between Metadata and Page
```typescript
// Both generateMetadata and page render should call same cached function
const contentData = await fetchCountryContent(...); // Called once, used twice
```

### 3. Keep Static Blocks as Server Components
```typescript
// ✅ Good - Static content, no interactivity
export default function TextBlock({ data }: BaseBlockProps) {
  return <div>{data.content}</div>;
}

// ❌ Bad - Unnecessary client component for static content
"use client";
export default function TextBlock({ data }: BaseBlockProps) {
  return <div>{data.content}</div>;
}
```

### 4. Lazy Load Interactive Blocks
```typescript
// ✅ Good - Lazy loaded, no SSR
const BuildersListBlock = dynamic(() => import('./BuildersListBlock'), {
  ssr: false,
});

// ❌ Bad - Hydrates eagerly on page load
import BuildersListBlock from './BuildersListBlock';
```

---

## Monitoring & Debugging

### Check Cache Status
```typescript
// Add logging to see cache hits/misses
export const fetchCountryContent = cache(async (countrySlug, countryName, countryCode) => {
  console.log(`📦 Fetching country content for: ${countrySlug}`);
  // ... fetch logic
});
```

### Measure TTFB
```typescript
// Add timing to page components
export default async function CountryPage({ params }) {
  const start = Date.now();
  const contentData = await fetchCountryContent(...);
  console.log(`⏱️ Fetch time: ${Date.now() - start}ms`);
  // ...
}
```

---

## FAQ

**Q: How do I change revalidation time?**
A: Update `COUNTRY_REVALIDATE_TIME` or `CITY_REVALIDATE_TIME` constants.

**Q: Can I trigger revalidation manually?**
A: Yes, use `revalidateTag()` or implement `revalidateCountryPage()` / `revalidateCityPage()`.

**Q: How do I add a new block type?**
A: Create component, add to registry, update type definition.

**Q: Why is only builders-list a client component?**
A: It's the only interactive block (search, filter, sort, pagination). All others are static.

**Q: Does this work with the old CountryCityPage component?**
A: The refactored pages replace CountryCityPage. Old component remains for reference if needed.

**Q: How do I verify caching is working?**
A: Check logs for cache hits, measure TTFB on repeated requests, monitor CDN cache metrics.

---

## Support

For issues or questions, refer to:
- CONTENT_CACHE_REFACTORING_SUMMARY.md - Complete documentation
- lib/server/content/*.ts - Implementation details
- components/blocks/*.tsx - Block implementations
