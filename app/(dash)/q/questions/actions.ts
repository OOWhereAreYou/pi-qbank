"use server";

import { QuestionService } from "@/server/service/question";

export const createQuestion = QuestionService.create;

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
