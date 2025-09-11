"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button, buttonVariants } from "../ui/button";
import { VariantProps } from "class-variance-authority";
import { ChevronDownIcon, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type IProps = {
  label?: React.ReactNode | string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  options?: {
    icon?: React.ReactNode;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    value?: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
  }[];
  className?: string;
  showDownArrow?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
};

export const DropdownButton = ({
  variant = "ghost",
  label,
  options,
  showDownArrow,
  className,
  size = "icon",
}: IProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            "gap-1",
            className,
            size == "icon" && !className ? "size-8" : ""
          )}
          size={size}
        >
          {label ?? <MoreHorizontal />}
          {showDownArrow && <ChevronDownIcon className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {options?.map((item, index) => (
          <DropdownMenuItem
            key={`dropdown-menu-item-${index}`}
            onClick={item.onClick}
            disabled={item.disabled}
            className={item.className}
            variant={item.variant == "destructive" ? "destructive" : "default"}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
