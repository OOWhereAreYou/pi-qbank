import { useDialog } from "@/components/hooks/use-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/widgets/copy-button";
import { DropdownButton } from "@/components/widgets/dropdown-button";
import { MdRender } from "@/components/widgets/md-render";
import { questionTypeNames } from "@/lib/enum";
import { PopulatedQuestion } from "@/server/service/question";
import { useRouter } from "next/navigation";
import { getQuetionStr } from "./question-utils";
import { useMemo } from "react";
import { toast } from "sonner";

type IProps = {
  item: PopulatedQuestion;
  index: number;
  onDelete?: () => void;
};

export const QuestionCard = ({ item, index, onDelete }: IProps) => {
  const router = useRouter();
  const { openDialog } = useDialog();
  const questionStr = useMemo(() => {
    return getQuetionStr(item, {
      hasAnswer: true,
      hasAnalysis: true,
    });
  }, [item]);
  return (
    <div className="border rounded bg-card space-y-2">
      <div className="flex items-center gap-2 px-4 py-1 bg-muted/50 justify-between">
        <Badge variant={"outline"}>
          {questionTypeNames[item.type ?? "ESSAY"]}
        </Badge>
        <span className="text-sm flex items-center gap-2">
          <span>ID:{item.id}</span>
          <CopyButton copyText={item.id} />
        </span>
        <div className="flex-grow"></div>
        <DropdownButton
          options={[
            {
              label: "编辑",
              onClick: () => {
                router.push(`/q/questions/${item.id}`);
              },
            },
            {
              label: "复制",
              onClick: async () => {
                await navigator.clipboard.writeText(questionStr);
                toast.success("复制成功");
              },
            },
            {
              label: "删除",
              variant: "destructive",
              onClick: () => {
                openDialog({
                  title: "删除",
                  content: <p>确定要删除此题目吗？</p>,
                  onConfirm: () => {
                    onDelete?.();
                  },
                });
              },
            },
          ]}
        />
      </div>
      <div className="px-4">
        <MdRender md={`${index + 1}.&nbsp;${questionStr}`} />
      </div>
      <div></div>
    </div>
  );
};
