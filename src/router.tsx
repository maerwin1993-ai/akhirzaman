import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// The router checks the dehydrated payload against a "serializable" type, and
// Query's own DehydratedState types its keys as `readonly unknown[]`, which
// that check rejects. The values are plain JSON, so the payload is described
// with a type the check accepts while the real state is passed through.
type Dehydrated = { queryClient: { queries: never[]; mutations: never[] } };

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Hand the server-fetched query data to the browser so the first client
    // render matches the HTML the server sent.
    dehydrate: (): Dehydrated =>
      ({ queryClient: dehydrate(queryClient) }) as unknown as Dehydrated,
    hydrate: (dehydrated: Dehydrated) => {
      hydrate(queryClient, dehydrated.queryClient);
    },
  });

  return router;
};
