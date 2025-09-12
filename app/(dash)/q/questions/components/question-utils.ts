import { PopulatedQuestion } from "@/server/service/question";
import { QuestionType } from "@prisma/client";

const OPTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export const getQuetionStr = (
  q: Partial<PopulatedQuestion>,
  option?: {
    hasAnswer?: boolean;
    hasAnalysis?: boolean;
  }
) => {
  let str = `${q.content}`;
  // 选项
  const optionsStr = q.meta?.options
    ?.map((option, index) => `${OPTIONS[index]}. ${option.label}`)
    .join("\n");
  if (
    q.type == QuestionType.SINGLE ||
    q.type == QuestionType.MULTIPLE ||
    q.type == QuestionType.INDEFINITE
  ) {
    str += `\n${optionsStr}`;
  }

  // 子题
  const childrenStr = q.children
    ?.map((child, index) => `(${index + 1}). ${getQuetionStr(child)}`)
    .join("\n");
  if (q.type == QuestionType.COMPOUND) {
    str += `\n${childrenStr}`;
    if (option?.hasAnswer) {
      str += `\n答案：${q.children
        ?.map((child, index) => `(${index + 1})${child.meta?.answer ?? "无"}`)
        .join("; ")}`;
    }
    if (option?.hasAnalysis) {
      str += `\n解析：${q.children
        ?.map((child, index) => `(${index + 1})${child.meta?.analysis ?? "无"}`)
        .join("; ")}`;
    }
  } else {
    if (option?.hasAnswer) {
      str += `\n答案：${q.meta?.answer ?? "无"}`;
    }
    if (option?.hasAnalysis) {
      str += `\n解析：${q.meta?.analysis ?? "无"}`;
    }
  }

  return str;
};
