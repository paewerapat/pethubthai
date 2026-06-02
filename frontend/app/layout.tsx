import type { Metadata } from "next";
import { Prompt, Kanit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import CursorPaw from "@/components/CursorPaw";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  display: 'swap',
});

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: 'swap',
});

const BASE_URL = 'https://pethubthai.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PetHub Thai — ช่วยน้องกลับบ้าน',
    template: '%s | PetHub Thai',
  },
  description: 'แพลตฟอร์มช่วยเหลือสัตว์เลี้ยงหาย รวมประกาศตามหา ประกาศรับเลี้ยง และหาบ้านให้น้องในประเทศไทย',
  keywords: ['สัตว์เลี้ยงหาย', 'หาสุนัข', 'หาแมว', 'ตามหาสัตว์เลี้ยง', 'PetHub Thai', 'Thailand'],
  authors: [{ name: 'PetHub Thai' }],
  creator: 'PetHub Thai',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: BASE_URL,
    siteName: 'PetHub Thai',
    title: 'PetHub Thai — ช่วยน้องกลับบ้าน',
    description: 'แพลตฟอร์มช่วยเหลือสัตว์เลี้ยงหาย รวมประกาศตามหา ประกาศรับเลี้ยง และหาบ้านให้น้องในประเทศไทย',
    images: [
      {
        url: '/images/logo-banner.png',
        width: 1200,
        height: 630,
        alt: 'PetHub Thai — ช่วยน้องกลับบ้าน',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetHub Thai — ช่วยน้องกลับบ้าน',
    description: 'แพลตฟอร์มช่วยเหลือสัตว์เลี้ยงหาย รวมประกาศตามหา ประกาศรับเลี้ยง และหาบ้านให้น้องในประเทศไทย',
    images: ['/images/logo-banner.png'],
  },
  icons: {
    icon: [{ url: '/images/logo-icon.png', type: 'image/png' }],
    apple: '/images/logo-icon.png',
    shortcut: '/images/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${kanit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CursorPaw />
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ duration: 3000 }}
        />
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
