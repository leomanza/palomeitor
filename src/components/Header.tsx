import Link from "next/link";
import { Bird, Info } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import AuthButton from "./AuthButton";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

function AuthButtonSkeleton() {
    return <Skeleton className="h-10 w-20" />;
}

interface HeaderProps {
    dict: Dictionary['header'];
}

export default function Header({ dict }: HeaderProps) {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Bird className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold font-headline">
            {dict.title}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Button variant="ghost" asChild>
            <Link
              href="/reportar"
            >
              {dict.report}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link
              href="/reports"
            >
              {dict.reports}
            </Link>
          </Button>
           <Button variant="ghost" asChild>
            <Link
              href="/acerca-de"
            >
              {dict.about}
            </Link>
          </Button>
          <Suspense fallback={<AuthButtonSkeleton />}>
             <AuthButton />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
