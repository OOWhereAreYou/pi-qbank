"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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

export interface QuestionFormProps {
  initialData?: Partial<QuestionFormValues> | null;
}

export interface QuestionFormRef {
  getValues: () => QuestionFormValues;
  triggerValidate: () => Promise<boolean>;
}

// =======================================================================
// PART 1: 子组件 - 用于渲染不同题型的特定字段
// =======================================================================

// 用于单选、多选、不定项的选项组件
const ChoiceOptionsForm = ({
  form,
  namePrefix,
}: {
  form: any;
  namePrefix: string;
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
            name={`${namePrefix}.options.${index}.content`}
            placeholder={`选项 ${index + 1}`}
            className="flex-grow"
          />
          <CheckboxForm
            name={`${namePrefix}.options.${index}.isCorrect`}
            label="正确"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
          >
            删除
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ content: "", isCorrect: false })}
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
    valueType="boolean"
    options={[
      { value: "true", label: "正确" },
      { value: "false", label: "错误" },
    ]}
  />
);

// 用于填空题的答案组件
const FillAnswerForm = ({
  form,
  namePrefix,
}: {
  form: any;
  namePrefix: string;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${namePrefix}.answers`,
  });

  return (
    <div className="space-y-4 rounded-md border p-4">
      <FormLabel>填空答案</FormLabel>
      <FormDescription>每个输入框代表一个需要填写的空。</FormDescription>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <InputForm
            name={`${namePrefix}.answers.${index}.value`}
            placeholder={`答案 ${index + 1}`}
            className="flex-grow"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
          >
            删除
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ value: "" })}
      >
        添加答案
      </Button>
    </div>
  );
};

// 单一题目的详细信息表单（题干、答案、解析）
const SimpleQuestionDetails = ({
  form,
  type,
}: {
  form: any;
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
      {type === "FILL" && <FillAnswerForm form={form} namePrefix="meta" />}

      <TextareaForm
        name="analysis"
        label="解析"
        placeholder="请输入题目解析"
        rows={3}
      />
    </div>
  );
};

// 复合题的子题列表组件
const SubQuestionList = ({ form }: { form: any }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subQuestions",
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
              meta: { options: [] },
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
            onRemove={() => remove(index)}
            options={subQuestionTypeOptions}
          />
        ))}
      </div>
      <FormField
        control={form.control}
        name="subQuestions"
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
  form: any;
  index: number;
  onRemove: () => void;
  options: any[];
}) => {
  const questionType = form.watch(`subQuestions.${index}.type`);

  return (
    <div className="space-y-6 rounded-md border bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">子题 {index + 1}</h4>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
        >
          删除子题
        </Button>
      </div>
      <SelectForm
        name={`subQuestions.${index}.type`}
        label="题型"
        placeholder="请选择题型"
        options={options}
      />
      <TextareaForm
        name={`subQuestions.${index}.content`}
        label="题干"
        placeholder="请输入子题题干"
        rows={3}
      />

      {(questionType === "SINGLE" ||
        questionType === "MULTIPLE" ||
        questionType === "INDEFINITE") && (
        <ChoiceOptionsForm
          form={form}
          namePrefix={`subQuestions.${index}.meta`}
        />
      )}
      {questionType === "JUDGEMENT" && (
        <JudgementAnswerForm namePrefix={`subQuestions.${index}.meta`} />
      )}
      {questionType === "FILL" && (
        <FillAnswerForm form={form} namePrefix={`subQuestions.${index}.meta`} />
      )}

      <TextareaForm
        name={`subQuestions.${index}.analysis`}
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
      },
    });

    useImperativeHandle(ref, () => ({
      getValues: () => form.getValues(),
      triggerValidate: () => form.trigger(),
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
          {mainQuestionType !== QuestionType.COMPOUND && (
            <SimpleQuestionDetails form={form} type={mainQuestionType} />
          )}
        </form>
      </Form>
    );
  }
);
