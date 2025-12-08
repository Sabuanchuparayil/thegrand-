"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

interface InaugurationEvent {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  image?: any;
}

interface InaugurationAnnouncementProps {
  event?: InaugurationEvent;
}

export default function InaugurationAnnouncement({
  event,
}: InaugurationAnnouncementProps) {
  const defaultEvent: InaugurationEvent = {
    title: "UK Inauguration Launch",
    description:
      "Join us for the grand opening of THE GRAND GOLD & DIAMONDS in the UK. Experience our luxury collections and meet our master craftsmen.",
    date: "Coming Soon",
    location: "London, United Kingdom",
  };

  const displayEvent = event || defaultEvent;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-diamond">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-gold" />
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal">
              {displayEvent.title}
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          {displayEvent.image && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl overflow-hidden luxury-shadow"
            >
              <Image
                src={displayEvent.image}
                alt={displayEvent.title || "Inauguration"}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {displayEvent.description && (
              <p className="text-lg text-charcoal/70 leading-relaxed">
                {displayEvent.description}
              </p>
            )}

            <div className="space-y-4">
              {displayEvent.date && (
                <div className="flex items-start space-x-4">
                  <Calendar className="w-6 h-6 text-emerald mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-charcoal">Date</p>
                    <p className="text-charcoal/70">{displayEvent.date}</p>
                  </div>
                </div>
              )}

              {displayEvent.location && (
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-emerald mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-charcoal">Location</p>
                    <p className="text-charcoal/70">{displayEvent.location}</p>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/store"
              className="inline-block px-8 py-4 bg-emerald text-white font-semibold rounded-lg hover:bg-emerald-dark transition-all duration-300 hover-glow"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

