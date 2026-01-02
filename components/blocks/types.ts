/**
 * Block type definitions for content rendering
 */

export interface BaseBlockProps {
  data: any;
  className?: string;
}

export interface BlockConfig {
  component: React.ComponentType<BaseBlockProps>;
  isServerComponent: boolean;
  lazyLoad?: boolean;
}

export type BlockType = 
  | 'hero'
  | 'stats'
  | 'text'
  | 'why-choose'
  | 'services'
  | 'venue'
  | 'gallery'
  | 'builder-advantages'
  | 'builders-list'
  | 'cities-list'
  | 'conclusion'
  | 'cta'
  | 'map';
