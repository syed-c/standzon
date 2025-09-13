'use client';

import React, { Suspense, lazy } from 'react';

// ✅ PERFORMANCE: Lazy load chart components only when needed
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })));
const AreaChart = lazy(() => import('recharts').then(module => ({ default: module.AreaChart })));
const Area = lazy(() => import('recharts').then(module => ({ default: module.Area })));
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const Bar = lazy(() => import('recharts').then(module => ({ default: module.Bar })));
const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
const Pie = lazy(() => import('recharts').then(module => ({ default: module.Pie })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));
const Legend = lazy(() => import('recharts').then(module => ({ default: module.Legend })));
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));
const Cell = lazy(() => import('recharts').then(module => ({ default: module.Cell })));

interface OptimizedChartProps {
  type: 'line' | 'area' | 'bar' | 'pie';
  data: any[];
  width?: number;
  height?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function OptimizedChart({ 
  type, 
  data, 
  width = 400, 
  height = 300, 
  className = '',
  children 
}: OptimizedChartProps) {
  const ChartComponent = React.useMemo(() => {
    switch (type) {
      case 'line':
        return LineChart;
      case 'area':
        return AreaChart;
      case 'bar':
        return BarChart;
      case 'pie':
        return PieChart;
      default:
        return LineChart;
    }
  }, [type]);

  return (
    <div className={`optimized-chart ${className}`} style={{ width, height }}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg animate-pulse">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      }>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            {children}
          </ChartComponent>
        </ResponsiveContainer>
      </Suspense>
    </div>
  );
}

// Export individual components for specific use cases
export { 
  Line, 
  Area, 
  Bar, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
};
