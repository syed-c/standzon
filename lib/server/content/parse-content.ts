/**
 * Content parsing utilities with memoization
 * Server-only - do not import in client components
 */

import { cache } from 'react';
import { ParsedPageContent, ParsedContentBlock } from './types';

/**
 * Safely extract text from various CMS content structures
 */
function extractText(content: any): string {
  if (!content) return "";
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null) {
    // Try common properties in order of preference
    return content.description || 
           content.text || 
           content.heading || 
           content.title || 
           content.content ||
           content.heroDescription ||
           content.heroContent ||
           JSON.stringify(content);
  }
  return String(content);
}

/**
 * Safely extract arrays from content
 */
function extractArray(content: any): any[] {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  if (typeof content === 'string') return [content];
  if (typeof content === 'object' && content !== null) {
    // If it's an object with keywords property
    if (Array.isArray(content.keywords)) return content.keywords;
    if (typeof content.keywords === 'string') return [content.keywords];
    if (Array.isArray(content.galleryImages)) return content.galleryImages;
  }
  return [];
}

/**
 * Memoized content parser
 * Parses raw CMS content into structured format suitable for rendering
 */
export const parsePageContent = cache((
  cmsContent: any,
  defaultContent: any,
  countrySlug: string,
  citySlug?: string
): ParsedPageContent => {
  const cityPageId = citySlug ? `${countrySlug}-${citySlug}` : "";
  
  // Base content from defaults
  const base = defaultContent || {};
  
  // Resolve block from cmsContent
  let block = cmsContent;
  if (citySlug && cmsContent?.sections?.cityPages?.[cityPageId]) {
    block = cmsContent.sections.cityPages[cityPageId];
    // Handle nested countryPages in cityPages
    if (block.countryPages?.[citySlug]) {
      block = block.countryPages[citySlug];
    }
  } else if (cmsContent?.sections?.countryPages?.[countrySlug]) {
    block = cmsContent.sections.countryPages[countrySlug];
  }

  // Handle nested 'content' property
  if (block?.content && typeof block.content === 'object' && !Array.isArray(block.content)) {
    block = { ...block, ...block.content };
  }

  // Merge everything
  const merged = {
    ...base,
    ...(block || {}),
  };

  return {
    seo: {
      metaTitle: extractText(merged.seo?.metaTitle || merged.metaTitle || merged.title),
      metaDescription: extractText(merged.seo?.metaDescription || merged.metaDescription || merged.description),
      keywords: extractArray(merged.seo?.keywords || merged.seoKeywords),
    },
    hero: {
      title: extractText(merged.hero?.title || merged.hero?.heading || merged.title),
      description: extractText(merged.heroDescription || merged.heroContent || merged.hero?.description || merged.hero?.text || merged.description),
      ctaText: extractText(merged.hero?.ctaText || merged.ctaText || "Get Free Quote"),
      subtitle: extractText(merged.hero?.subtitle || merged.subtitle || "Professional booth design and construction services"),
    },
    content: {
      introduction: extractText(merged.content?.introduction || merged.description || merged.heroDescription || merged.heroContent),
      whyChooseSection: extractText(merged.content?.whyChooseSection || merged.whyChooseSection || merged.whyChooseParagraph),
      industryOverview: extractText(merged.content?.industryOverview || merged.industryOverview),
      venueInformation: extractText(merged.content?.venueInformation || merged.venueInformation),
      builderAdvantages: extractText(merged.content?.builderAdvantages || merged.builderAdvantages),
      conclusion: extractText(merged.content?.conclusion || merged.conclusion),
    },
    design: {
      primaryColor: merged.design?.primaryColor || "#ec4899",
      accentColor: merged.design?.accentColor || "#f97316",
      layout: merged.design?.layout || "modern",
      showStats: merged.design?.showStats ?? true,
      showMap: citySlug ? true : false,
    },
    galleryImages: extractArray(merged.galleryImages || merged.content?.galleryImages || merged.images),
    // Additional fields for rendering
    whyChooseHeading: extractText(merged.whyChooseHeading || merged.content?.whyChooseHeading || merged.whyChooseSectionHeading),
    whyChooseParagraph: extractText(merged.whyChooseParagraph || merged.content?.whyChooseParagraph || merged.whyChooseSection || merged.content?.whyChooseSection),
    quotesParagraph: extractText(merged.quotesParagraph || merged.content?.quotesParagraph || merged.quotesText),
    buildersHeading: extractText(merged.buildersHeading || merged.content?.buildersHeading || merged.buildersSectionHeading),
    buildersIntro: extractText(merged.buildersIntro || merged.content?.buildersIntro || merged.buildersDescription),
    servicesHeading: extractText(merged.servicesHeading || merged.content?.servicesHeading || merged.industryOverviewHeading || merged.title),
    servicesParagraph: extractText(merged.servicesParagraph || merged.content?.servicesParagraph || merged.industryOverview || merged.content?.industryOverview || merged.description),
    finalCtaHeading: extractText(merged.finalCtaHeading || merged.content?.finalCtaHeading || merged.ctaHeading),
    finalCtaParagraph: extractText(merged.finalCtaParagraph || merged.content?.finalCtaParagraph || merged.ctaDescription),
    finalCtaButtonText: extractText(merged.finalCtaButtonText || merged.content?.finalCtaButtonText || merged.ctaButtonText),
    // Additional editor fields
    industryOverview: extractText(merged.industryOverview || merged.content?.industryOverview),
    venueInformation: extractText(merged.venueInformation || merged.content?.venueInformation),
    builderAdvantages: extractText(merged.builderAdvantages || merged.content?.builderAdvantages),
    conclusion: extractText(merged.conclusion || merged.content?.conclusion),
  } as any;
});

/**
 * Extract sections from parsed content as blocks
 */
export function extractContentBlocks(parsedContent: ParsedPageContent): ParsedContentBlock[] {
  const blocks: ParsedContentBlock[] = [];
  let order = 0;

  // Hero block
  if (parsedContent.hero.title) {
    blocks.push({
      id: 'hero',
      type: 'hero',
      data: parsedContent.hero,
      order: order++,
    });
  }

  // Stats block
  if (parsedContent.design.showStats) {
    blocks.push({
      id: 'stats',
      type: 'stats',
      data: {},
      order: order++,
    });
  }

  // Introduction block
  if (parsedContent.content.introduction) {
    blocks.push({
      id: 'introduction',
      type: 'text',
      data: {
        title: '',
        content: parsedContent.content.introduction,
      },
      order: order++,
    });
  }

  // Why Choose block
  if (parsedContent.whyChooseParagraph) {
    blocks.push({
      id: 'why-choose',
      type: 'why-choose',
      data: {
        heading: parsedContent.whyChooseHeading,
        content: parsedContent.whyChooseParagraph,
      },
      order: order++,
    });
  }

  // Services/Industry Overview block
  if (parsedContent.industryOverview || parsedContent.servicesParagraph) {
    blocks.push({
      id: 'services',
      type: 'text',
      data: {
        heading: parsedContent.servicesHeading || 'Our Services',
        content: parsedContent.industryOverview || parsedContent.servicesParagraph,
      },
      order: order++,
    });
  }

  // Venue Information block
  if (parsedContent.venueInformation) {
    blocks.push({
      id: 'venue',
      type: 'text',
      data: {
        heading: 'Venue Information',
        content: parsedContent.venueInformation,
      },
      order: order++,
    });
  }

  // Gallery block
  if (parsedContent.galleryImages.length > 0) {
    blocks.push({
      id: 'gallery',
      type: 'gallery',
      data: {
        images: parsedContent.galleryImages,
      },
      order: order++,
    });
  }

  // Builder Advantages block
  if (parsedContent.builderAdvantages) {
    blocks.push({
      id: 'builder-advantages',
      type: 'text',
      data: {
        heading: 'Why Choose Us',
        content: parsedContent.builderAdvantages,
      },
      order: order++,
    });
  }

  // Conclusion block
  if (parsedContent.content.conclusion) {
    blocks.push({
      id: 'conclusion',
      type: 'text',
      data: {
        heading: '',
        content: parsedContent.content.conclusion,
      },
      order: order++,
    });
  }

  // Final CTA block
  if (parsedContent.finalCtaHeading || parsedContent.finalCtaParagraph) {
    blocks.push({
      id: 'final-cta',
      type: 'cta',
      data: {
        heading: parsedContent.finalCtaHeading,
        content: parsedContent.finalCtaParagraph,
        buttonText: parsedContent.finalCtaButtonText,
      },
      order: order++,
    });
  }

  return blocks;
}
