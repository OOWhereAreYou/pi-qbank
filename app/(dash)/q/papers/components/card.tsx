import { PopulatedPaper } from "@/server/service/paper";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { DropdownButton } from "@/components/widgets/dropdown-button";
import { difficultyMap } from "@/lib/enum";
import { useDialog } from "@/components/hooks/use-dialog";

type IProps = {
  item: PopulatedPaper;
  onDelete?: () => void;
  onEdit?: () => void;
};

export const PaperCard = ({ item, onDelete, onEdit }: IProps) => {
  const { openDialog } = useDialog();
  const questionCount = item.paperQuestions?.length ?? 0;
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <CardTitle>{item.name}</CardTitle>
            {item.description && (
              <CardDescription>{item.description}</CardDescription>
            )}
          </div>
          <DropdownButton
            label={<MoreVertical className="h-4 w-4" />}
            options={[
              {
                label: "编辑",
                onClick: () => {
                  onEdit?.();
                },
              },
              {
                label: "删除",
                variant: "destructive",
                onClick: () => {
                  openDialog({
                    title: "删除试卷",
                    content: `确定删除试卷《${item.name}》吗？`,
                    onConfirm: () => {
                      onDelete?.();
                    },
                  });
                },
              },
            ]}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Badge variant="outline">总分: {item.score}</Badge>
          <Badge variant="outline">题目数: {questionCount}</Badge>
          <Badge variant="outline">
            难度: {difficultyMap[item.difficulty ?? 1]}
          </Badge>
          {item.subject && (
            <Badge variant="outline">科目: {item.subject}</Badge>
          )}
          {item.grade && <Badge variant="outline">年级: {item.grade}</Badge>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          创建于 {new Date(item.createdAt).toLocaleDateString()}
        </div>
        <Button asChild>
          <Link href={`/q/papers/${item.id}`}>查看试卷</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
