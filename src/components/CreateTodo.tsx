import { type z } from "zod"
import React, { useState } from "react"
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import { TodoInputSchema } from "@/utils/types";
import type { TodoItemType } from "@/utils/types";

export function CreateTodo() {

	// Infer the Todo Input type from the zod schema
	type TodoInputType = z.infer<typeof TodoInputSchema>

	const [newTodo, setNewTodo] = useState<TodoInputType>({text: ""});

	const trpcApiContext = api.useContext();

	const { mutate } = api.todos.createTodo.useMutation({
		
		onMutate: async (newTodo) => {

			// Cancel any outgoing/in-flight re-fetches so they don't overwrite our optimistic update
			await trpcApiContext.todos.getAllTodos.cancel()

			// Snapshot of the previous Todos
			const previousTodos = trpcApiContext.todos.getAllTodos.getData()

			// Optimistically update to the new value
			trpcApiContext.todos.getAllTodos.setData(undefined, (prev) => {
				const optimisticTodo: TodoItemType = {
					id: 'optimistic-todo-id',
					// text: newTodo.text, // 'placeholder'
					text: "persisting to db...", // 'placeholder'
					done: false
				}
				if (!prev) return [optimisticTodo]
				return [...prev, optimisticTodo]
			})

			// Clear the DOM input
			console.log({newTodo})
			setNewTodo({text: ""});

			// Return a context object with the snapshotted value
			return { previousTodos }
		},

		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, newTodo, context) => {
			toast.error("An error occured when creating todo")
			// Clear input
			setNewTodo(newTodo)
			if (!context) return
			trpcApiContext.todos.getAllTodos.setData(undefined, () => context.previousTodos)
		},

		// Always refetch Todos from API after error or success:
		onSettled: async () => {
			console.log('SETTLED')
			// invalidate cached data from the query of todos.getAllTodos
			await trpcApiContext.todos.getAllTodos.invalidate();
		},
	});

	// const handleTodoSubmit = (evt: React.FormEvent<HTMLFormElement>, mutate) => {
	// 	evt.preventDefault();
	// 	const result = TodoInputSchema.safeParse(newTodo);
	// 	if (!result.success) {
	// 		toast.error(result.error.format()._errors.join("\n"))
	// 	}
	// 	mutate(newTodo);
	// }

	return (
		<div>
			{/* <form onSubmit={handleTodoSubmit.bind(null, mutate)} className="flex gap2"> */}
			{/* <form onSubmit={(e) => handleTodoSubmit(e, mutate)} className="flex gap2"> */}
			<form onSubmit={(e) => {

				e.preventDefault();

				const result = TodoInputSchema.safeParse(newTodo)

				if (!result.success) {
					toast.error(result.error.format()._errors.join('\n'))
					// Do nothing
					return;
				}

				// Create Todo mutation
				mutate(newTodo)
				
			}} className="flex gap-2">
				<input
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="New Todo..."
					type="text" name="new-todo" id="new-todo"
					value={newTodo.text}
					onChange={(e) => {
						setNewTodo({text: e.target.value})
					}}
				/>
				<button
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>CREATE</button>
			</form>
		</div>
	)
}