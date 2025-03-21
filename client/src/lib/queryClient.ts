import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Check if data is FormData
  const isFormData = data instanceof FormData;
  
  const res = await fetch(url, {
    method,
    // Only set Content-Type for JSON data, not for FormData
    headers: data && !isFormData ? { "Content-Type": "application/json" } : {},
    // Don't stringify FormData
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // If queryKey has multiple elements, construct the URL with parameters
    let url = queryKey[0] as string;
    if (queryKey.length > 1 && queryKey[1]) {
      // If the URL already ends with '/', don't add another one
      const separator = url.endsWith('/') ? '' : '/';
      url = `${url}${separator}${queryKey[1]}`;
    }
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Custom event to trigger loading indicator
export const triggerLoading = (isLoading: boolean) => {
  const eventName = isLoading ? 'cosmic-loading-start' : 'cosmic-loading-complete';
  document.dispatchEvent(new Event(eventName));
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Add global loading indicators for queries and mutations
queryClient.getQueryCache().subscribe(event => {
  const queries = queryClient.getQueryCache().getAll();
  const isFetching = queries.some(query => query.state.isFetching);
  
  if (isFetching) {
    triggerLoading(true);
  } else {
    // Small delay to prevent flashing
    setTimeout(() => {
      const isStillFetching = queryClient.getQueryCache().getAll().some(q => q.state.isFetching);
      if (!isStillFetching) {
        triggerLoading(false);
      }
    }, 300);
  }
});

queryClient.getMutationCache().subscribe(event => {
  const mutations = queryClient.getMutationCache().getAll();
  const isPending = mutations.some(mutation => mutation.state.status === 'pending');
  
  if (isPending) {
    triggerLoading(true);
  } else {
    setTimeout(() => {
      const isStillPending = queryClient.getMutationCache().getAll().some(m => m.state.status === 'pending');
      if (!isStillPending) {
        triggerLoading(false);
      }
    }, 300);
  }
});
