"use client";

import { useState } from "react";
import { DashContent, DashHeader, DashSidebar } from "./components";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashSidebar isCollapsed={isSidebarCollapsed} />
      <div
        className={cn(
          "flex flex-1 flex-col bg-muted/30 fixed right-0 top-0 bottom-0",
          isSidebarCollapsed ? "left-20" : "left-64"
        )}
      >
        <DashHeader onToggleSidebar={toggleSidebar} />
        <DashContent>{children}</DashContent>
      </div>
    </div>
  );
}
