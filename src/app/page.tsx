"use client";

import { useChat } from "ai/react";
import { Textarea, Button } from "@nextui-org/react";
import { useEffect, useRef } from "react";

export default function Index() {
  const { messages, input, handleInputChange, append, setMessages } = useChat();

  // Submit prompt to execute on the server:
  const onPromptSubmit = (clear: boolean, input: string) => {
    if (clear) {
      setMessages([]);
    }
    append({
      createdAt: new Date(),
      role: "user",
      content: input,
    });
  };

  // Use a ref to store the state of the chat so that it can be accessed within our useEffect hook:
  const stateRef = useRef<{ input: string; messages: any[] }>({
    input,
    messages,
  });
  useEffect(() => {
    stateRef.current = {
      input,
      messages,
    };
  }, [input, messages]);

  // Listen for the enter key to submit the prompt:
  useEffect(() => {
    const onKeypress = (e: KeyboardEvent) => {
      const { messages, input } = stateRef.current;
      if (e.key === "Enter" && messages.length === 0 && input) {
        e.preventDefault();
        onPromptSubmit(false, input);
      }
    };

    window.addEventListener("keypress", onKeypress);
    return () => window.removeEventListener("keypress", onKeypress);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      <h1 className="font-bold text-inherit">Auto-Prompt Sample Application</h1>
      <p className="text-sm">
        Use the field below to provide a task to our system.
      </p>
      <form className="mt-4 w-full max-w-md">
        <Textarea
          value={input}
          label="Prompt"
          placeholder="What do you want to do?"
          onChange={handleInputChange}
        />
        <Button
          radius="sm"
          size="sm"
          className="mt-4 hover:cursor-pointer"
          onClick={() => onPromptSubmit(true, input)}
        >
          Run
        </Button>
      </form>
      <div className="mt-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
