import { z } from "zod";

export const DraftSchema = z.object({
  title: z.string(),
  outline: z.array(z.string()),
  sections: z.array(
    z.object({
      heading: z.string(),
      body: z.string()
    })
  ),
  conclusion: z.string()
});

export type Draft = z.infer<typeof DraftSchema>;

