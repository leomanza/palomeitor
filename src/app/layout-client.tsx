
'use client'
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Dictionary } from "@/lib/i18n";

export default function RootLayoutClient({
    children,
    dict
}: {
    children: React.ReactNode,
    dict: Dictionary
}) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    return (
        <div className="flex flex-col min-h-screen">
            {!isLandingPage && <Header dict={dict.header} />}
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
        </div>
    )
}
