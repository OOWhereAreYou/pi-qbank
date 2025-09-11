"use server";

import { QuestionService } from "@/server/service/question";

export const saveQuestion = QuestionService.save;

export const getQuestion = QuestionService.get;

export const listQuestions = async (
  page: number = 1,
  pageSize: number = 20,
  search?: string
) => {
  return await QuestionService.list({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      parentId: null,
      OR: search
        ? [
            {
              id: {
                contains: search,
              },
            },
            {
              content: {
                contains: search,
              },
            },
          ]
        : undefined,
    },
    include: {
      children: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const deleteQuestion = QuestionService.delete;
