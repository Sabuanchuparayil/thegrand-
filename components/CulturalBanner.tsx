"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const culturalHighlights = [
  {
    title: "Diwali Collection",
    description: "Celebrate the Festival of Lights with our exquisite gold jewelry",
    image: "/images/cultural/diwali.jpg",
    season: "autumn",
  },
  {
    title: "Eid Collection",
    description: "Elegant pieces for your special celebrations",
    image: "/images/cultural/eid.jpg",
    season: "spring",
  },
  {
    title: "Wedding Season",
    description: "Bridal jewelry that honors tradition and modern elegance",
    image: "/images/cultural/wedding.jpg",
    season: "all",
  },
  {
    title: "Christmas Collection",
    description: "Luxury pieces for the holiday season",
    image: "/images/cultural/christmas.jpg",
    season: "winter",
  },
];

export default function CulturalBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % culturalHighlights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentHighlight = culturalHighlights[currentIndex];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald/5 to-gold/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal mb-4">
            Celebrating Cultural Diversity
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Our collections honor traditions from around the world, creating
            jewelry that resonates with every culture
          </p>
        </motion.div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="relative h-96 rounded-2xl overflow-hidden luxury-shadow"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald/80 to-charcoal/60 z-10" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="px-8 sm:px-12 lg:px-16 text-white">
              <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                {currentHighlight.title}
              </h3>
              <p className="text-xl text-diamond/90 max-w-2xl">
                {currentHighlight.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Indicator Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {culturalHighlights.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-emerald w-8"
                  : "bg-charcoal/30 hover:bg-charcoal/50"
              }`}
              aria-label={`Go to ${culturalHighlights[index].title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

