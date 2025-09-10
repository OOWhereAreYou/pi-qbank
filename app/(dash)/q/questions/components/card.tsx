import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questionTypeNames } from "@/lib/enum";
import { PopulatedQuestion } from "@/server/service/question";
import Link from "next/link";

type IProps = {
  item: PopulatedQuestion;
  index: number;
};

export const QuestionCard = ({ item, index }: IProps) => {
  return (
    <div className="border rounded bg-card space-y-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted justify-between">
        <Badge variant={"outline"}>
          {questionTypeNames[item.type ?? "ESSAY"]}
        </Badge>
        <Button variant={"link"} size={"sm"} asChild>
          <Link href={`/q/questions/${item.id}`}>编辑</Link>
        </Button>
      </div>
      <div className="px-4">
        <span>{index + 1}.</span>
        <span>{item.content}</span>
      </div>
    </div>
  );
};
