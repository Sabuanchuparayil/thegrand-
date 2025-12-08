import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import CookieConsent from "@/components/CookieConsent";
import ChatSupport from "@/components/ChatSupport";

export const metadata: Metadata = {
  title: "THE GRAND GOLD & DIAMONDS - Luxury Jewelry",
  description: "A global luxury jewelry house rooted in craftsmanship. Discover unique, elegant, and culturally rich jewelry pieces.",
  keywords: ["luxury jewelry", "gold jewelry", "diamonds", "bridal jewelry", "cultural jewelry"],
  openGraph: {
    title: "THE GRAND GOLD & DIAMONDS",
    description: "A global luxury jewelry house rooted in craftsmanship",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <CookieConsent />
          <ChatSupport />
        </Providers>
      </body>
    </html>
  );
}

