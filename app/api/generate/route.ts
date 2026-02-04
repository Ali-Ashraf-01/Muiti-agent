import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/agents/pipeline";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: { topic?: string } = await request.json();
    const topic = body.topic?.trim();

    if (!topic || topic.length < 3) {
      return NextResponse.json(
        { error: "Please provide a topic with at least 3 characters.", code: "TOPIC_SHORT" },
        { status: 400 }
      );
    }

    console.log("Received topic:", topic);
    console.time("pipeline");
    const result = await runPipeline(topic);
    console.timeEnd("pipeline");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/generate:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating content.", code: "PIPELINE_FAIL" },
      { status: 500 }
    );
  }
}
