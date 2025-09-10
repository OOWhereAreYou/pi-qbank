import { z } from "zod";
import { QuestionType } from "@prisma/client";

// 基础信息 Schema，所有题型共享
export const baseQuestionSchema = z.object({
  difficulty: z.number().min(1).max(3).default(1).optional(),
  knowledgePoints: z.array(z.string()).default([]).optional(),
  tags: z.array(z.string()).default([]).optional(),
  source: z.string().optional(),
  grade: z.number().optional(),
  subject: z.string().optional(),
});

// 选项的 Schema
export const optionSchema = z.object({
  content: z.string().min(1, { message: "选项内容不能为空" }),
  isCorrect: z.boolean().default(false).optional(),
});

// 子题的 Schema (用于复合题)
const subQuestionSchema = z.discriminatedUnion("type", [
  // 子题 - 单选、多选、不定项
  z.object({
    type: z.enum([
      QuestionType.SINGLE,
      QuestionType.MULTIPLE,
      QuestionType.INDEFINITE,
    ]),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z
      .object({
        options: z.array(optionSchema).min(2, "至少需要两个选项"),
      })
      .refine((data) => data.options.some((opt) => opt.isCorrect), {
        message: "必须设置至少一个正确答案",
        path: ["options"],
      }),
  }),
  // 子题 - 判断题
  z.object({
    type: z.literal(QuestionType.JUDGEMENT),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z.object({
      answer: z.boolean({ message: "请选择正确答案" }),
    }),
  }),
  // 子题 - 填空题
  z.object({
    type: z.literal(QuestionType.FILL),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z.object({
      answers: z
        .array(z.object({ value: z.string().min(1, "答案不能为空") }))
        .min(1, "至少需要一个答案"),
    }),
  }),
  // 子题 - 简答题
  z.object({
    type: z.literal(QuestionType.ESSAY),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z.any().optional(),
  }),
]);

// 主表单的 Schema 定义
export const questionFormSchema = z.discriminatedUnion("type", [
  // 单选题、多选题、不定项题
  baseQuestionSchema.extend({
    type: z.enum([
      QuestionType.SINGLE,
      QuestionType.MULTIPLE,
      QuestionType.INDEFINITE,
    ]),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z
      .object({
        options: z.array(optionSchema).min(2, "至少需要两个选项"),
      })
      .refine((data) => data.options.some((opt) => opt.isCorrect), {
        message: "必须设置至少一个正确答案",
        path: ["options"],
      }),
  }),
  // 判断题
  baseQuestionSchema.extend({
    type: z.literal(QuestionType.JUDGEMENT),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z.object({
      answer: z.boolean(),
    }),
  }),
  // 填空题
  baseQuestionSchema.extend({
    type: z.literal(QuestionType.FILL),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z.object({
      answers: z
        .array(z.object({ value: z.string().min(1, "答案不能为空") }))
        .min(1, "至少需要一个答案"),
    }),
  }),
  // 简答题
  baseQuestionSchema.extend({
    type: z.literal(QuestionType.ESSAY),
    content: z.string().min(1, { message: "题干不能为空" }),
    analysis: z.string().optional(),
    meta: z.any().optional(), // 简答题可能没有 meta
  }),
  // 复合题
  baseQuestionSchema.extend({
    type: z.literal(QuestionType.COMPOUND),
    content: z.string().optional(),
    subQuestions: z.array(subQuestionSchema).min(1, "复合题至少需要一个子题"),
  }),
]);

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
