/**
 * Stats Block - Server Component
 * Displays builder statistics
 */

import { BaseBlockProps } from './types';

interface StatsData {
  totalBuilders: number;
  averageRating: number;
  verifiedBuilders: number;
  totalProjects: number;
}

interface StatsBlockProps extends BaseBlockProps {
  stats?: StatsData;
}

export default function StatsBlock({ stats, className = '' }: StatsBlockProps) {
  const statsData = stats || {
    totalBuilders: 0,
    averageRating: 4.8,
    verifiedBuilders: 0,
    totalProjects: 0
  };

  return (
    <div className={`bg-white/15 backdrop-blur-sm rounded-xl p-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl lg:text-4xl font-bold text-white">
            {statsData.totalBuilders}+
          </div>
          <div className="text-blue-200 text-sm lg:text-base">
            Verified Builders
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-4xl font-bold text-white">
            {statsData.averageRating}
          </div>
          <div className="text-blue-200 text-sm lg:text-base">
            Average Rating
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-4xl font-bold text-white">
            {statsData.totalProjects}
          </div>
          <div className="text-blue-200 text-sm lg:text-base">
            Projects Completed
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-4xl font-bold text-white">
            $450
          </div>
          <div className="text-blue-200 text-sm lg:text-base">
            Avg. Price/sqm
          </div>
        </div>
      </div>
    </div>
  );
}
