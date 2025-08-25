"use client";

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BoothRentalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Booth Rental Services</h1>
          <p className="text-gray-600 mb-8">Flexible, cost-effective exhibition booth rental solutions with full setup and support.</p>
          <div className="flex gap-3 mb-12">
            <Link href="/builders">
              <Button className="bg-blue-primary hover:bg-blue-dark text-white">Find Builders</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-gray-300 text-gray-900">Request Quote</Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-2">What we offer</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Modular and custom booth rental options</li>
              <li>Complete installation and dismantle</li>
              <li>Graphics, furniture, lighting, and AV</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 