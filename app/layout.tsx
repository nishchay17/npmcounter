import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import Providers from "./Providers";

const poppins = Poppins({
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "npm counter",
  description: "Get your npm package download count quickly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-poppins antialiased",
          poppins.className
        )}
      >
        <Providers>{children}</Providers>
        <TailwindIndicator />
      </body>
    </html>
  );
}
