"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Camera } from "lucide-react";
import Image from "next/image";

interface ARTeaserProps {
  title?: string;
  description?: string;
  image?: any;
}

export default function ARTeaser({
  title = "Experience AR Try-On",
  description = "See how our jewelry looks on you before you buy. Try on necklaces, earrings, and rings in augmented reality.",
  image,
}: ARTeaserProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-charcoal to-emerald-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="w-10 h-10 text-gold" />
              <h2 className="text-4xl sm:text-5xl font-serif font-bold">
                {title}
              </h2>
            </div>
            <p className="text-xl text-diamond/90 mb-8 leading-relaxed">
              {description}
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <Camera className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
                <span className="text-diamond/90">
                  Real-time 2D face tracking for necklaces and earrings
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
                <span className="text-diamond/90">
                  3D model viewing for rings and pendants
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Camera className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
                <span className="text-diamond/90">
                  Works on mobile and desktop devices
                </span>
              </li>
            </ul>
            <Link
              href="/ar-try-on"
              className="inline-block px-8 py-4 bg-gold text-charcoal font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover-glow"
            >
              Try It Now
            </Link>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden luxury-shadow"
          >
            {image ? (
              <Image
                src={image}
                alt="AR Try-On"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald to-gold flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-serif">AR Experience</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}



