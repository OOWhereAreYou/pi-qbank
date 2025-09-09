"use server";

import { z } from "zod";

const schema = z.object({
  question: z.string(),
  optionA: z.string(),
  optionB: z.string(),
  optionC: z.string(),
  optionD: z.string(),
  answer: z.string(),
});

export async function createQuestion(formData: FormData) {
  const parsed = schema.parse({
    question: formData.get("question"),
    optionA: formData.get("optionA"),
    optionB: formData.get("optionB"),
    optionC: formData.get("optionC"),
    optionD: formData.get("optionD"),
    answer: formData.get("answer"),
  });

  console.log(parsed);
}
