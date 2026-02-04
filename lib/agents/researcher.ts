import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { Exa } from "exa-js";
import { ResearchBriefSchema, type ResearchBrief } from "@/lib/schemas/researcher";

export async function runResearcher(topic: string): Promise<ResearchBrief> {
  // Initialize Exa API client
  const exaApiKey = process.env.EXA_API_KEY;
  const exa = exaApiKey ? new Exa(exaApiKey) : null;

  let searchResults = "";
  let citations: Array<{ title: string; url: string; note: string }> = [];

  // Perform Exa search if API key is available
  if (exa) {
    try {
      const searchResponse = await exa.searchAndContents(topic, {
        numResults: 5,
        useAutoprompt: true,
        text: {},
        highlights: {}
      });

      // Extract search results and citations
      if (searchResponse.results && searchResponse.results.length > 0) {
        searchResults = searchResponse.results
          .map((result: any, index: number) => {
            const text = result.text || "";
            const highlights = result.highlights ? (Array.isArray(result.highlights) ? result.highlights.join(" ") : result.highlights) : "";
            const content = text || highlights || "";
            const title = result.title || "Untitled";
            const url = result.url || "";
            
            // Add to citations
            citations.push({
              title,
              url,
              note: `Relevant information about ${topic}`
            });

            return `[Source ${index + 1}: ${title}]\n${content}\nURL: ${url}\n`;
          })
          .join("\n\n---\n\n");

        searchResults = `SEARCH RESULTS FROM EXA API:\n\n${searchResults}`;
      }
    } catch (error) {
      console.error("Exa API search error:", error);
      // Continue without search results if Exa fails
    }
  }

  // Generate research brief using LLM with search results as context
  const result = await generateObject({

    model: openai("gpt-4o-mini"),
    temperature: 0.3, // مناسب للـ research
    topP: 0.9,
    schema: ResearchBriefSchema,
    prompt: [
      "You are a meticulous research assistant.",
      "Given a topic and search results, gather key information, concepts, and example data that a writer could use.",
      "Focus on accuracy, structure, and clear citations.",
      "Use the provided search results to inform your research brief.",
      "Include real URLs and sources from the search results in your citations.",
      "",
      `Topic: ${topic}`,
      "",

    
      searchResults || "No search results available. Use your knowledge to provide a research brief."
    ].join("\n")
  });

  // Merge citations from Exa search with LLM-generated citations
  const finalBrief = result.object;
  
  // If we have Exa citations, prioritize them, otherwise use LLM citations
  if (citations.length > 0) {
    finalBrief.citations = citations;
  }

  return finalBrief;
}

