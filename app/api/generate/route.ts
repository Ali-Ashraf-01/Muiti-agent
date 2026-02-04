import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/agents/pipeline";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a topic with at least 3 characters." },
        { status: 400 }
      );
    }

    const result = await runPipeline(topic.trim());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/generate:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating content." },
      { status: 500 }
    );
  }
}
