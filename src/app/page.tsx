"use client";

import { useChat } from "ai/react";
import { Textarea } from "@nextui-org/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto">
      {messages.map((m: any) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <Textarea
          label="Prompt"
          className="fixed top-0 w-full max-w-md mt-8"
          value={input}
          placeholder="What do you want to do?"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
