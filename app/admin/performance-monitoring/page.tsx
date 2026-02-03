import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import PerformanceMonitoringClient from './PerformanceMonitoringClient';

export const metadata: Metadata = siteMetadata['/admin/performance-monitoring'] || {
  title: 'Performance Monitoring | Admin Dashboard',
  description: 'Monitor platform performance, caching efficiency, and system metrics'
};

export default function PerformanceMonitoringPage() {
  return <PerformanceMonitoringClient />;
}