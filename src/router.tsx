import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Hand the server-fetched query data to the browser so the first
    // client render matches the HTML the server sent.
    dehydrate: () => {
      const { queries } = dehydrate(queryClient);
      return { queryClient: { queries: queries ?? [] } };
    },
    hydrate: (dehydrated: { queryClient: ReturnType<typeof dehydrate> }) => {
      hydrate(queryClient, dehydrated.queryClient);
    },
  });

  return router;
};
