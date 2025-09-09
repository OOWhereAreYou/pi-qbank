import { FC, PropsWithChildren } from "react";

export const DashContent: FC<PropsWithChildren> = ({ children }) => {
  return <main className="flex-1 overflow-y-auto p-6">{children}</main>;
};
