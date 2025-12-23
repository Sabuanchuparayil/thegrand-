"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Download, FileText, CheckCircle } from "lucide-react";

export default function GDPRExportPage() {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (!session?.user?.id) {
      alert("Please sign in to export your data");
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch(`/api/gdpr/export?userId=${session.user.id}`);
      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-data-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExported(true);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg p-8 luxury-shadow">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 text-gold mx-auto mb-4" />
              <h1 className="text-3xl font-serif font-bold text-charcoal mb-4">
                Export Your Data
              </h1>
              <p className="text-charcoal/70">
                Download a copy of all your personal data in JSON format (GDPR Right to Access)
              </p>
            </div>

            {exported ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-4" />
                <p className="text-lg font-semibold text-charcoal mb-2">
                  Data Export Complete
                </p>
                <p className="text-charcoal/70">
                  Your data has been downloaded. Check your downloads folder.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-charcoal/5 p-6 rounded-lg">
                  <h3 className="font-semibold text-charcoal mb-3">
                    Your export will include:
                  </h3>
                  <ul className="space-y-2 text-charcoal/80">
                    <li>• Personal information (name, email, phone)</li>
                    <li>• Account preferences and settings</li>
                    <li>• Order history</li>
                    <li>• Saved addresses</li>
                    <li>• Marketing preferences</li>
                  </ul>
                </div>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-gold text-charcoal py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download My Data
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}




