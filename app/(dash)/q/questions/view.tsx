"use client";
import { IList, useList } from "@/components/hooks/use-list";
import { PopulatedQuestion } from "@/server/service/question";
import { listQuestions } from "./actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { QuestionCard } from "./components/card";

type IProps = {
  defaultValue?: IList<PopulatedQuestion> | null;
};

export const ViewComponent = ({ defaultValue }: IProps) => {
  const router = useRouter();
  const { records } = useList({
    fetcher: listQuestions,
    initialData: defaultValue,
  });

  const onAdd = () => {
    router.push("/q/questions/new");
  };

  return (
    <div className="space-y-2">
      <div className="bg-card">
        <Button onClick={onAdd}>新增</Button>
      </div>
      <div className="space-y-2">
        {records.map((item, index) => (
          <QuestionCard item={item} key={item.id} index={index} />
        ))}
      </div>
    </div>
  );
};
