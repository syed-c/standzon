/**
 * Block Registry
 * Maps block types to their components
 */

import { BlockConfig, BlockType } from './types';
import HeroBlock from './HeroBlock';
import StatsBlock from './StatsBlock';
import TextBlock from './TextBlock';
import WhyChooseBlock from './WhyChooseBlock';
import BuildersListBlock from './BuildersListBlock';
import CitiesListBlock from './CitiesListBlock';
import CtaBlock from './CtaBlock';

// Registry of all available blocks
export const BLOCK_REGISTRY: Record<BlockType, BlockConfig> = {
  hero: {
    component: HeroBlock,
    isServerComponent: true,
  },
  stats: {
    component: StatsBlock,
    isServerComponent: true,
  },
  text: {
    component: TextBlock,
    isServerComponent: true,
  },
  'why-choose': {
    component: WhyChooseBlock,
    isServerComponent: true,
  },
  services: {
    component: TextBlock,
    isServerComponent: true,
  },
  venue: {
    component: TextBlock,
    isServerComponent: true,
  },
  'builder-advantages': {
    component: TextBlock,
    isServerComponent: true,
  },
  'builders-list': {
    component: BuildersListBlock,
    isServerComponent: false,
  },
  'cities-list': {
    component: CitiesListBlock,
    isServerComponent: true,
  },
  conclusion: {
    component: TextBlock,
    isServerComponent: true,
  },
  cta: {
    component: CtaBlock,
    isServerComponent: true,
  },
  // Placeholder blocks for future implementation
  gallery: {
    component: TextBlock,
    isServerComponent: true,
  },
  map: {
    component: TextBlock,
    isServerComponent: true,
  },
};

/**
 * Get block component by type
 */
export function getBlockComponent(type: BlockType) {
  return BLOCK_REGISTRY[type]?.component;
}

/**
 * Check if a block is a server component
 */
export function isServerBlock(type: BlockType): boolean {
  return BLOCK_REGISTRY[type]?.isServerComponent ?? true;
}

/**
 * Check if a block should be lazy loaded
 */
export function shouldLazyLoad(type: BlockType): boolean {
  return BLOCK_REGISTRY[type]?.lazyLoad ?? false;
}

/**
 * Get all block types
 */
export function getBlockTypes(): BlockType[] {
  return Object.keys(BLOCK_REGISTRY) as BlockType[];
}
