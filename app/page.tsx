"use client";

import { useState } from "react";

type PipelineResult = {
  research: {
    topic: string;
    summary: string;
    keyPoints: { heading: string; details: string }[];
    statsAndData?: { description: string; value: string; source: string }[];
    citations?: { title: string; url: string; note: string }[];
  };
  draft: {
    title: string;
    outline: string[];
    sections: { heading: string; body: string }[];
    conclusion: string;
  };
  edited: {
    finalTitle: string;
    finalBodyMarkdown: string;
    changeNotes: {
      area: string;
      before?: string;
      after: string;
      rationale: string;
    }[];
  };
};

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = topic.trim();
    if (trimmed.length < 3) {
      setError("Please enter a topic with at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic: trimmed })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }

      const data = (await response.json()) as PipelineResult;
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-8">
      <section>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm"
        >
          <label className="text-sm font-medium text-slate-200">
            Topic
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How AI agents can improve content creation workflows"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 ring-sky-500/0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center self-start rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {loading ? "Agents are collaborating..." : "Generate with multi-agent pipeline"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <p className="text-xs text-slate-500">
            This will sequentially run a Researcher, Writer, and Editor agent using the Vercel AI
            SDK and show each stage of the pipeline.
          </p>
        </form>
      </section>

      {result && (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-semibold text-sky-300">Researcher</h2>
            <p className="text-xs text-slate-400">{result.research.summary}</p>
            <div className="space-y-2 text-xs">
              {result.research.keyPoints.map((kp, i) => (
                <div key={i}>
                  <p className="font-medium text-slate-200">{kp.heading}</p>
                  <p className="text-slate-400">{kp.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-semibold text-emerald-300">Writer</h2>
            <p className="text-xs font-medium text-slate-200">{result.draft.title}</p>
            <div className="space-y-1 text-xs text-slate-400">
              {result.draft.outline.map((item, i) => (
                <p key={i}>• {item}</p>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-semibold text-amber-300">Editor</h2>
            <p className="text-xs font-medium text-slate-200">{result.edited.finalTitle}</p>
            <div className="space-y-1 text-xs text-slate-400">
              {result.edited.changeNotes.map((note, i) => (
                <div key={i} className="border-l border-slate-700 pl-2">
                  <p className="font-medium text-slate-200">{note.area}</p>
                  <p>{note.after}</p>
                  <p className="text-[11px] text-slate-500">Reason: {note.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {result && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-200">Final Article (Markdown)</h2>
          <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap break-words rounded-md bg-slate-950/70 p-3 text-xs text-slate-100">
            {result.edited.finalBodyMarkdown}
          </pre>
        </section>
      )}
    </div>
  );
}


