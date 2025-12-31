import { notFound } from "next/navigation";

export default async function TestDynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  console.log("Test dynamic page with slug:", slug);
  
  // Simple test - always show something
  if (slug) {
    return (
      <div>
        <h1>Test Dynamic Page</h1>
        <p>Slug: {slug}</p>
        <p>Length: {slug.length}</p>
      </div>
    );
  }
  
  notFound();
}