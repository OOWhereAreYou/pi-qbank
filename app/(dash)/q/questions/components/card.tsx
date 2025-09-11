import { useDialog } from "@/components/hooks/use-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/widgets/copy-button";
import { DropdownButton } from "@/components/widgets/dropdown-button";
import { questionTypeNames } from "@/lib/enum";
import { PopulatedQuestion } from "@/server/service/question";
import Link from "next/link";
import { useRouter } from "next/navigation";

type IProps = {
  item: PopulatedQuestion;
  index: number;
  onDelete?: () => void;
};

export const QuestionCard = ({ item, index, onDelete }: IProps) => {
  const router = useRouter();
  const { openDialog } = useDialog();
  return (
    <div className="border rounded bg-card space-y-2">
      <div className="flex items-center gap-2 px-4 py-1 bg-muted justify-between">
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
              label: "删除",
              variant: "destructive",
              onClick: () => {
                openDialog({
                  title: "删除",
                  content: <p>确定要删除此题目吗？</p>,
                  onConfirm: () => {
                    console.log("删除");
                    onDelete?.();
                  },
                });
              },
            },
          ]}
        />
      </div>
      <div className="px-4">
        <span>{index + 1}.</span>
        <span>{item.content}</span>
      </div>
      <div></div>
    </div>
  );
};
