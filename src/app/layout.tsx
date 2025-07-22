import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS here
import { getDictionary, type Dictionary } from "@/lib/i18n";
import RootLayoutClient from "./layout-client";


export const metadata: Metadata = {
  title: "Flockia",
  description: "A citizen science app for counting pigeons and contributing to urban wildlife data.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕊️</text></svg>",
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
