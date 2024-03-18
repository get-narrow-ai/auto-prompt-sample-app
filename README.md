# Auto Prompt Sample App

## Set-up and running the application

### .env.local file

The application will required the following information in an .env.local file before running it locally:

```
OPENAI_API_KEY=<YOUR OPENAI KEY>
NEXT_PUBLIC_CODETHREAD_KEY=<YOUR_CODETHREAD_KEY>
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

## Deploy on Vercel

The easiest way to deploy a Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
