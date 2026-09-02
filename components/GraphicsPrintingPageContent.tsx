"use client";

import ServiceDetailPage from "@/components/ServiceDetailPage";
import { graphicsPrintingContent } from "@/lib/data/servicePagesContent";

export default function GraphicsPrintingPageContent() {
  return <ServiceDetailPage content={graphicsPrintingContent} />;
}
