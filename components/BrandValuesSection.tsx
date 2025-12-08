"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Globe, Award } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Craftsmanship",
    description:
      "Each piece is meticulously crafted by master artisans, ensuring unparalleled quality and attention to detail.",
  },
  {
    icon: Globe,
    title: "Cultural Heritage",
    description:
      "Celebrating diverse traditions and cultural richness, our designs honor heritage while embracing modernity.",
  },
  {
    icon: Heart,
    title: "Timeless Elegance",
    description:
      "Creating jewelry that transcends trends, designed to be cherished for generations to come.",
  },
  {
    icon: Sparkles,
    title: "Luxury Redefined",
    description:
      "A commitment to excellence, where every piece tells a story of sophistication and refinement.",
  },
];

export default function BrandValuesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-diamond">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal mb-4">
            Our Values
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            The principles that guide our craft and define our brand
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-8 rounded-lg luxury-shadow hover-glow group"
              >
                <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-red/20 transition-colors">
                  <Icon className="w-8 h-8 text-red" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-charcoal mb-4">
                  {value.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

