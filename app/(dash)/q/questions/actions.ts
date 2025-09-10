"use server";

import { QuestionService } from "@/server/service/question";
import { Prisma } from "@prisma/client";

export const createQuestion = QuestionService.create;

export const updateQuestion = async (
  id: string,
  data: Prisma.QuestionUpdateInput
) => {
  return await QuestionService.update(id, {
    ...data,
  });
};

export const getQuestion = QuestionService.get;

export const listQuestions = async (
  page: number = 1,
  pageSize: number = 20
) => {
  return await QuestionService.list({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      parentId: null,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};
