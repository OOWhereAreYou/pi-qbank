// question
export enum QuestionStatus {
  DELETED = 0,
  ACTIVE = 1,
  DRAFT = 2,
}

export const questionStatus: Record<QuestionStatus, string> = {
  [QuestionStatus.DELETED]: "已删除",
  [QuestionStatus.ACTIVE]: "正常",
  [QuestionStatus.DRAFT]: "草稿",
};

// paper
export enum PaperStatus {
  DELETED = 0,
  ACTIVE = 1,
  DRAFT = 2,
}

export const paperStatus: Record<PaperStatus, string> = {
  [PaperStatus.DELETED]: "已删除",
  [PaperStatus.ACTIVE]: "正常",
  [PaperStatus.DRAFT]: "草稿",
};
