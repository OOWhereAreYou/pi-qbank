"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MenuItem, menuItems } from "./menu";

const buildBreadcrumbs = (pathname: string): MenuItem[] => {
  const segments = pathname.split("/").filter((segment) => segment !== "");
  const breadcrumbs: MenuItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    let foundItem: MenuItem | undefined;

    const searchMenuItem = (
      items: MenuItem[],
      path: string
    ): MenuItem | undefined => {
      for (const item of items) {
        if (item.href === path) {
          return item;
        }
        if (item.children) {
          const child = searchMenuItem(item.children, path);
          if (child) return child;
        }
      }
      return undefined;
    };

    foundItem = searchMenuItem(menuItems, currentPath);

    if (foundItem) {
      breadcrumbs.push(foundItem);
    } else {
      let label = "详情";
      if (segment === "new" || segment == "create") {
        label = "新建";
      }
      breadcrumbs.push({
        label: label,
        href: currentPath,
      });
    }
  });

  return breadcrumbs;
};

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const breadcrumbItems = buildBreadcrumbs(pathname);

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  if (
    pathname === "/dash" &&
    breadcrumbItems.length === 1 &&
    breadcrumbItems[0].href === "/dash"
  ) {
    return (
      <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
        <span className="text-gray-700 dark:text-gray-200">
          {breadcrumbItems[0].label}
        </span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        return (
          <div key={item.href + item.label} className="flex items-center">
            <Link
              href={item.href}
              className={
                isLast
                  ? "text-gray-700 dark:text-gray-200"
                  : "hover:text-gray-700 dark:hover:text-gray-200"
              }
            >
              {item.label}
            </Link>
            {!isLast && <ChevronRight className="h-4 w-4 mx-1" />}
          </div>
        );
      })}
    </nav>
  );
};
