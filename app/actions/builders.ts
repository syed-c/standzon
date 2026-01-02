'use server';

import { 
  getBuilders as dbGetBuilders, 
  getBuilderBySlug as dbGetBuilderBySlug,
  createBuilder as dbCreateBuilder,
  updateBuilder as dbUpdateBuilder,
  deleteBuilder as dbDeleteBuilder
} from '@/lib/server/db/builders';
import { revalidatePath } from 'next/cache';

export async function getBuildersAction() {
  try {
    const builders = await dbGetBuilders();
    return { success: true, data: builders };
  } catch (error) {
    console.error('Error in getBuildersAction:', error);
    return { success: false, error: 'Failed to fetch builders' };
  }
}

export async function getBuilderBySlugAction(slug: string) {
  try {
    const builder = await dbGetBuilderBySlug(slug);
    return { success: true, data: builder };
  } catch (error) {
    console.error('Error in getBuilderBySlugAction:', error);
    return { success: false, error: 'Failed to fetch builder' };
  }
}

export async function updateBuilderAction(builderId: string, updates: any) {
  try {
    // Basic auth check would go here
    const updated = await dbUpdateBuilder(builderId, updates);
    revalidatePath('/admin/builders');
    revalidatePath(`/builders/${updated.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error in updateBuilderAction:', error);
    return { success: false, error: 'Failed to update builder' };
  }
}

export async function deleteBuilderAction(builderId: string) {
  try {
    await dbDeleteBuilder(builderId);
    revalidatePath('/admin/builders');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteBuilderAction:', error);
    return { success: false, error: 'Failed to delete builder' };
  }
}

export async function createBuilderAction(builderData: any) {
  try {
    const created = await dbCreateBuilder(builderData);
    revalidatePath('/admin/builders');
    return { success: true, data: created };
  } catch (error) {
    console.error('Error in createBuilderAction:', error);
    return { success: false, error: 'Failed to create builder' };
  }
}
