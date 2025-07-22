"use client";

import Link from "next/link";
import { Bird, Menu, X, List, MapIcon, Info } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import AuthButton from "./AuthButton";
import { Suspense, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AuthButtonSkeleton() {
  return <Skeleton className="h-10 w-20" />;
}

interface HeaderProps {
  dict: Dictionary["header"];
}

export default function Header({ dict }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: "/reportar",
      label: dict.report,
      icon: <Bird className="h-5 w-5" />,
    },
    {
      href: "/reports",
      label: dict.reports,
      icon: <List className="h-5 w-5" />,
    },
    {
      href: "/acerca-de",
      label: dict.about,
      icon: <Info className="h-5 w-5" />,
    },
  ];

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/flockia-isologo.png"
            alt="Flockia Isologo"
            width={84}
            height={21}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          {navLinks.map((link) => (
            <Button variant="ghost" asChild key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Suspense fallback={<AuthButtonSkeleton />}>
            <AuthButton />
          </Suspense>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] p-4">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image
                      src="/flockia-isologo.png"
                      alt="Flockia Isologo"
                      width={120}
                      height={30}
                    />
                  </Link>
                </div>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 text-lg font-medium p-2 rounded-md hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto">
                  <div className="border-t pt-4">
                    <Suspense fallback={<AuthButtonSkeleton />}>
                      <AuthButton />
                    </Suspense>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
