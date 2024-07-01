import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { OpenAIStream, StreamingTextResponse, AnthropicStream } from "ai";

// Create an OpenAI and Anthropic API clients (that're edge friendly!)
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const shouldUseAnthropic =
    process.env.NEXT_PUBLIC_LLM_PROVIDER === "anthropic";
  const hasOpenAiKey = process.env.OPENAI_API_KEY;

  // If we have an Anthropic API key, prioritize Claude to generate the response:
  if (shouldUseAnthropic) {
    const anthropic = new Anthropic({});
    // Ask Anthropic for a streaming chat completion given the prompt:
    const stream = await anthropic.messages.create({
      messages,
      model: "claude-3-opus-20240229",
      temperature: 0.3,
      max_tokens: 2048,
      stream: true,
    });

    // Convert into ReadableStream and respond:
    return new StreamingTextResponse(AnthropicStream(stream));
  }

  if (hasOpenAiKey) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Ask OpenAI for a streaming chat completion given the prompt:
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-2024-04-09",
      temperature: 0.3,
      stream: true,
      messages,
    });

    // Convert into ReadableStream and respond:
    return new StreamingTextResponse(OpenAIStream(response));
  }
}
