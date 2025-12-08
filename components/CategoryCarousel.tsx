"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const categories = [
  { name: "Traditional Indian Bridal", href: "/collections/traditional-indian", icon: "👑" },
  { name: "Contemporary Minimalist", href: "/collections/contemporary", icon: "✨" },
  { name: "Middle Eastern Ornate", href: "/collections/middle-eastern", icon: "🌙" },
  { name: "Western Engagement", href: "/collections/western-engagement", icon: "💍" },
  { name: "Afro-Caribbean", href: "/collections/afro-caribbean", icon: "🌟" },
  { name: "Heritage Classics", href: "/collections/heritage-classics", icon: "🏛️" },
];

export default function CategoryCarousel() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-diamond overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal mb-2">
            Explore by Culture
          </h2>
          <p className="text-charcoal/70">
            Discover collections designed for every heritage
          </p>
        </motion.div>

        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex-shrink-0 snap-start"
            >
              <Link href={category.href}>
                <div className="w-64 h-48 glass-morphism rounded-2xl p-6 flex flex-col items-center justify-center text-center hover-glow transition-all duration-300 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-charcoal group-hover:text-emerald transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

