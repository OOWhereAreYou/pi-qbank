"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { QuestionType } from "@prisma/client";
import React, { forwardRef, useImperativeHandle } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputForm,
  SelectForm,
  TextareaForm,
  CheckboxForm,
  TagsForm,
} from "@/components/widgets/form-item";
import { questionTypeNames } from "@/lib/enum";
import { questionFormSchema, QuestionFormValues } from "./schema";
import { DropdownButton } from "@/components/widgets/dropdown-button";

type QuestionFormType = UseFormReturn<QuestionFormValues>;

export interface QuestionFormProps {
  initialData?: Partial<QuestionFormValues> | null;
}

export interface QuestionFormRef {
  getValues: () => QuestionFormValues;
  triggerValidate: () => Promise<boolean>;
  form: () => QuestionFormType;
}

// =======================================================================
// PART 1: 子组件 - 用于渲染不同题型的特定字段
// =======================================================================

// 用于单选、多选、不定项的选项组件
const ChoiceOptionsForm = ({
  form,
  namePrefix,
}: {
  form: QuestionFormType;
  namePrefix: "meta" | `children.${number}.meta`;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${namePrefix}.options`,
  });

  return (
    <div className="space-y-4 rounded-md border p-4">
      <FormLabel>选项与答案</FormLabel>
      <FormDescription>添加选项并勾选正确答案。</FormDescription>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <InputForm
            name={`${namePrefix}.options.${index}.label`}
            placeholder={`选项 ${index + 1}`}
            className="flex-grow"
          />
          <CheckboxForm
            name={`${namePrefix}.options.${index}.isAnswer`}
            label="正确"
          />
          <DropdownButton
            options={[
              {
                label: "删除",
                onClick: () => remove(index),
                variant: "destructive",
              },
            ]}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ label: "", isAnswer: false })}
      >
        添加选项
      </Button>
      <FormField
        control={form.control}
        name={`${namePrefix}.options`}
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// 用于判断题的答案组件
const JudgementAnswerForm = ({ namePrefix }: { namePrefix: string }) => (
  <SelectForm
    name={`${namePrefix}.answer`}
    label="正确答案"
    options={[
      { value: "正确", label: "正确" },
      { value: "错误", label: "错误" },
    ]}
  />
);

// 用于填空题的答案组件
const FillAnswerForm = ({ namePrefix }: { namePrefix: string }) => (
  <div className="space-y-4">
    <FormLabel>填空答案</FormLabel>
    <FormDescription>如果答案有多个空, 请用分号 (;) 隔开。</FormDescription>
    <TextareaForm
      name={`${namePrefix}.answer`}
      placeholder="请输入答案"
      rows={3}
    />
  </div>
);

// 单一题目的详细信息表单（题干、答案、解析）
const SimpleQuestionDetails = ({
  form,
  type,
}: {
  form: QuestionFormType;
  type: QuestionType;
}) => {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">2. 题目详情</h3>
      <TextareaForm
        name="content"
        label="题干"
        placeholder="请输入题干"
        rows={5}
      />

      {(type === "SINGLE" || type === "MULTIPLE" || type === "INDEFINITE") && (
        <ChoiceOptionsForm form={form} namePrefix="meta" />
      )}
      {type === "JUDGEMENT" && <JudgementAnswerForm namePrefix="meta" />}
      {type === "FILL" && <FillAnswerForm namePrefix="meta" />}

      <TextareaForm
        name="meta.analysis"
        label="解析"
        placeholder="请输入题目解析"
        rows={3}
      />
    </div>
  );
};

// 复合题的子题列表组件
const SubQuestionList = ({ form }: { form: QuestionFormType }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  // 子题不能是复合题
  const subQuestionTypeOptions = Object.values(QuestionType)
    .filter((type) => type !== QuestionType.COMPOUND)
    .map((type) => ({
      value: type,
      label: questionTypeNames[type],
    }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">3. 子题列表</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              type: QuestionType.SINGLE,
              content: "",
              meta: { options: [], order: fields.length + 1 },
            })
          }
        >
          添加子题
        </Button>
      </div>
      <div className="space-y-8">
        {fields.map((field, index) => (
          <SubQuestionItem
            key={field.id}
            form={form}
            index={index}
            onRemove={() => {
              remove(index);
            }}
            options={subQuestionTypeOptions}
          />
        ))}
      </div>
      <FormField
        control={form.control}
        name="children"
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// 子题表单项 (与你原来的基本一致，稍作修改)
const SubQuestionItem = ({
  form,
  index,
  onRemove,
  options,
}: {
  form: QuestionFormType;
  index: number;
  onRemove: () => void;
  options: { value: string; label: string }[];
}) => {
  const questionType = form.watch(`children.${index}.type`);

  return (
    <div className="space-y-6 rounded-md border bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">子题 {index + 1}</h4>
        <DropdownButton
          options={[
            {
              label: "删除",
              onClick: onRemove,
              variant: "destructive",
            },
          ]}
        />
      </div>
      <SelectForm
        name={`children.${index}.type`}
        label="题型"
        placeholder="请选择题型"
        options={options}
      />
      <TextareaForm
        name={`children.${index}.content`}
        label="题干"
        placeholder="请输入子题题干"
        rows={3}
      />

      {(questionType === "SINGLE" ||
        questionType === "MULTIPLE" ||
        questionType === "INDEFINITE") && (
        <ChoiceOptionsForm form={form} namePrefix={`children.${index}.meta`} />
      )}
      {questionType === "JUDGEMENT" && (
        <JudgementAnswerForm namePrefix={`children.${index}.meta`} />
      )}
      {questionType === "FILL" && (
        <FillAnswerForm namePrefix={`children.${index}.meta`} />
      )}

      <TextareaForm
        name={`children.${index}.meta.analysis`}
        label="解析"
        placeholder="请输入题目解析"
        rows={3}
      />
    </div>
  );
};

// =======================================================================
// PART 2: 主表单组件
// =======================================================================

export const QuestionForm = forwardRef<QuestionFormRef, QuestionFormProps>(
  ({ initialData = {} }, ref) => {
    const form = useForm<QuestionFormValues>({
      resolver: zodResolver(questionFormSchema),
      defaultValues: {
        ...initialData,
        children: initialData?.children?.sort(
          (a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0)
        ),
      },
    });

    useImperativeHandle(ref, () => ({
      getValues: () => form.getValues(),
      triggerValidate: () => form.trigger(),
      form: () => form,
    }));

    // 监听主题型的变化
    const mainQuestionType = form.watch("type");

    return (
      <Form {...form}>
        <form className="space-y-12">
          {/* Section 1: 题目基本信息 */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">1. 题目基本信息</h3>
            <div className="grid grid-cols-3 gap-2">
              <SelectForm
                name="type"
                label="题型"
                placeholder="请选择题型"
                options={Object.values(QuestionType).map((type) => ({
                  value: type,
                  label: questionTypeNames[type],
                }))}
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
                name="grade"
                label="年级"
                type="number"
                placeholder="请输入适用年级"
                valueType="number"
              />
              <InputForm name="subject" label="科目" placeholder="请输入科目" />
              <TagsForm
                name="knowledgePoints"
                label="知识点"
                placeholder="多个知识点请用逗号分隔"
              />
              <TagsForm
                name="tags"
                label="标签"
                placeholder="多个标签请用逗号分隔"
              />
            </div>
          </div>

          {/* Case 1: 如果是复合题 */}
          {mainQuestionType === QuestionType.COMPOUND && (
            <>
              <div className="space-y-8">
                <h3 className="text-xl font-semibold">
                  2. 复合题主题干 (选填)
                </h3>
                <TextareaForm
                  name="content"
                  label="主题干"
                  placeholder="如果这是一个复合题 (包含多个子题), 请在这里输入主题干, 例如一篇阅读理解的文章。"
                  rows={5}
                />
              </div>
              <div className="border-t" />
              <SubQuestionList form={form} />
            </>
          )}

          {/* Case 2: 如果是简单题 */}
          {mainQuestionType && mainQuestionType !== QuestionType.COMPOUND && (
            <SimpleQuestionDetails form={form} type={mainQuestionType} />
          )}
        </form>
      </Form>
    );
  }
);
