"use server";

import { PaperService } from "@/server/service/paper";

export const createPaper = PaperService.create;

export const listPapers = async (
  page: number = 1,
  pageSize: number = 20,
  search?: string
) => {
  return await PaperService.list({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      OR: search
        ? [
            {
              id: {
                contains: search,
              },
            },
            {
              name: {
                contains: search,
              },
            },
          ]
        : undefined,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const deletePaper = PaperService.delete;

export const updatePaper = PaperService.update;

export const getPaper = PaperService.get;
