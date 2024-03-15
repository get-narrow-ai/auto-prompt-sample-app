export const callImprovementApi = async ({
  prompt,
  context,
  setPrompt,
}: {
  prompt: string;
  context: string;
  setPrompt: (newPrompt: string) => void;
}) => {
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

export const callTrainingApi = async ({
  prompt,
  context,
  generation,
  correction,
}: {
  prompt: string;
  context: string;
  generation: string;
  correction: string;
}) => {
  const response = await fetch(process.env.NEXT_PUBLIC_TRAINING_API_URL || "", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CODETHREAD_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, context, generation, correction }),
  });
  return response.json();
};
