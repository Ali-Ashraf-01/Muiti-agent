import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { DraftSchema, type Draft } from "@/lib/schemas/writer";
import type { ResearchBrief } from "@/lib/schemas/researcher";

export async function runWriter(research: ResearchBrief) {
  const stream = await streamObject({
    model: openai("gpt-4o-mini"),
    temperature: 0.5,
    topP: 0.9,
    schema: DraftSchema,
    prompt: [
      "You are a professional content writer tasked with creating a high-quality first draft.",
      "Your goals:",
      "- Organize content into sections with clear headings and subheadings",
      "- Ensure smooth flow and logical progression between paragraphs",
      "- Use examples, data, and citations from the research brief",
      "- Highlight key points or insights",
      "- Maintain clarity, coherence, and professional tone",
      "",
      `Research: ${JSON.stringify(research)}`
    ].join("\n"),
  });

  return stream;
}
