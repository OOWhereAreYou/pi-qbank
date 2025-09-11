import { cn } from "@/lib/utils";
import { FC, PropsWithChildren } from "react";

export const DashContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main
      className={cn("flex-1 overflow-y-scroll p-6", "h-[calc(100vh-64px)]")}
    >
      {children}
    </main>
  );
};
