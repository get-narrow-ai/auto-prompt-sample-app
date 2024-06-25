# Auto Prompt Sample App

[Book a demo](https://calendly.com/paul-codethread/narrow-ai-demo) to get API access.

## Set-up and running the application

### .env.local file

The application will require the following information in an .env.local file before running it locally:

```
# Your organizations config / secrets:

# Select your preferred LLM provider:
NEXT_PUBLIC_LLM_PROVIDER=<'openai' | 'anthropic'>
# Add Anthropic key if using Anthropic:
ANTHROPIC_API_KEY=<YOUR ANTHROPIC KEY>
# Add OpenAI key if using OpenAI:
OPENAI_API_KEY=<YOUR OPENAI KEY>

# The below will be given to you by the CodeThread team upon technical evaluation:
NEXT_PUBLIC_CODETHREAD_KEY=<YOUR_CODETHREAD_KEY>
NEXT_PUBLIC_IMPROVE_API_URL=<YOUR_CODETHREAD_ENDPOINT>
NEXT_PUBLIC_TRAINING_API_URL=<YOUR_CODETHREAD_ENDPOINT>
```

If you are interested in trying out our API, please contact howard@codethread.ai for more information on procuring an API key for testing.

### Install and run

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Endpoints

### POST /content/prompt - Improvement Endpoint

Expected input fields:

```
{
    prompt: string, // Original prompt
    context: string, // Context provided to the prompt (input variables)
    model: string, // Model name
}
```

Outputs a streaming response which contains the improved prompt.

### POST /content/prompt/improve - Training Endpoint

Expected input fields:

```
    {
        prompt: string, // Original prompt
        context: string, // Context provided to the prompt (input variables)
        generation: string, // Initial prompt generation
        correction: string, // User corrected output
        model: string, // Model name
    }
```

Outputs a prompt string which can be appended to the original prompt to align it with the desired user outcome.

## Application Flow

- Provide an initial prompt and example context to the application
- When you click "Improve", the Improvement Endpoint will be run with the results streamed into the prompt field
- When you click "Test", the current prompt will be run with the current context provided and displayed
- You can click "Fix Response" in the response card to make updates to the generated response and on submission this will run the Training Endpoint
- The results of the Training Endpoint are then appended to the initial prompt in the background to align it with the desired user outcome, and the results of that prompt are shown in a new response card
  - See how this is done in the `/utils/prompt.ts` file
- You can click the "Copy" button to copy the fully formatted prompt to your clipboard for further testing

## Deploy on Vercel

The easiest way to deploy a Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
