"use client";

import { useState, useEffect } from "react";
import { X, Cookie, Settings } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner && !showSettings) {
    return (
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 right-4 bg-charcoal text-white p-3 rounded-full shadow-lg hover:bg-charcoal/90 transition-colors z-50"
        aria-label="Cookie Settings"
      >
        <Cookie className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-charcoal/20 shadow-2xl z-50 p-6">
      <div className="max-w-7xl mx-auto">
        {showSettings ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-serif font-bold text-charcoal">
                  Cookie Preferences
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowBanner(false);
                }}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-charcoal/5 rounded-lg">
                <div>
                  <h3 className="font-semibold text-charcoal">Necessary Cookies</h3>
                  <p className="text-sm text-charcoal/70">
                    Required for the website to function. Cannot be disabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-charcoal/5 rounded-lg">
                <div>
                  <h3 className="font-semibold text-charcoal">Analytics Cookies</h3>
                  <p className="text-sm text-charcoal/70">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-charcoal/5 rounded-lg">
                <div>
                  <h3 className="font-semibold text-charcoal">Marketing Cookies</h3>
                  <p className="text-sm text-charcoal/70">
                    Used to deliver personalized advertisements and track campaign performance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-charcoal/5 rounded-lg">
                <div>
                  <h3 className="font-semibold text-charcoal">Functional Cookies</h3>
                  <p className="text-sm text-charcoal/70">
                    Enable enhanced functionality and personalization.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) =>
                    setPreferences({ ...preferences, functional: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-gold text-charcoal py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowBanner(false);
                }}
                className="px-6 py-3 border border-charcoal/20 text-charcoal rounded-lg hover:bg-charcoal/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-4 mb-4">
              <Cookie className="w-6 h-6 text-gold mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-serif font-bold text-charcoal mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-charcoal/70 mb-4">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.{" "}
                  <Link href="/privacy-policy" className="text-gold hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAcceptAll}
                className="bg-gold text-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 border border-charcoal/20 text-charcoal rounded-lg hover:bg-charcoal/5 transition-colors"
              >
                Customize
              </button>
              <button
                onClick={handleRejectAll}
                className="px-6 py-3 border border-charcoal/20 text-charcoal rounded-lg hover:bg-charcoal/5 transition-colors"
              >
                Reject All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


