"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { menuItems, MenuItem } from "./menu";

type DashSidebarProps = {
  isCollapsed: boolean;
};

export const DashSidebar: FC<DashSidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    if (isCollapsed) return [];
    const activeParent = menuItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => pathname.startsWith(child.href))
    );
    return activeParent ? [activeParent.href] : [];
  });

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    const isActive = pathname.startsWith(item.href);

    const isMenuOpen = hasChildren && openMenus.includes(item.href);

    const linkClasses = `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    } ${isCollapsed ? "justify-center" : ""}`;

    if (hasChildren && !isCollapsed) {
      return (
        <li key={item.href}>
          <div
            onClick={() => toggleMenu(item.href)}
            className={linkClasses + " cursor-pointer"}
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronDown
              className={`ml-auto h-5 w-5 transform transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isMenuOpen && (
            <ul className="mt-2 space-y-2 pl-8">
              {item.children?.map(renderMenuItem)}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.href}>
        <Link href={item.href} className={linkClasses}>
          {item.icon}
          {!isCollapsed && <span>{item.label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div
      className={`h-full border-r bg-background transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center justify-center border-b bg-background px-6">
        <h1
          className={`text-lg font-bold transition-opacity ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          Pi QBank
        </h1>
      </div>
      <nav className="flex flex-col p-4">
        <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
      </nav>
    </div>
  );
};
