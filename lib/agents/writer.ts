import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { DraftSchema, type Draft } from "@/lib/schemas/writer";
import type { ResearchBrief } from "@/lib/schemas/researcher";

export async function runWriter(brief: ResearchBrief): Promise<Draft> {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: DraftSchema,
    temperature: 0.6,
    topP: 0.95,
    system: "You are a professional content writer.",
    prompt: `
Create a well-structured first draft based on the research brief below.
Use a clear, friendly tone suitable for an online article or blog post.
Do NOT include a citations section.

RESEARCH BRIEF (JSON):
${JSON.stringify(brief, null, 2)}
    `.trim(),
  });

  if (!result.object) {
    throw new Error("Writer agent returned empty result");
  }

  return result.object;
}

