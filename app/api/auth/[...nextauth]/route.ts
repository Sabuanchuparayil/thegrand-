import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import { getUserByEmail, createUser } from "@/lib/auth/auth";
import type { NextRequest } from "next/server";

// Build providers array conditionally to avoid errors with empty credentials
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const email = credentials.email as string;
      const password = credentials.password as string;

      // Check if email is an admin email
      const adminEmails = [
        "admin@thegrand.com",
        "admin@thegrand.co.uk",
        "admin@thegrand.luxury",
        process.env.ADMIN_EMAIL || "",
      ].filter(Boolean);
      
      const isAdminEmail = adminEmails.some(adminEmail => 
        email.toLowerCase() === adminEmail.toLowerCase()
      );

      // For now, we'll use a simple email-based auth
      // In production, you should hash passwords and store them
      try {
        const user = await getUserByEmail(email);

        if (!user || !user.isActive) {
          // Auto-create user if doesn't exist (for demo purposes)
          // In production, implement proper registration flow
          try {
            const newUser = await createUser({
              email: email,
              name: email.split("@")[0],
              phone: "",
              role: isAdminEmail ? "admin" : "customer",
            });
            if (newUser) {
              return {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
              };
            }
          } catch (createError) {
            console.error("Error creating user:", createError);
            // Fall through to return demo user
          }
          
          // Return a demo user if Sanity is not configured or creation failed
          return {
            id: `demo-${Date.now()}`,
            email: email,
            name: email.split("@")[0],
            role: isAdminEmail ? "admin" : "customer",
          };
        }

        // TODO: Verify password hash
        // For now, accept any password for existing users
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      } catch (dbError) {
        console.error("Database error in auth:", dbError);
        // Always return a demo user if database is not available
        // This ensures admin emails can still log in
        return {
          id: `demo-${Date.now()}`,
          email: email,
          name: email.split("@")[0],
          role: isAdminEmail ? "admin" : "customer",
        };
      }
    },
  }),
];

// Only add OAuth providers if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.APPLE_ID && process.env.APPLE_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

const authOptions = {
  trustHost: true, // Fixes Railway deployment UntrustedHost error
  providers,
  callbacks: {
    async signIn(params: any) {
      const { user, account, profile } = params;
      // Handle OAuth sign-in - create or link user account
      if (account?.provider !== "credentials" && user.email) {
        try {
          const userEmail = typeof user.email === 'string' ? user.email : '';
          let dbUser = await getUserByEmail(userEmail);
          
          if (!dbUser) {
            // Create new user from OAuth provider
            const userName = typeof user.name === 'string' ? user.name : userEmail.split("@")[0];
            dbUser = await createUser({
              email: userEmail,
              name: userName,
              phone: "",
              role: "customer",
            });
          }
          
          // Update user object with database user data
          if (dbUser) {
            user.id = dbUser._id;
            (user as any).role = dbUser.role;
          }
        } catch (error) {
          console.error("Error in OAuth sign-in:", error);
          // Allow sign-in to continue even if DB operation fails
        }
      }
      return true;
    },
    async jwt(params: any) {
      const { token, user, account } = params;
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.provider = account?.provider;
      }
      return token;
    },
    async session(params: any) {
      const { session, token } = params;
      if (session?.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback-secret-for-development-only",
  debug: process.env.NODE_ENV === "development",
};

// Validate that we have at least one provider
if (providers.length === 0) {
  console.error("No authentication providers configured!");
}

// Create NextAuth handler
const { handlers, auth } = NextAuth(authOptions);

// Export handlers for Next.js App Router
export const { GET, POST } = handlers;

// Export auth function for server-side session access
export { auth };

