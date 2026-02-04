import { z } from "zod";

export const ResearchBriefSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  keyPoints: z
    .array(
      z.object({
        heading: z.string(),
        details: z.string()
      })
    )
    .min(1),
  statsAndData: z
    .array(
      z.object({
        description: z.string(),
        value: z.string(),
        source: z.string()
      })
    )
    .optional(),
  citations: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        note: z.string()
      })
    )
    .optional()
});

export type ResearchBrief = z.infer<typeof ResearchBriefSchema>;

