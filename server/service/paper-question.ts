import { Prisma, PaperQuestion } from "@prisma/client";
import { prisma } from "../lib/db";
import { withErrorHandler } from "../lib/error-handler";
import { PopulatedPaper } from "./paper";
import { PopulatedQuestion } from "./question";

export type PopulatedPaperQuestion = Omit<PaperQuestion, "questionSnapshot"> & {
  paper: PopulatedPaper;
  question: PopulatedQuestion;
  questionSnapshot: PopulatedQuestion;
};

type PaperQuestionId = {
  paperId: string;
  questionId: string;
};

const PaperQuestionServiceBase = {
  create: async (data: Prisma.PaperQuestionCreateInput) => {
    return await prisma.paperQuestion.create({
      data,
    });
  },
  list: async (input: Prisma.PaperQuestionFindManyArgs) => {
    const { where, ...rest } = input;
    const [records, total] = await Promise.all([
      prisma.paperQuestion.findMany({
        ...rest,
        where,
      }),
      prisma.paperQuestion.count({ where }),
    ]);
    return {
      records,
      total,
    };
  },
  update: async (
    id: PaperQuestionId,
    data?: Prisma.PaperQuestionUpdateInput
  ) => {
    return await prisma.paperQuestion.update({
      where: {
        paperId_questionId: id,
      },
      data: {
        ...(data ?? {}),
      },
    });
  },
  delete: async (id: PaperQuestionId) => {
    return await prisma.paperQuestion.delete({
      where: { paperId_questionId: id },
    });
  },
};

export const PaperQuestionService = withErrorHandler(PaperQuestionServiceBase);
