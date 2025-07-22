import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS here
import { getDictionary, type Dictionary } from "@/lib/i18n";
import RootLayoutClient from "./layout-client";


export const metadata: Metadata = {
  title: "Flockia",
  description: "AI-powered citizen science for urban birds",
  icons: {
    icon: "/flockia-logo.png"
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dict = await getDictionary();
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <RootLayoutClient dict={dict}>
            {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
