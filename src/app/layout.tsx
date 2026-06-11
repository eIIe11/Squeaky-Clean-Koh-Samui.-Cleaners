import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import BubbleEffects from "@/components/effects/bubbles";
import "./globals.css";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Squeaky Clean — Premium Cleaning Services Thailand",
    template: "%s | Squeaky Clean Thailand",
  },
  description:
    "Professional cleaning services across Thailand. Villa cleaning, Airbnb turnover, deep cleaning, and more. Book online in 90 seconds.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://squeakycleansamui.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Squeaky Clean",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)] antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <BubbleEffects />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
