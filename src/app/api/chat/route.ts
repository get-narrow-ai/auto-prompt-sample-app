import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { OpenAIStream, StreamingTextResponse, AnthropicStream } from "ai";

// Create an OpenAI and Anthropic API clients (that're edge friendly!)
export const runtime = "edge";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const anthropic = new Anthropic({});

export async function POST(req: Request) {
  const { messages } = await req.json();
  // Prioritize Claude Opus usage for higher generation quality:
  const shouldUseAnthropicClaude = process.env.ANTHROPIC_API_KEY;

  // If we have an Anthropic API key, prioritize Claude to generate the response:
  if (shouldUseAnthropicClaude) {
    // Ask Anthropic for a streaming chat completion given the prompt:
    const stream = await anthropic.messages.create({
      messages,
      model: "claude-3-opus-20240229",
      max_tokens: 2048,
      stream: true,
    });

    // Convert into ReadableStream and respond:
    return new StreamingTextResponse(AnthropicStream(stream));
  }

  // Heuristic to choose model, gpt-4 can only take 8k tokens in total:
  const shouldUseLargerContextModel = messages[0].content.length > 12000;

  // Ask OpenAI for a streaming chat completion given the prompt:
  const response = await openai.chat.completions.create({
    model: shouldUseLargerContextModel ? "gpt-4-1106-preview" : "gpt-4",
    stream: true,
    messages,
  });

  // Convert into ReadableStream and respond:
  return new StreamingTextResponse(OpenAIStream(response));
}
