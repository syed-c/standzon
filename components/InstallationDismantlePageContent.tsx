"use client";

import ServiceDetailPage from "@/components/ServiceDetailPage";
import { installationDismantleContent } from "@/lib/data/servicePagesContent";

export default function InstallationDismantlePageContent() {
  return <ServiceDetailPage content={installationDismantleContent} />;
}
