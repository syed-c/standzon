"use client";
import React from 'react';
import Image from 'next/image';

export default function Topbar() {
  return (
    <div className="h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="text-sm text-gray-500 truncate">
        <span className="text-gray-900 font-medium">Projects</span>
        <span className="mx-2">›</span>
        <span>Construction</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">House Spectrum Ltd</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-900 hover:bg-gray-200">Manage</button>
        <button className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-900 hover:bg-gray-200">Share</button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
          <Image alt="Avatar" src="/zonelogo1.png" width={32} height={32} />
        </div>
      </div>
    </div>
  );
}


