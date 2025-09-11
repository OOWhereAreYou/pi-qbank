"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";

import { User, Menu } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import Link from "next/link";
import { ThemeToggle } from "@/components/widgets/theme";

type DashHeaderProps = {
  onToggleSidebar: () => void;
};

export const DashHeader: FC<DashHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 sticky top-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/settings/profile">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
};
