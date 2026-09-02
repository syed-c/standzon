"use client";

import ServiceDetailPage from "@/components/ServiceDetailPage";
import { customBoothContent } from "@/lib/data/servicePagesContent";

export default function CustomBoothPageContent() {
  return <ServiceDetailPage content={customBoothContent} />;
}
