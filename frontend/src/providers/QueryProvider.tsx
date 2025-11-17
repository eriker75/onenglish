"use client";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache and refetch configuration
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 5 * 60 * 1000, // 5 minutes
      refetchIntervalInBackground: true,

      // Retry configuration
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      retryOnMount: true,

      // Cache configuration
      gcTime: 10 * 60 * 1000, // 10 minutes (before cacheTime)

      // Network configuration
      networkMode: "online",
    },
    mutations: {
      // Mutations configuration
      retry: 1,
      retryDelay: 1000,
      networkMode: "online",
    },
  },
});

const QueryProvider = ({ children }: PropsWithChildren) => {
  const isDev = process.env.NEXT_PUBLIC_NODE_ENV === "development";

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default QueryProvider;
