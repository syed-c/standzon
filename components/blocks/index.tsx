/**
 * Block Renderer
 * Server component that renders content blocks using the block registry
 */

import { ParsedContentBlock } from '@/lib/server/content/types';
import { getBlockComponent } from './registry';

interface BlockRendererProps {
  blocks: ParsedContentBlock[];
  blockOrder?: string[];
  className?: string;
}

/**
 * Main Block Renderer
 * Renders blocks in the order they appear in the content
 */
export function BlockRenderer({ blocks, blockOrder, className = '' }: BlockRendererProps) {
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  // If a custom order is provided, filter and sort blocks accordingly
  let blocksToRender = sortedBlocks;
  if (blockOrder && blockOrder.length > 0) {
    const orderMap = new Map(blockOrder.map((id, index) => [id, index]));
    blocksToRender = sortedBlocks
      .filter(block => orderMap.has(block.id))
      .sort((a, b) => {
        const aIndex = orderMap.get(a.id) ?? 999;
        const bIndex = orderMap.get(b.id) ?? 999;
        return aIndex - bIndex;
      });
  }

  if (blocksToRender.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {blocksToRender.map((block) => {
        const BlockComponent = getBlockComponent(block.type as any);
        
        if (!BlockComponent) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }

        return (
          <section 
            key={block.id} 
            id={block.id}
            className={`block-section block-${block.type} mb-12`}
          >
            <BlockComponent data={block.data} />
          </section>
        );
      })}
    </div>
  );
}

/**
 * Render a single block by ID
 */
export function BlockById({ 
  blocks, 
  blockId, 
  className = '' 
}: { 
  blocks: ParsedContentBlock[]; 
  blockId: string; 
  className?: string;
}) {
  const block = blocks.find(b => b.id === blockId);
  
  if (!block) {
    return null;
  }

  const BlockComponent = getBlockComponent(block.type as any);
  
  if (!BlockComponent) {
    return null;
  }

  return (
    <section id={blockId} className={className}>
      <BlockComponent data={block.data} />
    </section>
  );
}
