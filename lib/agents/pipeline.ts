import { runResearcher } from "./researcher";
import { runWriter } from "./writer";
import { runEditor } from "./editor";

import type { ResearchBrief } from "@/lib/schemas/researcher";
import type { Draft } from "@/lib/schemas/writer";
import type { FinalArticle } from "@/lib/schemas/editor";

type PipelineOptions = {
  skipEditor?: boolean;
};

type TimedResult<T> = {
  result: T;
  ms: number;
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

async function runWithTiming<T>(fn: () => Promise<T>): Promise<TimedResult<T>> {
  const start = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - start };
}

export async function runPipeline(
  topic: string,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const timings = {
    researchMs: 0,
    writerMs: 0,
    editorMs: 0,
  };

 
  const researchTimed = await runWithTiming(() => runResearcher(topic));
  const research = researchTimed.result;
  timings.researchMs = researchTimed.ms;


  const writerTimed = await runWithTiming(() => runWriter(research));
  const draft: Draft | null = writerTimed.result;
  timings.writerMs = writerTimed.ms;

  
  let edited: FinalArticle | null = null;
  if (draft && !options.skipEditor) {
    const editorTimed = await runWithTiming(() => runEditor({ draft }));
    edited = editorTimed.result;
    timings.editorMs = editorTimed.ms;
  }

  return {
    research,
    draft,
    edited,
    timings,
  };
}
