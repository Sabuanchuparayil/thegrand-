"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export default function HeroSection({
  headline = "Timeless Elegance, Cultural Heritage",
  subheadline = "Discover our exquisite collection of luxury jewelry, crafted for the modern connoisseur",
  videoUrl,
  imageUrl,
}: HeroSectionProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald via-emerald-dark to-charcoal" />
        )}
        <div className="absolute inset-0 bg-charcoal/40" />
      </div>

      {/* Sparkle Overlay */}
      <div className="absolute inset-0 z-10 sparkle-overlay" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 text-gold mx-auto animate-sparkle" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 text-shadow-luxury"
          >
            <span className="gold-gradient bg-clip-text text-transparent">
              {headline}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl sm:text-2xl text-diamond mb-10 max-w-2xl mx-auto"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link
              href="/collections"
              className="inline-block px-8 py-4 bg-gold text-charcoal font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover-glow border-2 border-gold-dark shadow-lg"
            >
              Explore the Collection
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-gold rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 bg-gold rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}


