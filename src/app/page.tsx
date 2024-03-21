"use client";

import { useChat } from "ai/react";
import { Textarea, Button } from "@nextui-org/react";
import { useState } from "react";
import AiResponse from "./components/ai-response";
import { callImprovementApi, callTrainingApi } from "./clients/prompt-api";
import { formatPrompt } from "./utils/prompt";
import GitHubSvg from "./svgs/github";
import EmailExample from "./examples/email";
import LinkedInExample from "./examples/linkedin";
import TweetExample from "./examples/tweet";
import SummaryExample from "./examples/summary";

export default function Index() {
  const { messages, input, handleInputChange, append, setMessages, setInput } =
    useChat();
  // Context added to prompt set up by user:
  const [context, setContext] = useState<string>("");
  // Additions to prompt from training API:
  const [additional, setAdditional] = useState<string>("");

  // Submit prompt to execute on the server:
  const onPromptSubmit = (
    prompt: string,
    context?: string,
    additional?: string
  ): void => {
    // Do not call the server if there is no prompt:
    if (!prompt.length) {
      return;
    }
    const content = formatPrompt(prompt, context, additional);

    // "Append" is the "ai/react" method to add a new message to the prompt
    // and call the API for a response:
    append({
      createdAt: new Date(),
      role: "user",
      content,
    });
  };

  // Call training API to improve prompt based on user correction:
  const onTrain = async (
    generation: string,
    correction: string
  ): Promise<void> => {
    const trainingResponse = await callTrainingApi({
      prompt: input,
      context,
      generation,
      correction,
    });
    // Store training information for use in the prompt:
    setAdditional(trainingResponse.prompt);

    // Clear previous messages:
    setMessages([]);

    // Submit new version of the prompt:
    onPromptSubmit(input, context, trainingResponse.prompt);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto">
      <div className="flex items-center justify-left gap-2">
        <h1 className="font-bold text-xl">Auto-Prompt Sample Application</h1>
        <a
          href="https://github.com/CodeThread-ai/auto-prompt-sample-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubSvg />
        </a>
      </div>
      <p className="text-sm">
        Use the fields below to provide a task and context to our system.
      </p>

      {/* Form to collect initial prompt and context example, and allow auto-improvement */}
      <form className="mt-4 w-full">
        <h2 className="font-bold text-sm">Setup</h2>
        <Textarea
          isRequired
          value={input}
          label="Prompt"
          maxRows={input?.length ? Infinity : 2}
          placeholder="What do you want to do?"
          className="mt-2"
          onChange={handleInputChange}
        />
        <Textarea
          className="mt-4 border-gray-200 focus:border-[#3170f9]"
          value={context}
          maxRows={context?.length ? 8 : 2}
          label="Context"
          placeholder="Give an example of the context you would use"
          onChange={(e) => setContext(e.target.value)}
        />

        {!input.length ? (
          <>
            <div>
              <p className="text-xs text-slate-500 mt-4">
                Or choose one of our sample datasets:
              </p>
              <Button
                radius="sm"
                size="sm"
                variant="bordered"
                className="mt-2"
                onClick={() => {
                  setInput(EmailExample.prompt);
                  setContext(EmailExample.context);
                }}
              >
                Write me a cold sales email
              </Button>
              <Button
                radius="sm"
                size="sm"
                variant="bordered"
                className="mt-2 ml-2"
                onClick={() => {
                  setInput(LinkedInExample.prompt);
                  setContext(LinkedInExample.context);
                }}
              >
                Write me a LinkedIn post to market a blog post
              </Button>
              <Button
                radius="sm"
                size="sm"
                variant="bordered"
                className="mt-2"
                onClick={() => {
                  setInput(TweetExample.prompt);
                  setContext(TweetExample.context);
                }}
              >
                Write me a Tweet to market a blog post
              </Button>
              <Button
                radius="sm"
                size="sm"
                variant="bordered"
                className="mt-2 ml-2"
                onClick={() => {
                  setInput(SummaryExample.prompt);
                  setContext(SummaryExample.context);
                }}
              >
                Summarize this blog post
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              radius="sm"
              size="sm"
              isDisabled={!input.length}
              className="mt-4 hover:cursor-pointer"
              onClick={() => {
                setMessages([]);
                onPromptSubmit(input, context, additional);
              }}
            >
              Test
            </Button>
            <Button
              radius="sm"
              size="sm"
              variant="bordered"
              isDisabled={!input.length}
              className="mt-4 ml-2 hover:cursor-pointer"
              onClick={() => {
                callImprovementApi({
                  prompt: input,
                  context,
                  setPrompt: setInput,
                });
              }}
            >
              Improve
            </Button>
            {additional && (
              <Button
                radius="sm"
                size="sm"
                variant="bordered"
                isDisabled={!input.length}
                className="mt-4 ml-2 hover:cursor-pointer"
                onClick={() => {
                  // Copy full prompt to clipboard:
                  navigator.clipboard.writeText(
                    formatPrompt(input, context, additional)
                  );
                }}
              >
                Copy
              </Button>
            )}
          </>
        )}
      </form>
      {/* Show response and allow user to train by editing it */}
      <div className="mt-4">
        {messages.length ? (
          <h2 className="font-bold text-sm">Response</h2>
        ) : null}
        {messages.length === 1 ? (
          <AiResponse
            message={{
              id: "skeleton",
              role: "assistant",
              content: "",
            }}
            onTrain={onTrain}
          />
        ) : null}
        {messages.map((m) =>
          m.role === "user" ? null : (
            <AiResponse key={m.content} message={m} onTrain={onTrain} />
          )
        )}
      </div>
    </div>
  );
}
