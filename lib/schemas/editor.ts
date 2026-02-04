import { z } from "zod";


export const FinalArticleSchema = z.object({
  title: z.string(),
  content: z.string(),
  seoDescription: z.string().optional(),
});

export type FinalArticle = z.infer<typeof FinalArticleSchema>;


export const EditedContentSchema = z.object({
  finalTitle: z.string(),
  finalBodyMarkdown: z.string(),
  changeNotes: z.array(
    z.object({
      area: z.string(),
      before: z.string().optional(),
      after: z.string(),
      rationale: z.string()
    })
  )
});

export type EditedContent = z.infer<typeof EditedContentSchema>;

