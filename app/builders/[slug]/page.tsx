import { notFound } from "next/navigation";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import BuilderProfileClient from "./BuilderProfileClient";

// Server component wrapper that handles params
export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log("🔍 Server: Looking for builder with slug:", slug);

  // Only use unified platform data in production
  const unifiedBuilders = unifiedPlatformAPI.getBuilders();
  const builder = unifiedBuilders.find((b) => b.slug === slug);

  if (!builder) {
    console.log("❌ Server: Builder not found with slug:", slug);
    notFound();
  }

  console.log("✅ Server: Found builder:", builder.companyName);
  return <BuilderProfileClient slug={slug} initialBuilder={builder} />;
}
