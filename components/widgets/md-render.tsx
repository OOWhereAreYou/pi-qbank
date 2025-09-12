"use client";
import { cn } from "@/lib/utils";
import { Streamdown } from "streamdown";

type IProps = {
  md?: string | null;
  className?: string;
};
export const MdRender = ({ md = "", className }: IProps) => {
  return (
    <div
      className={cn(
        "whitespace-break-spaces text-justify leading-8",
        className
      )}
    >
      <Streamdown>{`${md}`}</Streamdown>
    </div>
  );
};
