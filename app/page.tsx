import HomePageContent from "@/components/HomePageContent";
import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata["/"];

// Featured builders section removed for production

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return <HomePageContent />;
}
