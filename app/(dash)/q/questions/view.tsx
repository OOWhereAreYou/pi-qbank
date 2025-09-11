"use client";
import { IList, useList } from "@/components/hooks/use-list";
import { PopulatedQuestion } from "@/server/service/question";
import { deleteQuestion, listQuestions } from "./actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { QuestionCard } from "./components/card";
import { SearchInput } from "@/components/widgets/search-input";
import useLoading from "@/components/hooks/use-loading";

type IProps = {
  defaultValue?: IList<PopulatedQuestion> | null;
};

export const ViewComponent = ({ defaultValue }: IProps) => {
  const router = useRouter();
  const { startLoading, endLoading } = useLoading();
  const { records, onSearch, loading, refetch } = useList({
    fetcher: listQuestions,
    initialData: defaultValue,
  });

  const onAdd = () => {
    router.push("/q/questions/new");
  };

  return (
    <div className="space-y-4 m-auto w-2xl">
      <div className="bg-card p-4 flex items-center justify-between sticky top-0">
        <SearchInput
          onSearch={onSearch}
          onClear={() => onSearch(null)}
          loading={loading}
        />
        <Button onClick={onAdd}>新增</Button>
      </div>
      <div className="space-y-4">
        {records.map((item, index) => (
          <QuestionCard
            item={item}
            key={item.id}
            index={index}
            onDelete={async () => {
              startLoading();
              await deleteQuestion(item.id);
              endLoading();
              refetch();
            }}
          />
        ))}
      </div>
    </div>
  );
};
