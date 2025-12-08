import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "THE GRAND GOLD & DIAMONDS - Luxury Jewelry",
  description: "A global luxury jewelry house rooted in craftsmanship. Discover unique, elegant, and culturally rich jewelry pieces.",
  keywords: ["luxury jewelry", "gold jewelry", "diamonds", "bridal jewelry", "cultural jewelry"],
  openGraph: {
    title: "THE GRAND GOLD & DIAMONDS",
    description: "A global luxury jewelry house rooted in craftsmanship",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

import CookieConsent from "@/components/CookieConsent";

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
        </Providers>
      </body>
    </html>
  );
}

