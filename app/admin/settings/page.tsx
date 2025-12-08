import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { Settings, Save, Key, Globe, Bell } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/settings");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin") {
    redirect("/");
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
            Settings
          </h1>
          <p className="text-charcoal/70">
            Manage system settings and configuration
          </p>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            General Settings
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Site Name
              </label>
              <input
                type="text"
                defaultValue="THE GRAND"
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Site URL
              </label>
              <input
                type="url"
                defaultValue={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3011"}
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Default Currency
              </label>
              <select className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                <option>GBP (£)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save General Settings</span>
            </button>
          </form>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
            <Key className="w-6 h-6" />
            API Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Metals.Dev API Key
              </label>
              <input
                type="password"
                value={process.env.METALS_API_KEY ? "••••••••" : "Not configured"}
                disabled
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg bg-cream"
              />
              <p className="text-xs text-charcoal/60 mt-1">
                Configure in environment variables (.env.local)
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Stripe Secret Key
              </label>
              <input
                type="password"
                value={process.env.STRIPE_SECRET_KEY ? "••••••••" : "Not configured"}
                disabled
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg bg-cream"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                WhatsApp API Key
              </label>
              <input
                type="password"
                value={process.env.WHATSAPP_API_KEY ? "••••••••" : "Not configured"}
                disabled
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg bg-cream"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Resend API Key (Email)
              </label>
              <input
                type="password"
                value={process.env.RESEND_API_KEY ? "••••••••" : "Not configured"}
                disabled
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg bg-cream"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notification Settings
          </h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3 accent-gold" defaultChecked />
              <span className="text-charcoal/70">
                Email notifications for new orders
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3 accent-gold" defaultChecked />
              <span className="text-charcoal/70">
                Email notifications for price updates
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3 accent-gold" />
              <span className="text-charcoal/70">
                WhatsApp notifications for new orders
              </span>
            </label>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save Notification Settings</span>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
            System Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-charcoal/10">
              <span className="text-charcoal/70">Environment</span>
              <span className="font-semibold text-charcoal">
                {process.env.NODE_ENV || "development"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-charcoal/10">
              <span className="text-charcoal/70">Next.js Version</span>
              <span className="font-semibold text-charcoal">14.x</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-charcoal/10">
              <span className="text-charcoal/70">Sanity Dataset</span>
              <span className="font-semibold text-charcoal">
                {process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

