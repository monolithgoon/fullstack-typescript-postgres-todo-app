import toast from "react-hot-toast";
import type { TodoItemType } from "@/utils/validation";
import { api } from "@/utils/trpc-api";

export function Todo({ todo }: { todo: TodoItemType }) {
  
  const { id, text, done } = todo;

  const trpc = api.useContext();

  // Toggle a Todo
  const { mutate: toggleTodoMutation } = api.todos.toggleTodo.useMutation({
    onMutate: async ({ id, done }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todos.getAllTodos.cancel();

      // Snapshot the previous value
      const previousTodos = trpc.todos.getAllTodos.getData();

      // Optimistically update to the new value
      trpc.todos.getAllTodos.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              done,
            };
          }
          return todo;
        });
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },

    onSuccess: (err, { done }) => {
      if (done) {
        toast.success("Todo completed 🎉");
      }
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, done, context) => {
      toast.error(
        `An error occured when marking todo as ${done ? "done" : "undone"}`
      );
      if (!context) return;
      trpc.todos.getAllTodos.setData(undefined, () => context.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.todos.getAllTodos.invalidate();
    },
  });

  // Delete a Todo
  const { mutate: deleteTodoMutation } = api.todos.deleteTodo.useMutation({
    // The `onMutate` function is called before the mutation is executed, and is used to update the local cache optimistically.
    // In this case, it cancels any outstanding requests for the list of todos (trpc.todos.getAllTodos.cancel()), takes a snapshot of the current value of the list of todos (const previousTodos = trpc.todos.getAllTodos.getData()), and then updates the list of todos with the specified ID removed.
    // It then returns a context object with the previous value of the list of todos.
    onMutate: async (deleteId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todos.getAllTodos.cancel();

      // Snapshot the previous value
      const previousTodos = trpc.todos.getAllTodos.getData();

      // Optimistically update to the new value
      trpc.todos.getAllTodos.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.filter((t) => t.id !== deleteId);
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      toast.error(`An error occured when deleting todo`);
      if (!context) return;
      trpc.todos.getAllTodos.setData(undefined, () => context.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.todos.getAllTodos.invalidate();
    },
  });

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <input
          // className="cursor-pointer w-4 h-4 border border-gray-300 bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
          type="checkbox"
          name="done"
          id={id}
          checked={done}
          onChange={(e) => {
            toggleTodoMutation({ id, done: e.target.checked });
          }}
        />
        <label
          htmlFor={id}
          className={`cursor-pointer ${done ? "line-through" : ""}`}
        >
          {text}
        </label>
      </div>
      <button
        className="clear-btn"
        // className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium lg text-sm w-full sm:w-auto px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => {
          deleteTodoMutation(id);
        }}
      >
        DELETE
      </button>
    </div>
  );
}
