"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const shopCategories = [
  { name: "Necklaces", href: "/shop/necklaces" },
  { name: "Earrings", href: "/shop/earrings" },
  { name: "Rings", href: "/shop/rings" },
  { name: "Bracelets", href: "/shop/bracelets" },
  { name: "Bangles", href: "/shop/bangles" },
  { name: "Pendants", href: "/shop/pendants" },
];

interface Collection {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export default function Footer() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        if (response.ok) {
          const data = await response.json();
          setCollections(data.collections || []);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        setCollections([]);
      }
    };

    fetchCollections();
  }, []);

  // Limit to first 5 collections for footer
  const culturalCategories = collections.slice(0, 5).map((collection) => ({
    name: collection.title,
    href: `/collections/${collection.slug?.current || collection.slug}`,
  }));
  return (
    <footer className="bg-charcoal text-diamond mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-gold" />
              <span className="text-2xl font-serif font-bold text-gold">
                THE GRAND
              </span>
            </div>
            <p className="text-diamond/70 text-sm">
              A global luxury jewelry house rooted in craftsmanship, celebrating
              cultural diversity and timeless elegance.
            </p>
            <p className="text-sm text-gold font-serif italic">
              "A PROMISING BRAND"
            </p>
          </div>

          {/* Cultural Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold mb-4">
              Cultural Collections
            </h3>
            <ul className="space-y-2">
              {culturalCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-diamond/70 hover:text-gold transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold mb-4">
              Shop by Category
            </h3>
            <ul className="space-y-2">
              {shopCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-diamond/70 hover:text-gold transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-diamond/70 text-sm">
                  UK Store Location
                  <br />
                  (Details Coming Soon)
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <Link
                  href="/store"
                  className="text-diamond/70 hover:text-gold transition-colors text-sm"
                >
                  Send Enquiry
                </Link>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-diamond/70 text-sm">
                  Contact via Enquiry Form
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-diamond/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-diamond/50 text-sm">
              © {new Date().getFullYear()} THE GRAND GOLD & DIAMONDS. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/our-story"
                className="text-diamond/50 hover:text-gold transition-colors text-sm"
              >
                Our Story
              </Link>
              <Link
                href="/store"
                className="text-diamond/50 hover:text-gold transition-colors text-sm"
              >
                Store & Inauguration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


