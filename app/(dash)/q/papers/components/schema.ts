import { z } from "zod";

export const paperFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "试卷名称不能为空"),
  description: z.string().optional().nullable(),
  difficulty: z.number({}).min(1).max(3),
  grade: z.number({}).optional().nullable(),
  subject: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  score: z.number({}).min(0, "总分不能为负数"),
});

export type PaperFormValues = z.infer<typeof paperFormSchema>;
