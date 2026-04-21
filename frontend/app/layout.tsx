import type { Metadata } from "next";
import { Prompt, Kanit } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "PetHub Thailand - ช่วยน้องกลับบ้าน",
  description: "แพลตฟอร์มช่วยเหลือสัตว์เลี้ยงหาย รวมประกาศตามหา ประกาศรับเลี้ยง และหาบ้านให้น้องในประเทศไทย",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
