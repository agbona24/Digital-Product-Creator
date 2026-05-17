import Link from "next/link";
import { Shovel } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
            <Shovel className="size-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">NicheForge</span>
        </Link>
        <ThemeToggle />
      </nav>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
