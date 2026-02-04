## Multi-Agent Content Creation System

This is a minimal example of a **multi-agent content creation pipeline** built with **Next.js 14 (App Router)**, **TypeScript**, and the **Vercel AI SDK**.

Three specialized agents collaborate:

- **Researcher Agent**: Uses **Exa API** for real web search to gather information, then generates a structured research brief with key points, statistics, and citations from actual sources.
- **Writer Agent**: Produces a first draft (title, outline, sections, conclusion) from the research brief.
- **Editor Agent**: Edits the draft into a polished Markdown article and explains key edits via change notes.

### How it works

1. The front-end form in `app/page.tsx` collects a topic from the user.
2. A POST request is sent to `app/api/generate/route.ts`.
3. The backend calls `runPipeline` in `lib/agents/pipeline.ts`, which:
   - Runs the **Researcher** (`lib/agents/researcher.ts`) - performs Exa API search and generates research brief,
   - Feeds the result into the **Writer** (`lib/agents/writer.ts`),
   - Then passes the draft to the **Editor** (`lib/agents/editor.ts`).
4. The full pipeline result (research, draft, edited content) is returned to the client and displayed.

### Getting started

1. Install dependencies:

```bash
npm install
```

2. Set up your API keys in a `.env.local` file:

```bash
# Required: OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Exa API key for enhanced web search (get from https://exa.ai)
EXA_API_KEY=your_exa_api_key_here
```

Or set them as environment variables:

```bash
# Windows PowerShell
$env:OPENAI_API_KEY="YOUR_KEY_HERE"
$env:EXA_API_KEY="YOUR_EXA_KEY_HERE"

# Windows CMD
set OPENAI_API_KEY=YOUR_KEY_HERE
set EXA_API_KEY=YOUR_EXA_KEY_HERE

# Linux/Mac
export OPENAI_API_KEY="YOUR_KEY_HERE"
export EXA_API_KEY="YOUR_EXA_KEY_HERE"
```

**Note**: The Exa API key is optional. If not provided, the Researcher agent will still work but won't perform web searches.

3. Run the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000` and enter a topic to see the three agents collaborate.

### Project Structure

```
lib/
  agents/
    researcher.ts    # Researcher agent with Exa API integration
    writer.ts        # Writer agent
    editor.ts        # Editor agent
    pipeline.ts      # Orchestrates all agents
  schemas/
    researcher.ts    # ResearchBrief schema
    writer.ts        # Draft schema
    editor.ts        # EditedContent schema
```

### Notes

- Models are configured via the Vercel AI SDK `openai("gpt-4o-mini")` helper from `@ai-sdk/openai`. You can swap this for any model/provider supported by the SDK.
- Output schemas are defined with **Zod** to ensure structured, type-safe communication between agents.
- The **Researcher agent** uses **Exa API** for real web search, providing actual URLs and citations. If Exa API key is not provided, it falls back to LLM knowledge only.


