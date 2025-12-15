import { NextRequest, NextResponse } from "next/server";
import { getSystemHealth, getRecentLogs, formatTimeSince } from "@/lib/gold-price/monitoring";

export const dynamic = "force-dynamic";

/**
 * GET /api/gold-price/monitoring
 * Get system health and monitoring information
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const logs = searchParams.get("logs") === "true";
    const logLimit = parseInt(searchParams.get("limit") || "10");

    const health = await getSystemHealth();
    const response: any = {
      success: true,
      health,
      timestamp: new Date().toISOString(),
    };

    if (logs) {
      const recentLogs = await getRecentLogs(logLimit);
      response.logs = recentLogs.map((log) => ({
        ...log,
        timeSince: log.timestamp
          ? formatTimeSince(Date.now() - new Date(log.timestamp).getTime())
          : null,
        durationFormatted: log.duration
          ? log.duration < 1000
            ? `${log.duration}ms`
            : `${(log.duration / 1000).toFixed(2)}s`
          : null,
      }));
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error getting monitoring data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get monitoring data",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}



