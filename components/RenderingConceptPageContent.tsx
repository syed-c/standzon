"use client";

import ServiceDetailPage from "@/components/ServiceDetailPage";
import { renderingConceptContent } from "@/lib/data/servicePagesContent";

export default function RenderingConceptPageContent() {
  return <ServiceDetailPage content={renderingConceptContent} />;
}
