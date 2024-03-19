import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Heuristic to choose model, gpt-4 can only take 8k tokens in total:
  const shouldUseLargerContextModel = messages[0].content.length > 12000;

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: shouldUseLargerContextModel ? "gpt-4-1106-preview" : "gpt-4",
    stream: true,
    messages,
  });

  // Convert the response into a text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
