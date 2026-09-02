"use client";

import ServiceDetailPage from "@/components/ServiceDetailPage";
import { projectManagementContent } from "@/lib/data/servicePagesContent";

export default function ProjectManagementPageContent() {
  return <ServiceDetailPage content={projectManagementContent} />;
}
