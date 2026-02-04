import { runResearcher } from "./researcher";
import { runWriter } from "./writer";
import { runEditor } from "./editor";
import type { ResearchBrief } from "@/lib/schemas/researcher";
import type { Draft } from "@/lib/schemas/writer";
import type { FinalArticle } from "@/lib/schemas/editor";

type PipelineOptions = {
  skipEditor?: boolean;
};

type PipelineResult = {
  research: ResearchBrief;
  draft: Draft | null;
  edited: FinalArticle | null;
  timings: {
    researchMs: number;
    writerMs: number;
    editorMs: number;
  };
};

export async function runPipeline(
  topic: string,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const timings = {
    researchMs: 0,
    writerMs: 0,
    editorMs: 0,
  };

  // 🕵️ Researcher
  const t1 = Date.now();
  const research = await runResearcher(topic);
  timings.researchMs = Date.now() - t1;

  // ✍️ Writer
  let draft: Draft | null = null;
  try {
    const t2 = Date.now();
    draft = await runWriter(research);
    timings.writerMs = Date.now() - t2;
  } catch (err) {
    console.error("Writer failed:", err);
  }

  // 🧑‍⚖️ Editor
  let edited: FinalArticle | null = null;
  if (draft && !options.skipEditor) {
    try {
      const t3 = Date.now();
      edited = await runEditor(draft);
      timings.editorMs = Date.now() - t3;
    } catch (err) {
      console.error("Editor failed:", err);
    }
  }

  return {
    research,
    draft,
    edited,
    timings,
  };
}
