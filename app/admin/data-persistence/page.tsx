'use client';

import React from 'react';
import DataPersistenceMonitor from '@/components/DataPersistenceMonitor';

export default function DataPersistencePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <DataPersistenceMonitor />
      </div>
    </div>
  );
}