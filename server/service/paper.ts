import { Prisma, Paper } from "@prisma/client";
import { prisma } from "../lib/db";
import { withErrorHandler } from "../lib/error-handler";
import { PopulatedPaperQuestion } from "./paper-question";
import { PopulatedQuestion } from "./question";

export type PopulatedPaper = Omit<Paper, "structure"> & {
  paperQuestions: PopulatedPaperQuestion[];
  structure: PaperStructure[];
};

export type PaperStructure = {
  title: string;
  description: string;
  questions: PopulatedQuestion[];
  qids: {
    qid: string;
    score: number;
  }[];
};
const PaperServiceBase = {
  get: async (id: string) => {
    const paper = await prisma.paper.findUnique({
      where: { id },
      include: {
        paperQuestions: {
          include: {
            question: true,
          },
        },
      },
    });
    if (!paper) {
      throw new Error("试卷不存在");
    }
    return paper as unknown as PopulatedPaper;
  },
  create: async (data: Prisma.PaperCreateInput) => {
    return await prisma.paper.create({
      data,
    });
  },
  list: async (input: Prisma.PaperFindManyArgs) => {
    const { where, ...rest } = input;
    const [records, total] = await Promise.all([
      prisma.paper.findMany({
        ...rest,
        where,
      }),
      prisma.paper.count({ where }),
    ]);
    return {
      records: records as unknown as PopulatedPaper[],
      total,
    };
  },
  update: async (id?: string, data?: Prisma.PaperUpdateInput) => {
    return await prisma.paper.update({
      where: { id },
      data: {
        ...(data ?? {}),
      },
    });
  },
  delete: async (id?: string) => {
    return await prisma.paper.delete({
      where: { id },
    });
  },
};

export const PaperService = withErrorHandler(PaperServiceBase);
