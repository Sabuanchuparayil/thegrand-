// Monitoring and logging for scheduled price updates

export interface PriceUpdateLog {
  timestamp: string;
  success: boolean;
  goldPrice?: number;
  platinumPrice?: number;
  currency?: string;
  productsUpdated?: number;
  productsTotal?: number;
  errors?: string[];
  duration?: number; // milliseconds
}

export interface SystemHealth {
  storedPricesValid: boolean;
  lastUpdateTime?: string;
  lastUpdate?: string; // Alias for lastUpdateTime
  timeSinceLastUpdate?: number; // milliseconds
  apiKeyConfigured: boolean;
  productCount: number;
  dynamicProductCount: number;
  status?: "healthy" | "warning" | "error"; // System status
  lastError?: string; // Last error message
}

const MAX_LOG_ENTRIES = 100;
const LOG_FILE_PATH = ".cache/price-update-logs.json";

/**
 * Log a price update event
 */
export async function logPriceUpdate(log: PriceUpdateLog): Promise<void> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const logPath = path.join(process.cwd(), LOG_FILE_PATH);
    
    // Ensure cache directory exists
    const cacheDir = path.join(process.cwd(), ".cache");
    await fs.mkdir(cacheDir, { recursive: true });

    // Load existing logs
    let logs: PriceUpdateLog[] = [];
    try {
      const existing = await fs.readFile(logPath, "utf-8");
      logs = JSON.parse(existing);
    } catch {
      // File doesn't exist, start fresh
    }

    // Add new log entry
    logs.unshift(log);

    // Keep only last MAX_LOG_ENTRIES
    if (logs.length > MAX_LOG_ENTRIES) {
      logs = logs.slice(0, MAX_LOG_ENTRIES);
    }

    // Save logs
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("Error logging price update:", error);
    // Don't throw - logging failure shouldn't break the system
  }
}

/**
 * Get recent price update logs
 */
export async function getRecentLogs(limit: number = 10): Promise<PriceUpdateLog[]> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const logPath = path.join(process.cwd(), LOG_FILE_PATH);

    const existing = await fs.readFile(logPath, "utf-8");
    const logs: PriceUpdateLog[] = JSON.parse(existing);
    
    return logs.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Get system health status
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  const { getAllStoredPrices, areStoredPricesValid } = await import("./price-storage");
  const { getPriceUpdateSummary } = await import("./product-price-updater");

  const storedPrices = await getAllStoredPrices();
  const isValid = await areStoredPricesValid();
  const summary = await getPriceUpdateSummary();
  const apiKeyConfigured = !!process.env.METALS_API_KEY;

  let timeSinceLastUpdate: number | undefined;
  if (storedPrices) {
    timeSinceLastUpdate = Date.now() - storedPrices.gold.timestamp;
  }

  // Determine status
  let status: "healthy" | "warning" | "error" = "healthy";
  if (!isValid || !apiKeyConfigured) {
    status = "error";
  } else if (timeSinceLastUpdate && timeSinceLastUpdate > 86400000) { // More than 24 hours
    status = "warning";
  }

  return {
    storedPricesValid: isValid,
    lastUpdateTime: storedPrices?.lastUpdated,
    lastUpdate: storedPrices?.lastUpdated, // Alias
    timeSinceLastUpdate,
    apiKeyConfigured,
    productCount: summary.productCount,
    dynamicProductCount: summary.dynamicProductCount,
    status,
  };
}

/**
 * Format duration for display
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format time since last update
 */
export function formatTimeSince(ms: number): string {
  if (ms < 60000) return `${Math.floor(ms / 1000)}s ago`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)}h ago`;
  return `${Math.floor(ms / 86400000)}d ago`;
}

