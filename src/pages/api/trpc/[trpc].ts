import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "@/env.mjs";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/app-router";

// Export a default function that creates a handler for the Next.js API routes using `createNextApiHandler`
export default createNextApiHandler({
  // Use `appRouter` as the router for the handler
  router: appRouter,
  // Use `createTRPCContext` to create the context for the handler
  createContext: createTRPCContext,
  // Use the `onError` handler only in development environment
  onError:
    env.NODE_ENV === "development"
      ? // Define an error handling function that logs the error message with path information
        ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : // If not in development environment, do not define an error handling function
        undefined,
});
