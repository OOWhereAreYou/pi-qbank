"use client";
import { useRef } from "react";
import { QuestionForm, QuestionFormRef } from "../components/form";
import { Button } from "@/components/ui/button";
import { saveQuestion } from "../actions";
import { PopulatedQuestion } from "@/server/service/question";
import { nullsToUndefined } from "@/lib/utils";
import useLoading from "@/components/hooks/use-loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type IProps = {
  defaultValue?: PopulatedQuestion | null;
};

export const ViewCOmponent = ({ defaultValue }: IProps) => {
  const router = useRouter();
  const formRef = useRef<QuestionFormRef>(null);
  const { startLoading, endLoading } = useLoading();
  const onSave = async () => {
    const trigger = await formRef.current?.triggerValidate();
    const values = formRef.current?.getValues();
    if (!trigger || !values) return;
    startLoading();
    const result = await saveQuestion(nullsToUndefined(values));
    endLoading();
    toast[result.status](result.message);
    if (result.status === "success") {
      router.replace(`/q/questions/${result.data?.id}`);
      return;
    }
  };

  return (
    <div className="m-auto w-2xl space-y-2">
      <div className="flex justify-end bg-card p-4 rounded sticky top-0 gap-2 border border-muted-foreground/10">
        <Button variant="secondary" onClick={router.back}>
          返回
        </Button>
        <Button onClick={onSave}>保存</Button>
      </div>
      <div className="bg-card p-4 rounded border border-muted-foreground/10">
        <QuestionForm ref={formRef} initialData={defaultValue} />
      </div>
    </div>
  );
};
