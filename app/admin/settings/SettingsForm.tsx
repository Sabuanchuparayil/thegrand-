'use client';

import { useState } from "react";
import { Save } from "lucide-react";
import { updateGeneralSettings } from "./actions";

export default function SettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await updateGeneralSettings(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    } finally {
      setIsSubmitting(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="siteName" className="block text-sm font-semibold text-gray-900 mb-2">
          Site Name
        </label>
        <input
          id="siteName"
          name="siteName"
          type="text"
          defaultValue="THE GRAND"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="siteUrl" className="block text-sm font-semibold text-gray-900 mb-2">
          Site URL
        </label>
        <input
          id="siteUrl"
          name="siteUrl"
          type="url"
          defaultValue={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3011"}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="defaultCurrency" className="block text-sm font-semibold text-gray-900 mb-2">
          Default Currency
        </label>
        <select 
          id="defaultCurrency"
          name="defaultCurrency"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="GBP">GBP (£)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>
      
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        <span>{isSubmitting ? 'Saving...' : 'Save General Settings'}</span>
      </button>
    </form>
  );
}

