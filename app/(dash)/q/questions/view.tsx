"use client";
import { IList, useList } from "@/components/hooks/use-list";
import { PopulatedQuestion } from "@/server/service/question";
import { listQuestions } from "./actions";
import { Button } from "@/components/ui/button";

type IProps = {
  defaultValue?: IList<PopulatedQuestion> | null;
};

export const ViewComponent = ({ defaultValue }: IProps) => {
  const { records } = useList({
    fetcher: listQuestions,
    initialData: defaultValue,
  });

  const onAdd = () => {
    console.log("add");
  };

  return (
    <div className="space-y-2">
      <div className="bg-card">
        <Button>新增</Button>
      </div>
      <div className="space-y-2">
        {records.map((item) => (
          <div className="border rounded overflow-hidden p-4" key={item.id}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};
