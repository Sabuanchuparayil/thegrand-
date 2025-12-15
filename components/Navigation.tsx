"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, Sparkles, Shield, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import CartIcon from "./CartIcon";

interface Collection {
  _id: string;
  title: string;
  slug: string | { current: string };
}

const staticNavigationItems = [
  { name: "Home", href: "/" },
  {
    name: "Shop by Category",
    href: "/shop",
    submenu: [
      { name: "Necklaces", href: "/shop/necklaces" },
      { name: "Earrings", href: "/shop/earrings" },
      { name: "Rings", href: "/shop/rings" },
      { name: "Bracelets", href: "/shop/bracelets" },
      { name: "Bangles", href: "/shop/bangles" },
      { name: "Pendants", href: "/shop/pendants" },
      { name: "Men's Jewelry", href: "/shop/mens-jewelry" },
    ],
  },
  { name: "Explore by Culture", href: "/explore-by-culture" },
  { name: "Experience AR Try-On", href: "/ar-try-on" },
  { name: "Our Story", href: "/our-story" },
  { name: "Store & Inauguration", href: "/store" },
];

export default function Navigation() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "admin" || userRole === "manager";

  // Fetch collections dynamically
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
        // Fallback to empty array if fetch fails
        setCollections([]);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Build navigation items with dynamic collections
  const navigationItems = [
    { name: "Home", href: "/" },
    {
      name: "Collections",
      href: "/collections",
      submenu: collections.length > 0
        ? collections.map((collection) => {
            const slug = typeof collection.slug === 'string' 
              ? collection.slug 
              : (collection.slug?.current || '');
            return {
              name: collection.title,
              href: `/collections/${slug}`,
            };
          })
        : [
            // Fallback if no collections are loaded
            { name: "View All Collections", href: "/collections" },
          ],
    },
    ...staticNavigationItems.slice(1), // Add the rest of the static items
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Sparkles className="w-8 h-8 text-gold group-hover:animate-sparkle" />
            <span className="text-2xl font-serif font-bold gold-gradient">
              THE GRAND
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.submenu && setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className="text-charcoal hover:text-red transition-colors font-medium relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && hoveredItem === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-56 glass-morphism rounded-lg p-4 shadow-xl z-[60]"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-2 text-charcoal hover:text-red transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden lg:flex items-center space-x-1 text-charcoal hover:text-gold transition-colors"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium">Admin</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="hidden lg:flex items-center space-x-1 text-charcoal hover:text-gold transition-colors"
                  title="My Profile"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden lg:flex items-center space-x-1 text-charcoal/70 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden lg:flex items-center space-x-1 text-charcoal hover:text-gold transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
            <CartIcon />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-charcoal hover:text-red transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gold/20"
          >
            <div className="px-4 py-6 space-y-4">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 py-2 text-charcoal hover:text-red font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 py-2 text-gold hover:text-gold/80 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 py-2 text-red-600 hover:text-red-700 font-medium w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 py-2 text-charcoal hover:text-emerald font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block py-2 text-charcoal hover:text-emerald font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-1 text-charcoal/70 hover:text-red text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
