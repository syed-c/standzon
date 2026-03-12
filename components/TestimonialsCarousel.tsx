"use client";

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechFlow Solutions",
    role: "Marketing Director",
    content: "Stands Zone transformed our European tour. Finding reliable local builders in three different countries was seamless and the quality was superior to anything we've had before.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b1e2c947?w=150&h=150&fit=crop&crop=face",
    location: "Berlin, Germany"
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Innovation Labs",
    role: "CEO",
    content: "The quote comparison tool saved us over 40 hours of manual research. We found a niche builder in Tokyo that perfectly matched our minimalist brand aesthetic.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "San Francisco, USA"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    company: "Green Energy Corp",
    role: "Events Manager",
    content: "Unrivaled database of quality partners. For high-stakes trade shows, this is the only platform we use to vet our construction teams.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    location: "Madrid, Spain"
  },
  {
    id: 4,
    name: "David Kumar",
    company: "MedTech Innovations",
    role: "VP Sales",
    content: "ExhibitBay's network of verified builders is impressive. We've used the platform for three different trade shows across Europe with consistently excellent results.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "London, UK"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4 uppercase">
            TRUSTED BY EXHIBITORS WORLDWIDE
          </h3>
          <div className="w-20 h-1 bg-[#1e3886] mx-auto"></div>
        </div>

        {/* Testimonials grid — show 3 at a time on desktop */}
        <div className="grid md:grid-cols-3 gap-10">
          {[0, 1, 2].map((offset) => {
            const idx = (currentIndex + offset) % testimonials.length;
            const t = testimonials[idx];
            return (
              <div key={t.id} className="p-8 border border-slate-100 shadow-sm relative">
                {/* Quote icon */}
                <div className="absolute -top-4 left-8 text-4xl text-slate-200 font-serif leading-none">&ldquo;</div>

                <p className="italic text-slate-600 leading-relaxed mt-4 mb-8">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-black text-[#0f172a] text-sm">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center mt-12 gap-6">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 hover:border-[#1e3886] transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#1e3886] scale-150'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 hover:border-[#1e3886] transition-colors"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}