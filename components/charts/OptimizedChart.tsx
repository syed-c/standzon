'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

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
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
          {children}
        </ChartComponent>
      </ResponsiveContainer>
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
