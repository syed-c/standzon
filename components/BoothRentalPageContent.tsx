"use client";

import ServiceDetailPage from "@/components/ServiceDetailPage";
import { boothRentalContent } from "@/lib/data/servicePagesContent";

export default function BoothRentalPageContent() {
  return <ServiceDetailPage content={boothRentalContent} />;
}
