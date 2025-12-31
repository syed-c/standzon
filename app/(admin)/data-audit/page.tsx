'use client';

import React from 'react';
import DataAuditSystem from '@/components/admin/DataAuditSystem';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function DataAuditPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      {/* main content only, no old Navigation/Footer. */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Exhibition Data Audit System
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mt-4">
              Comprehensive data completeness analysis and automated publishing
            </p>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Real-Time</div>
                <div className="text-blue-200">Data Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Auto-Publish</div>
                <div className="text-blue-200">Missing Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Global</div>
                <div className="text-blue-200">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DataAuditSystem />
        </div>
      </section>
    </AdminLayout>
  );
}