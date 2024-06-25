// Formats into final prompt from initial prompt, context, and additional training information:
export const formatPrompt = (
  input: string,
  context?: string,
  additional?: string
): string => {
  return `${input}

${additional ? `${additional}` : ""}

${
  context
    ? `# CONTEXT:
${context}`
    : ""
}`;
};
