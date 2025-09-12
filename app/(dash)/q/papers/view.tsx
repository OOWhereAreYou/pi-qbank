"use client";
import { useDialog } from "@/components/hooks/use-dialog";
import { Button } from "@/components/ui/button";
import { PaperForm, PaperFormRef } from "./components/form";
import { useRef } from "react";
import { createPaper, listPapers, updatePaper } from "./actions";
import { toast } from "sonner";
import useLoading from "@/components/hooks/use-loading";
import { IList, useList } from "@/components/hooks/use-list";
import { PopulatedPaper } from "@/server/service/paper";
import { PaperCard } from "./components/card";

type IProps = {
  defaultValue?: IList<PopulatedPaper> | null;
};

export const ViewComponent = ({ defaultValue }: IProps) => {
  const { openDialog, closeDialog } = useDialog();
  const { startLoading, endLoading } = useLoading();
  const { records, refetch } = useList({
    initialData: defaultValue,
    fetcher: listPapers,
  });
  const formRef = useRef<PaperFormRef>(null);
  const onAdd = (item?: PopulatedPaper) => {
    openDialog({
      title: item ? "编辑" : "新增",
      content: <PaperForm ref={formRef} initialData={item} />,
      manualClose: true,
      onConfirm: async () => {
        const trigger = await formRef.current?.triggerValidate();
        const values = formRef.current?.getValues();
        if (!trigger || !values) {
          return;
        }
        startLoading();
        const { id, tags, ...rest } = values;
        const result = id
          ? await updatePaper(id, {
              ...rest,
              tags: tags ?? [],
            })
          : await createPaper({
              ...rest,
              tags: tags ?? [],
            });
        toast[result.status](result.message);
        endLoading();
        if (result.status === "success") {
          closeDialog();
          refetch();
        }
      },
    });
  };
  return (
    <div className="space-y-4 m-auto w-2xl">
      <div className="rounded bg-card p-4 flex items-center justify-between sticky top-0 border border-muted-foreground/10">
        <Button onClick={() => onAdd()}>新增</Button>
      </div>
      <div className="space-y-4">
        {records.map((item) => (
          <PaperCard item={item} key={item.id} onEdit={() => onAdd(item)} />
        ))}
      </div>
    </div>
  );
};
