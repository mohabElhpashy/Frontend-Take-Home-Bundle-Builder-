import { QueryClient } from '@tanstack/react-query';

/** App-wide React Query client. The catalog rarely changes, so cache it hard. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
