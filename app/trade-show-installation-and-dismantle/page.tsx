"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InstallationDismantlePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trade Show Installation & Dismantle
          </h1>
          <p className="text-gray-600 mb-8">
            End-to-end I&D services for a flawless show experience, from
            logistics to on-site execution.
          </p>
          <div className="flex gap-3 mb-12">
            <Link href="/builders">
              <Button className="bg-blue-primary hover:bg-blue-dark text-white">
                Find Builders
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-900"
              >
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
