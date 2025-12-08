export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { Mail, MessageSquare, Send, Users } from "lucide-react";
import Link from "next/link";
import { getAllUsers } from "@/lib/auth/auth";

export default async function AdminMarketingPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/marketing");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    redirect("/");
  }

  const users = await getAllUsers(1000);
  const emailOptIn = users.filter((u: any) => u.emailOptIn !== false).length;
  const whatsappOptIn = users.filter((u: any) => u.whatsappOptIn === true).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
            Marketing Communications
          </h1>
          <p className="text-charcoal/70">
            Send marketing messages via email and WhatsApp
          </p>
        </div>

        {/* Audience Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg luxury-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-charcoal">Email Audience</h2>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-charcoal mb-2">
              {emailOptIn}
            </div>
            <p className="text-sm text-charcoal/70">
              Users opted in for email marketing
            </p>
          </div>

          <div className="bg-white rounded-lg luxury-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-charcoal">WhatsApp Audience</h2>
              <MessageSquare className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-charcoal mb-2">
              {whatsappOptIn}
            </div>
            <p className="text-sm text-charcoal/70">
              Users opted in for WhatsApp marketing
            </p>
          </div>
        </div>

        {/* Email Campaign */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
            Send Email Campaign
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="Email subject..."
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Message
              </label>
              <textarea
                rows={6}
                placeholder="Your marketing message..."
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-gold" />
                <span className="text-sm text-charcoal/70">
                  Send to all email subscribers ({emailOptIn} users)
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Send Email Campaign</span>
            </button>
          </form>
        </div>

        {/* WhatsApp Campaign */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
            Send WhatsApp Campaign
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Your WhatsApp message (max 160 characters recommended)..."
                maxLength={1000}
                className="w-full px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <p className="text-xs text-charcoal/60 mt-1">
                Note: WhatsApp Business API required. Messages must comply with WhatsApp policies.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-gold" />
                <span className="text-sm text-charcoal/70">
                  Send to all WhatsApp subscribers ({whatsappOptIn} users)
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send WhatsApp Campaign</span>
            </button>
          </form>
        </div>

        {/* Campaign History */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
            Recent Campaigns
          </h2>
          <div className="text-center py-8 text-charcoal/70">
            <Send className="w-16 h-16 mx-auto mb-4 text-charcoal/20" />
            <p>No campaigns sent yet</p>
            <p className="text-sm mt-2">
              Start sending marketing communications to your audience
            </p>
          </div>
        </div>

        {/* Audience Management */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
            Audience Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-charcoal mb-4">Email Subscribers</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                  <span className="text-charcoal/70">Total Subscribers</span>
                  <span className="font-semibold">{emailOptIn}</span>
                </div>
                <Link
                  href="/admin/users?filter=emailOptIn"
                  className="block text-center text-gold hover:text-gold/80 transition-colors py-2"
                >
                  View Subscribers →
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-4">WhatsApp Subscribers</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                  <span className="text-charcoal/70">Total Subscribers</span>
                  <span className="font-semibold">{whatsappOptIn}</span>
                </div>
                <Link
                  href="/admin/users?filter=whatsappOptIn"
                  className="block text-center text-gold hover:text-gold/80 transition-colors py-2"
                >
                  View Subscribers →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

