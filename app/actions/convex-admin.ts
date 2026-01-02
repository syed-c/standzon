'use server';

import { getGlobalPagesStatistics, generateAllGlobalPages } from '@/lib/server/convex/admin';

export async function getGlobalPagesStatisticsAction() {
  try {
    const stats = await getGlobalPagesStatistics();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error in getGlobalPagesStatisticsAction:', error);
    return { success: false, error: 'Failed to fetch global pages statistics' };
  }
}

export async function generateAllGlobalPagesAction() {
  try {
    const pages = await generateAllGlobalPages();
    return { success: true, data: pages };
  } catch (error) {
    console.error('Error in generateAllGlobalPagesAction:', error);
    return { success: false, error: 'Failed to generate all global pages' };
  }
}
