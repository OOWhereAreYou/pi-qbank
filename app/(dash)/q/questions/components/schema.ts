import { z } from "zod";
import { QuestionType } from "@prisma/client";

// 选项的 Schema
export const optionSchema = z.object({
  label: z.string().min(1, { message: "选项内容不能为空" }),
  isAnswer: z.boolean(),
});

export const metaScheme = z
  .object({
    answer: z.string().optional(),
    options: z.array(optionSchema).optional(),
  })
  .nullable()
  .optional();

// 题型
const typeEnum = Object.values(QuestionType);

// 基础信息 Schema，所有题型共享
export const baseQuestionSchema = z.object({
  id: z.string().optional(),
  difficulty: z.number().min(1).max(3).nullable().optional(),
  knowledgePoints: z.array(z.string()).default([]).nullable().optional(),
  tags: z.array(z.string()).default([]).nullable().optional(),
  source: z.string().nullable().optional(),
  grade: z.number().nullable().optional(),
  subject: z.string().nullable().optional(),
  analysis: z.string().nullable().optional(),
  content: z.string().min(1, { message: "题干不能为空" }).nullable().optional(),
  type: z.enum(typeEnum).nullable().optional(),
  meta: metaScheme,
});

// 主表单的 Schema 定义
export const questionFormSchema = baseQuestionSchema.extend({
  children: z.array(baseQuestionSchema).optional().nullable(),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
