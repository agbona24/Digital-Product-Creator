"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="size-9 text-muted-foreground hover:text-foreground"
        title="Sign out"
      >
        <LogOut className="size-4" />
      </Button>
    </form>
  );
}
