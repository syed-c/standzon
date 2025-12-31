import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";

export default async function TestBuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  console.log("Test builder page with ID:", id);
  
  // Try to find builder by ID
  const sb = getServerSupabase();
  if (sb) {
    const { data: builder, error } = await sb
      .from('builder_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error || !builder) {
      console.log("Builder not found with ID:", id);
      notFound();
    }
    
    return (
      <div>
        <h1>Test Builder Page</h1>
        <p>ID: {builder.id}</p>
        <p>Name: {builder.company_name}</p>
        <p>Slug: {builder.slug}</p>
      </div>
    );
  }
  
  notFound();
}