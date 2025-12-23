"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Mail, Phone, Send } from "lucide-react";

export default function StorePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative h-96 w-full bg-gradient-to-br from-emerald to-charcoal">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-4">
                Store & Inauguration
              </h1>
              <p className="text-xl text-diamond/90 max-w-2xl mx-auto">
                Join us for our UK launch and experience luxury in person
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Store Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">
                  Visit Our Store
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-emerald mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-charcoal">Location</p>
                      <p className="text-charcoal/70">
                        London, United Kingdom
                        <br />
                        <span className="text-sm">Exact address coming soon</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Calendar className="w-6 h-6 text-emerald mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-charcoal">Inauguration Date</p>
                      <p className="text-charcoal/70">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald/10 to-gold/10 rounded-2xl p-8">
                <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">
                  Grand Opening Event
                </h3>
                <p className="text-charcoal/70 leading-relaxed mb-4">
                  Join us for the grand opening of THE GRAND GOLD & DIAMONDS in
                  the UK. Experience our luxury collections, meet our master
                  craftsmen, and be among the first to explore our exclusive
                  pieces.
                </p>
                <p className="text-charcoal/70 leading-relaxed">
                  Details about the inauguration event will be announced soon.
                  Sign up for our newsletter or submit an enquiry to be notified
                  when we open our doors.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">
                Send an Enquiry
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-charcoal mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-charcoal/20 rounded-lg focus:border-emerald focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-charcoal mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-charcoal/20 rounded-lg focus:border-emerald focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-charcoal mb-2"
                  >
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-charcoal/20 rounded-lg focus:border-emerald focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-charcoal mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-charcoal/20 rounded-lg focus:border-emerald focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-emerald text-white font-semibold rounded-lg hover:bg-emerald-dark transition-all duration-300 hover-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
                {submitStatus === "success" && (
                  <p className="text-emerald font-semibold text-center">
                    Thank you! Your enquiry has been sent successfully.
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-600 font-semibold text-center">
                    There was an error sending your enquiry. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}




