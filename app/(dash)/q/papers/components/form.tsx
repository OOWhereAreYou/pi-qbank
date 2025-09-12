"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import React, { forwardRef, useImperativeHandle } from "react";

import { Form } from "@/components/ui/form";
import {
  InputForm,
  SelectForm,
  TextareaForm,
  TagsForm,
} from "@/components/widgets/form-item";
import { paperFormSchema, PaperFormValues } from "./schema";
import { cn } from "@/lib/utils";

type PaperFormType = UseFormReturn<PaperFormValues>;

export interface PaperFormProps {
  initialData?: Partial<PaperFormValues> | null;
  className?: string;
}

export interface PaperFormRef {
  getValues: () => PaperFormValues;
  triggerValidate: () => Promise<boolean>;
  form: () => PaperFormType;
}

export const PaperForm = forwardRef<PaperFormRef, PaperFormProps>(
  ({ initialData = {}, className }, ref) => {
    const form = useForm<PaperFormValues>({
      resolver: zodResolver(paperFormSchema),
      defaultValues: {
        name: "",
        description: "",
        difficulty: 1,
        score: 100,
        tags: [],
        grade: null,
        subject: "",
        ...initialData,
      },
    });

    useImperativeHandle(ref, () => ({
      getValues: () => form.getValues(),
      triggerValidate: () => form.trigger(),
      form: () => form,
    }));

    return (
      <Form {...form}>
        <form className={cn("space-y-8", className)}>
          <div className="grid grid-cols-2 gap-4">
            <InputForm
              name="name"
              label="试卷名称"
              placeholder="请输入试卷名称"
              className="col-span-2"
            />
            <SelectForm
              name="difficulty"
              label="难度"
              placeholder="请选择难度"
              valueType="number"
              options={[
                { value: 1, label: "易" },
                { value: 2, label: "中" },
                { value: 3, label: "难" },
              ]}
            />
            <InputForm
              name="score"
              label="总分"
              type="number"
              placeholder="请输入试卷总分"
              valueType="number"
            />
            <InputForm
              name="grade"
              label="年级"
              type="number"
              placeholder="请输入适用年级"
              valueType="number"
            />
            <InputForm name="subject" label="科目" placeholder="请输入科目" />
            <div className="col-span-2">
              <TextareaForm
                name="description"
                label="试卷描述"
                placeholder="请输入试卷描述"
                rows={4}
              />
            </div>
            <div className="col-span-2">
              <TagsForm
                name="tags"
                label="标签"
                placeholder="多个标签请用逗号分隔"
              />
            </div>
          </div>
        </form>
      </Form>
    );
  }
);

PaperForm.displayName = "PaperForm";
