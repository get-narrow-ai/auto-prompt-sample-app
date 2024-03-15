"use client";

import { useChat } from "ai/react";
import { Textarea, Button } from "@nextui-org/react";
import { useState } from "react";
import AiResponse from "./components/ai-response";
import { callImprovementApi, callTrainingApi } from "./clients/prompt-api";

export default function Index() {
  const { messages, input, handleInputChange, append, setMessages, setInput } =
    useChat();
  const [context, setContext] = useState<string>("");

  // Submit prompt to execute on the server:
  const onPromptSubmit = (input: string, context?: string) => {
    if (!input.length) {
      return;
    }

    const content = context
      ? `${input}

# CONTEXT:
${context}`
      : input;

    append({
      createdAt: new Date(),
      role: "user",
      content,
    });
  };

  // Call training API to improve prompt based on user correction:
  const onTrain = async (generation: string, correction: string) => {
    const trainingResponse = await callTrainingApi({
      prompt: input,
      context,
      generation,
      correction,
    });
    setInput(trainingResponse.prompt);
    setMessages([]);
    onPromptSubmit(trainingResponse.prompt, context);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto">
      <h1 className="font-bold text-xl">Auto-Prompt Sample Application</h1>
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
          maxRows={Infinity}
          placeholder="What do you want to do?"
          className="mt-2"
          onChange={handleInputChange}
        />
        <Textarea
          className="mt-4 border-gray-200 focus:border-[#3170f9]"
          value={context}
          label="Context"
          placeholder="Give an example of the context you would use"
          onChange={(e) => setContext(e.target.value)}
        />
        <Button
          radius="sm"
          size="sm"
          isDisabled={!input.length}
          className="mt-4 hover:cursor-pointer"
          onClick={() => {
            setMessages([]);
            onPromptSubmit(input, context);
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
            callImprovementApi({ prompt: input, context, setPrompt: setInput });
          }}
        >
          Improve
        </Button>
      </form>
      {/* Show response and allow user to train by editing it */}
      <div className="mt-4">
        {messages.length ? (
          <h2 className="font-bold text-sm">Response</h2>
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
