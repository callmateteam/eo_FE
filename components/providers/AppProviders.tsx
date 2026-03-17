"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProjectToastProvider } from "@/components/providers/ProjectToastProvider";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
}

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);
  const content = (
    <QueryClientProvider client={queryClient}>
      <ProjectToastProvider>{children}</ProjectToastProvider>
    </QueryClientProvider>
  );

  if (!googleClientId) {
    return content;
  }

  return <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>;
}
