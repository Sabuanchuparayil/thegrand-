"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  Lock,
  Heart,
  ShoppingBag,
  CreditCard,
  Bell,
  Shield,
  FileText,
  Trash2,
  Download,
} from "lucide-react";
import Link from "next/link";

interface ProfileTab {
  id: string;
  name: string;
  icon: any;
}

const profileTabs: ProfileTab[] = [
  { id: "profile", name: "Profile", icon: User },
  { id: "orders", name: "My Orders", icon: ShoppingBag },
  { id: "addresses", name: "Addresses", icon: MapPin },
  { id: "payment", name: "Payment Methods", icon: CreditCard },
  { id: "preferences", name: "Preferences", icon: Settings },
  { id: "security", name: "Security", icon: Lock },
  { id: "gdpr", name: "Privacy & GDPR", icon: Shield },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?redirect=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/users/me`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const handleSaveProfile = async (formData: any) => {
    setSaving(true);
    try {
      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updated = await response.json();
        setUserData(updated);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-charcoal/70">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  const userRole = (session?.user as any)?.role;

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
              My Account
            </h1>
            <p className="text-charcoal/70">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg luxury-shadow p-6 sticky top-24">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b border-charcoal/10">
                  <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-gold">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-charcoal">
                    {session?.user?.name || "User"}
                  </h3>
                  <p className="text-sm text-charcoal/60">
                    {session?.user?.email}
                  </p>
                  {userRole && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-gold/20 text-gold rounded-full capitalize">
                      {userRole}
                    </span>
                  )}
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                  {profileTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                          activeTab === tab.id
                            ? "bg-gold text-charcoal font-semibold"
                            : "text-charcoal/70 hover:bg-charcoal/5"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <ProfileTabContent
                  userData={userData}
                  session={session}
                  onSave={handleSaveProfile}
                  saving={saving}
                />
              )}
              {activeTab === "orders" && <OrdersTabContent />}
              {activeTab === "addresses" && <AddressesTabContent userData={userData} onSave={handleSaveProfile} />}
              {activeTab === "payment" && <PaymentTabContent />}
              {activeTab === "preferences" && <PreferencesTabContent userData={userData} onSave={handleSaveProfile} />}
              {activeTab === "security" && <SecurityTabContent />}
              {activeTab === "gdpr" && <GDPRTabContent />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Profile Tab Component
function ProfileTabContent({
  userData,
  session,
  onSave,
  saving,
}: {
  userData: any;
  session: any;
  onSave: (data: any) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    name: userData?.name || session?.user?.name || "",
    phone: userData?.phone || "",
    whatsapp: userData?.whatsapp || "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        whatsapp: userData.whatsapp || "",
      });
    }
  }, [userData]);

  return (
    <div className="bg-white rounded-lg luxury-shadow p-6">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
        <User className="w-6 h-6" />
        Personal Information
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Email
          </label>
          <input
            type="email"
            value={session?.user?.email || ""}
            disabled
            className="w-full px-4 py-3 border border-charcoal/20 rounded-lg bg-charcoal/5 text-charcoal/50"
          />
          <p className="text-xs text-charcoal/50 mt-1">
            Email cannot be changed
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="+44 7123 456789"
            className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <p className="text-xs text-charcoal/50 mt-1">
            Include country code for WhatsApp marketing communications
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-gold text-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

// Orders Tab Component
function OrdersTabContent() {
  return (
    <div className="bg-white rounded-lg luxury-shadow p-6">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" />
        My Orders
      </h2>
      <Link
        href="/orders"
        className="inline-block text-gold hover:text-gold/80 font-semibold mb-4"
      >
        View All Orders →
      </Link>
      <p className="text-charcoal/70">
        Your order history will appear here. Visit the Orders page to see all your orders.
      </p>
    </div>
  );
}

// Addresses Tab Component
function AddressesTabContent({
  userData,
  onSave,
}: {
  userData: any;
  onSave: (data: any) => void;
}) {
  const [addresses, setAddresses] = useState(
    userData?.addresses || [
      { label: "Home", street: "", city: "", postalCode: "", country: "United Kingdom" },
    ]
  );

  return (
    <div className="bg-white rounded-lg luxury-shadow p-6">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6" />
        Saved Addresses
      </h2>
      <div className="space-y-4">
        {addresses.map((address: any, index: number) => (
          <div key={index} className="border border-charcoal/20 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-charcoal">{address.label || "Address"}</h3>
              <button className="text-red-600 hover:text-red-700 text-sm">
                Remove
              </button>
            </div>
            <p className="text-charcoal/70">
              {address.street || "No address set"}
              {address.city && `, ${address.city}`}
              {address.postalCode && `, ${address.postalCode}`}
              {address.country && `, ${address.country}`}
            </p>
          </div>
        ))}
        <button className="w-full border-2 border-dashed border-charcoal/20 rounded-lg p-4 text-charcoal/70 hover:border-gold hover:text-gold transition-colors">
          + Add New Address
        </button>
      </div>
    </div>
  );
}

// Payment Methods Tab Component
function PaymentTabContent() {
  return (
    <div className="bg-white rounded-lg luxury-shadow p-6">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6" />
        Payment Methods
      </h2>
      <p className="text-charcoal/70 mb-4">
        Manage your saved payment methods for faster checkout.
      </p>
      <button className="border-2 border-dashed border-charcoal/20 rounded-lg p-4 text-charcoal/70 hover:border-gold hover:text-gold transition-colors">
        + Add Payment Method
      </button>
    </div>
  );
}

// Preferences Tab Component
function PreferencesTabContent({
  userData,
  onSave,
}: {
  userData: any;
  onSave: (data: any) => void;
}) {
  const [preferences, setPreferences] = useState({
    emailOptIn: userData?.emailOptIn !== false,
    whatsappOptIn: userData?.whatsappOptIn === true,
    smsOptIn: false,
    newsletter: true,
  });

  return (
    <div className="bg-white rounded-lg luxury-shadow p-6">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Preferences
      </h2>
      <div className="space-y-4">
        <label className="flex items-center gap-3 p-4 border border-charcoal/10 rounded-lg hover:bg-cream/50 transition-colors">
          <input
            type="checkbox"
            checked={preferences.emailOptIn}
            onChange={(e) =>
              setPreferences({ ...preferences, emailOptIn: e.target.checked })
            }
            className="w-5 h-5 accent-gold"
          />
          <div>
            <span className="font-semibold text-charcoal">Email Marketing</span>
            <p className="text-sm text-charcoal/60">
              Receive promotional emails and updates
            </p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-4 border border-charcoal/10 rounded-lg hover:bg-cream/50 transition-colors">
          <input
            type="checkbox"
            checked={preferences.whatsappOptIn}
            onChange={(e) =>
              setPreferences({ ...preferences, whatsappOptIn: e.target.checked })
            }
            className="w-5 h-5 accent-gold"
          />
          <div>
            <span className="font-semibold text-charcoal">WhatsApp Marketing</span>
            <p className="text-sm text-charcoal/60">
              Receive marketing messages via WhatsApp
            </p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-4 border border-charcoal/10 rounded-lg hover:bg-cream/50 transition-colors">
          <input
            type="checkbox"
            checked={preferences.newsletter}
            onChange={(e) =>
              setPreferences({ ...preferences, newsletter: e.target.checked })
            }
            className="w-5 h-5 accent-gold"
          />
          <div>
            <span className="font-semibold text-charcoal">Newsletter</span>
            <p className="text-sm text-charcoal/60">
              Subscribe to our monthly newsletter
            </p>
          </div>
        </label>
        <button
          onClick={() => onSave({ preferences })}
          className="bg-gold text-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors mt-4"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// Security Tab Component
function SecurityTabContent() {
  return (
    <div className="bg-white rounded-lg luxury-shadow p-6">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
        <Lock className="w-6 h-6" />
        Security Settings
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Current Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button className="bg-gold text-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors">
          Update Password
        </button>
      </div>
    </div>
  );
}

// GDPR Tab Component
function GDPRTabContent() {
  return (
    <div className="bg-white rounded-lg luxury-shadow p-6">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6" />
        Privacy & GDPR
      </h2>
      <div className="space-y-6">
        <div className="p-4 bg-cream rounded-lg">
          <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Data
          </h3>
          <p className="text-sm text-charcoal/70 mb-4">
            Download a copy of all your personal data stored in our system.
          </p>
          <Link
            href="/profile/gdpr/export"
            className="inline-block bg-gold text-charcoal px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors"
          >
            Request Data Export
          </Link>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Delete Your Account
          </h3>
          <p className="text-sm text-red-700 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Link
            href="/profile/gdpr/delete"
            className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Delete Account
          </Link>
        </div>
        <div className="p-4 border border-charcoal/20 rounded-lg">
          <h3 className="font-semibold text-charcoal mb-2">Privacy Policy</h3>
          <p className="text-sm text-charcoal/70 mb-4">
            Read our privacy policy to understand how we handle your data.
          </p>
          <Link
            href="/privacy-policy"
            className="text-gold hover:text-gold/80 font-semibold text-sm"
          >
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
