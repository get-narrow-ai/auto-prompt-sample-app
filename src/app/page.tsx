"use client";

import { useChat } from "ai/react";
import {
  Textarea,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

export default function Index() {
  const [context, setContext] = useState("");

  const { messages, input, handleInputChange, append, setMessages } = useChat();

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
      <h1 className="font-bold text-inherit">Auto-Prompt Sample Application</h1>
      <p className="text-sm">
        Use the fields below to provide a task and context to our system.
      </p>
      <form className="mt-4 w-full max-w-md">
        <Textarea
          isRequired
          value={input}
          label="Prompt"
          placeholder="What do you want to do?"
          onChange={handleInputChange}
        />
        <Textarea
          className="mt-4 border-gray-200 focus:border-[#3170f9]"
          value={context}
          label="Context"
          placeholder="What context do I get to use?"
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
          Run
        </Button>
      </form>
      <div className="mt-4">
        {messages.map((m) => (
          <Card key={m.id} className="whitespace-pre-wrap mt-2">
            <CardBody>
              <p>{m.content}</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <p className="text-xs">
                {m.role === "user" ? "You" : "LLM"} -{" "}
                {m.createdAt?.toLocaleString() || "now"}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
