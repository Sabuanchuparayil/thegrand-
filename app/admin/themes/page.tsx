export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { Palette, Image, Video, Save, Eye } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";

async function getHomepageData() {
  try {
    const homepage = await client.fetch(`*[_type == "homepage"][0]`);
    return homepage;
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return null;
  }
}

export default async function AdminThemesPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/themes");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    redirect("/");
  }

  const homepage = await getHomepageData();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Themes & Banners Management
          </h1>
          <p className="text-gray-900/70">
            Manage homepage themes, banners, and visual content
          </p>
        </div>

        {/* Hero Banner Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Image className="w-6 h-6" />
            Hero Banner
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Headline
              </label>
              <input
                type="text"
                defaultValue={homepage?.hero_banner?.headline || ""}
                placeholder="Enter headline..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subheadline
              </label>
              <input
                type="text"
                defaultValue={homepage?.hero_banner?.subheadline || ""}
                placeholder="Enter subheadline..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hero Image
                </label>
                {homepage?.hero_banner?.image && (
                  <div className="mb-4">
                    <img
                      src={urlForImage(homepage.hero_banner.image)}
                      alt="Hero"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-900/50 mt-1">
                  Upload a new hero image (recommended: 1920x1080px)
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hero Video (Optional)
                </label>
                {homepage?.hero_banner?.video && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-900/70">
                      Video file uploaded
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-900/50 mt-1">
                  Upload a hero video (MP4, WebM)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600/90 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Save Hero Banner</span>
              </button>
              <a
                href="/"
                target="_blank"
                className="flex items-center space-x-2 text-gray-900/70 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>Preview</span>
              </a>
            </div>
          </form>
        </div>

        {/* AR Try-On Highlight */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Video className="w-6 h-6" />
            AR Try-On Highlight
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title
              </label>
              <input
                type="text"
                defaultValue={homepage?.ar_tryon_highlight?.title || ""}
                placeholder="Enter title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                defaultValue={homepage?.ar_tryon_highlight?.description || ""}
                placeholder="Enter description..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Image
              </label>
              {homepage?.ar_tryon_highlight?.image && (
                <div className="mb-4">
                  <img
                    src={urlForImage(homepage.ar_tryon_highlight.image)}
                    alt="AR Try-On"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save AR Highlight</span>
            </button>
          </form>
        </div>

        {/* Inauguration Event */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Inauguration Event
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Title
              </label>
              <input
                type="text"
                defaultValue={homepage?.inauguration_event?.title || ""}
                placeholder="Enter event title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                defaultValue={homepage?.inauguration_event?.description || ""}
                placeholder="Enter event description..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Date
                </label>
                <input
                  type="datetime-local"
                  defaultValue={
                    homepage?.inauguration_event?.date
                      ? new Date(homepage.inauguration_event.date)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue={homepage?.inauguration_event?.location || ""}
                  placeholder="Enter location..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Image
              </label>
              {homepage?.inauguration_event?.image && (
                <div className="mb-4">
                  <img
                    src={urlForImage(homepage.inauguration_event.image)}
                    alt="Event"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save Event Details</span>
            </button>
          </form>
        </div>

        {/* Color Theme Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Color Theme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Primary Color (Gold)
              </label>
              <input
                type="color"
                defaultValue="#B8860B"
                className="w-full h-12 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Secondary Color (Emerald)
              </label>
              <input
                type="color"
                defaultValue="#10B981"
                className="w-full h-12 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Background Color (Cream)
              </label>
              <input
                type="color"
                defaultValue="#FDFBF6"
                className="w-full h-12 rounded-lg border border-gray-300"
              />
            </div>
          </div>
          <p className="text-sm text-gray-900/60 mt-4">
            Note: Theme colors are managed through CSS variables in globals.css. 
            Changes here would require code deployment.
          </p>
        </div>

        {/* Cultural Banner Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Cultural Banners
          </h2>
          <p className="text-gray-900/70 mb-4">
            Cultural banners are currently managed in the CulturalBanner component.
            To manage them via CMS, create a "cultural_banner" schema in Sanity.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Current Banners:</h3>
            <ul className="list-disc list-inside text-gray-900/70 space-y-1">
              <li>Diwali Collection</li>
              <li>Eid Collection</li>
              <li>Wedding Season</li>
              <li>Christmas Collection</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

