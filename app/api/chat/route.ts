import { NextRequest, NextResponse } from "next/server";
import { generateResponse, getProductRecommendations, categorizeQuery } from "@/lib/ai/gemini";
import type { ChatMessage } from "@/lib/ai/gemini";

/**
 * POST /api/chat
 * Handle customer support chat with Gemini AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Validate conversation history format
    const validHistory: ChatMessage[] = Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (msg: any) =>
            msg &&
            typeof msg === "object" &&
            (msg.role === "user" || msg.role === "assistant") &&
            typeof msg.content === "string"
        )
      : [];

    // Generate response
    const response = await generateResponse(message, validHistory);

    // Get additional context (optional, for future enhancements)
    const [recommendations, category] = await Promise.all([
      getProductRecommendations(message).catch(() => []),
      categorizeQuery(message).catch(() => ({ category: "general" as const, confidence: 0.5 })),
    ]);

    return NextResponse.json({
      success: true,
      response,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
      category: category.category,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

