import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { FinalArticleSchema, type FinalArticle } from "@/lib/schemas/editor";
import type { Draft } from "@/lib/schemas/writer";

export async function runEditor(draft: Draft): Promise<FinalArticle> {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: FinalArticleSchema,
    temperature: 0.2,
    topP: 0.9,
    system: "You are a meticulous editor.",
    prompt: `
Review the draft for clarity, style, and coherence.
Produce a polished final article with:
- A clear title
- Content in Markdown format
- An optional SEO description

DRAFT (JSON):
${JSON.stringify(draft, null, 2)}
    `.trim(),
  });

  if (!result.object) {
    throw new Error("Editor agent failed");
  }

  return result.object;
}


