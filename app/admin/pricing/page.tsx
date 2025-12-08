export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { DollarSign, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { getAllStoredPrices } from "@/lib/gold-price/price-storage";
import { getSystemHealth, getRecentLogs } from "@/lib/gold-price/monitoring";

export default async function AdminPricingPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/pricing");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    redirect("/");
  }

  const storedPrices = await getAllStoredPrices();
  const systemHealth = await getSystemHealth();
  const recentLogs = await getRecentLogs(10);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Pricing Management
            </h1>
            <p className="text-gray-900/70">
              Manage dynamic gold pricing and metal prices
            </p>
          </div>
          <form action="/api/gold-price/scheduled" method="POST">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Update Prices Now</span>
            </button>
          </form>
        </div>

        {/* System Health */}
        <div className={`rounded-lg shadow-md p-6 ${
          systemHealth.status === "healthy" ? "bg-emerald-50 border border-emerald-200" : "bg-blue-50 border border-blue-200"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                System Status: <span className="capitalize">{systemHealth.status}</span>
              </h3>
              <p className="text-sm text-gray-900/70">
                Last Update: {systemHealth.lastUpdate ? new Date(systemHealth.lastUpdate).toLocaleString() : "Never"}
              </p>
              {systemHealth.lastError && (
                <p className="text-sm text-red-600 mt-2">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  {systemHealth.lastError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Current Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Gold Price (24k)
              </h2>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            {storedPrices?.gold ? (
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  £{storedPrices.gold.price.toFixed(2)}
                </div>
                <p className="text-sm text-gray-900/70">
                  per gram
                </p>
                <p className="text-xs text-gray-900/50 mt-2">
                  Last updated: {storedPrices.lastUpdated ? new Date(storedPrices.lastUpdated).toLocaleString() : "N/A"}
                </p>
              </div>
            ) : (
              <div className="text-gray-900/70">
                <p>No price data available</p>
                <p className="text-sm mt-2">Click "Update Prices Now" to fetch current prices</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Platinum Price
              </h2>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            {storedPrices?.platinum ? (
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  £{storedPrices.platinum.price.toFixed(2)}
                </div>
                <p className="text-sm text-gray-900/70">
                  per gram
                </p>
                <p className="text-xs text-gray-900/50 mt-2">
                  Last updated: {storedPrices.lastUpdated ? new Date(storedPrices.lastUpdated).toLocaleString() : "N/A"}
                </p>
              </div>
            ) : (
              <div className="text-gray-900/70">
                <p>No price data available</p>
                <p className="text-sm mt-2">Click "Update Prices Now" to fetch current prices</p>
              </div>
            )}
          </div>
        </div>

        {/* Purity Multipliers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Gold Purity Multipliers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <PurityCard purity="24k" multiplier={1.0} />
            <PurityCard purity="22k" multiplier={0.9167} />
            <PurityCard purity="18k" multiplier={0.75} />
            <PurityCard purity="14k" multiplier={0.5833} />
            <PurityCard purity="10k" multiplier={0.4167} />
          </div>
        </div>

        {/* Recent Price Updates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Recent Price Updates
          </h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-900/70 text-center py-8">
              No update logs available
            </p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{log.message}</p>
                    <p className="text-sm text-gray-900/70">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      log.level === "error"
                        ? "bg-red-100 text-red-800"
                        : log.level === "warn"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {log.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            API Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Metals.Dev API Key
              </label>
              <input
                type="password"
                value={process.env.METALS_API_KEY ? "••••••••" : "Not configured"}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-900/60 mt-1">
                Configure in environment variables
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Update Schedule
              </label>
              <p className="text-gray-900/70">
                Prices are automatically updated twice daily at 8 AM and 5 PM (British Time)
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function PurityCard({ purity, multiplier }: { purity: string; multiplier: number }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className="text-2xl font-bold text-blue-600 mb-1">{purity}</div>
      <div className="text-sm text-gray-900/70">
        {multiplier === 1.0 ? "100%" : `${(multiplier * 100).toFixed(2)}%`}
      </div>
    </div>
  );
}

