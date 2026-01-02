"use client";

/**
 * Builders List Block - Client Component (Lazy)
 * Displays filtered and paginated builders with search and sort
 * This component is interactive, so it's a client component
 */

import { useState } from 'react';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Card, CardContent } from '@/components/shared/card';
import { Search, Filter, Grid, List, Building2 } from 'lucide-react';
import { BuilderCard } from '@/components/client/BuilderCard';
import { BaseBlockProps } from './types';

interface BuildersListData {
  builders: any[];
  heading?: string;
  intro?: string;
}

const BUILDERS_PER_PAGE = 12;

export default function BuildersListBlock({ data, className = '' }: BaseBlockProps) {
  const buildersListData = data as BuildersListData;
  const builders = buildersListData.builders || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "projects" | "name">("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter builders
  const filteredBuilders = builders.filter((builder: any) => {
    const search = searchTerm.toLowerCase();
    const nameText = (builder.companyName || "").toLowerCase();
    const descText = (builder.companyDescription || "").toLowerCase();
    const cityText = (builder.headquarters?.city || "").toLowerCase();
    
    return !search || 
           nameText.includes(search) ||
           descText.includes(search) ||
           cityText.includes(search);
  });

  // Sort builders
  filteredBuilders.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "projects":
        return b.projectsCompleted - a.projectsCompleted;
      case "name":
        return a.companyName.localeCompare(b.companyName);
      default:
        return b.rating - a.rating;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredBuilders.length / BUILDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * BUILDERS_PER_PAGE;
  const currentBuilders = filteredBuilders.slice(startIndex, startIndex + BUILDERS_PER_PAGE);

  const handleSortChange = (value: string) => {
    setSortBy(value as "rating" | "projects" | "name");
    setCurrentPage(1);
  };

  return (
    <div className={className}>
      {buildersListData.heading && (
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {buildersListData.heading}
        </h2>
      )}
      {buildersListData.intro && (
        <p className="text-gray-600 mb-6">{buildersListData.intro}</p>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search builders..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Sort by Rating</option>
              <option value="projects">Sort by Projects</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600 mb-4">
        Showing {currentBuilders.length} of {filteredBuilders.length} builders
      </p>

      {/* Builders Grid */}
      {filteredBuilders.length === 0 ? (
        <Card className="p-8 text-center">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            {searchTerm ? "No builders match your search." : "No builders available."}
          </p>
        </Card>
      ) : (
        <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-1"}`}>
          {currentBuilders.map((builder: any) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
