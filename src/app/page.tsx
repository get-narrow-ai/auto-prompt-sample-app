"use client";

import { useChat } from "ai/react";
import { Textarea, Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import AiResponse from "./AiResponse";
import UserMessage from "./UserMessage";

const callImprovementApi = async ({ prompt, context, setPrompt }: any) => {
  const response = await fetch(process.env.NEXT_PUBLIC_IMPROVE_API_URL || "", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CODETHREAD_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, context }),
  });
  let content = "";
  const decoder = new TextDecoder();
  const reader = response.body!.getReader();
  let result = await reader.read();
  while (!result.done) {
    const chunk = result.value;
    const decodedValue = decoder.decode(chunk);
    content += decodedValue;
    setPrompt(content);
    result = await reader.read();
  }
};

export default function Index() {
  const [context, setContext] = useState("");

  const { messages, input, handleInputChange, append, setMessages, setInput } =
    useChat();

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

  // Use a ref to store the state of the chat so that it can be accessed within our useEffect hook:
  const stateRef = useRef<{ input: string; messages: any[]; context: string }>({
    input,
    messages,
    context,
  });
  useEffect(() => {
    stateRef.current = {
      input,
      messages,
      context,
    };
  }, [input, messages, context]);

  // Listen for the enter key to submit the prompt:
  useEffect(() => {
    const onKeypress = (e: KeyboardEvent) => {
      const { messages, input } = stateRef.current;
      if (e.key === "Enter" && messages.length === 0 && input) {
        e.preventDefault();
        onPromptSubmit(input, context);
      }
    };

    window.addEventListener("keypress", onKeypress);
    return () => window.removeEventListener("keypress", onKeypress);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      <h1 className="font-bold text-xl">Auto-Prompt Sample Application</h1>
      <p className="text-sm">
        Use the fields below to provide a task and context to our system.
      </p>

      <form className="mt-4 w-full max-w-md">
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
      <div className="mt-4">
        {messages.length ? (
          <h2 className="font-bold text-sm">Response</h2>
        ) : null}
        {messages.map((m) =>
          m.role === "user" ? (
            <UserMessage key={m.id} message={m} />
          ) : (
            <AiResponse key={m.id} message={m} />
          )
        )}
      </div>
    </div>
  );
}
