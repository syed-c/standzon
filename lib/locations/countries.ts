export const ALL_COUNTRY_SLUGS: string[] = [
  "china",
  "united-states",
  "germany",
  "japan",
  "united-kingdom",
  "france",
  "canada",
  "brazil",
  "australia",
  "russia",
  "south-korea",
  "united-arab-emirates",
  "netherlands",
  "mexico",
  "saudi-arabia",
  "singapore",
  "turkey",
  "indonesia",
  "poland",
  "south-africa",
  "switzerland",
  "argentina",
  "belgium",
  "nigeria",
  "sweden",
  "denmark",
  "thailand",
  "austria",
  "colombia",
  "egypt",
  "norway",
  "philippines",
  "pakistan",
  "malaysia",
  "chile",
  "finland",
  "vietnam",
  "bangladesh",
  "qatar",
  "kenya",
  "peru",
  "kuwait",
  "oman",
  "bahrain",
];

export function isValidCountrySlug(
  slug: string | undefined | null
): slug is string {
  if (!slug || typeof slug !== "string") return false;
  const sanitized = sanitizeCountrySlug(slug);
  return ALL_COUNTRY_SLUGS.includes(sanitized);
}

export function sanitizeCountrySlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getDisplayNameFromSlug(slug: string): string {
  const sanitized = sanitizeCountrySlug(slug);
  // Title case hyphenated words: united-states -> United States
  return sanitized
    .split("-")
    .map((part) => (part.length ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}
