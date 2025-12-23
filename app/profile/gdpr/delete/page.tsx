"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";

export default function GDPRDeletePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    if (!session?.user?.id) {
      alert("Please sign in to delete your data");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/gdpr/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          confirm: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      setDeleted(true);
      
      // Sign out user after deletion
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 3000);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete data. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg p-8 luxury-shadow">
            <div className="text-center mb-8">
              <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-serif font-bold text-charcoal mb-4">
                Delete Your Account
              </h1>
              <p className="text-charcoal/70">
                Permanently delete your account and personal data (GDPR Right to Erasure)
              </p>
            </div>

            {deleted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-4" />
                <p className="text-lg font-semibold text-charcoal mb-2">
                  Account Deleted
                </p>
                <p className="text-charcoal/70">
                  Your account and personal data have been deleted. You will be signed out shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">
                        Warning: This action cannot be undone
                      </h3>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• All your personal information will be permanently deleted</li>
                        <li>• Your order history will be anonymized</li>
                        <li>• You will lose access to your account</li>
                        <li>• This action is irreversible</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-charcoal/5 p-6 rounded-lg">
                  <h3 className="font-semibold text-charcoal mb-3">
                    What will be deleted:
                  </h3>
                  <ul className="space-y-2 text-charcoal/80">
                    <li>• Your account and profile information</li>
                    <li>• Personal contact details</li>
                    <li>• Saved addresses</li>
                    <li>• Account preferences</li>
                    <li>• Marketing preferences</li>
                  </ul>
                  <p className="text-sm text-charcoal/60 mt-4">
                    Note: Order records may be retained in anonymized form for legal and tax compliance purposes.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Type "DELETE" to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting || confirmText !== "DELETE"}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Permanently Delete My Account"}
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




