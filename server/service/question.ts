import { Prisma, Question, QuestionType } from "@prisma/client";
import { prisma } from "../lib/db";
import { withErrorHandler } from "../lib/error-handler";
import { PopulatedPaperQuestion } from "./paper-question";

export interface PopulatedQuestion extends Question {
  children?: Partial<PopulatedQuestion>[] | null;
  parent?: PopulatedQuestion | null;
  meta: QustionMeta | null;
  paperQuestions?: PopulatedPaperQuestion[] | null;
}

export type QustionMeta = {
  options?: QuestionOption[];
  answer?: string;
  analysis?: string;
  contentImgs?: string[];
  answerImgs?: string[];
  analysisImgs?: string[];
  order?: number;
};

export type QuestionOption = {
  label: string;
  isAnswer: boolean;
  img?: string;
};

const QuestionServiceBase = {
  get: async (id: string) => {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });
    if (!question) {
      throw new Error("题目不存在");
    }
    return question as PopulatedQuestion;
  },
  create: async (
    data: Prisma.QuestionCreateInput,
    tx?: Prisma.TransactionClient
  ) => {
    return await (tx ?? prisma).question.create({
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

  update: async (
    id?: string,
    data?: Prisma.QuestionUpdateInput,
    tx?: Prisma.TransactionClient
  ) => {
    return await (tx ?? prisma).question.update({
      where: { id },
      data: {
        ...(data ?? {}),
      },
      include: {
        children: true,
      },
    });
  },
  delete: async (id?: string) => {
    return await prisma.question.delete({
      where: { id },
    });
  },
  save: async (data: Partial<PopulatedQuestion>) => {
    const {
      id,
      children: _children,
      createdAt,
      updatedAt,
      paperQuestions,
      parent,
      meta,
      parentId,
      ...rest
    } = data;

    const updateData = {
      ...rest,
      meta: meta ?? {},
    };
    const children = _children?.map((child, index) => ({
      ...child,
      meta: {
        ...(child.meta ?? {}),
        order: index + 1,
      },
    }));

    const existChildrenIds = id
      ? (
          await prisma.question.findMany({
            where: {
              parentId: id,
            },
          })
        ).map((child) => child.id)
      : [];

    let toUpdateChildren = [];
    let toCreateChildren = [];
    let toDeleteChildren = existChildrenIds.filter(
      (id) => !children?.some((child) => child.id === id)
    );

    for (const child of children ?? []) {
      const {
        id: childId,
        children,
        createdAt,
        updatedAt,
        paperQuestions,
        parent,
        parentId,
        ...childRest
      } = child;
      if (childId) {
        toUpdateChildren.push({
          ...childRest,
          id: childId,
        });
      } else {
        toCreateChildren.push({ ...childRest });
      }
    }
    return await prisma.question.upsert({
      where: { id: id ?? "" },
      create: {
        ...updateData,
        children: {
          create: toCreateChildren,
        },
      },
      update: {
        ...updateData,
        children: {
          deleteMany: toDeleteChildren.map((id) => ({ id })),
          update: toUpdateChildren.map(({ id, ...rest }) => ({
            where: { id },
            data: rest,
          })),
          create: toCreateChildren,
        },
      },
      include: {
        children: true,
      },
    });
  },
};

export const QuestionService = withErrorHandler(QuestionServiceBase);
