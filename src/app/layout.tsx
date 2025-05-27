import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CIE IGCSE Study Notes | Comprehensive Revision Materials",
  description: "Access comprehensive CIE IGCSE study notes, revision materials, and exam preparation resources for all subjects. Expert-curated content to help you excel in your IGCSE examinations.",
  keywords: "CIE IGCSE, study notes, revision, exam preparation, IGCSE subjects, Cambridge International",
  authors: [{ name: "CIE IGCSE Study Notes Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`} style={{ backgroundColor: '#E67E5080' }}>
      <body className="font-sans antialiased" style={{ backgroundColor: '#E67E5080' }}>
        {children}
      </body>
    </html>
  );
}
