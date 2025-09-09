import { Prisma, Question, QuestionType } from "@prisma/client";
import { prisma } from "../lib/db";
import { withErrorHandler } from "../lib/error-handler";
import { PopulatedPaperQuestion } from "./paper-question";

export interface PopulatedQuestion extends Question {
  children: PopulatedQuestion[];
  parent: PopulatedQuestion | null;
  meta: QustionMeta | null;
  paperQuestions: PopulatedPaperQuestion[];
}

export type QustionMeta = {
  answer?: string;
  options?: QuestionType[];
};

export type QuestionOption = {
  label: string;
  isAnswer: boolean;
};

const QuestionServiceBase = {
  create: async (data: Prisma.QuestionCreateInput) => {
    return await prisma.question.create({
      data,
    });
  },
  list: async (input: Prisma.QuestionFindManyArgs) => {
    const { where, ...rest } = input;
    const [records, total] = await Promise.all([
      prisma.question.findMany({
        ...rest,
        where,
      }),
      prisma.question.count({ where }),
    ]);
    return {
      records: records as PopulatedQuestion[],
      total,
    };
  },
  update: async (id?: string, data?: Prisma.QuestionUpdateInput) => {
    return await prisma.question.update({
      where: { id },
      data: {
        ...(data ?? {}),
      },
    });
  },
  delete: async (id?: string) => {
    return await prisma.question.delete({
      where: { id },
    });
  },
};

export const QuestionService = withErrorHandler(QuestionServiceBase);
