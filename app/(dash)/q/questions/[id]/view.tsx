"use client";
import { useRef } from "react";
import { QuestionForm, QuestionFormRef } from "../components/form";
import { Button } from "@/components/ui/button";
import { createQuestion } from "../actions";
import { PopulatedQuestion } from "@/server/service/question";
import { QuestionFormValues } from "../components/schema";

type IProps = {
  defaultValue?: PopulatedQuestion | null;
};

export const ViewCOmponent = ({ defaultValue }: IProps) => {
  const formRef = useRef<QuestionFormRef>(null);

  const onSave = async () => {
    const trigger = await formRef.current?.triggerValidate();
    console.log("trigger", trigger);
    if (!trigger) return;

    const values = formRef.current?.getValues();
    const result = await createQuestion({
      ...values,
      content: values?.content ?? "",
    });
    console.log("result", result);
  };

  return (
    <div className="m-auto w-2xl bg-card p-4 border rounded space-y-2">
      <div className="flex justify-end">
        <Button onClick={onSave}>保存</Button>
      </div>
      <QuestionForm
        ref={formRef}
        initialData={defaultValue as QuestionFormValues}
      />
    </div>
  );
};
