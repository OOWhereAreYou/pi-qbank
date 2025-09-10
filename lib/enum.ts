import { QuestionType } from "@prisma/client";

export const questionTypeNames: Record<QuestionType, string> = {
  SINGLE: "单选题",
  MULTIPLE: "多选题",
  INDEFINITE: "不定项选择题",
  JUDGEMENT: "判断题",
  FILL: "填空题",
  ESSAY: "简答题",
  COMPOUND: "复合题",
};
