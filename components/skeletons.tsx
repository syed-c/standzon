import React from 'react';

export function HeroSkeleton() {
    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900 animate-pulse">
            <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
                <div className="space-y-8 flex flex-col items-center">
                    <div className="h-12 md:h-20 bg-gray-800 rounded-lg w-3/4 max-w-2xl"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2 max-w-lg"></div>
                    <div className="h-32 bg-gray-800 rounded w-full max-w-3xl"></div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mt-8">
                        <div className="h-16 bg-gray-800 rounded"></div>
                        <div className="h-16 bg-gray-800 rounded"></div>
                        <div className="h-16 bg-gray-800 rounded"></div>
                        <div className="h-16 bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MetricsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
        </div>
    );
}

export function LeadsSkeleton() {
    return (
        <div className="py-12 md:py-16 bg-gray-50/50 animate-pulse">
            <div className="max-w-7xl mx-auto px-4">
                <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        </div>
    );
}
