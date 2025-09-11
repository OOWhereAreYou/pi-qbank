import { CopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

type IProps = {
  copyText?: string;
};

export const CopyButton = ({ copyText }: IProps) => {
  const onCopy = async () => {
    try {
      if (!copyText) {
        return;
      }
      await navigator.clipboard.writeText(copyText);
      toast.success("复制成功");
    } catch (error) {
      toast.error("复制失败");
    }
  };

  return (
    <Button className="p-1 size-6 rounded" variant={"outline"} onClick={onCopy}>
      <CopyIcon className="size-4" />
    </Button>
  );
};
