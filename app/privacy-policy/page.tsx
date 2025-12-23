import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Trash2, Download, FileText } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-gold mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">
              Privacy Policy
            </h1>
            <p className="text-charcoal/70">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                1. Introduction
              </h2>
              <p className="text-charcoal/80 leading-relaxed">
                THE GRAND GOLD & DIAMONDS ("we", "us", "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">
                    Personal Information
                  </h3>
                  <ul className="list-disc list-inside text-charcoal/80 space-y-2">
                    <li>Name and contact information (email, phone, WhatsApp)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely via Stripe)</li>
                    <li>Date of birth and gender (optional)</li>
                    <li>Account preferences and settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">
                    Usage Information
                  </h3>
                  <ul className="list-disc list-inside text-charcoal/80 space-y-2">
                    <li>Browser type and version</li>
                    <li>IP address</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-charcoal/80 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and updates</li>
                <li>Provide customer support</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                4. Your GDPR Rights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg luxury-shadow">
                  <Eye className="w-6 h-6 text-gold mb-2" />
                  <h3 className="font-semibold text-charcoal mb-2">Right to Access</h3>
                  <p className="text-sm text-charcoal/70">
                    Request a copy of your personal data
                  </p>
                  <Link
                    href="/profile/gdpr/export"
                    className="text-gold hover:underline text-sm mt-2 inline-block"
                  >
                    Export My Data →
                  </Link>
                </div>
                <div className="bg-white p-4 rounded-lg luxury-shadow">
                  <FileText className="w-6 h-6 text-gold mb-2" />
                  <h3 className="font-semibold text-charcoal mb-2">Right to Rectification</h3>
                  <p className="text-sm text-charcoal/70">
                    Correct inaccurate personal data
                  </p>
                  <Link
                    href="/profile"
                    className="text-gold hover:underline text-sm mt-2 inline-block"
                  >
                    Update Profile →
                  </Link>
                </div>
                <div className="bg-white p-4 rounded-lg luxury-shadow">
                  <Trash2 className="w-6 h-6 text-gold mb-2" />
                  <h3 className="font-semibold text-charcoal mb-2">Right to Erasure</h3>
                  <p className="text-sm text-charcoal/70">
                    Request deletion of your personal data
                  </p>
                  <Link
                    href="/profile/gdpr/delete"
                    className="text-gold hover:underline text-sm mt-2 inline-block"
                  >
                    Delete My Data →
                  </Link>
                </div>
                <div className="bg-white p-4 rounded-lg luxury-shadow">
                  <Lock className="w-6 h-6 text-gold mb-2" />
                  <h3 className="font-semibold text-charcoal mb-2">Right to Restrict</h3>
                  <p className="text-sm text-charcoal/70">
                    Restrict processing of your data
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                5. Cookies
              </h2>
              <p className="text-charcoal/80 leading-relaxed mb-4">
                We use cookies to enhance your experience. You can manage your cookie preferences 
                at any time through the cookie settings.
              </p>
              <ul className="list-disc list-inside text-charcoal/80 space-y-2">
                <li><strong>Necessary Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Marketing Cookies:</strong> Used for personalized advertising</li>
                <li><strong>Functional Cookies:</strong> Enable enhanced features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                6. Data Security
              </h2>
              <p className="text-charcoal/80 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your 
                personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                7. Data Retention
              </h2>
              <p className="text-charcoal/80 leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes 
                outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                8. Contact Us
              </h2>
              <p className="text-charcoal/80 leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your GDPR rights, 
                please contact us at:
              </p>
              <div className="bg-charcoal/5 p-4 rounded-lg mt-4">
                <p className="text-charcoal">
                  <strong>Email:</strong> privacy@thegrand.com<br />
                  <strong>Phone:</strong> +44 (0) 20 1234 5678<br />
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}




