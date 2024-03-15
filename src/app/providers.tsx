"use client";

import { NextUIProvider } from "@nextui-org/react";

// Since we use Next UI as a component library, we use their provider to avoid prop drilling of themes / styles etc:
export function Providers({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
