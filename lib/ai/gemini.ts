// Gemini AI integration for customer support
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini only if API key is available
let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
  }
} else {
  console.warn("GEMINI_API_KEY not set. Gemini AI features will be disabled.");
}

// Knowledge base about The Grand products and services
const KNOWLEDGE_BASE = `
# The Grand - Luxury Jewelry Knowledge Base

## About The Grand
The Grand is a luxury jewelry brand specializing in culturally-inspired fine jewelry. We offer exquisite pieces crafted from premium materials including 22k and 18k gold, platinum, and silver, adorned with diamonds, emeralds, sapphires, rubies, and pearls.

## Product Categories
1. **Necklaces** - Traditional and contemporary designs
2. **Earrings** - From minimalist to ornate styles
3. **Rings** - Engagement, wedding, and fashion rings
4. **Bracelets** - Elegant wrist jewelry
5. **Bangles** - Traditional and modern designs
6. **Pendants** - Statement pieces and charms
7. **Men's Jewelry** - Sophisticated pieces for gentlemen

## Cultural Collections
- **Traditional Indian Bridal** - Exquisite bridal sets perfect for weddings
- **Contemporary Minimalist** - Modern, elegant designs
- **Middle Eastern Ornate** - Intricate patterns and designs
- **Western Engagement** - Classic engagement rings
- **Afro-Caribbean** - Vibrant cultural pieces
- **Heritage Classics** - Timeless traditional designs

## Materials
- **22k Gold** - Premium traditional gold (91.7% pure)
- **18k Gold** - Durable and elegant (75% pure)
- **Platinum** - Premium white metal
- **Silver** - Classic and affordable

## Gemstones
- Diamonds - Brilliant and timeless
- Emeralds - Rich green gemstones
- Sapphires - Blue and other colors
- Rubies - Deep red gemstones
- Pearls - Classic elegance
- None - Pure metal designs

## Pricing Model
We offer dynamic pricing based on:
- Current gold market prices
- Gemstone quality and quantity
- Labor costs
- Design complexity

## Services
- **AR Try-On** - Virtual try-on using augmented reality
- **360° Product Views** - Interactive product visualization
- **Custom Orders** - Bespoke jewelry creation
- **Cultural Consultation** - Expert advice on cultural appropriateness
- **International Shipping** - Worldwide delivery
- **Lifetime Warranty** - Quality guarantee on all pieces

## Care Instructions
- Store jewelry in soft pouches or boxes
- Clean with mild soap and water
- Avoid harsh chemicals and perfumes
- Professional cleaning recommended annually
- Remove before swimming or exercising

## Policies
- **Returns** - 30-day return policy for unworn items
- **Warranty** - Lifetime warranty on craftsmanship
- **Shipping** - Free shipping on orders over £500
- **Payment** - Multiple payment options including Stripe
- **Privacy** - GDPR compliant data handling

## Frequently Asked Questions

**Q: Do you offer custom designs?**
A: Yes, we offer bespoke jewelry creation. Contact us through the website or visit our showroom.

**Q: What is your return policy?**
A: We offer a 30-day return policy for items in original condition with tags attached.

**Q: Do you ship internationally?**
A: Yes, we ship worldwide. Shipping costs and delivery times vary by location.

**Q: How do I care for my jewelry?**
A: Store in soft pouches, clean with mild soap and water, and avoid harsh chemicals. Professional cleaning is recommended annually.

**Q: What payment methods do you accept?**
A: We accept all major credit cards, debit cards, and PayPal through our secure payment gateway.

**Q: Can I try on jewelry before buying?**
A: Yes! We offer AR Try-On feature on our website, and you can also visit our showroom for in-person try-ons.

**Q: Do you offer financing options?**
A: Yes, we offer flexible payment plans for purchases over £1000. Contact us for details.

**Q: What makes your jewelry culturally appropriate?**
A: Our designs are created with cultural sensitivity, respecting traditions while offering modern elegance. We consult with cultural experts and community members.

**Q: How do I know the gold purity?**
A: All our gold jewelry is hallmarked and certified. 22k gold is 91.7% pure, and 18k gold is 75% pure.

**Q: Can I track my order?**
A: Yes, once your order ships, you'll receive a tracking number via email.
`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Initialize Gemini model with knowledge base
 */
function getModel() {
  if (!genAI) {
    throw new Error("Gemini AI is not initialized. Please set GEMINI_API_KEY environment variable.");
  }
  
  // Use gemini-1.5-flash for faster responses, or gemini-1.5-pro for better quality
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // Updated to newer model
    systemInstruction: `You are Sabuji, a helpful customer support agent for The Grand, a luxury jewelry brand. 
    
Use the following knowledge base to answer customer questions accurately and helpfully:
${KNOWLEDGE_BASE}

Guidelines:
- Be friendly, professional, and culturally sensitive
- Provide accurate information about products, services, and policies
- If you don't know something, admit it and suggest contacting customer service
- Always be helpful and aim to resolve customer inquiries
- Use the knowledge base to provide specific details about products and services
- Maintain a luxury brand tone while being approachable
- For pricing questions, mention that prices are dynamic based on gold market rates
- Encourage customers to use AR Try-On feature for virtual try-ons
- Mention cultural collections when relevant to customer interests
- Answer questions about store inauguration, opening hours, and events if asked`,
  });
  return model;
}

/**
 * Fetch products from Sanity for context
 */
async function getProductsContext(): Promise<string> {
  try {
    // Dynamically import to avoid client-side issues
    const { fetchProducts } = await import("@/lib/sanity/data-fetcher");
    const products = await fetchProducts();
    
    if (!products || products.length === 0) {
      return "No products are currently available in the catalog.";
    }
    
    // Get product names and categories
    const productList = products.slice(0, 20).map((p: any) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      cultural_tags: p.cultural_tags || [],
    }));
    
    return `Current Products Available:
${productList.map((p: any) => `- ${p.name} (${p.category}) - ${p.cultural_tags?.join(", ") || "General"}`).join("\n")}

Total products: ${products.length}`;
  } catch (error) {
    console.error("Error fetching products for context:", error);
    return "Product information is currently unavailable.";
  }
}

/**
 * Generate a response to a customer query
 */
export async function generateResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    if (!genAI) {
      throw new Error("GEMINI_API_KEY not configured. Please set the GEMINI_API_KEY environment variable in Railway.");
    }
    
    const model = getModel();
    
    // Fetch current products for context
    const productsContext = await getProductsContext();
    
    // Build conversation context
    const historyText = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role === "user" ? "Customer" : "Assistant"}: ${msg.content}`)
      .join("\n");
    
    const prompt = `${productsContext}

${historyText ? `${historyText}\n\n` : ""}Customer: ${userMessage}

Assistant: Please provide a helpful response about The Grand's products and services. Use the product list above to give specific information when relevant.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API_KEY") || error.message.includes("GEMINI_API_KEY")) {
        return "I apologize, but the AI service is not properly configured. Please contact our customer service team directly, or the administrator can set up the GEMINI_API_KEY in Railway environment variables.";
      }
      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        return "I'm currently experiencing high demand. Please try again in a moment or contact our customer service team directly.";
      }
      if (error.message.includes("safety")) {
        return "I apologize, but I couldn't process that request due to content safety filters. Please rephrase your question or contact our customer service team.";
      }
      // Log the actual error for debugging
      console.error("Detailed Gemini error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    
    return "I apologize, but I'm having trouble processing your request right now. Please try again later or contact our customer service team directly at support@thegrand.co.uk.";
  }
}

/**
 * Get product recommendations based on customer query
 */
export async function getProductRecommendations(
  customerQuery: string
): Promise<string[]> {
  try {
    if (!genAI) {
      return [];
    }
    const model = getModel();
    
    const prompt = `Based on this customer query: "${customerQuery}"
    
Analyze the query and suggest relevant product categories or types from The Grand's collection. 
Return only a JSON array of category names or product types, nothing else.

Available categories: necklaces, earrings, rings, bracelets, bangles, pendants, mens-jewelry
Available cultural collections: Traditional Indian Bridal, Contemporary Minimalist, Middle Eastern Ornate, Western Engagement, Afro-Caribbean, Heritage Classics`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from response
    try {
      // Use [\s\S] instead of . with 's' flag for ES2017 compatibility
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If parsing fails, return empty array
    }
    
    return [];
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return [];
  }
}

/**
 * Check if query is about a specific topic
 */
export async function categorizeQuery(query: string): Promise<{
  category: "product" | "service" | "policy" | "general";
  confidence: number;
}> {
  try {
    if (!genAI) {
      return { category: "general", confidence: 0.5 };
    }
    const model = getModel();
    
    const prompt = `Categorize this customer query: "${query}"
    
Return only a JSON object with "category" (one of: product, service, policy, general) and "confidence" (0-1), nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Use [\s\S] instead of . with 's' flag for ES2017 compatibility
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Default fallback
    }
    
    return { category: "general", confidence: 0.5 };
  } catch (error) {
    console.error("Gemini categorization error:", error);
    return { category: "general", confidence: 0.5 };
  }
}

