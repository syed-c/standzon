import { createServerClient } from '../supabase';
import { cache } from 'react';

export const getPageContent = cache(async (path: string) => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('page_contents')
    .select('*')
    .eq('id', path === '/' ? 'home' : path)
    .single();
  
  if (error) {
    // try different ID format if path doesn't work
    const { data: data2, error: error2 } = await supabase
      .from('page_contents')
      .select('*')
      .eq('path', path)
      .single();
    
    if (error2) {
      console.warn(`No page content found for path: ${path}`);
      return null;
    }
    return data2.content;
  }
  return data.content;
});

export async function updatePageContent(path: string, content: any) {
  const supabase = createServerClient();
  const id = path === '/' ? 'home' : path;
  const { data, error } = await supabase
    .from('page_contents')
    .upsert({
      id,
      path,
      content,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
