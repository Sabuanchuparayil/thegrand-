// Session helper for NextAuth v5
import { auth } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get server session (NextAuth v5 compatible)
 */
export async function getServerSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

