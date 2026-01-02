"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '@/components/shared/button';

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
    content: "ExhibitBay helped us find the perfect builder for our trade show in Berlin. The quality was exceptional and we saved 30% compared to our previous vendor. Highly recommended!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b1e2c947?w=150&h=150&fit=crop&crop=face",
    location: "Berlin, Germany"
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Innovation Labs",
    role: "CEO",
    content: "The platform made it incredibly easy to compare quotes from multiple builders. We found a reliable partner who delivered our custom booth on time and within budget.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "San Francisco, USA"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    company: "Green Energy Corp",
    role: "Events Manager",
    content: "Outstanding service from start to finish. The builders were professional, creative, and delivered exactly what we envisioned. Our booth was the talk of the trade show!",
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

  console.log("TestimonialsCarousel: Component rendered");

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    console.log("TestimonialsCarousel: Next testimonial");
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    console.log("TestimonialsCarousel: Previous testimonial");
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    console.log("TestimonialsCarousel: Go to slide", index);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied clients who found their perfect exhibition stand builders through our platform
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="relative h-80 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 h-full flex flex-col justify-between border border-gray-100">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 text-gold-primary fill-current" />
                      ))}
                    </div>

                    {/* Content */}
                    <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                      "{testimonials[currentIndex].content}"
                    </blockquote>
                  </div>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ring-blue-primary/10">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 text-lg">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-blue-primary font-medium">
                        {testimonials[currentIndex].role}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonials[currentIndex].company} • {testimonials[currentIndex].location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prevTestimonial}
              className="rounded-full w-12 h-12 p-0 border-2 hover:border-blue-primary hover:text-blue-primary transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-primary scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextTestimonial}
              className="rounded-full w-12 h-12 p-0 border-2 hover:border-blue-primary hover:text-blue-primary transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}