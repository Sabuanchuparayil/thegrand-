"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "London, UK",
    text: "The craftsmanship is exceptional. My bridal set exceeded all expectations and honored our cultural traditions beautifully.",
    cultural: "South Asian",
  },
  {
    name: "Fatima Al-Rashid",
    location: "Manchester, UK",
    text: "Finally found jewelry that reflects my heritage while maintaining modern elegance. The AR try-on feature was incredible!",
    cultural: "Middle Eastern",
  },
  {
    name: "Sarah Johnson",
    location: "Birmingham, UK",
    text: "The attention to detail and quality is unmatched. This is true luxury jewelry that will be treasured for generations.",
    cultural: "Western European",
  },
  {
    name: "Amina Okafor",
    location: "Leeds, UK",
    text: "Beautiful pieces that celebrate African aesthetics with contemporary design. Absolutely stunning work!",
    cultural: "African",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald/5 to-gold/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-charcoal/70">
            Testimonials from our diverse community of jewelry lovers
          </p>
        </motion.div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 sm:p-12 rounded-2xl luxury-shadow relative"
        >
          <Quote className="w-12 h-12 text-gold/30 absolute top-6 left-6" />
          <div className="relative z-10">
            <p className="text-xl text-charcoal/80 mb-6 leading-relaxed italic">
              "{testimonials[currentIndex].text}"
            </p>
            <div className="border-t border-charcoal/10 pt-6">
              <p className="font-semibold text-charcoal text-lg">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-charcoal/50 text-sm">
                {testimonials[currentIndex].location} •{" "}
                {testimonials[currentIndex].cultural}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-emerald w-8"
                  : "bg-charcoal/30 hover:bg-charcoal/50"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



