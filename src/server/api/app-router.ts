import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example-router";
import { todosRouter } from "@/server/api/routers/todos-router";
import { signupRouter } from "@/server/api/routers/signup-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  todos: todosRouter,
  signup: signupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
