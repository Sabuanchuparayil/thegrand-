"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  DollarSign,
  Mail,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  Palette,
} from "lucide-react";
import { signOut } from "next-auth/react";

const adminMenuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Marketing", href: "/admin/marketing", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings   },
];

function AdminNavItems({ onItemClick }: { onItemClick: () => void }) {
  const pathname = usePathname();
  
  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-gold text-white"
                    : "text-charcoal hover:bg-gold/10 hover:text-gold"
                }`}
                onClick={onItemClick}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?redirect=/admin");
    } else if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (userRole !== "admin" && userRole !== "manager") {
        router.push("/");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-4 animate-pulse" />
          <p className="text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  const userRole = (session?.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-gold text-white p-2 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gold/20 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gold/20">
            <Link href="/admin" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-gold" />
              <span className="text-xl font-serif font-bold gold-gradient">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gold/20">
            <p className="text-sm text-charcoal/70">Logged in as</p>
            <p className="font-semibold text-charcoal">
              {session.user?.name || session.user?.email}
            </p>
            <p className="text-xs text-gold capitalize">
              {(session.user as any)?.role || "admin"}
            </p>
          </div>

          {/* Navigation */}
          <AdminNavItems onItemClick={() => setMobileMenuOpen(false)} />

          {/* Footer */}
          <div className="p-4 border-t border-gold/20">
            <Link
              href="/"
              className="block mb-2 text-sm text-charcoal/70 hover:text-gold transition-colors"
            >
              ← Back to Store
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center space-x-2 w-full text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`lg:ml-64 transition-all duration-300`}>
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

