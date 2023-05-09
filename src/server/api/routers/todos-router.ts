import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TodoInputSchema } from "@/utils/validation";

export const todosRouter = createTRPCRouter({
  
  getAllTodos2: protectedProcedure.query(() => {
    return [
      {
        id: "fake-todo-1",
        text: "fake todo text",
        done: false,
      },
      {
        id: "fake-todo-2",
        text: "fake todo text",
        done: true,
      },
    ];
  }),

  // Get all Todos
  getAllTodos: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return todos.map(todo => {
      return {
        id: todo.id,
        text: todo.text,
        done: todo.done
      };
    });
    // REMOVE
    return todos.map(({ id, text, done }) => ({ id, text, done }));
  }),

  // Create a Todo
  createTodo: protectedProcedure
    // FIXME > `TodoInputSchema is not properly mapping to ctx.prisma.todo
    .input(TodoInputSchema)
    // .input(
    //   // Define a schema validation object for `todoInput` using the `zod` library
    //   z.object({
    //     text: z
    //       .string({ required_error: "A todo must have text" })
    //       .min(2)
    //       .max(50),
    //     done: z.boolean({ required_error: "A todo must have a done value" }),
    //   })
    // )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      return ctx.prisma.todo.create({
        data: {
          text: input.text,
          // done: input.done,
          user: {
            connect: {
              id: user.id,
              // id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  // Delete a Todo
  deleteTodo: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  // Toggle Todo state
  toggleTodo: protectedProcedure
    .input(z.object({ id: z.string(), done: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
        },
      });
    }),
});
