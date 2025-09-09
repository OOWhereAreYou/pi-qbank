"use client";

import { useState } from "react";
import { DashContent, DashHeader, DashSidebar } from "./components";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashSidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <DashHeader onToggleSidebar={toggleSidebar} />
        <DashContent>{children}</DashContent>
      </div>
    </div>
  );
}
